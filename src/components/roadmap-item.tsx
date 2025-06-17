"use client"

import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { ChevronUp, MessageCircle } from "lucide-react"
import type { RoadmapItemType } from "@/src/lib/types"

interface RoadmapItemProps {
  item: RoadmapItemType
  isUpvoted: boolean
  onUpvote: () => void
  commentCount: number
  onToggleComments: () => void
}

export function RoadmapItem({ item, isUpvoted, onUpvote, commentCount, onToggleComments }: RoadmapItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Planned":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
          <CardDescription className="text-base mb-4">{item.description}</CardDescription>
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
            <Badge variant="outline">{item.category}</Badge>
            <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 ml-4">
          <Button
            variant={isUpvoted ? "default" : "outline"}
            size="sm"
            onClick={onUpvote}
            className="flex flex-col h-auto py-2 px-3"
          >
            <ChevronUp className="w-4 h-4" />
            <span className="text-sm font-medium">{item.upvotes}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onToggleComments}>
            <MessageCircle className="w-4 h-4 mr-1" />
            {commentCount}
          </Button>
        </div>
      </div>
    </CardHeader>
  )
}
