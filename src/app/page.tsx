"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Filter } from "lucide-react";
import { AuthForm } from "@/src/components/auth-form";
import { RoadmapHeader } from "@/src/components/roadmap-header";
import { RoadmapFilters } from "@/src/components/roadmap-filters";
import { RoadmapItem } from "@/src/components/roadmap-item";
import { CommentSection } from "@/src/components/comment-section";
import type { UserType, Comment, RoadmapItemType } from "@/src/lib/types";
import { mockComments, mockRoadmapItems } from "../lib/lib mock-data";
import { Card, CardContent } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { Toaster } from "../components/ui/toaster";
import Loading from "./loading";
import { authAPI, commentAPI, roadmapAPI, voteAPI } from "../lib/api";
import { socketManager } from "../lib/socket";
import { AdminPanel } from "../components/admin-panel";

export default function RoadmapApp() {
  const [user, setUser] = useState<UserType | null>(null)
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItemType[]>([])
  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set())
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortBy, setSortBy] = useState("upvotes")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        try {
          const userData = await authAPI.getProfile()
          setUser(userData)

          // Connect socket
          socketManager.connect(token)

          // Load user votes
          await loadUserVotes()
        } catch (error) {
          console.error("Auth check failed:", error)
          localStorage.removeItem("auth_token")
        }
      }
    }

    checkAuth()
  }, [])

  // Load roadmap items
  useEffect(() => {
    loadRoadmapItems()
  }, [filterStatus, filterCategory, sortBy, searchTerm])

  // Socket event listeners
  useEffect(() => {
    if (user) {
      // Comment events
      socketManager.onCommentCreated((data) => {
        setComments((prev) => ({
          ...prev,
          [data.itemId]: [...(prev[data.itemId] || []), data.comment],
        }))

        toast({
          title: "New comment",
          description: "A new comment was added",
        })
      })

      socketManager.onCommentUpdated((data) => {
        setComments((prev) => ({
          ...prev,
          [data.itemId]: updateCommentInList(prev[data.itemId] || [], data.comment),
        }))
      })

      socketManager.onCommentDeleted((data) => {
        setComments((prev) => ({
          ...prev,
          [data.itemId]: deleteCommentFromList(prev[data.itemId] || [], data.commentId),
        }))
      })

      // Vote events
      socketManager.onVoteUpdated((data) => {
        setRoadmapItems((prev) =>
          prev.map((item) => (item.id === data.itemId ? { ...item, upvotes: data.voteCount } : item)),
        )

        if (data.userId === user.id) {
          setUserVotes((prev) => {
            const newVotes = new Set(prev)
            if (data.action === "added") {
              newVotes.add(data.itemId)
            } else {
              newVotes.delete(data.itemId)
            }
            return newVotes
          })
        }
      })
    }

    return () => {
      socketManager.offAllListeners()
    }
  }, [user, toast])

  const loadRoadmapItems = async () => {
    try {
      setLoading(true)
      const items = await roadmapAPI.getItems({
        status: filterStatus,
        category: filterCategory,
        search: searchTerm,
        sortBy,
        sortOrder: "desc",
      })
      setRoadmapItems(items)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load roadmap items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadUserVotes = async () => {
    if (!user) return

    try {
      const votes = new Set<string>()

      // Check vote status for each item
      for (const item of roadmapItems) {
        try {
          const voteStatus = await voteAPI.getVoteStatus(item.id)
          if (voteStatus.hasVoted) {
            votes.add(item.id)
          }
        } catch (error) {
          // Continue if vote check fails
        }
      }

      setUserVotes(votes)
    } catch (error) {
      console.error("Failed to load user votes:", error)
    }
  }

  const handleLogin = async (userData: UserType) => {
    setUser(userData)

    // Connect socket
    socketManager.connect()

    // Load user votes
    await loadUserVotes()

    toast({
      title: "Welcome back!",
      description: "You have successfully logged in.",
    })
  }

  const handleSignup = async (userData: UserType) => {
    setUser(userData)

    // Connect socket
    socketManager.connect()

    toast({
      title: "Account created!",
      description: "Welcome to the roadmap platform.",
    })
  }

  const handleLogout = () => {
    setUser(null)
    authAPI.logout()
    socketManager.disconnect()
    setUserVotes(new Set())

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const handleItemCreated = (newItem: RoadmapItemType) => {
    setRoadmapItems((prev) => [newItem, ...prev])
  }

  const handleUpvote = async (itemId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to upvote items.",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await voteAPI.toggleVote(itemId)

      // Update local state immediately for better UX
      setUserVotes((prev) => {
        const newVotes = new Set(prev)
        if (result.action === "added") {
          newVotes.add(itemId)
        } else {
          newVotes.delete(itemId)
        }
        return newVotes
      })

      setRoadmapItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, upvotes: result.voteCount } : item)),
      )
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vote",
        variant: "destructive",
      })
    }
  }

  const handleAddComment = async (itemId: string, content: string) => {
    if (!user || !content.trim()) return

    try {
      const comment = await commentAPI.createComment(itemId, content.trim())

      // Update local state immediately
      setComments((prev) => ({
        ...prev,
        [itemId]: [...(prev[itemId] || []), comment],
      }))

      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      })
    }
  }

  const handleAddReply = async (itemId: string, parentCommentId: string, content: string) => {
    if (!user || !content.trim()) return

    try {
      const reply = await commentAPI.createComment(itemId, content.trim(), parentCommentId)

      // Update local state
      setComments((prev) => ({
        ...prev,
        [itemId]: addReplyToComments(prev[itemId] || [], parentCommentId, reply),
      }))

      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive",
      })
    }
  }

  const handleEditComment = async (itemId: string, commentId: string, newContent: string) => {
    if (!newContent.trim()) return

    try {
      const updatedComment = await commentAPI.updateComment(commentId, newContent.trim())

      setComments((prev) => ({
        ...prev,
        [itemId]: updateCommentInList(prev[itemId] || [], updatedComment),
      }))

      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (itemId: string, commentId: string) => {
    try {
      await commentAPI.deleteComment(commentId)

      setComments((prev) => ({
        ...prev,
        [itemId]: deleteCommentFromList(prev[itemId] || [], commentId),
      }))

      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      })
    }
  }

  const loadComments = async (itemId: string) => {
    try {
      const itemComments = await commentAPI.getComments(itemId)
      setComments((prev) => ({
        ...prev,
        [itemId]: itemComments,
      }))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      })
    }
  }

  const toggleComments = async (itemId: string) => {
    if (expandedComments.has(itemId)) {
      setExpandedComments((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        socketManager.leaveItem(itemId)
        return newSet
      })
    } else {
      setExpandedComments((prev) => new Set([...prev, itemId]))
      socketManager.joinItem(itemId)

      // Load comments if not already loaded
      if (!comments[itemId]) {
        await loadComments(itemId)
      }
    }
  }

  // Helper functions
  const updateCommentInList = (commentList: Comment[], updatedComment: Comment): Comment[] => {
    return commentList.map((comment) => {
      if (comment.id === updatedComment.id) {
        return updatedComment
      }
      if (comment.replies.length > 0) {
        return { ...comment, replies: updateCommentInList(comment.replies, updatedComment) }
      }
      return comment
    })
  }

  const deleteCommentFromList = (commentList: Comment[], commentId: string): Comment[] => {
    return commentList.filter((comment) => {
      if (comment.id === commentId) {
        return false
      }
      if (comment.replies.length > 0) {
        comment.replies = deleteCommentFromList(comment.replies, commentId)
      }
      return true
    })
  }

  const addReplyToComments = (commentList: Comment[], parentId: string, reply: Comment): Comment[] => {
    return commentList.map((comment) => {
      if (comment.id === parentId) {
        return { ...comment, replies: [...comment.replies, reply] }
      }
      if (comment.replies.length > 0) {
        return { ...comment, replies: addReplyToComments(comment.replies, parentId, reply) }
      }
      return comment
    })
  }

  const filteredAndSortedItems = roadmapItems.filter((item) => {
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesCategory && matchesSearch
  })

  const clearFilters = () => {
    setFilterStatus("all")
    setFilterCategory("all")
    setSearchTerm("")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <AuthForm onLogin={handleLogin} onSignup={handleSignup} />
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <RoadmapHeader user={user} onLogout={handleLogout} />

      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            {/* <h2 className="text-2xl font-bold">Product Roadmap</h2>
            <p className="text-muted-foreground">Track and vote on upcoming features</p> */}
          </div>
          <AdminPanel onItemCreated={handleItemCreated} />
        </div>

        <RoadmapFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          filterCategory={filterCategory}
          onCategoryChange={setFilterCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading roadmap items...</p>
          </div>
        )}

        {/* Roadmap Items */}
        <div className="space-y-6">
          {filteredAndSortedItems.map((item) => (
            <Card key={item.id} className="w-full">
              <RoadmapItem
                item={item}
                isUpvoted={userVotes.has(item.id)}
                onUpvote={() => handleUpvote(item.id)}
                commentCount={comments[item.id]?.length || 0}
                onToggleComments={() => toggleComments(item.id)}
              />

              {expandedComments.has(item.id) && (
                <CardContent className="pt-0">
                  <CommentSection
                    itemId={item.id}
                    comments={comments[item.id] || []}
                    user={user}
                    onAddComment={(content) => handleAddComment(item.id, content)}
                    onAddReply={(parentId, content) => handleAddReply(item.id, parentId, content)}
                    onEditComment={(commentId, content) => handleEditComment(item.id, commentId, content)}
                    onDeleteComment={(commentId) => handleDeleteComment(item.id, commentId)}
                  />
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {!loading && filteredAndSortedItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No roadmap items found.</p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Get started by creating some items!</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={clearFilters}>
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
                <AdminPanel onItemCreated={handleItemCreated} />
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  )
}


