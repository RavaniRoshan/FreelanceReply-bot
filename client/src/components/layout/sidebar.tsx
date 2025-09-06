/**
 * @fileoverview This file defines the Sidebar component, which is displayed
 * on the left side of the application. It contains the navigation menu and
 * the user profile section.
 */

import { Link, useLocation } from "wouter";
import { Bot, BarChart3, FileText, Brain, Plug, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "AI Learning", href: "/ai-learning", icon: Brain },
  { name: "Integrations", href: "/integrations", icon: Plug },
  { name: "Settings", href: "/settings", icon: Settings },
];

/**
 * The Sidebar component is displayed on the left side of the application. It
 * contains the navigation menu and the user profile section.
 * @returns {JSX.Element} The rendered Sidebar component.
 */
export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col" data-testid="sidebar">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-sidebar-foreground">AutoReply Pro</span>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (location === "/" && item.href === "/dashboard");
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md font-medium transition-colors cursor-pointer",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        
        {/* User Profile Section */}
        <div className="mt-8 pt-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-sidebar-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Jane Smith</p>
              <p className="text-xs text-muted-foreground">Freelancer</p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
