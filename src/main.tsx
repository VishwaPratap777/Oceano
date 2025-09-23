import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import LenisProvider from "./providers/LenisProvider";

// Optimize initial render
const root = createRoot(document.getElementById("root")!);

// Add performance optimizations
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    root.render(
      <LenisProvider>
        <App />
      </LenisProvider>
    );
  });
} else {
  // Fallback for browsers without requestIdleCallback
  setTimeout(() => {
    root.render(
      <LenisProvider>
        <App />
      </LenisProvider>
    );
  }, 1);
}
