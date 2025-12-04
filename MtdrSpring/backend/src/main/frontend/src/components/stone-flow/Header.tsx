import { Button } from "../ui/button";
import { Mountain } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/100">
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Mountain className="h-6 w-6 text-primary" />
            Stone Flow
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="no-underline text-muted-foreground hover:text-foreground transition-colors visited:text-muted-foreground">
              Características
            </a>
            <a href="#benefits" className="no-underline text-muted-foreground hover:text-foreground transition-colors visited:text-muted-foreground">
              Beneficios
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/app">
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                Ir a la App
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;