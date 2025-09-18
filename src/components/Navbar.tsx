import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Data", href: "/data" },
    { name: "Visualization", href: "/visualization" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="navbar-float rounded-2xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-xl font-bold text-primary">
            Ocean<span className="text-primary-glow">Data</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="nav-link px-3 py-2 text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent/50 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border/20">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="nav-link px-3 py-2 text-sm font-medium block"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;