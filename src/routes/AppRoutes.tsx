import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AdminLayout } from "../components/layout/AdminLayout"
import { ProtectedRoute } from "../components/ProtectedRoute"
import { Login } from "../app/login/Login"
import { Dashboard } from "../app/dashboard/Dashboard"
import { Jobs } from "../app/jobs/Jobs"
import { Dispatch } from "../app/dispatch/Dispatch"
import { Customers } from "../app/customers/Customers"
import { Technicians } from "../app/technicians/Technicians"
import { Invoices } from "../app/invoices/Invoices"
import { Reports } from "../app/reports/Reports"
import { Automation } from "../app/automation/Automation"

import { Schedule } from "../app/schedule/Schedule"
import { Leads } from "../app/leads/Leads"
import { Team } from "../app/team/Team"
import { Map } from "../app/map/Map"





import { LeadDetails } from "../components/leadsPages/LeadDetails"
import UserProfile from "../components/teamPages/UserProfile"
import { CategoryManagement, CourseBuilder, CourseDashboard, CourseDetail, CoursePublish, ModuleDetail } from "../app/training"
import CustomerAndJobModel from "../components/customerPages/CustomerAndJobModel"
import ClientModel from "../components/customerPages/clientPages/ClientModel"
import PriceBook from "../app/pricebook/PriceBook"
import { AdvancedReport } from "../app/reports/AdvancedReport"
import { EstimatesView } from "../components/estimatesModel/estimates/estimatesView"
import Estimates from "../app/estimates/Estimates"
import Settings from "../app/settings/Settings"
import WorkOrder from "../app/work-order/WorkOrder"
import WorkOrderDetailsPage from "../components/work-order-details/WorkOrderDetailsPage"
import { InvoiceDetailsPage } from "../components/invoicePages/InvoiceDetailsPage"
import WorkOrderGallery from "../app/work-order/WorkOrderGallery"
import Tickets from "../app/support/Tickets"
import TicketView from "../components/ticket/TicketView"








export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route

          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/map" element={<Map />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/products" element={<PriceBook />} />
                  <Route path="/dispatch" element={<Dispatch />} />
                  <Route path="/leads/all" element={<Leads />} />
                  <Route path="/leads/:leadId" element={<LeadDetails />} />

                  <Route path="/client" element={<Customers />} />
                  <Route path="/client/jobs/:jobId" element={<CustomerAndJobModel />} />
                  <Route path="/client/:customerId" element={<ClientModel />} />

                  <Route path="/work-order" element={<WorkOrder/>} />
                  <Route path="/work-order/:id" element={<WorkOrderDetailsPage/>} />

                  <Route path="/projects" element={<WorkOrderGallery/>} />
                  <Route path="/support/manage-ticket" element={<Tickets/>} />
                  <Route path="/support/manage-ticket/:id" element={<TicketView />} />



                  <Route path="/team" element={<Team />} />
                  <Route path="/technicians" element={<Technicians />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/invoices/:invoiceId" element={<InvoiceDetailsPage />} />
                  {/* <Route path="/estimates" element={<Estimates />} /> */}
                  <Route
                    path="/estimates"
                    element={<Navigate to="/estimates/add" replace />}
                  />

                  <Route path="/estimates">
                    <Route index element={<Estimates />} />
                    <Route path="add" element={<EstimatesView />} />
                    <Route path=":leadId" element={<EstimatesView />} />
                  </Route>

                  <Route path="/reports" element={<Reports />} />
                  <Route path="/advanced-report" element={<AdvancedReport />} />
                  <Route path="/automation" element={<Automation />} />

                  <Route path="/team" element={<Team />} />
                  <Route path="/team/user/:id" element={<UserProfile />} />



                  {/* tranning route  */}

                  <Route path="/training/courses" element={<CourseDashboard />} />
                  <Route path="/training/courses/new" element={<CourseDetail />} />

                  <Route path="/training/courses/edit/:id" element={<CourseBuilder />} />
                  <Route path="/training/categories" element={<CategoryManagement />} />
                  <Route path="/training/courses/view/:id" element={<CourseDetail />} />
                  <Route path="/training/builder/module/:moduleId" element={<ModuleDetail />} />
                  <Route path="/training/publish" element={<CoursePublish />} />



                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
