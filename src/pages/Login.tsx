import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthProvider";
import PearlTechLogo from "../assets/pearl-tech-logo-white.png";

interface LoginPageProps {
  onSuccess?: () => void;
  redirectTo?: string;
  autoRedirect?: boolean;
  title?: string;
  subtitle?: string;
  companyName?: string;
  footerText?: string;
  supportText?: string;
}

export default function LoginPage({
  onSuccess,
  redirectTo = "/dashboard",
  autoRedirect = true,
  title = "",
  subtitle = "Streamline your fleet operations with intelligent tracking and management",
  companyName = "Pearl Technologies Ltd.",
  footerText = "All rights reserved.",
  supportText = "If you have any issues signing in, please contact IT support.",
}: LoginPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithMsal, error: authError, loading: authLoading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || redirectTo;

  useEffect(() => {
    if (authError) {
      // Ignore expected hash errors
      if (
        authError.includes("hash_empty_error") ||
        authError.includes("Hash value cannot be processed")
      ) {
        console.info("[LoginPage] Ignoring hash_empty_error");
        return;
      }
      console.error("Auth error:", authError);
    }
  }, [authError]);

  if (isAuthenticated && !authLoading && autoRedirect) {
    console.log("Authenticated and redirecting to", from);
    return <Navigate to={from} replace />;
  }

  const handleLogin = async () => {
    console.log("handleLogin");
    alert("handleLogin");
    setLoading(true);
    try {
      await signInWithMsal();
      if (onSuccess) onSuccess();
      if (autoRedirect) navigate(from);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const loginInProgress = loading;
  const authInitialized = !authLoading;

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #09162C, #0F2C50)",
        }}
      >
        <div className="relative w-full max-w-md mx-4 z-10">
          {/* Main login card - updated with new background and shadow */}
          <div
            className="backdrop-blur-xl p-8 rounded-md"
            style={{
              backgroundColor: "#142F4C",
              border: "1px solid rgba(255, 179, 0, 0.2)",
              boxShadow:
                "0 14px 28px rgba(0, 0, 0, 0.4), 0 10px 10px rgba(0, 0, 0, 0.22)",
            }}
          >
            {/* Pearl Tech Logo and Branding */}
            <div className="text-center mb-4">
              {/* Logo container with clean Pearl Tech logo */}
              <div className="inline-flex items-center justify-center mb-4">
                <img
                  src={PearlTechLogo}
                  alt="Pearl Tech Logo"
                  className="h-9 w-auto"
                />
              </div>

              {/* Title */}
              <h1 className="text-white text-3xl font-bold mb-2">{title}</h1>

              {/* Subtitle */}
              {subtitle && <p className="text-slate-300 text-sm">{subtitle}</p>}
            </div>

            {/* Microsoft Sign In Button */}
            <button
              className="relative w-full bg-white text-gray-700 py-4 px-6 rounded-xl font-medium text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-3 group border border-gray-200 cursor-pointer"
              id="loginButton"
              style={{
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition:
                  "background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                transform: "scale(1)",
                backfaceVisibility: "hidden",
                WebkitFontSmoothing: "antialiased",
              }}
              onMouseEnter={(e) => {
                if (
                  !loading &&
                  !loginInProgress &&
                  authInitialized &&
                  !authLoading
                ) {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 2px rgba(76, 158, 255, 0.3), 0 4px 6px rgba(0, 0, 0, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 2px 4px rgba(0, 0, 0, 0.1)";
              }}
              onClick={handleLogin}
              disabled={
                loading || loginInProgress || !authInitialized || authLoading
              }
            >
              {!authInitialized || authLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin"></div>
                  <span>Initializing...</span>
                </>
              ) : loading || loginInProgress ? (
                <>
                  <div className="h-5 w-5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  {/* Microsoft Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
                    <rect
                      x="0"
                      y="0"
                      width="10"
                      height="10"
                      fill="#F25022"
                      rx="1"
                    />
                    <rect
                      x="11"
                      y="0"
                      width="10"
                      height="10"
                      fill="#7FBA00"
                      rx="1"
                    />
                    <rect
                      x="0"
                      y="11"
                      width="10"
                      height="10"
                      fill="#00A4EF"
                      rx="1"
                    />
                    <rect
                      x="11"
                      y="11"
                      width="10"
                      height="10"
                      fill="#FFB900"
                      rx="1"
                    />
                  </svg>
                  <span>Sign in with Microsoft</span>
                </>
              )}
            </button>

            {/* Support text */}
            {supportText && (
              <div className="text-center mt-4">
                <p className="text-slate-400 text-xs text-white">{supportText}</p>
              </div>
            )}
          </div>
        </div>

        {/* Full-width footer */}
        <div
          className="absolute bottom-0 left-0 right-0 backdrop-blur-sm z-10"
          style={{
            backgroundColor: "rgba(9, 22, 44, 0.6)",
            borderTop: "1px solid rgba(255, 179, 0, 0.15)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center items-center text-sm text-slate-300">
            <p>
              © 2025 {companyName} {footerText}
            </p>
            {/* <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div> */}
          </div>
        </div>
      </div>
    </>
  );
}