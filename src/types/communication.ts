// types/communication.ts

export type CommunicationType = "call" | "sms" | "email";
export type CallOutcome = "answered" | "missed" | "voicemail" | "busy" | "no_answer" | "callback_requested";
export type CallDirection = "inbound" | "outbound";
export type MessageStatus = "sent" | "delivered" | "read" | "failed" | "pending";
export type EmailStatus = "sent" | "delivered" | "opened" | "replied" | "bounced" | "draft";

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface CommunicationTag {
  id: string;
  name: string;
  color: string;
}

// Call Record
export interface CallRecord {
  id: string;
  type: "call";
  direction: CallDirection;
  outcome: CallOutcome;
  callerName: string;
  callerPhone: string;
  callerAvatar?: string;
  callerType: "customer" | "lead" | "staff" | "subcontractor" | "vendor" | "unknown";
  callerId?: string;
  receiverName: string;
  receiverPhone: string;
  receiverId?: string;
  timestamp: Date;
  duration: number; // in seconds
  hasRecording: boolean;
  recordingUrl?: string;
  recordingDuration?: number;
  notes?: string;
  tags: CommunicationTag[];
  relatedTo?: {
    type: "job" | "lead" | "invoice" | "estimate" | "ticket";
    id: string;
    label: string;
  };
  transcription?: string;
}

// SMS Message
export interface SMSMessage {
  id: string;
  content: string;
  timestamp: Date;
  direction: "inbound" | "outbound";
  status: MessageStatus;
  senderName: string;
  senderPhone: string;
}

export interface SMSThread {
  id: string;
  type: "sms";
  contactName: string;
  contactPhone: string;
  contactAvatar?: string;
  contactType: "customer" | "lead" | "staff" | "subcontractor" | "vendor" | "unknown";
  contactId?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: SMSMessage[];
  tags: CommunicationTag[];
  relatedTo?: {
    type: "job" | "lead" | "invoice" | "estimate" | "ticket";
    id: string;
    label: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// Email
export interface EmailMessage {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  cc?: {
    name: string;
    email: string;
  }[];
  subject: string;
  body: string;
  timestamp: Date;
  attachments: Attachment[];
  isRead: boolean;
}

export interface EmailThread {
  id: string;
  type: "email";
  subject: string;
  contactName: string;
  contactEmail: string;
  contactAvatar?: string;
  contactType: "customer" | "lead" | "staff" | "subcontractor" | "vendor" | "unknown";
  contactId?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: EmailStatus;
  messages: EmailMessage[];
  tags: CommunicationTag[];
  relatedTo?: {
    type: "job" | "lead" | "invoice" | "estimate" | "ticket";
    id: string;
    label: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  hasAttachments: boolean;
}

// Common tags
export const communicationTags: CommunicationTag[] = [
  { id: "tag-1", name: "Urgent", color: "red" },
  { id: "tag-2", name: "Follow-up", color: "yellow" },
  { id: "tag-3", name: "Resolved", color: "green" },
  { id: "tag-4", name: "Important", color: "orange" },
  { id: "tag-5", name: "Sales", color: "blue" },
  { id: "tag-6", name: "Support", color: "purple" },
  { id: "tag-7", name: "Billing", color: "cyan" },
];

// Mock Call Records
export const mockCallRecords: CallRecord[] = [
  {
    id: "call-001",
    type: "call",
    direction: "inbound",
    outcome: "answered",
    callerName: "John Smith",
    callerPhone: "(555) 123-4567",
    callerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    callerType: "customer",
    callerId: "CUST-001",
    receiverName: "Sarah Johnson",
    receiverPhone: "(555) 999-0001",
    receiverId: "STF-003",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    duration: 342,
    hasRecording: true,
    recordingUrl: "/recordings/call-001.mp3",
    recordingDuration: 342,
    notes: "Customer called about kitchen renovation project. Wants to schedule a site visit next week.",
    tags: [
      { id: "tag-4", name: "Important", color: "orange" },
      { id: "tag-5", name: "Sales", color: "blue" },
    ],
    relatedTo: {
      type: "job",
      id: "JOB-2024-001",
      label: "Kitchen Renovation",
    },
    transcription: "Hi, this is John Smith calling about the kitchen renovation estimate I received...",
  },
  {
    id: "call-002",
    type: "call",
    direction: "outbound",
    outcome: "voicemail",
    callerName: "Emily Davis",
    callerPhone: "(555) 999-0002",
    callerType: "staff",
    callerId: "STF-002",
    receiverName: "Mike Johnson",
    receiverPhone: "(555) 234-5678",
    receiverId: "CUST-045",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    duration: 32,
    hasRecording: true,
    recordingUrl: "/recordings/call-002.mp3",
    recordingDuration: 32,
    notes: "Left voicemail regarding appointment confirmation for tomorrow.",
    tags: [
      { id: "tag-2", name: "Follow-up", color: "yellow" },
    ],
    relatedTo: {
      type: "job",
      id: "JOB-2024-015",
      label: "Plumbing Repair",
    },
  },
  {
    id: "call-003",
    type: "call",
    direction: "inbound",
    outcome: "missed",
    callerName: "Lisa Anderson",
    callerPhone: "(555) 345-6789",
    callerType: "customer",
    callerId: "CUST-089",
    receiverName: "Main Line",
    receiverPhone: "(555) 999-0000",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    duration: 0,
    hasRecording: false,
    tags: [
      { id: "tag-1", name: "Urgent", color: "red" },
      { id: "tag-2", name: "Follow-up", color: "yellow" },
    ],
  },
  {
    id: "call-004",
    type: "call",
    direction: "inbound",
    outcome: "answered",
    callerName: "ABC Plumbing Co.",
    callerPhone: "(555) 456-7890",
    callerType: "subcontractor",
    callerId: "SUB-001",
    receiverName: "Michael Brown",
    receiverPhone: "(555) 999-0003",
    receiverId: "STF-004",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    duration: 485,
    hasRecording: true,
    recordingUrl: "/recordings/call-004.mp3",
    recordingDuration: 485,
    notes: "Discussed upcoming job schedule and material requirements.",
    tags: [
      { id: "tag-4", name: "Important", color: "orange" },
    ],
  },
  {
    id: "call-005",
    type: "call",
    direction: "outbound",
    outcome: "answered",
    callerName: "Sarah Johnson",
    callerPhone: "(555) 999-0001",
    callerType: "staff",
    callerId: "STF-003",
    receiverName: "Robert Chen",
    receiverPhone: "(555) 567-8901",
    receiverId: "CUST-102",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    duration: 256,
    hasRecording: true,
    recordingUrl: "/recordings/call-005.mp3",
    recordingDuration: 256,
    notes: "Follow-up call regarding invoice payment. Customer will pay by end of week.",
    tags: [
      { id: "tag-7", name: "Billing", color: "cyan" },
      { id: "tag-3", name: "Resolved", color: "green" },
    ],
    relatedTo: {
      type: "invoice",
      id: "INV-2024-089",
      label: "Invoice #INV-2024-089",
    },
  },
  {
    id: "call-006",
    type: "call",
    direction: "inbound",
    outcome: "callback_requested",
    callerName: "Jennifer Adams",
    callerPhone: "(555) 678-9012",
    callerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    callerType: "lead",
    callerId: "LEAD-456",
    receiverName: "Main Line",
    receiverPhone: "(555) 999-0000",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    duration: 45,
    hasRecording: true,
    recordingUrl: "/recordings/call-006.mp3",
    recordingDuration: 45,
    notes: "New lead interested in bathroom renovation. Requested callback after 5 PM.",
    tags: [
      { id: "tag-5", name: "Sales", color: "blue" },
      { id: "tag-2", name: "Follow-up", color: "yellow" },
    ],
    relatedTo: {
      type: "lead",
      id: "LEAD-456",
      label: "Bathroom Renovation Lead",
    },
  },
  {
    id: "call-007",
    type: "call",
    direction: "outbound",
    outcome: "no_answer",
    callerName: "Alex Thompson",
    callerPhone: "(555) 999-0004",
    callerType: "staff",
    callerId: "STF-005",
    receiverName: "Home Depot Supply",
    receiverPhone: "(555) 789-0123",
    receiverId: "VND-001",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: 0,
    hasRecording: false,
    tags: [],
  },
  {
    id: "call-008",
    type: "call",
    direction: "inbound",
    outcome: "answered",
    callerName: "David Martinez",
    callerPhone: "(555) 890-1234",
    callerType: "customer",
    callerId: "CUST-150",
    receiverName: "Emily Davis",
    receiverPhone: "(555) 999-0002",
    receiverId: "STF-002",
    timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
    duration: 612,
    hasRecording: true,
    recordingUrl: "/recordings/call-008.mp3",
    recordingDuration: 612,
    notes: "Customer reported issue with recent HVAC installation. Scheduled technician visit.",
    tags: [
      { id: "tag-6", name: "Support", color: "purple" },
      { id: "tag-1", name: "Urgent", color: "red" },
    ],
    relatedTo: {
      type: "ticket",
      id: "TKT-2024-045",
      label: "HVAC Noise Complaint",
    },
  },
];

// Mock SMS Threads
export const mockSMSThreads: SMSThread[] = [
  {
    id: "sms-001",
    type: "sms",
    contactName: "John Smith",
    contactPhone: "(555) 123-4567",
    contactAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    contactType: "customer",
    contactId: "CUST-001",
    lastMessage: "Thanks! See you tomorrow at 9 AM.",
    lastMessageTime: new Date(Date.now() - 10 * 60 * 1000),
    unreadCount: 0,
    messages: [
      {
        id: "msg-001",
        content: "Hi John, this is Sarah from ServicePro. Just confirming your appointment for tomorrow at 9 AM for the kitchen renovation estimate.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        direction: "outbound",
        status: "delivered",
        senderName: "Sarah Johnson",
        senderPhone: "(555) 999-0001",
      },
      {
        id: "msg-002",
        content: "Hi Sarah! Yes, that works perfectly for me.",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        direction: "inbound",
        status: "read",
        senderName: "John Smith",
        senderPhone: "(555) 123-4567",
      },
      {
        id: "msg-003",
        content: "Great! Our technician Mike will be there. He'll call you 30 minutes before arrival.",
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        direction: "outbound",
        status: "delivered",
        senderName: "Sarah Johnson",
        senderPhone: "(555) 999-0001",
      },
      {
        id: "msg-004",
        content: "Thanks! See you tomorrow at 9 AM.",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        direction: "inbound",
        status: "read",
        senderName: "John Smith",
        senderPhone: "(555) 123-4567",
      },
    ],
    tags: [
      { id: "tag-5", name: "Sales", color: "blue" },
    ],
    relatedTo: {
      type: "job",
      id: "JOB-2024-001",
      label: "Kitchen Renovation",
    },
    assignedTo: {
      id: "STF-003",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
  },
  {
    id: "sms-002",
    type: "sms",
    contactName: "Lisa Anderson",
    contactPhone: "(555) 345-6789",
    contactType: "customer",
    contactId: "CUST-089",
    lastMessage: "When will the technician arrive?",
    lastMessageTime: new Date(Date.now() - 45 * 60 * 1000),
    unreadCount: 2,
    messages: [
      {
        id: "msg-005",
        content: "Hi Lisa, your appointment is scheduled for today between 2-4 PM.",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        direction: "outbound",
        status: "delivered",
        senderName: "Emily Davis",
        senderPhone: "(555) 999-0002",
      },
      {
        id: "msg-006",
        content: "Ok thanks",
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
        direction: "inbound",
        status: "read",
        senderName: "Lisa Anderson",
        senderPhone: "(555) 345-6789",
      },
      {
        id: "msg-007",
        content: "It's 3:30 now. When will the technician arrive?",
        timestamp: new Date(Date.now() - 50 * 60 * 1000),
        direction: "inbound",
        status: "delivered",
        senderName: "Lisa Anderson",
        senderPhone: "(555) 345-6789",
      },
      {
        id: "msg-008",
        content: "When will the technician arrive?",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        direction: "inbound",
        status: "delivered",
        senderName: "Lisa Anderson",
        senderPhone: "(555) 345-6789",
      },
    ],
    tags: [
      { id: "tag-1", name: "Urgent", color: "red" },
      { id: "tag-6", name: "Support", color: "purple" },
    ],
    relatedTo: {
      type: "job",
      id: "JOB-2024-025",
      label: "AC Repair",
    },
    assignedTo: {
      id: "STF-002",
      name: "Emily Davis",
    },
  },
  {
    id: "sms-003",
    type: "sms",
    contactName: "ABC Plumbing Co.",
    contactPhone: "(555) 456-7890",
    contactType: "subcontractor",
    contactId: "SUB-001",
    lastMessage: "Materials delivered. Ready to start tomorrow.",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
    messages: [
      {
        id: "msg-009",
        content: "Hi, confirming we need the copper pipes and fittings for the Johnson job tomorrow.",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        direction: "outbound",
        status: "delivered",
        senderName: "Michael Brown",
        senderPhone: "(555) 999-0003",
      },
      {
        id: "msg-010",
        content: "Got it. I'll have everything ready by 7 AM.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        direction: "inbound",
        status: "read",
        senderName: "ABC Plumbing",
        senderPhone: "(555) 456-7890",
      },
      {
        id: "msg-011",
        content: "Materials delivered. Ready to start tomorrow.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        direction: "inbound",
        status: "read",
        senderName: "ABC Plumbing",
        senderPhone: "(555) 456-7890",
      },
    ],
    tags: [
      { id: "tag-3", name: "Resolved", color: "green" },
    ],
    assignedTo: {
      id: "STF-004",
      name: "Michael Brown",
    },
  },
  {
    id: "sms-004",
    type: "sms",
    contactName: "Jennifer Adams",
    contactPhone: "(555) 678-9012",
    contactAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    contactType: "lead",
    contactId: "LEAD-456",
    lastMessage: "Yes, I'm interested. Please send me the estimate.",
    lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    unreadCount: 1,
    messages: [
      {
        id: "msg-012",
        content: "Hi Jennifer, thank you for your interest in our bathroom renovation services. Would you like to schedule a free estimate?",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        direction: "outbound",
        status: "delivered",
        senderName: "Sarah Johnson",
        senderPhone: "(555) 999-0001",
      },
      {
        id: "msg-013",
        content: "Yes, I'm interested. Please send me the estimate.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        direction: "inbound",
        status: "delivered",
        senderName: "Jennifer Adams",
        senderPhone: "(555) 678-9012",
      },
    ],
    tags: [
      { id: "tag-5", name: "Sales", color: "blue" },
      { id: "tag-2", name: "Follow-up", color: "yellow" },
    ],
    relatedTo: {
      type: "lead",
      id: "LEAD-456",
      label: "Bathroom Renovation Lead",
    },
    assignedTo: {
      id: "STF-003",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
  },
  {
    id: "sms-005",
    type: "sms",
    contactName: "Robert Chen",
    contactPhone: "(555) 567-8901",
    contactType: "customer",
    contactId: "CUST-102",
    lastMessage: "Payment sent via Zelle. Thank you!",
    lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    unreadCount: 0,
    messages: [
      {
        id: "msg-014",
        content: "Hi Robert, this is a reminder that Invoice #INV-2024-089 is due in 3 days. Total: $2,500.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        direction: "outbound",
        status: "delivered",
        senderName: "Jennifer Garcia",
        senderPhone: "(555) 999-0005",
      },
      {
        id: "msg-015",
        content: "Thanks for the reminder. Will pay by Friday.",
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
        direction: "inbound",
        status: "read",
        senderName: "Robert Chen",
        senderPhone: "(555) 567-8901",
      },
      {
        id: "msg-016",
        content: "Payment sent via Zelle. Thank you!",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        direction: "inbound",
        status: "read",
        senderName: "Robert Chen",
        senderPhone: "(555) 567-8901",
      },
    ],
    tags: [
      { id: "tag-7", name: "Billing", color: "cyan" },
      { id: "tag-3", name: "Resolved", color: "green" },
    ],
    relatedTo: {
      type: "invoice",
      id: "INV-2024-089",
      label: "Invoice #INV-2024-089",
    },
    assignedTo: {
      id: "STF-009",
      name: "Jennifer Garcia",
    },
  },
];

// Mock Email Threads
export const mockEmailThreads: EmailThread[] = [
  {
    id: "email-001",
    type: "email",
    subject: "Re: Kitchen Renovation Project - Next Steps",
    contactName: "John Smith",
    contactEmail: "john.smith@email.com",
    contactAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    contactType: "customer",
    contactId: "CUST-001",
    lastMessage: "Thank you for the detailed proposal. I've reviewed it with my wife and we'd like to proceed with Option B.",
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 1,
    status: "replied",
    messages: [
      {
        id: "em-001",
        from: { name: "Sarah Johnson", email: "sarah@servicepro.com", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
        to: [{ name: "John Smith", email: "john.smith@email.com" }],
        subject: "Kitchen Renovation Project - Next Steps",
        body: `Dear John,

Thank you for meeting with us yesterday to discuss your kitchen renovation project. As promised, I'm attaching the detailed proposal with three design options.

Option A: Basic renovation ($15,000)
Option B: Mid-range upgrade ($25,000)
Option C: Premium renovation ($40,000)

Each option includes:
- Custom cabinetry
- Granite countertops
- New appliances (varies by option)
- Lighting upgrade
- Complete plumbing work

Please review the attached documents and let me know if you have any questions.

Best regards,
Sarah Johnson
Project Manager`,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        attachments: [
          { id: "att-001", name: "Kitchen_Renovation_Proposal.pdf", type: "pdf", size: 2450000, url: "/attachments/proposal.pdf" },
          { id: "att-002", name: "Design_Options.pdf", type: "pdf", size: 5680000, url: "/attachments/designs.pdf" },
        ],
        isRead: true,
      },
      {
        id: "em-002",
        from: { name: "John Smith", email: "john.smith@email.com" },
        to: [{ name: "Sarah Johnson", email: "sarah@servicepro.com" }],
        subject: "Re: Kitchen Renovation Project - Next Steps",
        body: `Hi Sarah,

Thank you for the detailed proposal. I've reviewed it with my wife and we'd like to proceed with Option B.

A few questions:
1. What's the estimated timeline for Option B?
2. Can we customize the cabinet color?
3. Is financing available?

Looking forward to your response.

Best,
John Smith`,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        attachments: [],
        isRead: false,
      },
    ],
    tags: [
      { id: "tag-5", name: "Sales", color: "blue" },
      { id: "tag-4", name: "Important", color: "orange" },
    ],
    relatedTo: {
      type: "job",
      id: "JOB-2024-001",
      label: "Kitchen Renovation",
    },
    assignedTo: {
      id: "STF-003",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    hasAttachments: true,
  },
  {
    id: "email-002",
    type: "email",
    subject: "Invoice #INV-2024-089 - Payment Confirmation",
    contactName: "Robert Chen",
    contactEmail: "robert.chen@company.com",
    contactType: "customer",
    contactId: "CUST-102",
    lastMessage: "Payment of $2,500.00 has been processed successfully. Thank you for your business!",
    lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    unreadCount: 0,
    status: "sent",
    messages: [
      {
        id: "em-003",
        from: { name: "ServicePro Billing", email: "billing@servicepro.com" },
        to: [{ name: "Robert Chen", email: "robert.chen@company.com" }],
        subject: "Invoice #INV-2024-089 - Payment Confirmation",
        body: `Dear Robert Chen,

Payment of $2,500.00 has been processed successfully. Thank you for your business!

Transaction Details:
- Invoice Number: INV-2024-089
- Amount: $2,500.00
- Payment Method: Zelle
- Date: January 22, 2024

A receipt is attached to this email for your records.

If you have any questions, please don't hesitate to contact us.

Best regards,
ServicePro Billing Team`,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        attachments: [
          { id: "att-003", name: "Receipt_INV-2024-089.pdf", type: "pdf", size: 125000, url: "/attachments/receipt.pdf" },
        ],
        isRead: true,
      },
    ],
    tags: [
      { id: "tag-7", name: "Billing", color: "cyan" },
      { id: "tag-3", name: "Resolved", color: "green" },
    ],
    relatedTo: {
      type: "invoice",
      id: "INV-2024-089",
      label: "Invoice #INV-2024-089",
    },
    assignedTo: {
      id: "STF-009",
      name: "Jennifer Garcia",
    },
    hasAttachments: true,
  },
  {
    id: "email-003",
    type: "email",
    subject: "Service Request - HVAC Not Working",
    contactName: "David Martinez",
    contactEmail: "david.martinez@gmail.com",
    contactType: "customer",
    contactId: "CUST-150",
    lastMessage: "The HVAC unit is making a loud grinding noise and not cooling properly. This is urgent as we have guests this weekend.",
    lastMessageTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
    unreadCount: 1,
    status: "opened",
    messages: [
      {
        id: "em-004",
        from: { name: "David Martinez", email: "david.martinez@gmail.com" },
        to: [{ name: "ServicePro Support", email: "support@servicepro.com" }],
        subject: "Service Request - HVAC Not Working",
        body: `Hello,

The HVAC unit is making a loud grinding noise and not cooling properly. This is urgent as we have guests this weekend.

The unit was installed by your team about 3 weeks ago (Job #JOB-2024-098).

Please send someone to look at it as soon as possible.

Thanks,
David Martinez
(555) 890-1234`,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        attachments: [
          { id: "att-004", name: "HVAC_Video.mp4", type: "video", size: 15680000, url: "/attachments/hvac_video.mp4" },
        ],
        isRead: false,
      },
    ],
    tags: [
      { id: "tag-1", name: "Urgent", color: "red" },
      { id: "tag-6", name: "Support", color: "purple" },
    ],
    relatedTo: {
      type: "ticket",
      id: "TKT-2024-045",
      label: "HVAC Noise Complaint",
    },
    assignedTo: {
      id: "STF-002",
      name: "Emily Davis",
    },
    hasAttachments: true,
  },
  {
    id: "email-004",
    type: "email",
    subject: "Subcontractor Agreement - ABC Plumbing Co.",
    contactName: "ABC Plumbing Co.",
    contactEmail: "contracts@abcplumbing.com",
    contactType: "subcontractor",
    contactId: "SUB-001",
    lastMessage: "Please find the signed subcontractor agreement attached. Looking forward to working with you.",
    lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    unreadCount: 0,
    status: "delivered",
    messages: [
      {
        id: "em-005",
        from: { name: "Michael Brown", email: "michael@servicepro.com" },
        to: [{ name: "ABC Plumbing", email: "contracts@abcplumbing.com" }],
        subject: "Subcontractor Agreement - ABC Plumbing Co.",
        body: `Dear ABC Plumbing Team,

Please find attached the updated subcontractor agreement for 2024. Kindly review and sign at your earliest convenience.

Key updates include:
- Updated payment terms
- New insurance requirements
- Revised job assignment process

Let me know if you have any questions.

Best regards,
Michael Brown`,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        attachments: [
          { id: "att-005", name: "Subcontractor_Agreement_2024.pdf", type: "pdf", size: 890000, url: "/attachments/agreement.pdf" },
        ],
        isRead: true,
      },
      {
        id: "em-006",
        from: { name: "ABC Plumbing", email: "contracts@abcplumbing.com" },
        to: [{ name: "Michael Brown", email: "michael@servicepro.com" }],
        subject: "Re: Subcontractor Agreement - ABC Plumbing Co.",
        body: `Hi Michael,

Please find the signed subcontractor agreement attached. Looking forward to working with you.

Best,
ABC Plumbing Team`,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        attachments: [
          { id: "att-006", name: "Subcontractor_Agreement_2024_Signed.pdf", type: "pdf", size: 920000, url: "/attachments/agreement_signed.pdf" },
        ],
        isRead: true,
      },
    ],
    tags: [
      { id: "tag-3", name: "Resolved", color: "green" },
    ],
    assignedTo: {
      id: "STF-004",
      name: "Michael Brown",
    },
    hasAttachments: true,
  },
  {
    id: "email-005",
    type: "email",
    subject: "New Lead: Bathroom Renovation Request",
    contactName: "Jennifer Adams",
    contactEmail: "jennifer.adams@outlook.com",
    contactAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    contactType: "lead",
    contactId: "LEAD-456",
    lastMessage: "I'm interested in renovating my master bathroom. Can you provide a free estimate?",
    lastMessageTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
    unreadCount: 1,
    status: "opened",
    messages: [
      {
        id: "em-007",
        from: { name: "Jennifer Adams", email: "jennifer.adams@outlook.com" },
        to: [{ name: "ServicePro Sales", email: "sales@servicepro.com" }],
        subject: "New Lead: Bathroom Renovation Request",
        body: `Hello,

I'm interested in renovating my master bathroom. Can you provide a free estimate?

Details:
- Bathroom size: Approximately 10x12 feet
- Current setup: Bathtub, single vanity, standard fixtures
- Desired changes: Walk-in shower, double vanity, modern fixtures

I've attached some inspiration photos.

Please call me at (555) 678-9012 after 5 PM or email me to schedule a consultation.

Thank you,
Jennifer Adams`,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        attachments: [
          { id: "att-007", name: "Bathroom_Inspiration_1.jpg", type: "jpg", size: 1250000, url: "/attachments/bathroom1.jpg" },
          { id: "att-008", name: "Bathroom_Inspiration_2.jpg", type: "jpg", size: 980000, url: "/attachments/bathroom2.jpg" },
        ],
        isRead: false,
      },
    ],
    tags: [
      { id: "tag-5", name: "Sales", color: "blue" },
      { id: "tag-2", name: "Follow-up", color: "yellow" },
    ],
    relatedTo: {
      type: "lead",
      id: "LEAD-456",
      label: "Bathroom Renovation Lead",
    },
    assignedTo: {
      id: "STF-003",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    hasAttachments: true,
  },
];

// Helper functions
export const formatDuration = (seconds: number): string => {
  if (seconds === 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};