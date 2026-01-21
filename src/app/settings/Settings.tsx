import { ChevronRight, Building2, Users, Zap, Bell, Wrench, Link, CreditCard } from 'lucide-react'
import { useState } from 'react'

type SettingsTab = 'company' | 'team' | 'services' | 'notifications' | 'automations' | 'integrations' | 'billing'

interface SettingsSection {
  id: SettingsTab
  label: string
  icon: any
}

const settingsSections: SettingsSection[] = [
  { id: 'company', label: 'Company Profile', icon: Building2 },
  { id: 'team', label: 'Team & Roles', icon: Users },
  { id: 'services', label: 'Services & Pricing', icon: Zap },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'automations', label: 'Automations', icon: Wrench },
  { id: 'integrations', label: 'Integrations', icon: Link },
  { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
]

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('company')

  const renderContent = () => {
    switch (activeTab) {
      case 'company':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                <input type="text" defaultValue="Right Step Flooring" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input type="email" defaultValue="admin@rightstepdooring.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input type="tel" defaultValue="(555) 123-4567" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input type="text" defaultValue="123 Business Street" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        )
      case 'team':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Team & Roles</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Admin:</strong> Full access to all features and settings
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Manager:</strong> Can manage jobs, technicians, and invoices
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Technician:</strong> Can view assigned jobs and update status
                </p>
              </div>
            </div>
          </div>
        )
      case 'services':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Services & Pricing</h2>
            <div className="space-y-4">
              {['Flooring Installation', 'Carpet Cleaning', 'Flooring Repair', 'Tile Restoration'].map((service) => (
                <div key={service} className="border border-gray-300 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">{service}</span>
                    <input type="number" defaultValue="500" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" placeholder="Price" />
                  </div>
                </div>
              ))}
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
                Add Service
              </button>
            </div>
          </div>
        )
      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            <div className="space-y-4">
              {[
                { label: 'Email notifications for new jobs', key: 'email_jobs' },
                { label: 'SMS alerts for urgent tasks', key: 'sms_urgent' },
                { label: 'Daily summary emails', key: 'daily_summary' },
                { label: 'Payment received notifications', key: 'payment_notif' },
              ].map((item) => (
                <div key={item.key} className="flex items-center p-4 border border-gray-300 rounded-lg">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <label className="ml-3 text-gray-900 font-medium">{item.label}</label>
                </div>
              ))}
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
                Save Preferences
              </button>
            </div>
          </div>
        )
      case 'automations':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Automations</h2>
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Send invoice on job completion</h3>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="ml-2 text-gray-700">Enabled</span>
                </label>
              </div>
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Auto-assign jobs to available technicians</h3>
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="ml-2 text-gray-700">Enabled</span>
                </label>
              </div>
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Send follow-up emails after job completion</h3>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="ml-2 text-gray-700">Enabled</span>
                </label>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
                Save Automations
              </button>
            </div>
          </div>
        )
      case 'integrations':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Integrations</h2>
            <div className="space-y-4">
              {['Stripe Payment Gateway', 'Google Calendar', 'Slack Notifications', 'Zapier'].map((integration) => (
                <div key={integration} className="border border-gray-300 rounded-lg p-4 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">{integration}</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded-lg transition-colors text-sm">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      case 'billing':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Billing & Plans</h2>
            <div className="space-y-4">
              <div className="border border-green-300 bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-900">Professional Plan</h3>
                <p className="text-green-700 mt-1">$99/month</p>
                <p className="text-green-600 text-sm mt-3">Current Plan • Renews on Feb 10, 2026</p>
              </div>
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold py-2.5 px-6 rounded-lg transition-colors">
                View Billing History
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold py-2.5 px-6 rounded-lg transition-colors">
                Change Plan
              </button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 text-sm mt-1">Manage your account, team, and preferences</p>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Navigation */}
        <div className="bg-white rounded-lg border border-gray-300 shadow-sm h-fit">
          <div className="p-4 space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    activeTab === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={18} />
                    <span className="font-medium">{section.label}</span>
                  </div>
                  {activeTab === section.id && <ChevronRight size={18} />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-gray-300 shadow-sm p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
