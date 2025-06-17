"use client";

import {
  Zap,
  Target,
  Star,
  Users,
  BarChart3,
  Search,
  Edit,
  Workflow,
  Smartphone,
  Brain,
  Globe,
  Shield,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

const getFeatureIcon = (category: string) => {
  const icons = {
    USER_EXPERIENCE: <Users className="w-5 h-5" />,
    CORE_FEATURES: <Zap className="w-5 h-5" />,
    WORKFLOW: <Workflow className="w-5 h-5" />,
    EDITOR: <Edit className="w-5 h-5" />,
    SEARCH: <Search className="w-5 h-5" />,
    COLLABORATION: <Users className="w-5 h-5" />,
    ANALYTICS: <BarChart3 className="w-5 h-5" />,
    NOTIFICATIONS: <Target className="w-5 h-5" />,
    MOBILE: <Smartphone className="w-5 h-5" />,
    INTEGRATIONS: <Target className="w-5 h-5" />,
    AI_ML: <Brain className="w-5 h-5" />,
    VISUALIZATION: <TrendingUp className="w-5 h-5" />,
    LOCALIZATION: <Globe className="w-5 h-5" />,
    SECURITY: <Shield className="w-5 h-5" />,
  };
  return icons[category as keyof typeof icons] || <Star className="w-5 h-5" />;
};

const getEffortColor = (effort: string) => {
  switch (effort) {
    case "Low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "High":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "Very High":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

export function FeatureRoadmapDisplay() {
  const priorityFeatures = {
    highPriority: [
      {
        title: "User Profiles & Avatars",
        description:
          "Complete user profiles with avatars, bio, activity history, and contribution stats",
        impact: "High user engagement and personalization",
        effort: "Medium",
        category: "USER_EXPERIENCE",
      },
      {
        title: "Advanced Voting System",
        description:
          "Multiple vote types (upvote/downvote), vote reasons, voting history, and vote analytics",
        impact: "Better feedback quality and user engagement",
        effort: "Medium",
        category: "CORE_FEATURES",
      },
      {
        title: "Item Status Workflow",
        description:
          "Automated status transitions, progress tracking, estimated completion dates",
        impact: "Better project management and transparency",
        effort: "High",
        category: "WORKFLOW",
      },
      {
        title: "Rich Text Editor",
        description:
          "Markdown support, image uploads, code blocks, mentions, and formatting",
        impact: "Better content creation and communication",
        effort: "Medium",
        category: "EDITOR",
      },
      {
        title: "Advanced Search & Filters",
        description:
          "Full-text search, saved searches, advanced filters, tags, and smart suggestions",
        impact: "Improved content discovery",
        effort: "High",
        category: "SEARCH",
      },
    ],
    mediumPriority: [
      {
        title: "Team Collaboration",
        description:
          "Organizations, teams, role-based permissions, team roadmaps",
        impact: "Enterprise adoption and team productivity",
        effort: "High",
        category: "COLLABORATION",
      },
      {
        title: "Analytics Dashboard",
        description:
          "User engagement metrics, voting trends, popular features, activity heatmaps",
        impact: "Data-driven decisions and insights",
        effort: "High",
        category: "ANALYTICS",
      },
      {
        title: "Email Notifications",
        description:
          "Digest emails, instant notifications, notification preferences, email templates",
        impact: "Better user retention and engagement",
        effort: "Medium",
        category: "NOTIFICATIONS",
      },
      {
        title: "Mobile App (PWA)",
        description:
          "Progressive Web App with offline support, push notifications, mobile-optimized UI",
        impact: "Mobile user accessibility",
        effort: "High",
        category: "MOBILE",
      },
      {
        title: "Integration APIs",
        description:
          "REST API, webhooks, Slack/Discord integration, GitHub sync",
        impact: "Third-party integrations and automation",
        effort: "High",
        category: "INTEGRATIONS",
      },
    ],
    niceToHave: [
      {
        title: "AI-Powered Features",
        description:
          "Smart categorization, duplicate detection, sentiment analysis, auto-tagging",
        impact: "Automated content management",
        effort: "Very High",
        category: "AI_ML",
      },
      {
        title: "Roadmap Visualization",
        description:
          "Timeline view, Gantt charts, dependency mapping, milestone tracking",
        impact: "Better project visualization",
        effort: "High",
        category: "VISUALIZATION",
      },
      {
        title: "Multi-language Support",
        description:
          "i18n support, RTL languages, auto-translation, localized content",
        impact: "Global user adoption",
        effort: "High",
        category: "LOCALIZATION",
      },
      {
        title: "Advanced Security",
        description:
          "2FA, SSO, audit logs, data encryption, compliance features",
        impact: "Enterprise security requirements",
        effort: "High",
        category: "SECURITY",
      },
    ],
  };

  const implementationRoadmap = {
    phase1: {
      title: "Foundation Enhancement (Weeks 1-4)",
      features: [
        "User Profiles & Avatars",
        "Rich Text Editor",
        "Advanced Voting System",
        "Email Notifications",
      ],
      goal: "Improve core user experience",
      progress: 0,
    },

    phase2: {
      title: "Advanced Features (Weeks 5-8)",
      features: [
        "Advanced Search & Filters",
        "Item Status Workflow",
        "Analytics Dashboard",
        "Mobile PWA",
      ],
      goal: "Add power-user features",
      progress: 0,
    },

    phase3: {
      title: "Enterprise Features (Weeks 9-12)",
      features: [
        "Team Collaboration",
        "Integration APIs",
        "Advanced Security",
        "Roadmap Visualization",
      ],
      goal: "Enterprise-ready platform",
      progress: 0,
    },

    phase4: {
      title: "AI & Innovation (Weeks 13-16)",
      features: [
        "AI-Powered Features",
        "Multi-language Support",
        "Advanced Analytics",
        "Performance Optimization",
      ],
      goal: "Cutting-edge features",
      progress: 0,
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">🚀 Roadmap App Enhancement Plan</h1>
        <p className="text-xl text-muted-foreground">
          Strategic features to make your roadmap app world-class
        </p>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="features">Feature Priorities</TabsTrigger>
          <TabsTrigger value="roadmap">Implementation Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          {/* High Priority Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Zap className="w-6 h-6" />
                🔥 High Priority Features
              </CardTitle>
              <CardDescription>
                Core features that will significantly improve user experience
                and engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {priorityFeatures.highPriority.map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getFeatureIcon(feature.category)}
                        </div>
                        <div className="space-y-2 flex-1">
                          <h3 className="font-semibold text-lg">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {feature.description}
                          </p>
                          <p className="text-sm text-blue-600 font-medium">
                            💡 {feature.impact}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge className={getEffortColor(feature.effort)}>
                              {feature.effort} Effort
                            </Badge>
                            <Badge variant="outline">
                              {feature.category.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Medium Priority Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <Target className="w-6 h-6" />
                🎯 Medium Priority Features
              </CardTitle>
              <CardDescription>
                Enhancement features that will add significant value and
                differentiation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {priorityFeatures.mediumPriority.map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getFeatureIcon(feature.category)}
                        </div>
                        <div className="space-y-2 flex-1">
                          <h3 className="font-semibold text-lg">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {feature.description}
                          </p>
                          <p className="text-sm text-blue-600 font-medium">
                            💡 {feature.impact}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge className={getEffortColor(feature.effort)}>
                              {feature.effort} Effort
                            </Badge>
                            <Badge variant="outline">
                              {feature.category.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Nice to Have Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Star className="w-6 h-6" />
                🌟 Nice to Have Features
              </CardTitle>
              <CardDescription>
                Advanced features for competitive advantage and innovation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {priorityFeatures.niceToHave.map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getFeatureIcon(feature.category)}
                        </div>
                        <div className="space-y-2 flex-1">
                          <h3 className="font-semibold text-lg">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {feature.description}
                          </p>
                          <p className="text-sm text-blue-600 font-medium">
                            💡 {feature.impact}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge className={getEffortColor(feature.effort)}>
                              {feature.effort} Effort
                            </Badge>
                            <Badge variant="outline">
                              {feature.category.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          <div className="grid gap-6">
            {Object.entries(implementationRoadmap).map(([phaseKey, phase]) => (
              <Card key={phaseKey}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {phase.title}
                      </CardTitle>
                      <CardDescription>{phase.goal}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {phase.progress}% Complete
                    </Badge>
                  </div>
                  <Progress value={phase.progress} className="w-full" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {phase.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 border rounded"
                      >
                        <div className="w-4 h-4 border-2 border-primary rounded"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Quick Start Recommendations</CardTitle>
          <CardDescription>
            Start with these features for maximum impact with minimal effort
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex flex-col items-start gap-2">
              <Users className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">User Profiles</div>
                <div className="text-sm opacity-80">
                  Start with basic profiles
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
            >
              <Edit className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Rich Text Editor</div>
                <div className="text-sm opacity-80">
                  Improve content creation
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
            >
              <Target className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Email Notifications</div>
                <div className="text-sm opacity-80">Boost engagement</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
