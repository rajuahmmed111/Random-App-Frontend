"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Shuffle,
  Settings,
  Zap,
  BarChart3,
  Eye,
  RefreshCw,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { RoadmapItemType } from "../lib/types";
import { roadmapAPI } from "../lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";

interface AdminPanelProps {
  onItemCreated: (item: RoadmapItemType) => void;
}

export function AdminPanel({ onItemCreated }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [recentItems, setRecentItems] = useState<RoadmapItemType[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
    status: "PLANNED",
  });
  const { toast } = useToast();

  // Enhanced random item templates with more variety
  const randomTemplates = [
    {
      title: "Dark Mode Implementation",
      description:
        "Implement a comprehensive dark mode theme with automatic system preference detection, smooth transitions, and customizable accent colors",
      category: "UI_UX",
      priority: "HIGH",
      tags: ["theme", "accessibility", "user-experience"],
    },
    {
      title: "Real-time Push Notifications",
      description:
        "Add real-time push notifications for important updates, comments, mentions, and user interactions across all platforms with customizable preferences",
      category: "FEATURES",
      priority: "MEDIUM",
      tags: ["notifications", "real-time", "engagement"],
    },
    {
      title: "Advanced Search & Filtering",
      description:
        "Enhance search functionality with advanced filtering, faceted search, auto-complete, intelligent suggestions, and saved search queries",
      category: "FEATURES",
      priority: "LOW",
      tags: ["search", "filtering", "user-experience"],
    },
    {
      title: "Mobile-First Responsive Design",
      description:
        "Optimize the entire application for mobile devices with touch-friendly interfaces, responsive layouts, and progressive web app capabilities",
      category: "UI_UX",
      priority: "HIGH",
      tags: ["mobile", "responsive", "pwa"],
    },
    {
      title: "Intelligent API Rate Limiting",
      description:
        "Implement smart rate limiting with user-based quotas, dynamic throttling, and comprehensive monitoring to prevent API abuse",
      category: "SECURITY",
      priority: "CRITICAL",
      tags: ["security", "api", "performance"],
    },
    {
      title: "Database Query Optimization",
      description:
        "Optimize database queries, implement intelligent caching strategies, connection pooling, and improve overall data retrieval performance",
      category: "PERFORMANCE",
      priority: "HIGH",
      tags: ["database", "performance", "optimization"],
    },
    {
      title: "Third-party Service Integration",
      description:
        "Add support for popular third-party services, APIs, webhooks, and external platform integrations with OAuth authentication",
      category: "INTEGRATION",
      priority: "MEDIUM",
      tags: ["integration", "api", "oauth"],
    },
    {
      title: "Native Mobile Applications",
      description:
        "Develop native mobile applications for iOS and Android with full feature parity, offline support, and push notifications",
      category: "MOBILE",
      priority: "HIGH",
      tags: ["mobile", "native", "offline"],
    },
    {
      title: "GraphQL API Implementation",
      description:
        "Implement GraphQL endpoints for more efficient data fetching, real-time subscriptions, and improved developer experience",
      category: "API",
      priority: "MEDIUM",
      tags: ["graphql", "api", "performance"],
    },
    {
      title: "Advanced Analytics Dashboard",
      description:
        "Build comprehensive analytics dashboard with user behavior insights, custom reports, data visualization, and automated alerts",
      category: "FEATURES",
      priority: "MEDIUM",
      tags: ["analytics", "dashboard", "insights"],
    },
    {
      title: "Multi-language Localization",
      description:
        "Add internationalization support for multiple languages with dynamic content translation, RTL support, and cultural adaptations",
      category: "FEATURES",
      priority: "LOW",
      tags: ["i18n", "localization", "accessibility"],
    },
    {
      title: "Two-Factor Authentication",
      description:
        "Implement comprehensive 2FA with TOTP, SMS, backup codes, biometric authentication, and hardware security key support",
      category: "SECURITY",
      priority: "CRITICAL",
      tags: ["security", "authentication", "2fa"],
    },
    {
      title: "Real-time Performance Monitoring",
      description:
        "Add comprehensive performance monitoring with real-time alerts, metrics tracking, automated reporting, and anomaly detection",
      category: "PERFORMANCE",
      priority: "HIGH",
      tags: ["monitoring", "performance", "alerts"],
    },
    {
      title: "Automated Testing Infrastructure",
      description:
        "Implement comprehensive automated testing suite with unit, integration, end-to-end testing, and continuous quality assurance",
      category: "PLATFORM",
      priority: "MEDIUM",
      tags: ["testing", "automation", "quality"],
    },
    {
      title: "Cloud Infrastructure Migration",
      description:
        "Migrate to scalable cloud infrastructure with auto-scaling, load balancing, disaster recovery, and multi-region deployment",
      category: "PLATFORM",
      priority: "HIGH",
      tags: ["cloud", "infrastructure", "scalability"],
    },
    {
      title: "Advanced User Permissions",
      description:
        "Implement role-based access control with granular permissions, team management, audit logs, and compliance features",
      category: "SECURITY",
      priority: "HIGH",
      tags: ["permissions", "rbac", "security"],
    },
    {
      title: "Webhook Integration System",
      description:
        "Allow users to configure webhooks for real-time notifications, event streaming, and seamless third-party integrations",
      category: "INTEGRATION",
      priority: "MEDIUM",
      tags: ["webhooks", "integration", "events"],
    },
    {
      title: "Progressive Web App Features",
      description:
        "Add PWA capabilities including offline support, app-like experience, push notifications, and background sync",
      category: "MOBILE",
      priority: "MEDIUM",
      tags: ["pwa", "offline", "mobile"],
    },
    {
      title: "Advanced Data Export Tools",
      description:
        "Provide comprehensive data export functionality with multiple formats, scheduled exports, and data transformation options",
      category: "FEATURES",
      priority: "LOW",
      tags: ["export", "data", "automation"],
    },
    {
      title: "AI-Powered Recommendations",
      description:
        "Implement machine learning algorithms for intelligent content recommendations, user insights, and predictive analytics",
      category: "FEATURES",
      priority: "MEDIUM",
      tags: ["ai", "ml", "recommendations"],
    },
  ];

  // Load recent items when panel opens
  useEffect(() => {
    if (isOpen) {
      loadRecentItems();
    }
  }, [isOpen]);

  const loadRecentItems = async () => {
    try {
      const items = await roadmapAPI.getItems({
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setRecentItems(items.slice(0, 10));
    } catch (error) {
      console.error("Failed to load recent items:", error);
    }
  };

  // Generate unique timestamp-based suffix
  const generateUniqueTitle = (baseTitle: string) => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    return `${baseTitle} #${timestamp}-${randomNum}`;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Description is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Category is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleCreateItem = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const newItem = await roadmapAPI.createItem({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
      });

      onItemCreated(newItem);
      setIsCreateOpen(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "MEDIUM",
        status: "PLANNED",
      });
      await loadRecentItems();

      toast({
        title: "Success",
        description: "Roadmap item created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create roadmap item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRandomItem = async () => {
    const randomTemplate =
      randomTemplates[Math.floor(Math.random() * randomTemplates.length)];
    const uniqueTitle = generateUniqueTitle(randomTemplate.title);

    try {
      setLoading(true);
      const newItem = await roadmapAPI.createItem({
        title: uniqueTitle,
        description: randomTemplate.description,
        category: randomTemplate.category,
        priority: randomTemplate.priority,
        status: "PLANNED",
      });

      onItemCreated(newItem);
      await loadRecentItems();

      toast({
        title: "Random Item Created!",
        description: `Created "${randomTemplate.title}" successfully!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create random item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCreateRandom = async (count: number) => {
    try {
      setLoading(true);
      setBulkProgress({ current: 0, total: count });

      const shuffled = [...randomTemplates].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(
        0,
        Math.min(count, randomTemplates.length)
      );
      let successCount = 0;

      for (let i = 0; i < selected.length; i++) {
        const template = selected[i];
        setBulkProgress({ current: i + 1, total: count });

        const uniqueTitle = generateUniqueTitle(template.title);

        try {
          const newItem = await roadmapAPI.createItem({
            title: uniqueTitle,
            description: template.description,
            category: template.category,
            priority: template.priority,
            status: "PLANNED",
          });
          onItemCreated(newItem);
          successCount++;

          // Small delay to prevent overwhelming the API
          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`Failed to create item: ${uniqueTitle}`, error);
        }
      }

      await loadRecentItems();
      setBulkProgress({ current: 0, total: 0 });

      toast({
        title: "Bulk Creation Complete!",
        description: `Successfully created ${successCount} out of ${selected.length} roadmap items!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create bulk items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setBulkProgress({ current: 0, total: 0 });
    }
  };

  const handleQuickDemo = async () => {
    try {
      setLoading(true);
      setBulkProgress({ current: 0, total: 5 });

      const demoItems = [
        {
          title: generateUniqueTitle("Dark Mode Support"),
          description:
            "Add comprehensive dark mode theme across the entire application with system preference detection",
          category: "UI_UX",
          priority: "HIGH",
          status: "IN_PROGRESS",
        },
        {
          title: generateUniqueTitle("Mobile App Development"),
          description:
            "Develop native mobile applications for iOS and Android with full feature parity",
          category: "MOBILE",
          priority: "HIGH",
          status: "PLANNED",
        },
        {
          title: generateUniqueTitle("Advanced Analytics"),
          description:
            "Implement detailed analytics dashboard with custom reports and data visualization",
          category: "FEATURES",
          priority: "MEDIUM",
          status: "IN_PROGRESS",
        },
        {
          title: generateUniqueTitle("API Security Enhancement"),
          description:
            "Add intelligent rate limiting and advanced security measures for API endpoints",
          category: "SECURITY",
          priority: "CRITICAL",
          status: "COMPLETED",
        },
        {
          title: generateUniqueTitle("Real-time Collaboration"),
          description:
            "Enable team workspaces with role-based permissions and real-time collaboration features",
          category: "FEATURES",
          priority: "MEDIUM",
          status: "PLANNED",
        },
      ];

      let successCount = 0;
      for (let i = 0; i < demoItems.length; i++) {
        const item = demoItems[i];
        setBulkProgress({ current: i + 1, total: 5 });

        try {
          const newItem = await roadmapAPI.createItem(item);
          onItemCreated(newItem);
          successCount++;
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`Failed to create demo item: ${item.title}`, error);
        }
      }

      await loadRecentItems();
      setBulkProgress({ current: 0, total: 0 });

      toast({
        title: "Demo Data Created!",
        description: `Created ${successCount} demo roadmap items with different statuses!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create demo data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setBulkProgress({ current: 0, total: 0 });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await roadmapAPI.deleteItem(itemId);
      await loadRecentItems();
      toast({
        title: "Item Deleted",
        description: "Roadmap item deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "PLANNED":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "ON_HOLD":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "HIGH":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "LOW":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Admin Panel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Admin Panel
          </DialogTitle>
          <DialogDescription>
            Create, manage, and monitor roadmap items for testing and
            demonstration
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="create">Create Items</TabsTrigger>
            <TabsTrigger value="manage">Manage Items</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          {/* Create Items Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Fast ways to create roadmap items
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleCreateRandomItem}
                    disabled={loading}
                    className="w-full"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Create Random Item
                  </Button>

                  <Button
                    onClick={handleQuickDemo}
                    disabled={loading}
                    variant="secondary"
                    className="w-full"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Quick Demo Setup (5 items)
                  </Button>

                  <div className="space-y-2">
                    <Label>Bulk Create Random Items</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkCreateRandom(3)}
                        disabled={loading}
                      >
                        3 Items
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkCreateRandom(5)}
                        disabled={loading}
                      >
                        5 Items
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkCreateRandom(10)}
                        disabled={loading}
                      >
                        10 Items
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkCreateRandom(15)}
                        disabled={loading}
                      >
                        15 Items
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkCreateRandom(20)}
                        disabled={loading}
                      >
                        20 Items
                      </Button>
                    </div>
                  </div>

                  <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Custom Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Roadmap Item</DialogTitle>
                        <DialogDescription>
                          Add a new item to the roadmap
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                              handleInputChange("title", e.target.value)
                            }
                            placeholder="Enter item title"
                            disabled={loading}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description *</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                              handleInputChange("description", e.target.value)
                            }
                            placeholder="Enter item description"
                            rows={4}
                            disabled={loading}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Category *</Label>
                            <Select
                              value={formData.category}
                              onValueChange={(value) =>
                                handleInputChange("category", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="UI_UX">UI/UX</SelectItem>
                                <SelectItem value="FEATURES">
                                  Features
                                </SelectItem>
                                <SelectItem value="PLATFORM">
                                  Platform
                                </SelectItem>
                                <SelectItem value="SECURITY">
                                  Security
                                </SelectItem>
                                <SelectItem value="PERFORMANCE">
                                  Performance
                                </SelectItem>
                                <SelectItem value="INTEGRATION">
                                  Integration
                                </SelectItem>
                                <SelectItem value="MOBILE">Mobile</SelectItem>
                                <SelectItem value="API">API</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select
                              value={formData.priority}
                              onValueChange={(value) =>
                                handleInputChange("priority", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="CRITICAL">
                                  Critical
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) =>
                              handleInputChange("status", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PLANNED">Planned</SelectItem>
                              <SelectItem value="IN_PROGRESS">
                                In Progress
                              </SelectItem>
                              <SelectItem value="COMPLETED">
                                Completed
                              </SelectItem>
                              <SelectItem value="ON_HOLD">On Hold</SelectItem>
                              <SelectItem value="CANCELLED">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={handleCreateItem}
                            disabled={loading}
                            className="flex-1"
                          >
                            {loading ? "Creating..." : "Create Item"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsCreateOpen(false)}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Progress & Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Creation Status
                  </CardTitle>
                  <CardDescription>
                    Monitor bulk creation progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bulkProgress.total > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Creating items...</span>
                        <span>
                          {bulkProgress.current}/{bulkProgress.total}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (bulkProgress.current / bulkProgress.total) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {loading && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {bulkProgress.total > 0
                          ? "Creating items..."
                          : "Processing..."}
                      </p>
                    </div>
                  )}

                  {!loading && bulkProgress.total === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No active operations</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Manage Items Tab */}
          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Recent Items
                  <Button variant="ghost" size="sm" onClick={loadRecentItems}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage recently created roadmap items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {recentItems.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">
                            {item.title}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {item.description.slice(0, 100)}...
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Badge
                              className={getStatusColor(item.status)}
                              variant="secondary"
                            >
                              {item.status.replace("_", " ")}
                            </Badge>
                            <Badge variant="outline">
                              {item.category.replace("_", "/")}
                            </Badge>
                            <Badge
                              className={getPriorityColor(item.priority)}
                              variant="secondary"
                            >
                              {item.priority}
                            </Badge>
                            <Badge variant="outline">
                              {item.upvotes} votes
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-4">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentItems.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No recent items found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Templates</CardTitle>
                <CardDescription>
                  Preview of random item templates ({randomTemplates.length}{" "}
                  total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {randomTemplates.map((template, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="font-medium text-sm">
                        {template.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 mb-2">
                        {template.description.slice(0, 120)}...
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">
                          {template.category.replace("_", "/")}
                        </Badge>
                        <Badge
                          className={getPriorityColor(template.priority)}
                          variant="secondary"
                        >
                          {template.priority}
                        </Badge>
                        {template.tags?.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {randomTemplates.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Available for creation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Recent Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recentItems.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Created recently
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    Different categories
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Distribution</CardTitle>
                <CardDescription>
                  Breakdown by category and priority
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">By Category</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(
                        randomTemplates.reduce((acc, template) => {
                          acc[template.category] =
                            (acc[template.category] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([category, count]) => (
                        <div
                          key={category}
                          className="text-center p-2 border rounded"
                        >
                          <div className="font-medium">{count}</div>
                          <div className="text-xs text-muted-foreground">
                            {category.replace("_", "/")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">By Priority</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(
                        randomTemplates.reduce((acc, template) => {
                          acc[template.priority] =
                            (acc[template.priority] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([priority, count]) => (
                        <div
                          key={priority}
                          className="text-center p-2 border rounded"
                        >
                          <div className="font-medium">{count}</div>
                          <div className="text-xs text-muted-foreground">
                            {priority}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
