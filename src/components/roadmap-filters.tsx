"use client"

import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Search } from "lucide-react"

interface RoadmapFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filterStatus: string
  onStatusChange: (value: string) => void
  filterCategory: string
  onCategoryChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
}

export function RoadmapFilters({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: RoadmapFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search roadmap items..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PLANNED">Planned</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ON_HOLD">On Hold</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="UI_UX">UI/UX</SelectItem>
              <SelectItem value="FEATURES">Features</SelectItem>
              <SelectItem value="PLATFORM">Platform</SelectItem>
              <SelectItem value="SECURITY">Security</SelectItem>
              <SelectItem value="PERFORMANCE">Performance</SelectItem>
              <SelectItem value="INTEGRATION">Integration</SelectItem>
              <SelectItem value="MOBILE">Mobile</SelectItem>
              <SelectItem value="API">API</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upvotes">Most Upvoted</SelectItem>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
