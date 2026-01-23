import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

/* ===================== SMALL HELPERS ===================== */




export function Login() {

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("admin@rsf.com")
  const [password, setPassword] = useState("demo123")


  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!email || !password) {
        setError("Please fill in all fields")
        return
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }

      await login(email, password)
      navigate("/")
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Login failed"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 🌈 Global Conic Gradient Background */}
      <div className="conic-gradient-bg" />
      <div className="glass-layout" />
      <div className="glass-surface" />

      {/* Card */}
      <div className="relative w-full max-w-md z-10">
        <div className="glass-surface rounded-2xl p-8 md:p-10  backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#387d22] to-[#2c621b] rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
              <img
                src="/images/logo.jpeg"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Right Step Flooring
            </h1>

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@fsm.com"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg transition-all backdrop-blur-sm
    ${email
                      ? "border-[#387d22] bg-[#f7fbf4]/60"
                      : "border-gray-200 bg-white/80"
                    }
    focus:outline-none focus:border-[#387d22] focus:ring-4 focus:ring-[#387d22]/20`}
                />

              </div>

              {/* <FilledHint
                visible={email.length > 0}
                text="Email is already filled"
              /> */}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg transition-all backdrop-blur-sm
    ${password
                      ? "border-[#387d22] bg-[#f7fbf4]/60"
                      : "border-gray-200 bg-white/80"
                    }
    focus:outline-none focus:border-[#387d22] focus:ring-4 focus:ring-[#387d22]/20`}
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-[#387d22] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {/* <FilledHint
                visible={password.length > 0}
                text="Password is already filled"
              /> */}
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50/80 border-l-4 border-red-500 rounded backdrop-blur-sm">
                <p className="text-red-700 text-sm font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#387d22] to-[#2c621b] text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-[#387d22]/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo Credentials */}
          {/* <div className="mt-8 p-4 bg-[#f7fbf4]/60 rounded-lg border border-[#387d22]/20 backdrop-blur-sm">
            <p className="text-sm font-semibold text-[#2c621b] mb-2">
              Demo Credentials
            </p>
            <div className="text-xs text-[#387d22] space-y-1">
              <p>
                <span className="font-semibold">Email:</span>{" "}
                admin@fsm.com
              </p>
              <p>
                <span className="font-semibold">Password:</span>{" "}
                demo123
              </p>
            </div>
          </div> */}

          {/* Footer */}
          <p className="text-center text-gray-600 text-xs mt-6">
            Secure login powered by Webkype
          </p>
        </div>
      </div>
    </div>
  )
}
