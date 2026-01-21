// src/services/api.ts

/**
 * API Service Layer for FSM Pro
 * 
 * This file demonstrates how to integrate with a backend API.
 * Replace mock data with actual API calls.
 */

// const API_BASE_URL = 'https://api.fsmpro.com/v1'

// ============ AUTH ENDPOINTS ============

export const authService = {
  login: async (email: string, password: string) => {
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // })
    // return response.json()

    // Mock response (remove when connecting to real API)
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          user: { id: '1', email, name: email.split('@')[0], role: 'admin' },
          token: 'mock-jwt-token'
        })
      }, 1000)
    })
  },

  logout: async () => {
    // const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
    // return response.json()
  }
}

// ============ JOBS ENDPOINTS ============

export interface Job {
  id: string
  title: string
  customer: string
  technician: string
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed'
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  date: string
  time: string
  location: string
  description: string
  estimatedDuration: string
}

export const jobService = {
  getAll: async (filters?: any) => {
    // const params = new URLSearchParams(filters)
    // const response = await fetch(`${API_BASE_URL}/jobs?${params}`)
    // return response.json()

    // Mock response
    return Promise.resolve([])
  },

  getById: async (id: string) => {
    // const response = await fetch(`${API_BASE_URL}/jobs/${id}`)
    // return response.json()
  },

  create: async (jobData: Omit<Job, 'id'>) => {
    // const response = await fetch(`${API_BASE_URL}/jobs`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(jobData)
    // })
    // return response.json()
  },

  update: async (id: string, jobData: Partial<Job>) => {
    // const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(jobData)
    // })
    // return response.json()
  },

  delete: async (id: string) => {
    // const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    //   method: 'DELETE'
    // })
    // return response.json()
  },

  assign: async (jobId: string, technicianId: string) => {
    // Assign a job to a technician
    // return this.update(jobId, { technician: technicianId, status: 'Assigned' })
  }
}

// ============ DISPATCH ENDPOINTS ============

export const dispatchService = {
  getAssignments: async () => {
    // Get all job assignments for dispatch board
    // const response = await fetch(`${API_BASE_URL}/dispatch/assignments`)
    // return response.json()
  },

  updateAssignment: async (jobId: string, technicianId: string) => {
    // Update job assignment
    // const response = await fetch(`${API_BASE_URL}/dispatch/assignments/${jobId}`, {
    //   method: 'PUT',
    //   body: JSON.stringify({ technicianId })
    // })
    // return response.json()
  },

  getGPSTracking: async () => {
    // Get real-time GPS coordinates
    // const response = await fetch(`${API_BASE_URL}/dispatch/gps`)
    // return response.json()
  }
}

// ============ CUSTOMER ENDPOINTS ============

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  jobs: number
  totalSpent: string
}

export const customerService = {
  getAll: async () => {
    // const response = await fetch(`${API_BASE_URL}/customers`)
    // return response.json()
  },

  create: async (customerData: Omit<Customer, 'id'>) => {
    // const response = await fetch(`${API_BASE_URL}/customers`, {
    //   method: 'POST',
    //   body: JSON.stringify(customerData)
    // })
    // return response.json()
  },

  update: async (id: string, customerData: Partial<Customer>) => {
    // const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(customerData)
    // })
    // return response.json()
  }
}

// ============ INVOICE ENDPOINTS ============

export interface Invoice {
  id: string
  customer: string
  amount: string
  status: 'Paid' | 'Pending' | 'Overdue'
  dueDate: string
}

export const invoiceService = {
  getAll: async () => {
    // const response = await fetch(`${API_BASE_URL}/invoices`)
    // return response.json()
  },

  create: async (invoiceData: Omit<Invoice, 'id'>) => {
    // const response = await fetch(`${API_BASE_URL}/invoices`, {
    //   method: 'POST',
    //   body: JSON.stringify(invoiceData)
    // })
    // return response.json()
  },

  sendReminder: async (invoiceId: string) => {
    // Send payment reminder to customer
    // const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/remind`, {
    //   method: 'POST'
    // })
    // return response.json()
  }
}

// ============ REPORTS ENDPOINTS ============

export const reportService = {
  getRevenueData: async (startDate: string, endDate: string) => {
    // const response = await fetch(
    //   `${API_BASE_URL}/reports/revenue?start=${startDate}&end=${endDate}`
    // )
    // return response.json()
  },

  getJobStats: async () => {
    // const response = await fetch(`${API_BASE_URL}/reports/jobs`)
    // return response.json()
  },

  getTechnicianPerformance: async () => {
    // const response = await fetch(`${API_BASE_URL}/reports/technicians`)
    // return response.json()
  }
}

// ============ AUTOMATION ENDPOINTS ============

export interface Workflow {
  id: string
  name: string
  trigger: string
  action: string
  status: 'Active' | 'Inactive'
}

export const automationService = {
  getWorkflows: async () => {
    // const response = await fetch(`${API_BASE_URL}/automation/workflows`)
    // return response.json()
  },

  createWorkflow: async (workflowData: Omit<Workflow, 'id'>) => {
    // const response = await fetch(`${API_BASE_URL}/automation/workflows`, {
    //   method: 'POST',
    //   body: JSON.stringify(workflowData)
    // })
    // return response.json()
  },

  updateWorkflow: async (id: string, workflowData: Partial<Workflow>) => {
    // const response = await fetch(`${API_BASE_URL}/automation/workflows/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(workflowData)
    // })
    // return response.json()
  }
}

// ============ EXAMPLE USAGE ============

/**
 * Example: How to use these services in a React component
 * 
 * import { useEffect, useState } from 'react'
 * import { jobService } from '../services/api'
 * 
 * export function MyComponent() {
 *   const [jobs, setJobs] = useState([])
 * 
 *   useEffect(() => {
 *     jobService.getAll().then(data => setJobs(data))
 *   }, [])
 * 
 *   return <div>{jobs.length} jobs loaded</div>
 * }
 */

// ============ INTERCEPTORS (OPTIONAL) ============

/**
 * Add request/response interceptors for:
 * - Authentication token injection
 * - Error handling
 * - Request/response transformation
 * - Retry logic
 */

class APIClient {
  private baseURL: string
  private token?: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  setToken(token: string) {
    this.token = token
  }

  async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options?.headers
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}

// Usage:
// const apiClient = new APIClient('https://api.fsmpro.com/v1')
// apiClient.setToken('your-jwt-token')
// const jobs = await apiClient.request<Job[]>('/jobs')

export { APIClient }
