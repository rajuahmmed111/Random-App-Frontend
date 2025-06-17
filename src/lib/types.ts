export interface UserType {
  id: string
  username: string
  email: string
  avatar?: string | null
  createdAt?: string
}

export interface Comment {
  id: string
  userId: string
  username: string
  content: string
  createdAt: string
  replies: Comment[]
}

export interface RoadmapItemType {
  id: string // Changed from number to string for MongoDB ObjectId
  title: string
  description: string
  status: string
  category: string
  upvotes: number
  createdAt: string
  priority: string
  commentCount?: number
  hasVoted?: boolean
}

// MongoDB-specific enums to match backend
export enum Status {
  PLANNED = "PLANNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ON_HOLD = "ON_HOLD",
  CANCELLED = "CANCELLED",
}

export enum Category {
  UI_UX = "UI_UX",
  FEATURES = "FEATURES",
  PLATFORM = "PLATFORM",
  SECURITY = "SECURITY",
  PERFORMANCE = "PERFORMANCE",
  INTEGRATION = "INTEGRATION",
  MOBILE = "MOBILE",
  API = "API",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}
