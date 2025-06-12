'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  X,
  Calendar,
  FrameIcon,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { Project } from '@/lib/api';

export interface ProjectSearchFilters {
  query: string;
  frameSize: 'all' | '20x20' | '20x30';
  sortBy: 'created_at' | 'updated_at' | 'title';
  sortOrder: 'asc' | 'desc';
  dateRange: 'all' | 'today' | 'week' | 'month';
}

export interface ProjectSearchProps {
  projects: Project[];
  onFilteredProjectsChange: (filteredProjects: Project[]) => void;
  onFiltersChange?: (filters: ProjectSearchFilters) => void;
}

export function ProjectSearch({
  projects,
  onFilteredProjectsChange,
  onFiltersChange,
}: ProjectSearchProps) {
  const [filters, setFilters] = useState<ProjectSearchFilters>({
    query: '',
    frameSize: 'all',
    sortBy: 'updated_at',
    sortOrder: 'desc',
    dateRange: 'all',
  });

  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...projects];

    // Text search
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query)
      );
    }

    // Frame size filter
    if (filters.frameSize !== 'all') {
      filtered = filtered.filter(project => project.frame_size === filters.frameSize);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(project => 
        new Date(project.updated_at) >= filterDate
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'updated_at':
        default:
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
          break;
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    onFilteredProjectsChange(filtered);
    onFiltersChange?.(filters);
  }, [projects, filters, onFilteredProjectsChange, onFiltersChange]);

  const updateFilter = <K extends keyof ProjectSearchFilters>(
    key: K,
    value: ProjectSearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      frameSize: 'all',
      sortBy: 'updated_at',
      sortOrder: 'desc',
      dateRange: 'all',
    });
    searchInputRef.current?.focus();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.query.trim()) count++;
    if (filters.frameSize !== 'all') count++;
    if (filters.dateRange !== 'all') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder="Search projects..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="pl-10 pr-10"
          />
          {filters.query && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => updateFilter('query', '')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* Sort Controls */}
        <div className="flex gap-2">
          <Select 
            value={filters.sortBy} 
            onValueChange={(value: any) => updateFilter('sortBy', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated_at">Last Updated</SelectItem>
              <SelectItem value="created_at">Created</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3"
          >
            {filters.sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Frame Size Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FrameIcon className="h-4 w-4" />
                Frame Size
              </label>
              <Select 
                value={filters.frameSize} 
                onValueChange={(value: any) => updateFilter('frameSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="20x20">20x20 Square</SelectItem>
                  <SelectItem value="20x30">20x30 Portrait</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </label>
              <Select 
                value={filters.dateRange} 
                onValueChange={(value: any) => updateFilter('dateRange', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.query && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{filters.query}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('query', '')}
              />
            </Badge>
          )}
          {filters.frameSize !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Frame: {filters.frameSize}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('frameSize', 'all')}
              />
            </Badge>
          )}
          {filters.dateRange !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date: {filters.dateRange}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('dateRange', 'all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}