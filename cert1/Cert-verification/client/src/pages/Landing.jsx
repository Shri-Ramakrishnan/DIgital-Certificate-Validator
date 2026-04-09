import { useNavigate } from "react-router-dom";
import { Shield, CheckCircle, Zap, Lock } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <Shield className="logo-icon" />
            <span>CertValidator</span>
          </div>
          <button onClick={() => navigate("/auth")} className="btn-nav-login">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Certificate Validator</h1>
          <p className="hero-subtitle">
            Validate your SSL/TLS certificates instantly and securely
          </p>
          <p className="hero-description">
            Check certificate authenticity, expiration dates, and issuer information with our advanced validation tool.
          </p>
          <button onClick={() => navigate("/auth")} className="btn-hero-cta">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="features-title">Why Choose CertValidator?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon success">
              <CheckCircle />
            </div>
            <h3>Instant Validation</h3>
            <p>Get real-time results on your certificate validity and details</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon warning">
              <Zap />
            </div>
            <h3>Fast Processing</h3>
            <p>Secure and efficient certificate analysis in seconds</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon primary">
              <Lock />
            </div>
            <h3>Secure & Private</h3>
            <p>Your certificate data is processed securely and never stored</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to validate your certificates?</h2>
        <p>Join thousands of users who trust CertValidator for certificate management</p>
        <div className="cta-buttons">
          <button onClick={() => navigate("/auth")} className="btn-primary-lg">
            Sign Up Now
          </button>
          <button onClick={() => navigate("/auth")} className="btn-secondary-lg">
            Sign In
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 CertValidator. All rights reserved.</p>
      </footer>
    </div>
  );
}
