"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  MessageCircle,
  Heart,
  AlertCircle,
} from "lucide-react";
import { notificationAPI } from "@/src/lib/api";
import { useToast } from "../hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { socketManager } from "../lib/socket";

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  sender?: {
    id: string
    username: string
    avatar?: string
  }
  item?: {
    id: string
    title: string
  }
  comment?: {
    id: string
    content: string
  }
}

interface NotificationDropdownProps {
  userId: string
}

export function NotificationDropdown({ userId }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    console.log("🔔 NotificationDropdown mounted for user:", userId)

    loadNotifications()
    loadUnreadCount()

    // event handling
    socketManager.onNewNotification((notification: Notification) => {
      console.log("🔔 New notification received in dropdown:", notification)

      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)

      // Show toast notification
      toast({
        title: notification.title,
        description: notification.message,
      })
    })

    socketManager.onNotificationUpdate((data: any) => {
      console.log("📡 Notification update received:", data)

      if (data.type === "mark_read") {
        setNotifications((prev) =>
          prev.map((notif) => (notif.id === data.notificationId ? { ...notif, isRead: true } : notif)),
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    })

    return () => {
      console.log("🔔 NotificationDropdown unmounting")
      // Don't call offAllListeners here as it might affect other components
    }
  }, [userId, toast])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      console.log("📥 Loading notifications...")
      const data = await notificationAPI.getNotifications({ limit: 20 })
      console.log("✅ Notifications loaded:", data.notifications.length)
      setNotifications(data.notifications)
    } catch (error) {
      console.error("❌ Failed to load notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      console.log("📊 Loading unread count...")
      const count = await notificationAPI.getUnreadCount()
      console.log("✅ Unread count loaded:", count)
      setUnreadCount(count)
    } catch (error) {
      console.error("❌ Failed to load unread count:", error)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      console.log("✅ Marking notification as read:", notificationId)
      await notificationAPI.markAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === notificationId ? { ...notif, isRead: true } : notif)),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("❌ Failed to mark notification as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      console.log("✅ Marking all notifications as read")
      await notificationAPI.markAllAsRead()
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
      setUnreadCount(0)
      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } catch (error) {
      console.error("❌ Failed to mark all notifications as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      console.log("🗑️ Deleting notification:", notificationId)
      await notificationAPI.deleteNotification(notificationId)
      setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
      toast({
        title: "Success",
        description: "Notification deleted",
      })
    } catch (error) {
      console.error("❌ Failed to delete notification:", error)
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "COMMENT_REPLY":
      case "ITEM_COMMENT":
        return <MessageCircle className="w-4 h-4 text-blue-500" />
      case "VOTE_MILESTONE":
        return <Heart className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications ({unreadCount} unread)</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 cursor-pointer ${!notification.isRead ? "bg-blue-50 dark:bg-blue-950" : ""}`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{notification.title}</p>
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkAsRead(notification.id)
                            }}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteNotification(notification.id)
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(notification.createdAt)}</span>
                      {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
