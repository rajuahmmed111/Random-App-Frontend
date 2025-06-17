import type { RoadmapItemType, Comment } from "./types"

export const mockRoadmapItems: RoadmapItemType[] = [
  {
    id: 1,
    title: "Dark Mode Support",
    description: "Add comprehensive dark mode theme across the entire application with system preference detection",
    status: "In Progress",
    category: "UI/UX",
    upvotes: 45,
    createdAt: "2024-01-15",
    priority: "High",
  },
  {
    id: 2,
    title: "Mobile App",
    description: "Develop native mobile applications for iOS and Android with full feature parity",
    status: "Planned",
    category: "Platform",
    upvotes: 78,
    createdAt: "2024-01-10",
    priority: "High",
  },
  {
    id: 3,
    title: "Advanced Analytics",
    description:
      "Implement detailed analytics dashboard with custom reports, data visualization, and export capabilities",
    status: "In Progress",
    category: "Features",
    upvotes: 32,
    createdAt: "2024-01-20",
    priority: "Medium",
  },
  {
    id: 4,
    title: "API Rate Limiting",
    description: "Add intelligent rate limiting to prevent API abuse and ensure fair usage across all endpoints",
    status: "Completed",
    category: "Security",
    upvotes: 23,
    createdAt: "2024-01-05",
    priority: "High",
  },
  {
    id: 5,
    title: "Team Collaboration",
    description: "Enable team workspaces with role-based permissions, shared projects, and real-time collaboration",
    status: "Planned",
    category: "Features",
    upvotes: 56,
    createdAt: "2024-01-12",
    priority: "Medium",
  },
  {
    id: 6,
    title: "Advanced Search",
    description: "Implement full-text search with filters, sorting, and intelligent suggestions",
    status: "Planned",
    category: "Features",
    upvotes: 34,
    createdAt: "2024-01-18",
    priority: "Low",
  },
  {
    id: 7,
    title: "Two-Factor Authentication",
    description: "Add 2FA support with TOTP, SMS, and backup codes for enhanced account security",
    status: "In Progress",
    category: "Security",
    upvotes: 67,
    createdAt: "2024-01-08",
    priority: "High",
  },
  {
    id: 8,
    title: "Webhook Integration",
    description: "Allow users to configure webhooks for real-time notifications and third-party integrations",
    status: "Planned",
    category: "Platform",
    upvotes: 29,
    createdAt: "2024-01-22",
    priority: "Medium",
  },
]

export const mockComments: Record<number, Comment[]> = {
  1: [
    {
      id: 1,
      userId: "user1",
      username: "Alice Johnson",
      content:
        "This would be amazing! Dark mode is essential for late-night coding sessions. Really looking forward to this feature.",
      createdAt: "2024-01-16T10:30:00Z",
      replies: [
        {
          id: 2,
          userId: "user2",
          username: "Bob Smith",
          content:
            "Totally agree! My eyes would thank you for this feature. Will it include automatic switching based on system preferences?",
          createdAt: "2024-01-16T11:00:00Z",
          replies: [
            {
              id: 3,
              userId: "user1",
              username: "Alice Johnson",
              content:
                "Exactly! It's all about user comfort and accessibility. System preference detection would be perfect.",
              createdAt: "2024-01-16T11:15:00Z",
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      userId: "user3",
      username: "Carol Davis",
      content:
        "Will this include system theme detection? It would be great if it automatically switches based on my OS settings.",
      createdAt: "2024-01-16T14:20:00Z",
      replies: [],
    },
  ],
  2: [
    {
      id: 5,
      userId: "user2",
      username: "Bob Smith",
      content: "Mobile app would be a game changer! When can we expect this? Any plans for offline functionality?",
      createdAt: "2024-01-11T09:15:00Z",
      replies: [],
    },
    {
      id: 6,
      userId: "user4",
      username: "David Wilson",
      content: "This is exactly what we need! Will it have push notifications for important updates?",
      createdAt: "2024-01-11T15:30:00Z",
      replies: [],
    },
  ],
  3: [
    {
      id: 7,
      userId: "user3",
      username: "Carol Davis",
      content:
        "Advanced analytics would help us make better data-driven decisions. Looking forward to the custom reports feature!",
      createdAt: "2024-01-21T08:45:00Z",
      replies: [],
    },
  ],
  7: [
    {
      id: 8,
      userId: "user1",
      username: "Alice Johnson",
      content: "2FA is crucial for security. Will you support authenticator apps like Google Authenticator and Authy?",
      createdAt: "2024-01-09T12:20:00Z",
      replies: [
        {
          id: 9,
          userId: "user5",
          username: "Emma Thompson",
          content:
            "Yes, TOTP support is mentioned in the description. This will definitely improve our account security!",
          createdAt: "2024-01-09T13:15:00Z",
          replies: [],
        },
      ],
    },
  ],
}
