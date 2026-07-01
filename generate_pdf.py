import os
import sys
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.pdfgen import canvas

# ── Color Palette ────────────────────────────────────────────────────────────
PRIMARY_COLOR = colors.HexColor("#0f172a")    # Slate-900 (Deep Navy/Slate)
SECONDARY_COLOR = colors.HexColor("#0ea5e9")  # Cyan-500 (Vibrant Sky Blue)
ACCENT_COLOR = colors.HexColor("#2563eb")     # Blue-600 (Ocean Accent)
TEXT_COLOR = colors.HexColor("#334155")       # Slate-700 (Body Text)
BG_LIGHT = colors.HexColor("#f8fafc")         # Slate-50 (Table Alternating Rows)
BORDER_COLOR = colors.HexColor("#cbd5e1")     # Slate-300 (Table Borders)
HEADER_BG = colors.HexColor("#1e293b")        # Slate-800 (Table Headers)

# ── Custom Numbered Canvas for Headers and Footers ───────────────────────────
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Suppress headers/footers on page 1 (cover page)
        if self._pageNumber > 1:
            # Header text and thin separator
            self.setFont("Helvetica", 9)
            self.setFillColor(colors.HexColor("#64748b")) # slate-500
            self.drawString(54, 752, "OceanData — Technical Interview Preparation & Code Review Guide")
            
            self.setStrokeColor(colors.HexColor("#e2e8f0")) # slate-200
            self.setLineWidth(0.75)
            self.line(54, 744, 558, 744) # margin left is 54pt, right is 558pt (width 612)

            # Footer text, page numbers and thin separator
            self.line(54, 52, 558, 52)
            self.drawString(54, 38, "Confidential — Prepared for Technical Interview")
            
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(558, 38, page_text)
            
        self.restoreState()

# ── XML Entity Escaping Utility ──────────────────────────────────────────────
def xml_esc(text):
    return (
        text.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;")
            .replace("'", "&apos;")
    )

def create_prep_guide():
    pdf_filename = "OceanData_Interview_Prep_Guide.pdf"
    
    # Page setup - Letter, 0.75" margins (54 points)
    # Printable area: 504 x 684 points (Width: 612, Height: 792)
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # ── Custom Style Modifications & Extensions ──────────────────────────────
    # Modify existing styles to avoid collisions
    styles['Normal'].fontName = 'Helvetica'
    styles['Normal'].fontSize = 10
    styles['Normal'].leading = 14
    styles['Normal'].textColor = TEXT_COLOR
    
    styles['BodyText'].fontName = 'Helvetica'
    styles['BodyText'].fontSize = 10
    styles['BodyText'].leading = 14
    styles['BodyText'].textColor = TEXT_COLOR
    styles['BodyText'].spaceAfter = 8

    styles.add(ParagraphStyle(
        name='CoverTitle',
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=PRIMARY_COLOR,
        alignment=1, # Center
        spaceAfter=15
    ))

    styles.add(ParagraphStyle(
        name='CoverSubtitle',
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=SECONDARY_COLOR,
        alignment=1, # Center
        spaceAfter=30
    ))

    styles.add(ParagraphStyle(
        name='CoverMeta',
        fontName='Helvetica',
        fontSize=10,
        leading=15,
        textColor=colors.HexColor("#475569"),
        alignment=1,
    ))

    styles.add(ParagraphStyle(
        name='H1',
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=PRIMARY_COLOR,
        spaceBefore=15,
        spaceAfter=10,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name='H2',
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=SECONDARY_COLOR,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name='H3',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=PRIMARY_COLOR,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name='CodeStyle',
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0f172a")
    ))

    styles.add(ParagraphStyle(
        name='TableText',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#1e293b")
    ))

    styles.add(ParagraphStyle(
        name='TableHeaderText',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white
    ))

    styles.add(ParagraphStyle(
        name='BulletText',
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_COLOR,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    ))

    story = []

    # =========================================================================
    # ── COVER PAGE ───────────────────────────────────────────────────────────
    # =========================================================================
    story.append(Spacer(1, 150))
    story.append(Paragraph("<b>OceanData</b>", styles['CoverTitle']))
    story.append(Paragraph("Democratizing Oceanographic Insights & Real-Time Analytics", styles['CoverSubtitle']))
    
    # Center accent divider bar
    d_table = Table([[""]], colWidths=[120], rowHeights=[4])
    d_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SECONDARY_COLOR),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(d_table)
    story.append(Spacer(1, 40))

    story.append(Paragraph("<b>FULL CODEBASE EXPLANATION &amp; TECHNICAL ARCHITECTURE STUDY GUIDE</b>", ParagraphStyle(
        name='CoverSubject',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=PRIMARY_COLOR,
        alignment=1,
        spaceAfter=150
    )))

    story.append(Paragraph(f"<b>Prepared for:</b> Candidate Technical Interview<br/>"
                           f"<b>Codebase Scope:</b> VishwaPratap777/Oceano (Full-Stack SPA)<br/>"
                           f"<b>Document Class:</b> Technical Walkthrough &amp; Prep Material<br/>"
                           f"<b>Date:</b> {datetime.now().strftime('%B %d, %Y')}", styles['CoverMeta']))
    story.append(PageBreak())

    # =========================================================================
    # ── SECTION 1: SYSTEM OVERVIEW & ARCHITECTURE ────────────────────────────
    # =========================================================================
    story.append(Paragraph("1. System Overview &amp; Architecture", styles['H1']))
    story.append(Paragraph(
        "<b>OceanData</b> is a full-stack, single-page web application designed to democratize access to "
        "oceanographic datasets and real-time marine metrics (such as Sea Surface Temperature (SST), wave heights, currents, "
        "wind speeds, and humidity). The system integrates three key layers: a modern React client with cinematic, "
        "fluid animations; an Express backend proxy server; and a multi-tiered AI assistant capable of processing real-time "
        "metrics and providing context-aware scientific explanations.",
        styles['BodyText']
    ))
    
    story.append(Paragraph("Key Interview Themes to Emphasize:", styles['H2']))
    story.append(Paragraph(
        "• <b>Production-Grade Fault Tolerance:</b> Highlight how the backend operates seamlessly even without API keys. "
        "The StormGlass service falls back to structured mock data, while the chatbot service implements a 3-tier cascade: "
        "Gemini 2.5 Flash -> Groq Llama 3.1 -> Local Keyword-Based Response Engine.",
        styles['BulletText']
    ))
    story.append(Paragraph(
        "• <b>State-of-the-Art UX:</b> Focus on the aesthetic micro-interactions. The interface uses customized GSAP route "
        "transitions (staggered staircase slide-downs) overlaid with dynamic SVG water displacement filters, alongside custom canvas-based "
        "pointer ripple trails and Lenis smooth scrolling.",
        styles['BulletText']
    ))
    story.append(Paragraph(
        "• <b>API Optimization:</b> Describe the in-memory coordinate caching system implemented in the weather API service, "
        "which uses a 1-hour Time-To-Live (TTL) to enforce rate limits and minimize external API network overhead.",
        styles['BulletText']
    ))
    story.append(Spacer(1, 10))

    # Architecture Table
    arch_data = [
        [Paragraph("<b>Component Layer</b>", styles['TableHeaderText']), Paragraph("<b>Technologies &amp; Libraries</b>", styles['TableHeaderText']), Paragraph("<b>Architectural Responsibility</b>", styles['TableHeaderText'])],
        [
            Paragraph("<b>Frontend Core</b>", styles['TableText']),
            Paragraph("React, TypeScript, Vite, React-Router-DOM, TailwindCSS, @tanstack/react-query", styles['TableText']),
            Paragraph("Single-page application layout, optimized queries, cached client hooks, responsive grid structures.", styles['TableText'])
        ],
        [
            Paragraph("<b>Animations</b>", styles['TableText']),
            Paragraph("GSAP (GreenSock), Framer Motion, Lenis Smooth Scroll, Canvas API", styles['TableText']),
            Paragraph("Cinematic rendering: staggered column stair transitions, water ripple SVG filters, active mouse particle trail, smooth scroll control.", styles['TableText'])
        ],
        [
            Paragraph("<b>Backend API</b>", styles['TableText']),
            Paragraph("Node.js, Express.js, Axios, Dotenv, CORS", styles['TableText']),
            Paragraph("Express proxy routing, in-memory weather metric caching, environment loader, structured global exception middleware.", styles['TableText'])
        ],
        [
            Paragraph("<b>AI Services</b>", styles['TableText']),
            Paragraph("@google/genai, groq-sdk, Llama-3.1-8b-instant, Gemini-2.5-flash", styles['TableText']),
            Paragraph("Context-aware system prompt composition incorporating live location weather details. Layered fallback pipeline.", styles['TableText'])
        ]
    ]
    
    # 504 pt total width inside margins. Let's make it [104, 160, 240]
    t_arch = Table(arch_data, colWidths=[104, 160, 240])
    t_arch.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_arch)
    story.append(PageBreak())

    # =========================================================================
    # ── SECTION 2: BACKEND ARCHITECTURE & FILE ANALYSIS ──────────────────────
    # =========================================================================
    story.append(Paragraph("2. Backend Architecture &amp; File Walkthrough", styles['H1']))
    story.append(Paragraph(
        "The backend server is structured inside the <code>server/</code> directory as a modular Node.js "
        "application leveraging ES Modules (<code>\"type\": \"module\"</code>). This section breaks down every "
        "backend file, explaining its code layout and how to present it in an interview.",
        styles['BodyText']
    ))

    # Helper to generate file description blocks
    def make_file_block(title, path, purpose, code_details, interview_tip):
        block = [
            Paragraph(f"<b>{title}</b> — <font size=9 color='#64748b'><code>{path}</code></font>", styles['H2']),
            Paragraph(f"<b>Core Responsibility:</b> {purpose}", styles['BodyText']),
            Paragraph(f"<b>Key Operations &amp; Code Flow:</b> {code_details}", styles['BodyText']),
            Paragraph(f"<b>💡 Interview Discussion Point:</b> {interview_tip}", ParagraphStyle(
                name='TipStyle',
                fontName='Helvetica-Oblique',
                fontSize=9.5,
                leading=13.5,
                textColor=colors.HexColor("#2563eb"),
                backColor=colors.HexColor("#eff6ff"),
                borderColor=colors.HexColor("#bfdbfe"),
                borderWidth=0.5,
                borderPadding=6,
                spaceBefore=4,
                spaceAfter=12
            ))
        ]
        return block

    # 1. server/src/index.js
    story.extend(make_file_block(
        "Server Entry Point", "server/src/index.js",
        "Configures the main Express application, sets up global middlewares, registers core routes, serves production static assets, and boots the HTTP server.",
        "Initializes Express and hooks up <code>cors()</code> and <code>express.json()</code> middlewares. "
        "Registers public endpoints (<code>/api/ocean</code> and <code>/api/chat</code>). "
        "Implements a health check route (<code>/api/health</code>) verifying the configuration of external APIs. "
        "For production deployment, it hosts the static compiled SPA assets out of <code>../../dist</code>. "
        "Includes a catch-all route (<code>*</code>) forwarding non-API requests to the client-side SPA router (<code>index.html</code>).",
        "Explain that in production, the node server hosts the client React SPA. This resolves common cross-origin request "
        "barriers (CORS) and simplifies deployment under a single, unified domain. Mention how it maps SPA route paths back to index.html "
        "so client-side react routing does not break on reload."
    ))

    # 2. server/src/config/env.js
    story.extend(make_file_block(
        "Environment Configuration Manager", "server/src/config/env.js",
        "Loads global variables from the root <code>.env</code> file, parses port settings, and holds references to model/weather credentials.",
        "Uses <code>dotenv.config</code> targeting the root directory. Packages configuration into a clean config object mapping "
        "variables like <code>STORMGLASS_API_KEY</code>, <code>GEMINI_API_KEY</code>, and <code>GROQ_API_KEY</code>. "
        "Enforces default geocoordinates (Mumbai Coast: 18.9219 N, 72.8222 E). "
        "Outputs non-fatal console warnings (<code>console.warn</code>) on boot if required credentials are missing.",
        "Emphasize the design choice of non-fatal warnings instead of throwing. This ensures developers can boot the app "
        "and immediately work on local features or design components without having to configure API key strings first."
    ))

    # 3. server/src/middleware/errorHandler.js
    story.extend(make_file_block(
        "Global Exception Interceptor", "server/src/middleware/errorHandler.js",
        "Catches unhandled route exceptions globally, logs their occurrences to stdout, and formats consistent JSON error responses for the client.",
        "An Express global handler matching the 4-argument signature: <code>(err, req, res, next)</code>. "
        "Determines the HTTP status (defaults to 500) and formats a clean JSON payload `{ error, status }`. "
        "In development environments, it prints full error stack traces to console stdout for rapid debugging, while shielding production clients from sensitive server details.",
        "Talk about centralized error handling as a software engineering best practice. By capturing errors in a single middleware, "
        "it avoids redundant try-catch logs and guarantees that the client always receives a structured, predictable error response."
    ))

    story.append(PageBreak())

    # 4. server/src/routes/ocean.js
    story.extend(make_file_block(
        "Ocean Metrics Endpoint", "server/src/routes/ocean.js",
        "Exposes a HTTP GET route to request live meteorological data based on user coordinates.",
        "Handles requests at <code>GET /</code>. Extracts <code>lat</code> and <code>lng</code> query parameters, parses them, "
        "and passes them to the StormGlass weather service. "
        "Includes a try-catch block specifically intercepting StormGlass HTTP exceptions. If the StormGlass API returns a 402 "
        "(Payment Required due to free-tier quota exhaustion), it maps this to a 429 status code with a user-friendly error explanation.",
        "Describe how mapping raw API codes (e.g. 402 to 429) makes client error handling logical. In an interview, explain how "
        "mapping payment errors to standard API rate limiting ('quota exceeded') improves customer transparency and guides UX design."
    ))

    # 5. server/src/routes/chat.js
    story.extend(make_file_block(
        "AI Conversations Handler", "server/src/routes/chat.js",
        "Exposes a HTTP POST endpoint processing user chat prompts enriched with real-time geographical conditions.",
        "Processes payloads at <code>POST /</code>. Validates required body structures (message, context coordinates, history). "
        "Before generating the response, it attempts to fetch real-time weather metrics matching the coordinates. "
        "Wraps this secondary fetch inside a nested try-catch block; if it fails (due to quota or timeout), it logs a warning "
        "and proceeds, calling the chat generator with null context rather than crashing the request.",
        "Emphasize the design paradigm of graceful degradation. Real-time data enrichment is treated as an enhancement: "
        "if the weather API fails, the user is still able to speak to the AI model using fallback oceanography data."
    ))

    # 6. server/src/services/stormglass.js
    story.extend(make_file_block(
        "StormGlass API Driver & Caching", "server/src/services/stormglass.js",
        "Communicates with the external StormGlass meteorological API, maps nested data models, and enforces coordinate-based cache limits.",
        "Utilizes <code>axios</code>. Declares a Map acting as an in-memory cache with a 1-hour TTL. "
        "If a cache hit matches the requested geokey (formatted coordinate query), it serves data instantly. "
        "Queries coordinates for wave height, current speed, water temperature, wind speed, swell, and humidity. "
        "Iterates source indexes (NOAA, METEO, DWD, etc.) to extract raw variables via a <code>pick()</code> helper. "
        "Generates a complete mock object with normal coordinates and metrics if the StormGlass key is missing.",
        "Highlight the cache design. Point out that caching coordinates prevents API spam, saving network roundtrips "
        "and protecting the application from hitting free tier limits. Discuss how mapping weather source arrays to a fallback hierarchy "
        "guarantees high data fidelity."
    ))

    story.append(PageBreak())

    # 7. server/src/services/gemini.js
    story.extend(make_file_block(
        "Gemini AI Service", "server/src/services/gemini.js",
        "Primary AI model orchestrator using the modern `@google/genai` library, framing context-aware prompts with strict marine safety guardrails.",
        "Calls <code>GoogleGenAI</code> and targets the <code>gemini-2.5-flash</code> model. "
        "Builds a system instruction prompt by wrapping real-time ocean metrics (waves, current, wind) into the system guidelines. "
        "Enforces action-oriented instructions: e.g., if wave height exceeds 1.5m, the model must emphasize caution and issue safety warnings. "
        "Maps user history variables (converting `assistant` roles to `model`) and triggers a content generation block. "
        "If no Gemini key is set or the call fails, it automatically redirects the prompt to the Groq service as a fallback.",
        "Discuss the power of dynamic system prompt injection. Explain how injecting metrics into the system instructions "
        "gives the LLM immediate context, turning a generic model into an expert local advisor that responds dynamically "
        "to changing sea states."
    ))

    # 8. server/src/services/groq.js
    story.extend(make_file_block(
        "Groq Fallback & Keyword Response Engine", "server/src/services/groq.js",
        "Operates as the secondary LLM fallback (hosting Llama-3.1) and houses a local keyword-matching database for zero-connection scenarios.",
        "Utilizes <code>groq-sdk</code> targeting <code>llama-3.1-8b-instant</code> with a defined system instruction. "
        "If Groq credentials are missing or the API returns a quota error, it catches the exception and passes the query to "
        "an offline <code>getFallbackResponse()</code> function. "
        "This offline engine checks keywords (e.g. salinity, currents, wave, temperature, argo) against a list of pre-compiled, "
        "highly educational responses on ocean science.",
        "Use this file to show off your focus on system availability. In an interview, explain how a multi-layer cascade "
        "(Gemini -> Groq -> Local Keyword Matching) ensures the chat UI remains functional under all failure modes, even if "
        "both LLM providers are offline or rate-limited."
    ))

    story.append(PageBreak())

    # =========================================================================
    # ── SECTION 3: FRONTEND ARCHITECTURE & FILE ANALYSIS ─────────────────────
    # =========================================================================
    story.append(Paragraph("3. Frontend Architecture &amp; File Walkthrough", styles['H1']))
    story.append(Paragraph(
        "The client application is built inside the <code>src/</code> directory using React with TypeScript, Vite, "
        "TailwindCSS, Framer Motion, and GSAP. It is architected for premium, visual, and highly responsive user interfaces. "
        "This section analyzes the custom frontend scripts.",
        styles['BodyText']
    ))

    # 1. src/App.tsx
    story.extend(make_file_block(
        "App Shell & Main router", "src/App.tsx",
        "Registers layout wrappers, configures API query clients, maps page routes, and coordinates global scroll transitions.",
        "Declares the <code>QueryClientProvider</code> and <code>BrowserRouter</code>. "
        "Sets up routes for Index page (handling <code>/</code>, <code>/about</code>, <code>/data</code>, <code>/visualization</code>), "
        "Chat, Login, and Learn. "
        "Implements a throttled scroll listener tracking window depth. If the scroll position is on the landing hero and less than 10vh, "
        "it hides the animated ocean background to prevent visual clutter. As the user scrolls down, the wave layers fade in.",
        "Point out the scroll-based conditional background rendering. This is a subtle optimization that keeps the page "
        "lightweight on initial load and keeps the hero section's visual text clean before the user begins to explore."
    ))

    # 2. src/pages/Index.tsx
    story.extend(make_file_block(
        "Single-Page Scroll Orchestrator", "src/pages/Index.tsx",
        "Fuses landing page components and maps routing paths to smooth page scrolls.",
        "Aggregates the <code>Hero</code>, <code>AboutSection</code>, <code>HomeSections</code>, <code>HowWeDoIt</code>, and <code>SiteFooter</code>. "
        "Listens to changes in the URL location. If a route matches <code>/about</code> or <code>/data</code>, it calculates the target element's position "
        "and scrolls the window smoothly (accounting for the floating navbar offset) rather than jumping abruptly.",
        "Discuss this approach as an SEO and UX best practice: it keeps a clean multi-page URL architecture for indexing, "
        "but presents a seamless, unified single-page layout to the user without full page reloads."
    ))

    # 3. src/pages/Chat.tsx
    story.extend(make_file_block(
        "Chat Client Interface", "src/pages/Chat.tsx",
        "Manages chat conversation states, custom prompt submission, and rendering of chat history.",
        "Maintains a message log array and is-loading states. Connects to <code>sendChatMessage</code>. "
        "Implements auto-scroll to the bottom of the conversation when new replies arrive using a <code>ref</code>. "
        "Includes a spring-animated sliding history sidebar (Framer Motion) and custom CSS keyframes mapping a typing indicator and backdrop glow.",
        "Highlight the UI performance choices: use of Framer Motion spring stiffness for layout shifts, and CSS hardware-accelerated "
        "animations to run rendering loops efficiently without bogging down the main JS thread."
    ))

    story.append(PageBreak())

    # 4. src/components/Stairs.tsx
    story.extend(make_file_block(
        "GSAP Staircase Page Transition", "src/components/Stairs.tsx",
        "Renders cinematic entrance and exit animations using staggered columns and SVG turbulence filters.",
        "Contains 5 vertical gradient columns. When navigating to a new route, GSAP triggers a timeline: "
        "staggers the columns down to block out the view, shifts routes behind the curtain, and slides the columns down out of the viewport. "
        "During initial load, it executes an SVG-filtered water ripple animation on the logo for 3 seconds before sliding open, "
        "and stores a flag in sessionStorage to skip it on subsequent views.",
        "This is a high-impact visual feature. Explain how you used GSAP stagger loops to animate individual bars "
        "sequentially and how the SVG displacement map filter creates a realistic watery effect. Talk about how coordinates "
        "are saved in sessionStorage to optimize subsequent navigation."
    ))

    # 5. src/components/backgrounds/OceanBackground.tsx
    story.extend(make_file_block(
        "GSAP Wave & Bubble Animation", "src/components/backgrounds/OceanBackground.tsx",
        "Builds a fluid background overlay containing looping SVG waves and random floating bubble streams.",
        "Declares three layered wave SVGs at the bottom of the screen. GSAP translates these waves along X to -50% for a seamless horizontal loop, "
        "while simultaneously bobbing them vertically. "
        "Fires two vertical streams of bubble particles (randomizing scale, velocity, and drift) along the screen margins, "
        "and listens to tab visibility changes to pause loops and save CPU cycles.",
        "Mention the performance optimizations. Discuss how using 2 matching tiles moving from 0 to -50% creates a seamless "
        "loop. Explain how you integrated tab visibility listeners to stop GSAP tweens when the tab is hidden, preventing CPU drain."
    ))

    # 6. src/components/effects/MouseRippleTrail.tsx
    story.extend(make_file_block(
        "Canvas Mouse Ripple Trail", "src/components/effects/MouseRippleTrail.tsx",
        "Renders smooth, watery cursor trails on a transparent canvas overlay.",
        "Creates a full-screen Canvas overlay. Throttles cursor movements to ~30fps to protect performance. "
        "Draws expanding radial gradients (cyan to transparent) on each mouse step, fading them out using a standard decay math. "
        "Uses <code>devicePixelRatio</code> matching to scale the canvas cleanly on high-DPI displays.",
        "Explain that drawing mouse trails directly in the DOM using divs causes huge layout overhead. By rendering "
        "directly onto a single, hardware-accelerated 2D canvas context and throttling listeners, we achieve smooth, high-fidelity trails "
        "with zero layout shifts."
    ))

    # 7. src/components/Hero.tsx
    story.extend(make_file_block(
        "Cinematic Hero Showcase", "src/components/Hero.tsx",
        "Controls loop timers for video masks, manages ambient audio elements, and triggers intro transitions.",
        "Contains a main background video and a header text mask that clips two identical videos. "
        "Uses a custom crossfade timeupdate handler that starts playing the second video 1.2s before the first video ends, "
        "swapping opacities to hide the loop loop gap. "
        "Manages ambient ocean sounds with volume ramps, and hooks into window visibility to pause play states.",
        "Explain the video loop issue. HTML5 videos pause for a split-second when looping, showing a black frame. By running "
        "two video elements side-by-side and performing a custom crossfade before the active video ends, we create a continuous, "
        "seamless loop. Explain how this is achieved through timeupdate listeners."
    ))

    story.append(PageBreak())

    # =========================================================================
    # ── SECTION 4: DEEP DIVE & CORE STRATEGIES ───────────────────────────────
    # =========================================================================
    story.append(Paragraph("4. Deep Dive: Core Engineering &amp; Optimization Strategies", styles['H1']))
    story.append(Paragraph(
        "In technical interviews, interviewers frequently dive deep into optimization, API choices, and advanced UI design. "
        "Be prepared to explain these three core strategies from the OceanData project:",
        styles['BodyText']
    ))

    story.append(Paragraph("A. Seamless Video Loop with Masked Typography", styles['H2']))
    story.append(Paragraph(
        "Standard HTML5 video elements suffer from loop latency—a brief pause or black flash occurs when the video resets. "
        "To achieve a premium, high-fidelity hero section, OceanData uses a dual-video crossfade system:<br/>"
        "1. Two video elements (<code>v0</code> and <code>v1</code>) are loaded with the same source.<br/>"
        "2. An active variable tracks which video is visible, setting its opacity to 1 and the other to 0.<br/>"
        "3. A <code>timeupdate</code> listener monitors the playing video. When the remaining play time is less than "
        "the crossfade duration (1.2 seconds), the hidden video starts playing from 0.01 seconds.<br/>"
        "4. A GSAP/CSS transition swaps the opacities, creating a seamless visual crossfade. Once the transition is complete, "
        "the active variable shifts, and the process repeats. This completely bypasses loop stutter.",
        styles['BodyText']
    ))

    story.append(Paragraph("B. Smart Multi-Tiered AI Fallback Cascade", styles['H2']))
    story.append(Paragraph(
        "OceanData does not rely blindly on a single LLM API. To ensure high availability, the backend employs a robust three-tier cascade:<br/>"
        "• <b>Tier 1 (Gemini 2.5 Flash):</b> The primary chatbot. It uses the modern <code>@google/genai</code> library and builds a "
        "location-aware system prompt using real-time StormGlass metrics. It applies business logic, like warning users if waves exceed 1.5m.<br/>"
        "• <b>Tier 2 (Groq Llama-3.1):</b> If the Gemini key is missing or the request fails (e.g. rate limits), the router catches the exception "
        "and redirects the message and history to the Groq service, query-mapped to Llama-3.1.<br/>"
        "• <b>Tier 3 (Local Keyword Engine):</b> If Groq is also down or unconfigured, the service falls back to a smart, "
        "local dictionary. It checks the user's message for keywords like <i>salinity</i>, <i>monsoon</i>, or <i>argo</i> and returns "
        "pre-written, highly detailed explanations. This ensures the chat interface always responds to the user.",
        styles['BodyText']
    ))

    story.append(Paragraph("C. Performance-First Animation Design", styles['H2']))
    story.append(Paragraph(
        "To achieve rich aesthetics without lagging the main browser thread, OceanData implements several key performance measures:<br/>"
        "• <b>Canvas for Particle Effects:</b> The mouse ripple trail is rendered using a single, transparent 2D canvas overlay. "
        "Instead of spawning hundreds of DOM elements (which triggers constant layout thrashing), ripples are drawn as radial gradients "
        "and cleared on a lightweight animation loop.<br/>"
        "• <b>GSAP Tween Pausing:</b> When the user switches tabs, both the ocean background waves and the smooth scroll library "
        "(Lenis) detect the page visibility change and immediately pause their animation loops. This saves significant CPU/GPU "
        "resources and prevents battery drain.",
        styles['BodyText']
    ))

    story.append(PageBreak())

    # =========================================================================
    # ── SECTION 5: INTERVIEW QUESTIONS & ANSWERS ─────────────────────────────
    # =========================================================================
    story.append(Paragraph("5. Common Interview Q&amp;A", styles['H1']))
    story.append(Paragraph(
        "This section list questions an interviewer might ask about this codebase, along with high-scoring technical responses.",
        styles['BodyText']
    ))

    # Helper to generate Q&A blocks
    def make_qa_block(q, a):
        return [
            Paragraph(f"<b>Q: {xml_esc(q)}</b>", styles['H3']),
            Paragraph(f"<b>A:</b> {a}", styles['BodyText']),
            Spacer(1, 4)
        ]

    # Q1
    story.extend(make_qa_block(
        "Why did you build an Express backend proxy instead of calling the weather APIs directly from React?",
        "Calling external APIs (like StormGlass) directly from React has two major flaws: first, it exposes sensitive API keys "
        "to the client console, which is a severe security risk; second, it triggers Cross-Origin Resource Sharing (CORS) blocks "
        "if the third-party server doesn't allow direct client requests. Setting up an Express proxy server solves both: keys "
        "remain secure in the backend's environment variables, and the client makes clean, local-origin calls to <code>/api</code>. "
        "It also lets us implement in-memory caching to save API costs."
    ))

    # Q2
    story.extend(make_qa_block(
        "How does the caching mechanism in the StormGlass service work, and how does it handle expired cache values?",
        "The StormGlass service implements an in-memory Cache using a standard JavaScript <code>Map</code>. The cache key is "
        "derived from coordinates rounded to two decimal places, creating a grid bounding box of about 1.1km. When a request comes in, "
        "we check if the key exists and if the current timestamp is less than the cache expiration time (1-hour TTL). If both conditions "
        "are met, we serve the cached weather data instantly. If the cache has expired, the entry is deleted and a fresh request is sent "
        "to the StormGlass API. The new data is then stored in the cache map with a new expiration timestamp."
    ))

    # Q3
    story.extend(make_qa_block(
        "How is the AI chat page designed to handle deep history contexts, and how does it prevent context-window bloat?",
        "In <code>Chat.tsx</code>, the client-side state maintains the full list of messages. However, when sending a request to the backend, "
        "we filter out the initial greeting and map the message history into an array of roles and content. In the backend, the Groq service "
        "restricts history context by slicing only the last 10 messages (<code>history.slice(-10)</code>) before forwarding them to Llama-3.1. "
        "This prevents context-window bloat and controls token usage. The Gemini service formats the last few conversation steps directly into "
        "its structured contents array, ensuring the model retains relevant context without incurring massive billing costs."
    ))

    # Q4
    story.extend(make_qa_block(
        "What performance optimizations did you make to the custom GSAP animations in the background wave layers?",
        "First, we used CSS 3D transforms (<code>force3D: true</code>) on the wave containers to force the browser to upload the wave layers "
        "to the GPU, which ensures hardware-accelerated animations. Second, instead of rendering a continuous wave path dynamically, we designed "
        "two identical SVG wave path tiles. We place them side-by-side in a container, translate the container horizontally to exactly -50%, "
        "and loop. This creates a seamless wave animation with minimal rendering cost. Finally, we pause these loops when the page is hidden "
        "by listening to the tab visibility API, saving processor cycles."
    ))

    # Q5
    story.extend(make_qa_block(
        "How is the custom page transition coordinated between React Router and the GSAP animators?",
        "We wrap our page routes inside a <code>PageTransitionWrapper</code> component, which defaults to the <code>Stairs</code> animator. "
        "The <code>Stairs</code> component uses React's <code>useLocation</code> hook to detect route changes. When the path changes, the component's "
        "<code>useEffect</code> hook triggers a GSAP timeline: it blocks user input, staggers 5 vertical columns down to cover the screen, "
        "triggers custom events (<code>stairs:start</code>, <code>stairs:mid</code>, and <code>stairs:complete</code>), and then glides the columns "
        "down to reveal the new page content. It also pauses our smooth-scrolling library (Lenis) during the transition to prevent visual stutter."
    ))

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] Prep guide successfully generated: {pdf_filename}")

if __name__ == "__main__":
    create_prep_guide()
