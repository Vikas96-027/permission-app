import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthProvider";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithMsal, error: authError, loading: authLoading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (authError) {
      if (
        authError.includes("hash_empty_error") ||
        authError.includes("Hash value cannot be processed")
      ) {
        return;
      }
      console.error("Auth error:", authError);
    }
  }, [authError]);

  // Already authenticated → redirect to dashboard
  if (isAuthenticated && !authLoading) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithMsal();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const loginInProgress = loading;
  const authInitialized = !authLoading;

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #09162C, #0F2C50)" }}
    >
      <div className="relative w-full max-w-md mx-4 z-10">
        <div
          className="backdrop-blur-xl p-8 rounded-md"
          style={{
            backgroundColor: "#142F4C",
            border: "1px solid rgba(255, 179, 0, 0.2)",
            boxShadow: "0 14px 28px rgba(0, 0, 0, 0.4), 0 10px 10px rgba(0, 0, 0, 0.22)",
          }}
        >
          <div className="text-center mb-6">
            <h1 className="text-white text-3xl font-bold mb-2">Permissions App</h1>
            <p className="text-slate-300 text-sm">
              Role-based access control management
            </p>
          </div>

          <button
            className="relative w-full bg-white text-gray-700 py-4 px-6 rounded-xl font-medium text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all"
            onClick={handleLogin}
            disabled={loading || loginInProgress || !authInitialized || authLoading}
          >
            {!authInitialized || authLoading ? (
              <>
                <div className="h-5 w-5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                <span>Initializing...</span>
              </>
            ) : loading || loginInProgress ? (
              <>
                <div className="h-5 w-5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
                  <rect x="0" y="0" width="10" height="10" fill="#F25022" rx="1" />
                  <rect x="11" y="0" width="10" height="10" fill="#7FBA00" rx="1" />
                  <rect x="0" y="11" width="10" height="10" fill="#00A4EF" rx="1" />
                  <rect x="11" y="11" width="10" height="10" fill="#FFB900" rx="1" />
                </svg>
                <span>Sign in with Microsoft</span>
              </>
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-slate-400 text-xs">
              If you have any issues signing in, please contact IT support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}