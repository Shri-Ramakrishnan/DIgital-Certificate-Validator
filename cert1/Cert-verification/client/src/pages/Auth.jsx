import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        if (!formData.email || !formData.password) {
          setError("Please fill in all fields");
          setLoading(false);
          return;
        }

        const response = await axios.post(`${API_URL}/login`, {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isAuthenticated", "true");
        navigate("/validate");
      } else {
        // Signup
        if (!formData.email || !formData.password || !formData.name || !formData.confirmPassword) {
          setError("Please fill in all fields");
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        const response = await axios.post(`${API_URL}/signup`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isAuthenticated", "true");
        navigate("/validate");
      }
    } catch (err) {
      let errorMessage = "An error occurred. Please try again.";
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message === "Network Error") {
        errorMessage = "Cannot connect to server. Make sure backend is running on http://localhost:5000";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Form */}
        <div className="auth-form-section">
          <div className="auth-header">
            <h1 className="auth-title">{isLogin ? "Welcome Back" : "Create Account"}</h1>
            <p className="auth-subtitle">
              {isLogin ? "Sign in to your account" : "Join CertValidator today"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Name Field (Signup Only) */}
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="form-input"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="form-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-toggle-btn"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Signup Only) */}
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="form-input"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
            </button>

            {/* Error Message */}
            {error && (
              <div className="alert alert-error">
                <p className="alert-text">{error}</p>
              </div>
            )}
          </form>

          {/* Toggle to Signup/Login */}
          <div className="auth-toggle">
            <p className="toggle-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="toggle-btn"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="demo-credentials">
              <p className="demo-label">Demo Credentials:</p>
              <p className="demo-text">Email: demo@example.com</p>
              <p className="demo-text">Password: demo123</p>
            </div>
          )}
        </div>

        {/* Right Side - Info */}
        <div className="auth-info-section">
          <div className="info-content">
            <Lock className="info-icon" />
            <h2 className="info-title">Secure Certificate Validation</h2>
            <p className="info-description">
              Validate your SSL/TLS certificates with industry-leading security standards. Our platform processes your certificates securely and never stores them on our servers.
            </p>
            <ul className="info-list">
              <li>✓ Instant validation results</li>
              <li>✓ Detailed certificate information</li>
              <li>✓ Expiration date tracking</li>
              <li>✓ Secure and private processing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
