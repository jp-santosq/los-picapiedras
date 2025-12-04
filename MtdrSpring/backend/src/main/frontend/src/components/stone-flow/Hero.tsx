import { Button } from "../ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const Hero = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div 
          ref={ref}
          className={`text-center space-y-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
            <TrendingUp className="h-4 w-4" />
            Incrementa tu productividad un 20%
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Gestiona proyectos con
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> fluidez</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Stone Flow transforma la manera en que tu equipo colabora, 
            mejorando la productividad y facilitando la entrega de resultados excepcionales.
          </p>
          
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <Link to="/app">
              <Button
                size="lg"
                className="landing-cta landing-cta-primary w-full sm:w-auto"
              >
                Ir a la App
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="landing-cta landing-cta-secondary w-full sm:w-auto"
              >
                Iniciar Sesión
              </Button>
            </Link>
          </div>
          
          <div className="pt-12 flex items-center justify-center gap-12 text-center flex-wrap">
            <div className="space-y-1">
              <div className="text-4xl font-bold text-foreground">20%</div>
              <div className="text-sm text-muted-foreground">Más productivo</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold text-foreground">50K+</div>
              <div className="text-sm text-muted-foreground">Equipos activos</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
