import type { Lead } from '../components/LeadCard'

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:5000/api'

export class LeadsService {
  /**
   * Fetch all leads from the server
   */
  static async getLeads(): Promise<Lead[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/leads`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.statusText}`)
      }

      const data = await response.json()
      return data.data || data
    } catch (error) {
      console.error('Error fetching leads:', error)
      throw error
    }
  }

  /**
   * Update lead status
   */
  static async updateLeadStatus(leadId: string, status: string): Promise<Lead> {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${leadId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update lead status: ${response.statusText}`)
      }

      const data = await response.json()
      return data.data || data
    } catch (error) {
      console.error('Error updating lead status:', error)
      throw error
    }
  }

  /**
   * Create a new lead
   */
  static async createLead(leadData: Partial<Lead>): Promise<Lead> {
    try {
      const response = await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })

      if (!response.ok) {
        throw new Error(`Failed to create lead: ${response.statusText}`)
      }

      const data = await response.json()
      return data.data || data
    } catch (error) {
      console.error('Error creating lead:', error)
      throw error
    }
  }

  /**
   * Update a lead
   */
  static async updateLead(leadId: string, leadData: Partial<Lead>): Promise<Lead> {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })

      if (!response.ok) {
        throw new Error(`Failed to update lead: ${response.statusText}`)
      }

      const data = await response.json()
      return data.data || data
    } catch (error) {
      console.error('Error updating lead:', error)
      throw error
    }
  }

  /**
   * Delete a lead
   */
  static async deleteLead(leadId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to delete lead: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting lead:', error)
      throw error
    }
  }
}
