import { Pencil, Plus } from "lucide-react"

export default function InvoiceNotesTab() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-10">




            <div className="flex flex-col items-center justify-center py-10">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Pencil size={32} className="text-primary" />
                </div>
                <p className="text-gray-600 text-sm">
                    No notes yet. Add one to keep your team aligned.
                </p>
            </div>
        </div>
    )
}
