// Form components and layout utilities for stone-flow

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Checkbox } from "./checkbox";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Separator } from "./separator";
import { Badge } from "./badge";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

// Form Field Wrapper
export const FormField = React.forwardRef<
  HTMLDivElement,
  {
    label?: string;
    description?: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
  }
>(({ label, description, error, required, children, className }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)}>
    {label && (
      <Label className={cn("text-sm font-medium", required && "after:content-['*'] after:text-destructive after:ml-1")}>
        {label}
      </Label>
    )}
    {children}
    {description && !error && (
      <p className="text-sm text-muted-foreground">{description}</p>
    )}
    {error && (
      <p className="text-sm text-destructive flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        {error}
      </p>
    )}
  </div>
));

// Multi-step Form
export const MultiStepForm = React.forwardRef<
  HTMLDivElement,
  {
    steps: Array<{
      title: string;
      description?: string;
      content: React.ReactNode;
    }>;
    currentStep: number;
    onStepChange: (step: number) => void;
    onSubmit?: () => void;
    className?: string;
  }
>(({ steps, currentStep, onStepChange, onSubmit, className }, ref) => (
  <div ref={ref} className={cn("space-y-8", className)}>
    {/* Step Indicator */}
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div 
            className={cn(
              "flex items-center gap-3 cursor-pointer",
              index <= currentStep ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => onStepChange(index)}
          >
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium",
              index < currentStep && "bg-primary border-primary text-primary-foreground",
              index === currentStep && "border-primary text-primary",
              index > currentStep && "border-muted-foreground/30"
            )}>
              {index < currentStep ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            <div className="hidden sm:block">
              <p className="font-medium">{step.title}</p>
              {step.description && (
                <p className="text-sm text-muted-foreground">{step.description}</p>
              )}
            </div>
          </div>
          {index < steps.length - 1 && (
            <Separator className="flex-1 mx-4" />
          )}
        </React.Fragment>
      ))}
    </div>

    {/* Step Content */}
    <div className="min-h-[400px]">
      {steps[currentStep]?.content}
    </div>

    {/* Navigation */}
    <div className="flex justify-between">
      <Button
        variant="outline"
        disabled={currentStep === 0}
        onClick={() => onStepChange(currentStep - 1)}
      >
        Previous
      </Button>
      <Button
        onClick={() => {
          if (currentStep < steps.length - 1) {
            onStepChange(currentStep + 1);
          } else {
            onSubmit?.();
          }
        }}
      >
        {currentStep < steps.length - 1 ? "Next" : "Submit"}
      </Button>
    </div>
  </div>
));

// Contact Form
export const ContactForm = React.forwardRef<
  HTMLFormElement,
  {
    onSubmit?: (data: {
      name: string;
      email: string;
      subject: string;
      message: string;
    }) => void;
    className?: string;
  }
>(({ onSubmit, className }, ref) => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form ref={ref} onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Name" required>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Your full name"
          />
        </FormField>
        <FormField label="Email" required>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your.email@example.com"
          />
        </FormField>
      </div>
      <FormField label="Subject" required>
        <Input
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          placeholder="What is this about?"
        />
      </FormField>
      <FormField label="Message" required>
        <Textarea
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Tell us more about your inquiry..."
          rows={6}
        />
      </FormField>
      <Button type="submit" className="w-full">
        Send Message
      </Button>
    </form>
  );
});

// Newsletter Signup
export const NewsletterSignup = React.forwardRef<
  HTMLDivElement,
  {
    title?: string;
    description?: string;
    onSubmit?: (email: string) => void;
    className?: string;
  }
>(({ title = "Stay Updated", description = "Get the latest news and updates", onSubmit, className }, ref) => {
  const [email, setEmail] = React.useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(email);
    setEmail("");
  };

  return (
    <div ref={ref} className={cn("bg-muted/50 rounded-lg p-6", className)}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit">Subscribe</Button>
      </form>
    </div>
  );
});

// Filter Panel
export const FilterPanel = React.forwardRef<
  HTMLDivElement,
  {
    title?: string;
    filters: Array<{
      id: string;
      label: string;
      type: "checkbox" | "radio" | "select" | "range";
      options?: Array<{ value: string; label: string; count?: number }>;
      value?: any;
      onChange?: (value: any) => void;
    }>;
    onClear?: () => void;
    className?: string;
  }
>(({ title = "Filters", filters, onClear, className }, ref) => (
  <div ref={ref} className={cn("space-y-6", className)}>
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Button variant="ghost" size="sm" onClick={onClear}>
        Clear All
      </Button>
    </div>
    
    {filters.map((filter, index) => (
      <div key={filter.id} className="space-y-3">
        <Label className="text-sm font-medium">{filter.label}</Label>
        
        {filter.type === "checkbox" && (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <div key={option.value} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${filter.id}-${option.value}`}
                    checked={filter.value?.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...(filter.value || []), option.value]
                        : filter.value?.filter((v: string) => v !== option.value);
                      filter.onChange?.(newValue);
                    }}
                  />
                  <Label
                    htmlFor={`${filter.id}-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
                {option.count !== undefined && (
                  <Badge variant="secondary" className="text-xs">
                    {option.count}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
        
        {filter.type === "radio" && (
          <RadioGroup value={filter.value} onValueChange={filter.onChange}>
            {filter.options?.map((option) => (
              <div key={option.value} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${filter.id}-${option.value}`} />
                  <Label
                    htmlFor={`${filter.id}-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
                {option.count !== undefined && (
                  <Badge variant="secondary" className="text-xs">
                    {option.count}
                  </Badge>
                )}
              </div>
            ))}
          </RadioGroup>
        )}
        
        {filter.type === "select" && (
          <Select value={filter.value} onValueChange={filter.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select option..." />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                  {option.count !== undefined && ` (${option.count})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {index < filters.length - 1 && <Separator />}
      </div>
    ))}
  </div>
));

// Search Bar with Filters
export const SearchWithFilters = React.forwardRef<
  HTMLDivElement,
  {
    placeholder?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    onSearch?: (query: string) => void;
    suggestions?: string[];
    filters?: React.ReactNode;
    className?: string;
  }
>(({ placeholder = "Search...", value = "", onValueChange, onSearch, suggestions = [], filters, className }, ref) => {
  const [query, setQuery] = React.useState(value);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  
  const handleSearch = () => {
    onSearch?.(query);
    setShowSuggestions(false);
  };
  
  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onValueChange?.(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-background border rounded-md shadow-lg z-50 mt-1">
              {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                  onClick={() => {
                    setQuery(suggestion);
                    onValueChange?.(suggestion);
                    setShowSuggestions(false);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>
      
      {filters && (
        <div className="mt-4">
          {filters}
        </div>
      )}
    </div>
  );
});

export {
  FormField,
  MultiStepForm,
  ContactForm,
  NewsletterSignup,
  FilterPanel,
  SearchWithFilters
};