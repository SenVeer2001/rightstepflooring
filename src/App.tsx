import { AppRoutes } from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'


function App() {
  return (
    <div className='' style={{ width: '100%', height: '100vh' ,background:`
    
    
    `}}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  )
}

export default App
