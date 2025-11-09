'use client';

import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const getIcon = () => {
    if (theme === 'light') return <Sun className="h-4 w-4" />;
    if (theme === 'dark') return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const getLabel = () => {
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    return 'System';
  };

  const getNextLabel = () => {
    if (theme === 'light') return 'Dark';
    if (theme === 'dark') return 'System';
    return 'Light';
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        "w-full justify-start gap-2 transition-all duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
      aria-label={`Current theme: ${getLabel()}. Click to switch to ${getNextLabel()} theme`}
      title={`Theme: ${getLabel()} (Click to switch to ${getNextLabel()})`}
    >
      <span className={cn(
        "transition-transform duration-200",
        resolvedTheme === 'dark' ? "rotate-12" : "rotate-0"
      )}>
        {getIcon()}
      </span>
      <span className="text-sm font-medium">
        {getLabel()}
      </span>
    </Button>
  );
}