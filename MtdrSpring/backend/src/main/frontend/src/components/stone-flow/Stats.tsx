import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const Stats = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section id="benefits" className="py-24 px-4 bg-gradient-to-r from-primary to-accent text-white">
      <div 
        ref={ref}
        className={`container mx-auto max-w-4xl text-center space-y-8 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-bold">
          Aumenta tu productividad un 20%
        </h2>
        <p className="text-xl text-white max-w-2xl mx-auto">
          Equipos que usan Stone Flow completan sus proyectos más rápido, 
          con mejor comunicación y resultados superiores.
        </p>
        <div className="pt-6">
          <Link to="/app">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 shadow-xl hover:scale-105 transition-transform"
            >
              Empieza gratis hoy
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-5xl font-bold">30 días</div>
            <div className="text-lg opacity-90">Prueba gratuita</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-bold">24/7</div>
            <div className="text-lg opacity-90">Soporte técnico</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-bold">∞</div>
            <div className="text-lg opacity-90">Proyectos ilimitados</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;