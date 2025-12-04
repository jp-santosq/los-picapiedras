// Advanced stone-flow layout and utility components

import * as React from "react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./button";
import { Button } from "./button";
import { Badge } from "./badge";
import { Separator } from "./separator";
import { AspectRatio } from "./aspect-ratio";
import { Calendar, Clock, MapPin, User, Star, Heart, Share2, Download, Play, Pause, Volume2, MoreHorizontal } from "lucide-react";

// Blog Post Card
export const BlogPostCard = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    image?: string;
    tags?: string[];
    className?: string;
  }
>(({ title, excerpt, author, date, readTime, category, image, tags = [], className }, ref) => (
  <Card ref={ref} className={cn("group overflow-hidden hover:shadow-lg transition-all duration-300", className)}>
    {image && (
      <div className="relative overflow-hidden">
        <AspectRatio ratio={16 / 9}>
          <img 
            src={image} 
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </AspectRatio>
        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
          {category}
        </Badge>
      </div>
    )}
    <CardHeader>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Calendar className="h-4 w-4" />
        <span>{date}</span>
        <Separator orientation="vertical" className="h-4" />
        <Clock className="h-4 w-4" />
        <span>{readTime}</span>
      </div>
      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground line-clamp-3 mb-4">{excerpt}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{author}</span>
        </div>
        <div className="flex gap-2">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
));

// Event Card
export const EventCard = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    date: string;
    time: string;
    location: string;
    price?: string;
    image?: string;
    attendees?: number;
    maxAttendees?: number;
    className?: string;
  }
>(({ title, date, time, location, price, image, attendees, maxAttendees, className }, ref) => (
  <Card ref={ref} className={cn("group overflow-hidden hover:shadow-lg transition-all duration-300", className)}>
    {image && (
      <div className="relative overflow-hidden">
        <AspectRatio ratio={16 / 10}>
          <img 
            src={image} 
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </AspectRatio>
        {price && (
          <Badge className="absolute top-4 right-4 bg-green-500 text-white">
            {price}
          </Badge>
        )}
      </div>
    )}
    <CardContent className="p-6">
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{date} at {time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        {attendees !== undefined && maxAttendees && (
          <div className="text-sm">
            <span className="font-medium">{attendees}</span>
            <span className="text-muted-foreground">/{maxAttendees} attending</span>
          </div>
        )}
        <Button size="sm" className="ml-auto">
          Join Event
        </Button>
      </div>
    </CardContent>
  </Card>
));

// Product Card
export const ProductCard = React.forwardRef<
  HTMLDivElement,
  {
    name: string;
    price: string;
    originalPrice?: string;
    rating?: number;
    reviews?: number;
    image?: string;
    badge?: string;
    inStock?: boolean;
    onAddToCart?: () => void;
    onToggleFavorite?: () => void;
    isFavorite?: boolean;
    className?: string;
  }
>(({ 
  name, 
  price, 
  originalPrice, 
  rating = 0, 
  reviews = 0, 
  image, 
  badge, 
  inStock = true,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  className 
}, ref) => (
  <Card ref={ref} className={cn("group overflow-hidden hover:shadow-lg transition-all duration-300", className)}>
    <div className="relative overflow-hidden">
      <AspectRatio ratio={1}>
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="bg-muted w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </AspectRatio>
      {badge && (
        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
          {badge}
        </Badge>
      )}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
        onClick={onToggleFavorite}
      >
        <Heart className={cn("h-4 w-4", isFavorite && "fill-red-500 text-red-500")} />
      </Button>
    </div>
    <CardContent className="p-4">
      <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
        {name}
      </h3>
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={cn(
              "h-4 w-4", 
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            )} 
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">({reviews})</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-bold">{price}</span>
        {originalPrice && (
          <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>
        )}
      </div>
      <Button 
        className="w-full" 
        disabled={!inStock}
        onClick={onAddToCart}
      >
        {inStock ? "Add to Cart" : "Out of Stock"}
      </Button>
    </CardContent>
  </Card>
));

// Media Player Card
export const MediaPlayerCard = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    artist: string;
    duration: string;
    image?: string;
    isPlaying?: boolean;
    onPlayPause?: () => void;
    onShare?: () => void;
    onDownload?: () => void;
    className?: string;
  }
>(({ title, artist, duration, image, isPlaying = false, onPlayPause, onShare, onDownload, className }, ref) => (
  <Card ref={ref} className={cn("overflow-hidden", className)}>
    <div className="flex">
      <div className="relative">
        <AspectRatio ratio={1} className="w-24">
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="bg-muted w-full h-full flex items-center justify-center">
              <Volume2 className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </AspectRatio>
        <Button
          size="icon"
          className="absolute inset-0 bg-black/50 hover:bg-black/70 text-white"
          onClick={onPlayPause}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </Button>
      </div>
      <div className="flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold line-clamp-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{artist}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={onShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-full bg-muted rounded-full h-1 mr-4">
            <div 
              className="bg-primary h-1 rounded-full transition-all duration-300" 
              style={{ width: isPlaying ? "45%" : "0%" }}
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{duration}</span>
        </div>
      </div>
    </div>
  </Card>
));

// Timeline Item
export const TimelineItem = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    date: string;
    description: string;
    status?: "completed" | "current" | "upcoming";
    icon?: React.ReactNode;
    className?: string;
  }
>(({ title, date, description, status = "upcoming", icon, className }, ref) => (
  <div ref={ref} className={cn("relative flex gap-4 pb-8", className)}>
    <div className="flex flex-col items-center">
      <div className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background",
        status === "completed" && "border-green-500 bg-green-500 text-white",
        status === "current" && "border-primary bg-primary text-primary-foreground",
        status === "upcoming" && "border-muted-foreground/30 text-muted-foreground"
      )}>
        {icon || <div className="h-2 w-2 rounded-full bg-current" />}
      </div>
      <div className="h-full w-px bg-border" />
    </div>
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{title}</h4>
        <span className="text-sm text-muted-foreground">{date}</span>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
));

// Stats Card with Chart
export const StatsChartCard = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    chartData?: number[];
    className?: string;
  }
>(({ title, value, change, trend, chartData = [], className }, ref) => (
  <Card ref={ref} className={cn("overflow-hidden", className)}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Badge
          variant={trend === "up" ? "default" : trend === "down" ? "destructive" : "secondary"}
          className={cn(
            trend === "up" && "bg-green-500 text-white",
            trend === "neutral" && "bg-yellow-500 text-white"
          )}
        >
          {change}
        </Badge>
      </div>
      {chartData.length > 0 && (
        <div className="h-16 w-full">
          <svg className="w-full h-full" viewBox="0 0 100 20">
            <polyline
              points={chartData.map((value, index) => 
                `${(index / (chartData.length - 1)) * 100},${20 - (value / Math.max(...chartData)) * 20}`
              ).join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={cn(
                trend === "up" && "text-green-500",
                trend === "down" && "text-red-500",
                trend === "neutral" && "text-yellow-500"
              )}
            />
          </svg>
        </div>
      )}
    </CardContent>
  </Card>
));

export {
  BlogPostCard,
  EventCard,
  ProductCard,
  MediaPlayerCard,
  TimelineItem,
  StatsChartCard
};