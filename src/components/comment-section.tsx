"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Textarea } from "@/src/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { Reply, Edit, Trash2 } from "lucide-react"
import type { Comment, UserType } from "@/src/lib/types"

interface CommentSectionProps {
  itemId: string // Changed from number to string
  comments: Comment[]
  user: UserType
  onAddComment: (content: string) => void
  onAddReply: (parentId: string, content: string, depth: number) => void // Changed parentId type to string
  onEditComment: (commentId: string, content: string) => void
  onDeleteComment: (commentId: string) => void
}

export function CommentSection({
  itemId,
  comments,
  user,
  onAddComment,
  onAddReply,
  onEditComment,
  onDeleteComment,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null) // Changed type to string
  const [editingComment, setEditingComment] = useState<string | null>(null) // Changed type to string
  const [newReply, setNewReply] = useState("")
  const [editContent, setEditContent] = useState("")

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment)
      setNewComment("")
    }
  }

  const handleAddReply = (parentId: string, depth: number) => {
    // Changed parentId type to string
    if (newReply.trim()) {
      onAddReply(parentId, newReply, depth)
      setNewReply("")
      setReplyingTo(null)
    }
  }

  const handleEditComment = (commentId: string) => {
    // Changed commentId type to string
    if (editContent.trim()) {
      onEditComment(commentId, editContent)
      setEditingComment(null)
      setEditContent("")
    }
  }

  const renderComment = (comment: Comment, depth = 0) => {
    const isOwner = user.id === comment.userId
    const canReply = depth < 2 // Limit to 3 levels (0, 1, 2)

    return (
      <div key={comment.id} className={`${depth > 0 ? "ml-6 border-l-2 border-border pl-4" : ""} mb-4`}>
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{comment.username}</span>
              <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            {editingComment === comment.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[60px]"
                  maxLength={300}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEditComment(comment.id)}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingComment(null)
                      setEditContent("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-foreground mb-2">{comment.content}</p>
                <div className="flex items-center gap-2">
                  {canReply && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    >
                      <Reply className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                  )}
                  {isOwner && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingComment(comment.id)
                          setEditContent(comment.content)
                        }}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onDeleteComment(comment.id)}>
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
            {replyingTo === comment.id && (
              <div className="mt-3 space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  className="min-h-[60px]"
                  maxLength={300}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAddReply(comment.id, depth)}>
                    Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReplyingTo(null)
                      setNewReply("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            {comment.replies.length > 0 && (
              <div className="mt-4">{comment.replies.map((reply) => renderComment(reply, depth + 1))}</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t pt-4">
      {/* Add Comment */}
      <div className="mb-6">
        <Textarea
          placeholder="Share your thoughts on this roadmap item..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-2"
          maxLength={300}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">{300 - newComment.length} characters remaining</span>
          <Button onClick={handleAddComment} disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-4">
        {comments.map((comment) => renderComment(comment))}
        {comments.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  )
}