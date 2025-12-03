import { Mountain } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-secondary/50 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold text-foreground">
              <Mountain className="h-6 w-6 text-primary" />
              Stone Flow
            </div>
            <p className="text-sm text-muted-foreground">
              La plataforma de gestión de proyectos que impulsa tu productividad.
            </p>
          </div>
          
          <div className="space-y-0">
            <h3 className="font-semibold text-foreground">Producto</h3>
            <ul className="list-none pl-0 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="no-underline hover:text-foreground transition-colors visited:text-muted-foreground">Características</a></li>
              <li><a href="#" className="no-underline hover:text-foreground transition-colors visited:text-muted-foreground">Precios</a></li>
              <li><a href="#" className="no-underline hover:text-foreground transition-colors visited:text-muted-foreground">Seguridad</a></li>
            </ul>
          </div>
          
          <div className="space-y-0">
            <h3 className="font-semibold text-foreground">Empresa</h3>
            <ul className="list-none pl-0 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="no-underline hover:text-foreground transition-colors visited:text-muted-foreground">Sobre nosotros</a></li>
              <li><a href="#" className="no-underline hover:text-foreground transition-colors visited:text-muted-foreground">Blog</a></li>
              <li><a href="#" className="no-underline hover:text-foreground transition-colors visited:text-muted-foreground">Contacto</a></li>
            </ul>
          </div>
          
          <div className="space-y-0">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="list-none pl-0 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="no-underline hover:text-foreground transition-colors visited:text-muted-foreground">Privacidad</a></li>
              <li><a href="#" className="no-underline hover:text-foreground transition-colors visited:text-muted-foreground">Términos</a></li>
              <li><a href="#" className="no-underline hover:text-foreground transition-colors visited:text-muted-foreground">Cookies</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2024 Stone Flow. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
