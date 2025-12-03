import { CheckCircle2, Users, BarChart3, Zap, Shield, Calendar } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: Users,
    title: "Colaboración en Tiempo Real",
    description: "Trabaja con tu equipo sin fricción, actualizaciones instantáneas y comunicación fluida."
  },
  {
    icon: BarChart3,
    title: "Analytics Avanzados",
    description: "Visualiza el progreso de tus proyectos con métricas detalladas y reportes personalizados."
  },
  {
    icon: Zap,
    title: "Automatización Inteligente",
    description: "Ahorra tiempo con flujos de trabajo automatizados y notificaciones inteligentes."
  },
  {
    icon: Calendar,
    title: "Planificación Flexible",
    description: "Organiza sprints, milestones y deadlines con vistas Kanban, Gantt y Calendar."
  },
  {
    icon: Shield,
    title: "Seguridad Enterprise",
    description: "Protección de datos de nivel empresarial con encriptación y backups automáticos."
  },
  {
    icon: CheckCircle2,
    title: "Gestión de Tareas",
    description: "Asigna, prioriza y da seguimiento a tareas con dependencias y subtareas ilimitadas."
  }
];

const Features = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  
  return (
    <section id="features" className="py-24 px-4 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto max-w-6xl">
        <div 
          ref={titleRef}
          className={`text-center space-y-4 mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Todo lo que necesitas para triunfar
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Herramientas profesionales diseñadas para equipos que buscan la excelencia
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;