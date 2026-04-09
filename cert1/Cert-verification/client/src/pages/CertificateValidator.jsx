import { useState } from "react";
import axios from "axios";
import { Upload, CheckCircle, AlertCircle, Clock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CertificateValidator() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      setResult(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError("");
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a certificate file");
      return;
    }

    const allowed = [".pem", ".crt", ".cer"];
    const isValid = allowed.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isValid) {
      setError("Invalid file type. Accepted: .pem, .crt, .cer");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/validate-cert", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Handle both old and new response formats
      const resultData = res.data.data || res.data;
      setResult(resultData);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Validation failed. Please check the file format.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === "VALID") return <CheckCircle />;
    if (status === "EXPIRED") return <Clock />;
    return <AlertCircle />;
  };

  const getStatusClass = (status) => {
    if (status === "VALID") return "status-valid";
    if (status === "EXPIRED") return "status-expired";
    return "status-invalid";
  };

  return (
    <div className="validator-page">
      {/* Header with Logout */}
      <div className="validator-header">
        <div className="validator-header-content">
          <h2 className="validator-welcome">Welcome, {user.name || user.email}!</h2>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut className="logout-icon" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="app-container">
        {/* Header */}
        <div className="app-header">
          <div className="icon-wrapper">
            <Upload />
          </div>
          <h1 className="app-title">Certificate Validator</h1>
          <p className="app-subtitle">Validate .pem, .crt, or .cer certificate files instantly</p>
        </div>

        {/* File Upload */}
        <div className="upload-wrapper">
          <label>
            <div
              className={`upload-area ${file ? "has-file" : ""}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pem,.crt,.cer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
              <Upload className="upload-icon" />
              {file ? (
                <div>
                  <p className="upload-text file-name">{file.name}</p>
                  <p className="upload-subtext file-size">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="upload-text">Click to upload or drag and drop</p>
                  <p className="upload-subtext">Supported: .pem, .crt, .cer</p>
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Validate Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          className="btn btn-primary"
        >
          {loading ? "Validating..." : "Validate Certificate"}
        </button>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle className="alert-icon" />
            <div className="alert-content">
              <div className="alert-title">Validation Error</div>
              <div className="alert-message">{error}</div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="result-section">
            <div className="result-header">
              <h2 className="result-title">Validation Result</h2>
              <div className={`result-status-icon ${getStatusClass(result.status)}`}>
                {getStatusIcon(result.status)}
              </div>
            </div>

            {/* Status */}
            <div className={`status-badge ${getStatusClass(result.status)}`}>
              <div className="status-label">Status</div>
              <div className="status-value">{result.status}</div>
            </div>

            {/* Issuer */}
            <div className="info-field">
              <div className="status-label">Issuer</div>
              <div className="info-value">{result.issuer}</div>
            </div>

            {/* Expiry */}
            <div className="info-field">
              <div className="status-label">Expires</div>
              <div className="info-value">
                {new Date(result.expiry).toLocaleDateString()} at {new Date(result.expiry).toLocaleTimeString()}
              </div>
            </div>

            {/* File Info */}
            {result.fileName && (
              <div className="info-field">
                <div className="status-label">File Name</div>
                <div className="info-value">{result.fileName}</div>
              </div>
            )}

            {result.fileSize && (
              <div className="info-field">
                <div className="status-label">File Size</div>
                <div className="info-value">{(result.fileSize / 1024).toFixed(2)} KB</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={() => {
                  setFile(null);
                  setResult(null);
                  setError("");
                }}
                className="btn btn-secondary"
              >
                Validate Another
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="app-footer">
          Certificate Validator v1.0 • Secure Certificate Validation Tool
        </div>
      </div>
    </div>
  );
}
