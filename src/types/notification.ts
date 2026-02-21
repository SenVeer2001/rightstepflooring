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

export type SourceType = "job" | "lead" | "invoice" | "estimate" | "work_order" | "ticket" | "customer" | "staff";

export interface RelatedEntity {
  type: SourceType;
  id: string;
  label: string;
  title: string;
  subtitle?: string;
  status?: string;
  statusColor?: "green" | "yellow" | "red" | "blue" | "gray" | "orange" | "purple";
  amount?: number;
  date?: Date;
  url: string;
}

export interface ActivityContext {
  trigger: string;
  description: string;
  actor?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  timestamp: Date;
}

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  description: string;
  fullMessage?: string;
  timestamp: Date;
  isRead: boolean;
  sourceType?: SourceType;
  sourceId?: string;
  sourceLabel?: string;
  actionUrl?: string;
  actionLabel?: string;
  isExpiring?: boolean;
  expiresAt?: Date;
  relatedEntities?: RelatedEntity[];
  activityContext?: ActivityContext;
}

// Mock Notifications Data
export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "assignment",
    priority: "action_required",
    title: "New Job Assignment",
    description: "You have been assigned to Kitchen Renovation project for John Smith",
    fullMessage: "You have been assigned as the lead technician for a Kitchen Renovation project at 456 Oak Avenue. The customer, John Smith, has requested a complete kitchen remodel including new cabinets, countertops, and appliances installation.\n\nProject Details:\n• Start Date: Tomorrow at 8:00 AM\n• Estimated Duration: 5 days\n• Budget: $15,000\n\nPlease review the job details and confirm your availability. All required materials have been ordered and will be delivered to the site before your arrival.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false,
    sourceType: "job",
    sourceId: "JOB-2024-001",
    sourceLabel: "JOB-2024-001",
    actionUrl: "/jobs/JOB-2024-001",
    actionLabel: "View Job",
    relatedEntities: [
      {
        type: "job",
        id: "JOB-2024-001",
        label: "JOB-2024-001",
        title: "Kitchen Renovation",
        subtitle: "456 Oak Avenue, New York, NY",
        status: "Scheduled",
        statusColor: "yellow",
        amount: 15000,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        url: "/jobs/JOB-2024-001"
      },
      {
        type: "customer",
        id: "CUST-001",
        label: "Customer",
        title: "John Smith",
        subtitle: "(555) 123-4567 • john.smith@email.com",
        url: "/customers/CUST-001"
      }
    ],
    activityContext: {
      trigger: "Job assignment by dispatcher",
      description: "Sarah Johnson assigned you to this job based on your availability and expertise in kitchen renovations.",
      actor: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        role: "Operations Manager"
      },
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    }
  },
  {
    id: "2",
    type: "payment",
    priority: "action_required",
    title: "Invoice Payment Received",
    description: "Payment of $2,500.00 received for Invoice #INV-1234",
    fullMessage: "Great news! A payment of $2,500.00 has been successfully processed for Invoice #INV-1234.\n\nPayment Details:\n• Amount: $2,500.00\n• Payment Method: Credit Card (ending in 4242)\n• Transaction ID: TXN-89012345\n• Customer: Emily Brown\n\nThe payment has been automatically recorded in the system, and a receipt has been emailed to the customer. The invoice status has been updated to 'Paid'.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: false,
    sourceType: "invoice",
    sourceId: "INV-1234",
    sourceLabel: "INV-1234",
    actionUrl: "/invoices/INV-1234",
    actionLabel: "View Invoice",
    relatedEntities: [
      {
        type: "invoice",
        id: "INV-1234",
        label: "INV-1234",
        title: "Invoice #INV-1234",
        subtitle: "Bathroom Plumbing Repair",
        status: "Paid",
        statusColor: "green",
        amount: 2500,
        date: new Date(Date.now() - 30 * 60 * 1000),
        url: "/invoices/INV-1234"
      },
      {
        type: "job",
        id: "JOB-2024-098",
        label: "JOB-2024-098",
        title: "Bathroom Plumbing Repair",
        subtitle: "Completed on Jan 15, 2024",
        status: "Completed",
        statusColor: "green",
        url: "/jobs/JOB-2024-098"
      },
      {
        type: "customer",
        id: "CUST-045",
        label: "Customer",
        title: "Emily Brown",
        subtitle: "(555) 987-6543",
        url: "/customers/CUST-045"
      }
    ],
    activityContext: {
      trigger: "Online payment processed",
      description: "Customer completed payment through the online payment portal using their saved credit card.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    }
  },
  {
    id: "3",
    type: "alert",
    priority: "action_required",
    title: "Estimate Expiring Soon",
    description: "Estimate #EST-5678 for Bathroom Remodel expires in 2 days",
    fullMessage: "Your estimate #EST-5678 for the Bathroom Remodel project is set to expire in 2 days.\n\nEstimate Details:\n• Customer: Michael Johnson\n• Project: Complete Bathroom Remodel\n• Estimated Amount: $8,500.00\n• Created: January 10, 2024\n• Expires: January 25, 2024\n\nRecommended Actions:\n1. Follow up with the customer to check if they have any questions\n2. Consider offering a small discount to encourage conversion\n3. Extend the estimate validity if needed\n\nThis estimate has been viewed 3 times by the customer.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
    sourceType: "estimate",
    sourceId: "EST-5678",
    sourceLabel: "EST-5678",
    actionUrl: "/estimates/EST-5678",
    actionLabel: "Review Estimate",
    isExpiring: true,
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    relatedEntities: [
      {
        type: "estimate",
        id: "EST-5678",
        label: "EST-5678",
        title: "Estimate #EST-5678",
        subtitle: "Complete Bathroom Remodel",
        status: "Pending",
        statusColor: "yellow",
        amount: 8500,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        url: "/estimates/EST-5678"
      },
      {
        type: "lead",
        id: "LEAD-456",
        label: "Lead",
        title: "Bathroom Remodel Lead",
        subtitle: "Created from website inquiry",
        status: "Hot",
        statusColor: "orange",
        url: "/leads/LEAD-456"
      },
      {
        type: "customer",
        id: "CUST-089",
        label: "Customer",
        title: "Michael Johnson",
        subtitle: "(555) 456-7890",
        url: "/customers/CUST-089"
      }
    ],
    activityContext: {
      trigger: "Automated expiration reminder",
      description: "The system automatically detected that this estimate is approaching its expiration date and generated this reminder.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  },
  {
    id: "4",
    type: "mention",
    priority: "informational",
    title: "You were mentioned",
    description: "Sarah Johnson mentioned you in a comment on Ticket #TKT-789",
    fullMessage: "@John, can you take a look at this customer's issue? They're reporting that the AC unit we installed last week is making an unusual noise. I think you handled the original installation, so you might have the best insight.\n\nThe customer is available for a callback anytime today. Let me know if you need any additional information from the original job file.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isRead: false,
    sourceType: "ticket",
    sourceId: "TKT-789",
    sourceLabel: "TKT-789",
    actionUrl: "/tickets/TKT-789",
    actionLabel: "View Ticket",
    relatedEntities: [
      {
        type: "ticket",
        id: "TKT-789",
        label: "TKT-789",
        title: "AC Unit Making Noise",
        subtitle: "Customer complaint - Priority: Medium",
        status: "Open",
        statusColor: "blue",
        url: "/tickets/TKT-789"
      },
      {
        type: "job",
        id: "JOB-2024-075",
        label: "Original Job",
        title: "AC Unit Installation",
        subtitle: "Completed Jan 8, 2024",
        status: "Completed",
        statusColor: "green",
        url: "/jobs/JOB-2024-075"
      }
    ],
    activityContext: {
      trigger: "Mentioned in ticket comment",
      description: "Sarah Johnson tagged you in a comment requesting your expertise on a customer issue.",
      actor: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        role: "Operations Manager"
      },
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
    }
  },
  {
    id: "5",
    type: "document",
    priority: "action_required",
    title: "Document Upload Required",
    description: "Please upload proof of insurance for Work Order #WO-456",
    fullMessage: "A document upload is required to proceed with Work Order #WO-456.\n\nRequired Document: Proof of Insurance\nDeadline: January 30, 2024\n\nThe customer (ABC Property Management) requires proof of current liability insurance before work can begin on their commercial property. Please upload a valid certificate of insurance showing:\n\n• General Liability Coverage (minimum $1M)\n• Workers Compensation Coverage\n• Your company name and policy dates\n\nYou can upload the document directly through the work order page or by replying to this notification.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isRead: true,
    sourceType: "work_order",
    sourceId: "WO-456",
    sourceLabel: "WO-456",
    actionUrl: "/work-orders/WO-456",
    actionLabel: "Upload Document",
    relatedEntities: [
      {
        type: "work_order",
        id: "WO-456",
        label: "WO-456",
        title: "Work Order #WO-456",
        subtitle: "Commercial HVAC Maintenance",
        status: "Pending Documents",
        statusColor: "orange",
        amount: 3500,
        url: "/work-orders/WO-456"
      },
      {
        type: "customer",
        id: "CUST-150",
        label: "Customer",
        title: "ABC Property Management",
        subtitle: "Commercial Account",
        url: "/customers/CUST-150"
      }
    ],
    activityContext: {
      trigger: "Customer requirement for work order",
      description: "ABC Property Management requires proof of insurance before authorizing work on their commercial property.",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
    }
  },
  {
    id: "6",
    type: "system",
    priority: "informational",
    title: "System Maintenance Scheduled",
    description: "Scheduled maintenance on Sunday, Jan 28th from 2:00 AM - 4:00 AM EST",
    fullMessage: "We will be performing scheduled system maintenance to improve performance and reliability.\n\nMaintenance Window:\n• Date: Sunday, January 28, 2024\n• Time: 2:00 AM - 4:00 AM EST\n• Expected Duration: 2 hours\n\nDuring this time, the following services may be temporarily unavailable:\n• Job scheduling and dispatching\n• Invoice generation\n• Mobile app access\n• Customer portal\n\nAll data will be preserved, and no action is required on your part. We apologize for any inconvenience.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isRead: true,
    activityContext: {
      trigger: "Scheduled system maintenance notification",
      description: "This is an automated system notification sent to all users regarding upcoming planned maintenance.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  },
  {
    id: "7",
    type: "assignment",
    priority: "completed",
    title: "Work Order Completed",
    description: "Alex Thompson marked Work Order #WO-123 as completed",
    fullMessage: "Work Order #WO-123 has been marked as completed.\n\nCompletion Summary:\n• Technician: Alex Thompson\n• Completion Time: 2:45 PM\n• Duration: 3 hours 15 minutes\n• Work Performed: Water heater replacement\n\nCustomer Feedback: The customer signed off on the work and expressed satisfaction with the service. They mentioned they would recommend us to their neighbors.\n\nNext Steps:\n• Invoice #INV-2024-156 has been automatically generated\n• Invoice will be sent to customer via email\n• Payment terms: Net 30",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRead: true,
    sourceType: "work_order",
    sourceId: "WO-123",
    sourceLabel: "WO-123",
    actionUrl: "/work-orders/WO-123",
    actionLabel: "View Details",
    relatedEntities: [
      {
        type: "work_order",
        id: "WO-123",
        label: "WO-123",
        title: "Work Order #WO-123",
        subtitle: "Water Heater Replacement",
        status: "Completed",
        statusColor: "green",
        amount: 1200,
        url: "/work-orders/WO-123"
      },
      {
        type: "invoice",
        id: "INV-2024-156",
        label: "INV-2024-156",
        title: "Invoice #INV-2024-156",
        subtitle: "Auto-generated",
        status: "Sent",
        statusColor: "blue",
        amount: 1200,
        url: "/invoices/INV-2024-156"
      },
      {
        type: "staff",
        id: "STF-005",
        label: "Technician",
        title: "Alex Thompson",
        subtitle: "Field Technician",
        url: "/staff/STF-005"
      }
    ],
    activityContext: {
      trigger: "Work order marked complete by technician",
      description: "Alex Thompson marked the work order as complete and collected customer signature on the mobile app.",
      actor: {
        name: "Alex Thompson",
        role: "Field Technician"
      },
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  },
  {
    id: "8",
    type: "message",
    priority: "informational",
    title: "New Message from Customer",
    description: "Mike Davis sent a message regarding the plumbing repair",
    fullMessage: "Hi,\n\nI wanted to follow up on the plumbing repair estimate you sent last week. I've reviewed the details and I'm ready to move forward with the work.\n\nA few questions:\n1. What's the earliest availability you have?\n2. Will I need to be home during the entire repair?\n3. Is the warranty included in the quoted price?\n\nPlease let me know when we can schedule this.\n\nThanks,\nMike Davis\n(555) 234-5678",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isRead: true,
    sourceType: "lead",
    sourceId: "LEAD-890",
    sourceLabel: "LEAD-890",
    actionUrl: "/leads/LEAD-890",
    actionLabel: "View Message",
    relatedEntities: [
      {
        type: "lead",
        id: "LEAD-890",
        label: "LEAD-890",
        title: "Plumbing Repair Lead",
        subtitle: "Pipe replacement in basement",
        status: "Hot",
        statusColor: "orange",
        url: "/leads/LEAD-890"
      },
      {
        type: "estimate",
        id: "EST-9012",
        label: "EST-9012",
        title: "Estimate #EST-9012",
        subtitle: "Sent Jan 12, 2024",
        status: "Viewed",
        statusColor: "blue",
        amount: 1850,
        url: "/estimates/EST-9012"
      },
      {
        type: "customer",
        id: "CUST-234",
        label: "Customer",
        title: "Mike Davis",
        subtitle: "(555) 234-5678",
        url: "/customers/CUST-234"
      }
    ],
    activityContext: {
      trigger: "Customer sent message via contact form",
      description: "Mike Davis replied to your estimate through the customer portal messaging system.",
      actor: {
        name: "Mike Davis",
        role: "Customer"
      },
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  },
  {
    id: "9",
    type: "reminder",
    priority: "action_required",
    title: "Appointment Reminder",
    description: "Site visit scheduled for tomorrow at 10:00 AM - 123 Oak Street",
    fullMessage: "This is a reminder for your scheduled site visit tomorrow.\n\nAppointment Details:\n• Date: Tomorrow\n• Time: 10:00 AM\n• Location: 123 Oak Street, Apt 4B, New York, NY 10001\n• Customer: Jennifer Adams\n• Phone: (555) 876-5432\n• Purpose: Initial assessment for bathroom renovation\n\nItems to Bring:\n• Measurement tools\n• Camera for documentation\n• Estimate forms\n• Business cards\n\nParking: Street parking available. Customer will buzz you in at the main entrance.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isRead: false,
    sourceType: "job",
    sourceId: "JOB-2024-002",
    sourceLabel: "JOB-2024-002",
    actionUrl: "/jobs/JOB-2024-002",
    actionLabel: "View Appointment",
    relatedEntities: [
      {
        type: "job",
        id: "JOB-2024-002",
        label: "JOB-2024-002",
        title: "Site Visit - Bathroom Renovation",
        subtitle: "123 Oak Street, Apt 4B",
        status: "Scheduled",
        statusColor: "yellow",
        date: new Date(Date.now() + 18 * 60 * 60 * 1000),
        url: "/jobs/JOB-2024-002"
      },
      {
        type: "customer",
        id: "CUST-567",
        label: "Customer",
        title: "Jennifer Adams",
        subtitle: "(555) 876-5432",
        url: "/customers/CUST-567"
      }
    ],
    activityContext: {
      trigger: "Automated appointment reminder (24 hours before)",
      description: "This reminder was automatically generated 24 hours before your scheduled appointment.",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  },
  {
    id: "10",
    type: "payment",
    priority: "informational",
    title: "Invoice Sent",
    description: "Invoice #INV-5678 has been sent to Emily Brown",
    fullMessage: "Invoice #INV-5678 has been successfully sent to the customer.\n\nInvoice Details:\n• Invoice Number: INV-5678\n• Customer: Emily Brown\n• Email: emily.brown@email.com\n• Amount: $450.00\n• Due Date: February 15, 2024\n• Payment Terms: Net 30\n\nThe customer will receive an email with a link to view and pay the invoice online. You can track the invoice status and payment from the invoices dashboard.",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isRead: true,
    sourceType: "invoice",
    sourceId: "INV-5678",
    sourceLabel: "INV-5678",
    actionUrl: "/invoices/INV-5678",
    actionLabel: "View Invoice",
    relatedEntities: [
      {
        type: "invoice",
        id: "INV-5678",
        label: "INV-5678",
        title: "Invoice #INV-5678",
        subtitle: "Faucet Repair Service",
        status: "Sent",
        statusColor: "blue",
        amount: 450,
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        url: "/invoices/INV-5678"
      },
      {
        type: "job",
        id: "JOB-2024-045",
        label: "JOB-2024-045",
        title: "Faucet Repair",
        subtitle: "Completed Jan 10, 2024",
        status: "Completed",
        statusColor: "green",
        url: "/jobs/JOB-2024-045"
      },
      {
        type: "customer",
        id: "CUST-321",
        label: "Customer",
        title: "Emily Brown",
        subtitle: "emily.brown@email.com",
        url: "/customers/CUST-321"
      }
    ],
    activityContext: {
      trigger: "Invoice sent via email",
      description: "The invoice was automatically sent to the customer's email address after job completion.",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  }
];