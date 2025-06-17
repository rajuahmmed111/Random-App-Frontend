const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// API utility functions
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      localStorage.setItem("auth_token", response.token);
    }

    return response.data;
  },

  register: async (email: string, username: string, password: string) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
    });

    if (response.token) {
      localStorage.setItem("auth_token", response.token);
    }

    return response.data;
  },

  getProfile: async () => {
    const response = await apiRequest("/auth/profile");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("auth_token");
  },
};

// Roadmap API - Updated for string IDs
export const roadmapAPI = {
  getItems: async (
    filters: {
      status?: string;
      category?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: string;
    } = {}
  ) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.append(key, value);
      }
    });

    const response = await apiRequest(`/roadmap?${params.toString()}`);
    return response.data.items;
  },

  getItem: async (id: string) => {
    // Changed from number to string
    const response = await apiRequest(`/roadmap/${id}`);
    return response.data.item;
  },

  createItem: async (data: {
    title: string;
    description: string;
    status?: string;
    category: string;
    priority?: string;
  }) => {
    const response = await apiRequest("/roadmap", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data.item;
  },

  updateItem: async (id: string, data: any) => {
    // Changed from number to string
    const response = await apiRequest(`/roadmap/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data.item;
  },

  deleteItem: async (id: string) => {
    // Changed from number to string
    await apiRequest(`/roadmap/${id}`, {
      method: "DELETE",
    });
  },
};

// Vote API - Updated for string IDs
export const voteAPI = {
  toggleVote: async (itemId: string) => {
    // Changed from number to string
    const response = await apiRequest(`/votes/${itemId}/toggle`, {
      method: "POST",
    });
    return response.data;
  },

  getVoteStatus: async (itemId: string) => {
    // Changed from number to string
    const response = await apiRequest(`/votes/${itemId}/status`);
    return response.data;
  },

  getVoteCount: async (itemId: string) => {
    // Changed from number to string
    const response = await apiRequest(`/votes/${itemId}/count`);
    return response.data.voteCount;
  },
};

// Comment API - Updated for string IDs
export const commentAPI = {
  getComments: async (itemId: string) => {
    // Changed from number to string
    const response = await apiRequest(`/comments/item/${itemId}`);
    return response.data.comments;
  },

  createComment: async (itemId: string, content: string, parentId?: string) => {
    // Changed from number to string
    const response = await apiRequest(`/comments/item/${itemId}`, {
      method: "POST",
      body: JSON.stringify({ content, parentId }),
    });
    return response.data.comment;
  },

  updateComment: async (commentId: string, content: string) => {
    const response = await apiRequest(`/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    });
    return response.data.comment;
  },

  deleteComment: async (commentId: string) => {
    await apiRequest(`/comments/${commentId}`, {
      method: "DELETE",
    });
  },
};

// Notification API
export const notificationAPI = {
  getNotifications: async (
    filters: {
      isRead?: boolean;
      type?: string;
      page?: number;
      limit?: number;
    } = {}
  ) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    const response = await apiRequest(`/notifications?${params.toString()}`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiRequest("/notifications/unread-count");
    return response.data.unreadCount;
  },

  markAsRead: async (notificationId: string) => {
    const response = await apiRequest(`/notifications/${notificationId}/read`, {
      method: "PUT",
    });
    return response.data.notification;
  },

  markAllAsRead: async () => {
    const response = await apiRequest("/notifications/mark-all-read", {
      method: "PUT",
    });
    return response.data.markedCount;
  },

  deleteNotification: async (notificationId: string) => {
    await apiRequest(`/notifications/${notificationId}`, {
      method: "DELETE",
    });
  },
};

// Admin API
export const adminAPI = {
  createRandomItem: async () => {
    const response = await apiRequest("/roadmap/admin/random", {
      method: "POST",
    });
    return response.data.item;
  },

  createBulkRandom: async (count: number) => {
    const response = await apiRequest("/roadmap/admin/bulk-random", {
      method: "POST",
      body: JSON.stringify({ count }),
    });
    return response.data;
  },

  createDemo: async () => {
    const response = await apiRequest("/roadmap/admin/demo", {
      method: "POST",
    });
    return response.data;
  },

  getTemplates: async () => {
    const response = await apiRequest("/roadmap/admin/templates");
    return response.data.templates;
  },
};
