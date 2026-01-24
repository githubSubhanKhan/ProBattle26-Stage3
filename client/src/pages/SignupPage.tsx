import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Briefcase } from "lucide-react";
import { signupUser } from "../services/authApi";

const SignupPage = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"SEEKER" | "PROVIDER">("SEEKER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signupUser(fullName, email, password, role);

      // After signup → login page
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#F8FFE5" }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#FFA500" }}>
              ServiceHub
            </h1>
            <p className="text-gray-600">Create your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="fullName"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("SEEKER")}
                  disabled={loading}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    role === "SEEKER"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <User
                    size={24}
                    className="mx-auto mb-2"
                    style={{ color: role === "SEEKER" ? "#FFA500" : "#9CA3AF" }}
                  />
                  <p
                    className={`font-semibold ${
                      role === "SEEKER" ? "text-orange-500" : "text-gray-700"
                    }`}
                  >
                    Find Services
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Service Seeker</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("PROVIDER")}
                  disabled={loading}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    role === "PROVIDER"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <Briefcase
                    size={24}
                    className="mx-auto mb-2"
                    style={{ color: role === "PROVIDER" ? "#FFA500" : "#9CA3AF" }}
                  />
                  <p
                    className={`font-semibold ${
                      role === "PROVIDER" ? "text-orange-500" : "text-gray-700"
                    }`}
                  >
                    Offer Services
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Service Provider</p>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#FFA500" }}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: "#FFA500" }}
              >
                Log In
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By signing up, you agree to our{" "}
          <a href="#" className="hover:underline" style={{ color: "#FFA500" }}>
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="hover:underline" style={{ color: "#FFA500" }}>
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;