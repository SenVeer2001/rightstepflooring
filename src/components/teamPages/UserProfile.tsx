

import { useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Info, Upload, ChevronDown } from 'lucide-react'
import Profilepage from './Profilepage'
import AdvanceProfile from './AdvanceProfile'

type TabType = 'profile' | 'advanced' | 'commissions'
type FeeUnit = '%' | '$'

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<TabType>('profile')


  const [feeUnits, setFeeUnits] = useState<Record<string, FeeUnit>>({
    creditFee: '%',
    checkFee: '%',
    cashFee: '%',
    additionalFee: '%',
    baseRate: '%',
  })

  const [formData, setFormData] = useState({
    role: 'Tech',
    assignToJobs: true,
    laborCost: 0,
    skills: '',
    serviceAreas: '',
    bio: '',
    userType: 'Subcontractor',
    name: 'Anthony McLeod',
    email: 'ahmcleod1963@gmail.com',
    homeAddress: '',
    phone: '19192280924',
    trackLocation: false,
    callMasking: false,
    twoFA: true,
    notes: '',
    scheduleColor: '#22c55e',
  })

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          User Settings
          <Info size={16} className="text-gray-400" />
        </h1>

        <button className="px-8 py-2.5 text-sm bg-primary text-white font-semibold rounded-full">
          Save
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-8 border-b">
        {['profile', 'advanced', 'commissions'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={`pb-3 text-sm font-semibold border-b-2 transition
              ${activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-800'}
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

    
      {activeTab === 'profile' && (
        <Profilepage />
      )}

     
      {activeTab === 'advanced' && (

        <AdvanceProfile />

      )}

      {activeTab === 'commissions' && (
        <div className="bg-white border rounded-xl p-6 space-y-10">

          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Technician Fees
            </h3>

            <div className="space-y-6">
              {[
                { key: 'creditFee', label: 'Credit fee' },
                { key: 'checkFee', label: 'Check fee' },
                { key: 'cashFee', label: 'Cash fee' },
                { key: 'additionalFee', label: 'Additional fee' },
              ].map((fee) => (
                <div
                  key={fee.key}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
                >
                  {/* LABEL */}
                  <div className="lg:col-span-2 text-sm font-semibold text-gray-700">
                    {fee.label}
                  </div>

                  {/* INPUT */}
                  <div className="lg:col-span-2">
                    <input
                      type="number"
                      min={0}
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
                      defaultValue={0}
                    />
                  </div>

                  {/* SLIDER */}
                  <div className="lg:col-span-5">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      defaultValue={0}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0%</span>
                      <span>20%</span>
                      <span>40%</span>
                      <span>60%</span>
                      <span>80%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* % / $ TOGGLE */}
                  <div className="lg:col-span-1">
                    <PercentDollarToggle
                      value={feeUnits[fee.key]}
                      onChange={(val) =>
                        setFeeUnits((prev) => ({
                          ...prev,
                          [fee.key]: val,
                        }))
                      }
                    />
                  </div>


                  {/* EXTRA OPTIONS */}
                  {fee.key === 'creditFee' && (
                    <div className="lg:col-span-2">
                      <button className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold">
                        Configure more credit options
                      </button>
                    </div>
                  )}

                  {fee.key === 'additionalFee' && (
                    <div className="lg:col-span-2 flex items-center gap-2 text-sm">
                      <input type="checkbox" />
                      Deduct from total
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* TECHNICIAN BASE RATE */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Technician Base Rate
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* INPUT */}
              <div className="lg:col-span-2">
                <input
                  type="number"
                  min={0}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
                  defaultValue={0}
                />
              </div>

              {/* SLIDER */}
              <div className="lg:col-span-7">
                <input
                  type="range"
                  min={0}
                  max={100}
                  defaultValue={0}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span>
                  <span>20%</span>
                  <span>40%</span>
                  <span>60%</span>
                  <span>80%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* % / $ */}
              <div className="lg:col-span-1">
                <PercentDollarToggle
                  value={feeUnits.baseRate}
                  onChange={(val) =>
                    setFeeUnits((prev) => ({
                      ...prev,
                      baseRate: val,
                    }))
                  }
                />
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

function PercentDollarToggle({
  value,
  onChange,
}: {
  value: '%' | '$'
  onChange: (val: '%' | '$') => void
}) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-gray-300">
      <button
        type="button"
        onClick={() => onChange('%')}
        className={`flex-1 py-2 text-sm font-semibold transition
          ${value === '%'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
        `}
      >
        %
      </button>

      <button
        type="button"
        onClick={() => onChange('$')}
        className={`flex-1 py-2 text-sm font-semibold transition
          ${value === '$'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
        `}
      >
        $
      </button>
    </div>
  )
}
