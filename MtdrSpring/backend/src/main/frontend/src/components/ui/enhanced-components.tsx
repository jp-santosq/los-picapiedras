// Enhanced stone-flow components with animations and additional functionality

import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { CheckCircle, ArrowRight, Star, Users, TrendingUp, Zap } from "lucide-react";

// Animated Feature Card with hover effects
export const AnimatedFeatureCard = React.forwardRef<
  HTMLDivElement,
  {
    icon: React.ReactNode;
    title: string;
    description: string;
    className?: string;
  }
>(({ icon, title, description, className }, ref) => (
  <Card 
    ref={ref}
    className={cn(
      "group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-2xl hover:-translate-y-1",
      className
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <CardHeader className="relative z-10">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="relative z-10">
      <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
      <Button variant="ghost" size="sm" className="group/btn p-0 h-auto font-medium text-primary hover:text-primary/80">
        Learn more
        <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
      </Button>
    </CardContent>
  </Card>
));

// Pricing Card Component
export const PricingCard = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    price: string;
    period: string;
    features: string[];
    highlighted?: boolean;
    buttonText?: string;
    className?: string;
  }
>(({ title, price, period, features, highlighted = false, buttonText = "Get Started", className }, ref) => (
  <Card 
    ref={ref}
    className={cn(
      "relative transition-all duration-300 hover:shadow-xl",
      highlighted && "border-2 border-primary shadow-lg scale-105",
      className
    )}
  >
    {highlighted && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
        <Badge className="bg-primary text-primary-foreground px-4 py-1">
          Most Popular
        </Badge>
      </div>
    )}
    <CardHeader className="text-center">
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <div className="mt-4">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-muted-foreground">/{period}</span>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        className={cn(
          "w-full mt-6",
          highlighted && "bg-primary hover:bg-primary/90"
        )}
        variant={highlighted ? "default" : "outline"}
      >
        {buttonText}
      </Button>
    </CardContent>
  </Card>
));

// Testimonial Card
export const TestimonialCard = React.forwardRef<
  HTMLDivElement,
  {
    quote: string;
    author: string;
    role: string;
    company: string;
    avatar?: string;
    rating?: number;
    className?: string;
  }
>(({ quote, author, role, company, avatar, rating = 5, className }, ref) => (
  <Card ref={ref} className={cn("relative overflow-hidden", className)}>
    <CardContent className="p-6">
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
        ))}
      </div>
      <blockquote className="text-lg font-medium leading-relaxed mb-6">
        "{quote}"
      </blockquote>
      <div className="flex items-center">
        {avatar ? (
          <img 
            src={avatar} 
            alt={author}
            className="h-12 w-12 rounded-full mr-4 object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
            <span className="text-primary font-medium text-lg">
              {author.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-muted-foreground">{role} at {company}</div>
        </div>
      </div>
    </CardContent>
  </Card>
));

// Stats Grid Component
export const StatsGrid = React.forwardRef<
  HTMLDivElement,
  {
    stats: Array<{
      value: string;
      label: string;
      icon?: React.ReactNode;
      change?: string;
      trend?: 'up' | 'down' | 'neutral';
    }>;
    className?: string;
  }
>(({ stats, className }, ref) => (
  <div ref={ref} className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
    {stats.map((stat, index) => (
      <Card key={index} className="group hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              {stat.change && (
                <div className={cn(
                  "flex items-center mt-2 text-xs",
                  stat.trend === 'up' && "text-green-600",
                  stat.trend === 'down' && "text-red-600",
                  stat.trend === 'neutral' && "text-gray-600"
                )}>
                  {stat.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                  {stat.change}
                </div>
              )}
            </div>
            {stat.icon && (
              <div className="text-primary/60 group-hover:text-primary transition-colors duration-300">
                {stat.icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
));

// CTA Section Component
export const CTASection = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton?: string;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
    className?: string;
  }
>(({ title, description, primaryButton, secondaryButton, onPrimaryClick, onSecondaryClick, className }, ref) => (
  <div ref={ref} className={cn("relative overflow-hidden", className)}>
    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
    <Card className="relative border-none shadow-2xl bg-gradient-to-r from-background to-background/95">
      <CardContent className="p-12 text-center">
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="px-8 py-3 text-lg"
            onClick={onPrimaryClick}
          >
            {primaryButton}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          {secondaryButton && (
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-3 text-lg"
              onClick={onSecondaryClick}
            >
              {secondaryButton}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
));

// Enhanced Hero Section
export const HeroSection = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    subtitle: string;
    description: string;
    primaryButton: string;
    secondaryButton?: string;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
    backgroundImage?: string;
    className?: string;
  }
>(({ 
  title, 
  subtitle, 
  description, 
  primaryButton, 
  secondaryButton, 
  onPrimaryClick, 
  onSecondaryClick, 
  backgroundImage,
  className 
}, ref) => (
  <section 
    ref={ref} 
    className={cn(
      "relative min-h-screen flex items-center justify-center overflow-hidden",
      className
    )}
    style={backgroundImage ? { 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    } : undefined}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
    <div className="relative z-10 container mx-auto px-6 text-center">
      <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
        {subtitle}
      </Badge>
      <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          size="lg" 
          className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={onPrimaryClick}
        >
          {primaryButton}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        {secondaryButton && (
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-4 text-lg font-semibold border-2"
            onClick={onSecondaryClick}
          >
            {secondaryButton}
          </Button>
        )}
      </div>
    </div>
  </section>
));

// Export all enhanced components
export {
  AnimatedFeatureCard,
  PricingCard,
  TestimonialCard,
  StatsGrid,
  CTASection,
  HeroSection
};