import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import TransitionLink from "./TransitionLink";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Data", href: "/data" },
    { name: "Visualization", href: "/visualization" },
  ];

  // Auto-hide navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 150) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 150) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav 
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-420px max-w-2xl px-4 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ willChange: 'transform' }}
    >
      <div className="navbar-float rounded-3xl px-6 py-4">
        {/* Desktop Navigation */}
        <div className="flex justify-center">
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <TransitionLink
                key={link.name}
                to={link.href}
                variant="fade"
                className="nav-link px-3 py-2 text-sm font-medium"
              >
                {link.name}
              </TransitionLink>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-end">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border/20">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <TransitionLink
                  key={link.name}
                  to={link.href}
                  variant="fade"
                  className="nav-link px-3 py-2 text-sm font-medium block"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </TransitionLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
