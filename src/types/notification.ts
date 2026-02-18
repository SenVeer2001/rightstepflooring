// types/notification.ts
// types/notification.ts
export type NotificationType = 
  | "assignment" 
  | "payment" 
  | "alert" 
  | "message" 
  | "document" 
  | "system"
  | "mention"
  | "reminder";

export type NotificationPriority = "action_required" | "informational" | "completed";

export type NotificationCategory = "all" | "action_required" | "mentions" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  sourceType?: "job" | "lead" | "invoice" | "estimate" | "work_order" | "ticket";
  sourceId?: string;
  sourceLabel?: string;
  actionUrl?: string;
  actionLabel?: string;
  isExpiring?: boolean;
  expiresAt?: Date;
}
// data/notificationData.ts
export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "assignment",
    priority: "action_required",
    title: "New Job Assignment",
    description: "You have been assigned to Kitchen Renovation project for John Smith",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    isRead: false,
    sourceType: "job",
    sourceId: "JOB-2024-001",
    sourceLabel: "JOB-2024-001",
    actionUrl: "/jobs/JOB-2024-001",
    actionLabel: "View Job",
  },
  {
    id: "2",
    type: "payment",
    priority: "action_required",
    title: "Invoice Payment Received",
    description: "Payment of $2,500.00 received for Invoice #INV-1234",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    isRead: false,
    sourceType: "invoice",
    sourceId: "INV-1234",
    sourceLabel: "INV-1234",
    actionUrl: "/invoices/INV-1234",
    actionLabel: "View Invoice",
  },
  {
    id: "3",
    type: "alert",
    priority: "action_required",
    title: "Estimate Expiring Soon",
    description: "Estimate #EST-5678 for Bathroom Remodel expires in 2 days",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    sourceType: "estimate",
    sourceId: "EST-5678",
    sourceLabel: "EST-5678",
    actionUrl: "/estimates/EST-5678",
    actionLabel: "Review Estimate",
    isExpiring: true,
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    type: "mention",
    priority: "informational",
    title: "You were mentioned",
    description: "Sarah Johnson mentioned you in a comment on Ticket #TKT-789",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    isRead: false,
    sourceType: "ticket",
    sourceId: "TKT-789",
    sourceLabel: "TKT-789",
    actionUrl: "/tickets/TKT-789",
    actionLabel: "View Ticket",
  },
  {
    id: "5",
    type: "document",
    priority: "action_required",
    title: "Document Upload Required",
    description: "Please upload proof of insurance for Work Order #WO-456",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isRead: true,
    sourceType: "work_order",
    sourceId: "WO-456",
    sourceLabel: "WO-456",
    actionUrl: "/work-orders/WO-456",
    actionLabel: "Upload Document",
  },
  {
    id: "6",
    type: "system",
    priority: "informational",
    title: "System Maintenance Scheduled",
    description: "Scheduled maintenance on Sunday, Jan 28th from 2:00 AM - 4:00 AM EST",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
  },
  {
    id: "7",
    type: "assignment",
    priority: "completed",
    title: "Work Order Completed",
    description: "Alex Thompson marked Work Order #WO-123 as completed",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
    sourceType: "work_order",
    sourceId: "WO-123",
    sourceLabel: "WO-123",
    actionUrl: "/work-orders/WO-123",
    actionLabel: "View Details",
  },
  {
    id: "8",
    type: "message",
    priority: "informational",
    title: "New Message from Customer",
    description: "Mike Davis sent a message regarding the plumbing repair",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: true,
    sourceType: "lead",
    sourceId: "LEAD-890",
    sourceLabel: "LEAD-890",
    actionUrl: "/leads/LEAD-890",
    actionLabel: "View Message",
  },
  {
    id: "9",
    type: "reminder",
    priority: "action_required",
    title: "Appointment Reminder",
    description: "Site visit scheduled for tomorrow at 10:00 AM - 123 Oak Street",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: false,
    sourceType: "job",
    sourceId: "JOB-2024-002",
    sourceLabel: "JOB-2024-002",
    actionUrl: "/jobs/JOB-2024-002",
    actionLabel: "View Appointment",
  },
  {
    id: "10",
    type: "payment",
    priority: "informational",
    title: "Invoice Sent",
    description: "Invoice #INV-5678 has been sent to Emily Brown",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    isRead: true,
    sourceType: "invoice",
    sourceId: "INV-5678",
    sourceLabel: "INV-5678",
    actionUrl: "/invoices/INV-5678",
    actionLabel: "View Invoice",
  },
];