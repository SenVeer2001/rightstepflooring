// pages/Tickets.tsx
import { useState } from "react";
import { Plus, Ticket as TicketIcon } from "lucide-react";

import { tickets as initialTickets, type Ticket, type TicketPriority, type TicketStatus } from "../../data/ticketData";
import TicketStats from "../../components/ticket/TicketStats";
import TicketTable from "../../components/ticket/TicketTable";
import AddTicketModal, { type TicketFormData } from "../../components/ticket/AddTicketModel";

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle status change
  const handleStatusChange = (ticketId: number, newStatus: TicketStatus) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  const handlePriorityChange = (ticketId: number, newPriority: TicketPriority) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId ? { ...ticket, priority: newPriority } : ticket
      )
    );
  };

  // Handle delete
  const handleDelete = (ticketId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this ticket?");
    if (confirmed) {
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
    }
  };

  const handleCreateTicket = async (formData: TicketFormData) => {
    // Create new ticket
    // @ts-ignore
    const newTicket: Ticket = {
      id: tickets.length + 1,
      customer: formData.customer,
      jobProject: formData.jobProject || "N/A",
      category: formData.category,
      subCategory: formData.subCategory,
      subContractor: formData.assignTo,
      coAssign: formData.coAssign || "N/A",
      priority: formData.priority,
      status: formData.status,
      details: formData.details,
      date: new Date().toISOString().split("T")[0],
      files: [], // You would upload files to server and get URLs back
    };


    setTickets(prev => [newTicket, ...prev]);

    // Show success toast if you have a toast library
    // console.log("Ticket created successfully!", newTicket);
  };

  return (
    <div className="p-4 md:p-4 space-y-6  ">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            {/* <TicketIcon className="text-primary" size={32} /> */}
            Support Tickets
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage customer support requests and flooring issues
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition"
        >
          <Plus size={18} />
          Create Ticket
        </button>
      </div>

      {/* Stats Section */}
      <TicketStats tickets={tickets} />

      {/* Table Section */}
      <TicketTable
        tickets={tickets}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onDelete={handleDelete}
      />


        <AddTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  );
}