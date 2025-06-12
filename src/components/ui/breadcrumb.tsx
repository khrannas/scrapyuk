'use client';

import { ReactNode } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
  showHome?: boolean;
}

export function Breadcrumb({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  className,
  showHome = true,
}: BreadcrumbProps) {
  const allItems: BreadcrumbItem[] = [
    ...(showHome ? [{ label: 'Dashboard', href: '/dashboard', icon: <Home className="h-4 w-4" /> }] : []),
    ...items,
  ];

  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        const isCurrent = item.current || isLast;

        return (
          <div key={index} className="flex items-center space-x-1">
            {index > 0 && (
              <span className="text-muted-foreground/60">
                {separator}
              </span>
            )}
            
            <div className="flex items-center space-x-1">
              {item.icon && (
                <span className={cn(
                  'flex-shrink-0',
                  isCurrent ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {item.icon}
                </span>
              )}
              
              {item.href && !isCurrent ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={cn(
                  'font-medium',
                  isCurrent ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {item.label}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

// Utility component for common breadcrumb patterns
export interface ProjectBreadcrumbProps {
  projectTitle?: string;
  projectId?: number;
  currentPage?: string;
  className?: string;
}

export function ProjectBreadcrumb({
  projectTitle,
  projectId,
  currentPage,
  className,
}: ProjectBreadcrumbProps) {
  const items: BreadcrumbItem[] = [
    {
      label: 'Projects',
      href: '/dashboard',
    },
  ];

  if (projectTitle && projectId) {
    items.push({
      label: projectTitle,
      href: `/projects/${projectId}`,
    });
  }

  if (currentPage) {
    items.push({
      label: currentPage,
      current: true,
    });
  }

  return <Breadcrumb items={items} className={className} />;
}