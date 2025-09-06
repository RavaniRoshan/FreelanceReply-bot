/**
 * @fileoverview This file defines the Header component, which is displayed
 * at the top of each page.
 */

import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";

/**
 * The props for the Header component.
 */
interface HeaderProps {
  /**
   * The title of the page.
   */
  title: string;
  /**
   * The description of the page.
   */
  description: string;
  /**
   * An optional action to display in the header.
   */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * The Header component is displayed at the top of each page. It shows the
 * page title and description, and an optional action button.
 * @param {HeaderProps} props - The props for the component.
 * @returns {JSX.Element} The rendered Header component.
 */
export default function Header({ title, description, action }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4" data-testid="header">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground" data-testid="page-title">{title}</h1>
          <p className="text-sm text-muted-foreground" data-testid="page-description">{description}</p>
        </div>
        <div className="flex items-center space-x-4">
          {action && (
            <Button 
              onClick={action.onClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="header-action-button"
            >
              <Plus className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          )}
          
          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              data-testid="notifications-button"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs"></span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
