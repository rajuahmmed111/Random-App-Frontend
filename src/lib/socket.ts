import io from "socket.io-client";
import type { Socket } from "socket.io-client";

class SocketManager {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(token?: string) {
    if (this.socket?.connected) return this.socket;

    const SOCKET_URL =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

    console.log("🔌 Connecting to socket:", SOCKET_URL);
    console.log("🔐 Using token:", token ? "Yes" : "No");

    this.socket = io(SOCKET_URL, {
      auth: {
        token: token || localStorage.getItem("auth_token"),
      },
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      this.isConnected = true;
      console.log("✅ Socket connected:", this.socket?.id);
    });

    this.socket.on("disconnect", () => {
      this.isConnected = false;
      console.log("❌ Socket disconnected");
    });

    this.socket.on("connect_error", (error: any) => {
      console.error("🔥 Socket connection error:", error);
    });

    // notification listening
    this.socket.on("new_notification", (notification: any) => {
      console.log("🔔 Received new notification:", notification);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      console.log("🔌 Disconnecting socket");
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinItem(itemId: string) {
    if (this.socket?.connected) {
      console.log("📝 Joining item room:", itemId);
      this.socket.emit("join_item", itemId);
    } else {
      console.error("❌ Socket not connected, cannot join item room");
    }
  }

  leaveItem(itemId: string) {
    if (this.socket?.connected) {
      console.log("🚪 Leaving item room:", itemId);
      this.socket.emit("leave_item", itemId);
    }
  }

  onCommentCreated(callback: (data: any) => void) {
    this.socket?.on("comment_created", (data: any) => {
      console.log("💬 Comment created event:", data);
      callback(data);
    });
  }

  onCommentUpdated(callback: (data: any) => void) {
    this.socket?.on("comment_updated", (data: any) => {
      console.log("✏️ Comment updated event:", data);
      callback(data);
    });
  }

  onCommentDeleted(callback: (data: any) => void) {
    this.socket?.on("comment_deleted", (data: any) => {
      console.log("🗑️ Comment deleted event:", data);
      callback(data);
    });
  }

  onVoteUpdated(callback: (data: any) => void) {
    this.socket?.on("vote_updated", (data: any) => {
      console.log("👍 Vote updated event:", data);
      callback(data);
    });
  }

  // notification event handling
  onNewNotification(callback: (notification: any) => void) {
    this.socket?.on("new_notification", (notification: any) => {
      console.log("🔔 New notification received:", notification);
      callback(notification);
    });
  }

  onNotificationUpdate(callback: (data: any) => void) {
    this.socket?.on("notification_update", (data: any) => {
      console.log("📡 Notification update received:", data);
      callback(data);
    });
  }

  offAllListeners() {
    this.socket?.off("comment_created");
    this.socket?.off("comment_updated");
    this.socket?.off("comment_deleted");
    this.socket?.off("vote_updated");
    this.socket?.off("new_notification");
    this.socket?.off("notification_update");
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

export const socketManager = new SocketManager();
