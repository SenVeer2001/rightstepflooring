import { X } from "lucide-react"
import { useEffect, useState } from "react"

interface DepositModalProps {
  isOpen: boolean
  initialValue?: number
  initialType?: "amount" | "percentage"
  onClose: () => void
  onSave: (data: {
    depositType: "amount" | "percentage"
    depositValue: number
    applyToFuture: boolean
  }) => void
}

export function DepositModal({
  isOpen,
  initialValue = 0,
  initialType = "amount",
  onClose,
  onSave,
}: DepositModalProps) {
  const [depositType, setDepositType] = useState<"amount" | "percentage">(
    initialType
  )
  const [depositValue, setDepositValue] = useState<number>(initialValue)
  const [applyToFutureEstimates, setApplyToFutureEstimates] =
    useState<boolean>(false)

  useEffect(() => {
    if (isOpen) {
      setDepositType(initialType)
      setDepositValue(initialValue)
      setApplyToFutureEstimates(false)
    }
  }, [isOpen, initialType, initialValue])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl">
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="text-sm font-semibold">Required Deposit</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">
          {/* TOGGLE + INPUT */}
          <div className="flex gap-3">
            {/* TOGGLE */}
            <div className="flex rounded-lg border overflow-hidden">
              <button
                onClick={() => setDepositType("amount")}
                className={`px-4 py-2 text-sm font-semibold ${
                  depositType === "amount"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                $
              </button>
              <button
                onClick={() => setDepositType("percentage")}
                className={`px-4 py-2 text-sm font-semibold ${
                  depositType === "percentage"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                %
              </button>
            </div>

            {/* INPUT */}
            <input
              type="number"
              value={depositValue}
              min={0}
              onChange={(e) => setDepositValue(Number(e.target.value))}
              className="flex-1 border rounded-lg px-3 py-2 text-sm
                         focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder={
                depositType === "percentage" ? "Enter %" : "Enter amount"
              }
            />
          </div>

          {/* CHECKBOX */}
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={applyToFutureEstimates}
              onChange={(e) => setApplyToFutureEstimates(e.target.checked)}
              className="accent-primary"
            />
            Set for future estimates
          </label>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-lg text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSave({
                depositType,
                depositValue,
                applyToFuture: applyToFutureEstimates,
              })
            }
            className="px-6 py-2 bg-secondary text-black rounded-lg
                       text-sm font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
