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
import { Settings } from "../app/settings/Settings"
import { Schedule } from "../app/schedule/Schedule"
import { Leads } from "../app/leads/Leads"
import { Team } from "../app/team/Team"
import { Map } from "../app/map/Map"
import { Estimates } from "../app/estimates/Estimates"
import { Products } from "../app/product/Products"


import { InvoiceDetailsPage } from "../components/invoicePages/InvoiceDetailsPage"
import { LeadDetails } from "../components/leadsPages/LeadDetails"
import UserProfile from "../components/teamPages/UserProfile"
import { CategoryManagement, CourseBuilder, CourseDashboard, CourseDetail, CoursePublish, ModuleDetail } from "../app/training"



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
                  <Route path="/products" element={<Products />} />
                  <Route path="/dispatch" element={<Dispatch />} />
                  <Route path="/leads" element={<Leads />} />
                  <Route path="/leads/:leadId" element={<LeadDetails />} />

                  <Route path="/customers" element={<Customers />} />
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
                    <Route path="view" element={<Estimates />} />
                    <Route path="add" element={<Estimates />} />
                  </Route>
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/automation" element={<Automation />} />
                 
                  <Route path="/team" element={<Team/>} />
                  <Route path="/team/user/:id" element={<UserProfile/>} />



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
