// Data visualization and dashboard components for stone-flow

import * as React from "react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { Progress } from "./progress";
import { Separator } from "./separator";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Calendar,
  Filter
} from "lucide-react";

// Dashboard Metric Card
export const MetricCard = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    trend?: "up" | "down" | "neutral";
    icon?: React.ReactNode;
    formatter?: (value: string | number) => string;
    className?: string;
  }
>(({ title, value, change, changeLabel, trend, icon, formatter, className }, ref) => (
  <Card ref={ref} className={cn("", className)}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon && <div className="text-muted-foreground">{icon}</div>}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {formatter ? formatter(value) : value}
      </div>
      {change !== undefined && (
        <div className="flex items-center text-xs text-muted-foreground">
          {trend === "up" && <TrendingUp className="mr-1 h-3 w-3 text-green-500" />}
          {trend === "down" && <TrendingDown className="mr-1 h-3 w-3 text-red-500" />}
          <span className={cn(
            trend === "up" && "text-green-500",
            trend === "down" && "text-red-500"
          )}>
            {change > 0 ? "+" : ""}{change}%
          </span>
          {changeLabel && <span className="ml-1">{changeLabel}</span>}
        </div>
      )}
    </CardContent>
  </Card>
));

// Activity Feed
export const ActivityFeed = React.forwardRef<
  HTMLDivElement,
  {
    activities: Array<{
      id: string;
      user: string;
      action: string;
      target?: string;
      time: string;
      avatar?: string;
      type?: "info" | "success" | "warning" | "error";
    }>;
    title?: string;
    className?: string;
  }
>(({ activities, title = "Recent Activity", className }, ref) => (
  <Card ref={ref} className={cn("", className)}>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {activity.avatar ? (
                <img 
                  src={activity.avatar} 
                  alt={activity.user}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {activity.user.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>
                {" "}{activity.action}
                {activity.target && (
                  <span className="font-medium"> {activity.target}</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
            {activity.type && (
              <Badge
                variant={
                  activity.type === "success" ? "default" :
                  activity.type === "error" ? "destructive" :
                  "secondary"
                }
                className="text-xs"
              >
                {activity.type}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
));

// Quick Stats Grid
export const QuickStatsGrid = React.forwardRef<
  HTMLDivElement,
  {
    stats: Array<{
      label: string;
      value: string | number;
      change?: number;
      icon?: React.ReactNode;
      color?: string;
    }>;
    className?: string;
  }
>(({ stats, className }, ref) => (
  <div ref={ref} className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
    {stats.map((stat, index) => (
      <div key={index} className="bg-card rounded-lg p-4 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
            {stat.change !== undefined && (
              <div className="flex items-center text-xs">
                {stat.change > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={cn(
                  stat.change > 0 ? "text-green-500" : "text-red-500"
                )}>
                  {Math.abs(stat.change)}%
                </span>
              </div>
            )}
          </div>
          {stat.icon && (
            <div className="text-muted-foreground opacity-70">
              {stat.icon}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
));

// Progress Tracker
export const ProgressTracker = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    items: Array<{
      label: string;
      current: number;
      target: number;
      color?: string;
    }>;
    className?: string;
  }
>(({ title, items, className }, ref) => (
  <Card ref={ref} className={cn("", className)}>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      {items.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{item.label}</span>
            <span className="text-muted-foreground">
              {item.current} / {item.target}
            </span>
          </div>
          <Progress 
            value={(item.current / item.target) * 100} 
            className="h-2"
          />
          <div className="text-xs text-muted-foreground">
            {Math.round((item.current / item.target) * 100)}% complete
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
));

// Data Table with Actions
export const DataTable = React.forwardRef<
  HTMLDivElement,
  {
    title?: string;
    columns: Array<{
      key: string;
      label: string;
      sortable?: boolean;
    }>;
    data: Array<Record<string, any>>;
    actions?: Array<{
      label: string;
      onClick: (row: any) => void;
      variant?: "default" | "destructive" | "outline" | "secondary";
    }>;
    onSort?: (key: string, direction: "asc" | "desc") => void;
    className?: string;
  }
>(({ title, columns, data, actions, onSort, className }, ref) => {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    const direction = sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(direction);
    onSort?.(key, direction);
  };

  return (
    <Card ref={ref} className={cn("", className)}>
      {title && (
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th 
                    key={column.key}
                    className={cn(
                      "text-left py-3 px-4 font-medium text-sm text-muted-foreground",
                      column.sortable && "cursor-pointer hover:text-foreground"
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {column.sortable && sortKey === column.key && (
                        <span className="text-xs">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {actions && actions.length > 0 && (
                  <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  {columns.map((column) => (
                    <td key={column.key} className="py-3 px-4 text-sm">
                      {row[column.key]}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {actions.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            variant={action.variant || "outline"}
                            size="sm"
                            onClick={() => action.onClick(row)}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
});

// Revenue Chart Card
export const RevenueChartCard = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    totalRevenue: string;
    change: number;
    period: string;
    chartData?: Array<{ name: string; value: number }>;
    className?: string;
  }
>(({ title, totalRevenue, change, period, chartData = [], className }, ref) => (
  <Card ref={ref} className={cn("", className)}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0">
      <div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{period}</p>
      </div>
      <Button variant="outline" size="sm">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </CardHeader>
    <CardContent>
      <div className="flex items-baseline space-x-3 mb-6">
        <div className="text-3xl font-bold">{totalRevenue}</div>
        <div className={cn(
          "flex items-center text-sm",
          change >= 0 ? "text-green-500" : "text-red-500"
        )}>
          {change >= 0 ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      
      {/* Simple bar chart visualization */}
      {chartData.length > 0 && (
        <div className="space-y-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="text-xs font-medium w-12">{item.name}</div>
              <div className="flex-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(item.value / Math.max(...chartData.map(d => d.value))) * 100}%` 
                    }}
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground w-16 text-right">
                ${item.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
));

export {
  MetricCard,
  ActivityFeed,
  QuickStatsGrid,
  ProgressTracker,
  DataTable,
  RevenueChartCard
};