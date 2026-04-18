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
import FAQ from "../app/faq/FAQ"
import NotificationsPage from "../app/notifications/Notifications"
import SubcontractorProfile from "../app/subcontractor/SubcontractorProfile"
import SubcontractorList from "../app/subcontractor/SubcontractorList"
import StaffList from "../app/staff/staffList"
import StaffProfile from "../app/staff/StaffProfile"
import DocumentVault from "../app/documentVault/DocumentVault"
import CommunicationHub from "../app/communication-hub/CommunicationHub"
import { ClientPurchaseOrder } from "../app/work-order/ClientPurchaseOrder"
import { staticPurchaseOrders } from "../types/vendor"
import { Payments } from "../app/payments/PaymentDashboard"
import { InvoicePaymentDetailsPage } from "../app/payments/InvoicePage"
import ChangeOrderList from "../app/changeOrder/ChangeOrderList"
import ChangeOrderView from "../app/changeOrder/ChangeOrderView"

import PayoutDetails from "../app/payout/PayoutDetails"
import PayoutLedger from "../app/payout-ladger/PayoutLadger"
import StaffAssessment from "../app/staff/StaffAssessment"
import StartAssessment from "../app/staff/StartAssessment"
import ViewAssessmentReport from "../app/staff/ViewAssessmentReport"
import ClientFeedback from "../components/customerPages/ClientFeedback"

import StaffPPF from "../app/staff/StaffPPF"
import FeedbackReport from "../components/customerPages/FeedbackReport"
import VendorBrandPayout from "../app/vendor-payout/VendorBrandPayout"


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
                  <Route path="/client-feedback" element={<ClientFeedback />} />
                  <Route path="/client-feedback/view/:jobId" element={<FeedbackReport />} />
                 

                  <Route path="/orders/work-order" element={<WorkOrder />} />
                  <Route path="/orders/work-order/:id" element={<WorkOrderDetailsPage />} />
                  <Route path="/orders/purchase-order" element={<ClientPurchaseOrder

                    purchaseOrders={staticPurchaseOrders}
                    onDelete={(id) => {
                      console.log("Delete PO:", id)
                    }}
                  />} />
                  <Route path="/projects" element={<WorkOrderGallery />} />
                  <Route path="/support/manage-ticket" element={<Tickets />} />
                  <Route path="/support/manage-ticket/:id" element={<TicketView />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/technicians" element={<Technicians />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/invoices/:invoiceId" element={<InvoiceDetailsPage />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/invoice/:invoiceId" element={<InvoicePaymentDetailsPage />} />
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




                  <Route path="/training/courses" element={<CourseDashboard />} />
                  <Route path="/training/courses/new" element={<CourseDetail />} />

                  <Route path="/training/courses/edit/:id" element={<CourseBuilder />} />
                  <Route path="/training/categories" element={<CategoryManagement />} />
                  <Route path="/training/courses/view/:id" element={<CourseDetail />} />
                  <Route path="/training/builder/module/:moduleId" element={<ModuleDetail />} />
                  <Route path="/training/publish" element={<CoursePublish />} />


                  <Route path="/subcontractors" element={<SubcontractorList />} />
                  <Route path="/subcontractors/:id" element={<SubcontractorProfile />} />
                  <Route path="/staff" element={<StaffList />} />
                  <Route path="/staff/:id" element={<StaffProfile />} />
                  <Route path="/staff-assessment" element={<StaffAssessment />} />
                  <Route path="/staff-assessment/start/:jobId" element={<StartAssessment />} />
                  <Route path="/staff-assessment/view/:jobId" element={<ViewAssessmentReport />} />
                  <Route path="/staff-ppf" element={<StaffPPF />} />
                  <Route path="/document-vault" element={<DocumentVault />} />
                  <Route path="/communication-hub" element={<CommunicationHub />} />
                  <Route path="/change-orders" element={<ChangeOrderList />} />
                  <Route path="/change-orders/:id" element={<ChangeOrderView />} />
                  <Route path="/change-orders/new" element={<ChangeOrderView />} />

                  {/* <Route path="/payouts" element={<PayoutList />} /> */}
                  <Route path="/payouts" element={<PayoutDetails />} />
                  <Route path="/payouts-ledger" element={<PayoutLedger />} />
                  <Route path="/payouts-vendor" element={<VendorBrandPayout />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/faq" element={<FAQ />} />

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
