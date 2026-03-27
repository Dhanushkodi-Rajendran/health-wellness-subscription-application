import { Routes, Route, Navigate, Link } from "react-router-dom";
import OnboardingFlow from "./components/OnboardingFlow";
import IneligiblePage from "./components/IneligiblePage";
import AdminDashboard from "./components/AdminDashboard";

function CardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 w-full flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
        <header className="bg-gradient-to-r from-orange-500 to-orange-400 text-white p-5 shadow-sm flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">
            Sparkout Tech Health
          </h1>
          <Link
            to="/admin"
            className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Admin Dashboard
          </Link>
        </header>
        <main className="flex-1 p-6 flex flex-col items-center justify-center overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/" element={<Navigate to="/onboarding" replace />} />
      <Route
        path="/onboarding"
        element={
          <CardLayout>
            <OnboardingFlow />
          </CardLayout>
        }
      />
      <Route
        path="/ineligible"
        element={
          <CardLayout>
            <IneligiblePage />
          </CardLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <CardLayout>
            <div className="flex flex-col items-center justify-center text-center py-8 px-4 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-5 shadow-sm border border-green-100">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-10 h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2 tracking-tight">
                Subscription Confirmed
              </h2>
              <p className="text-slate-600 mb-8 text-base font-medium max-w-sm">
                Welcome to Sparkout Tech Health! Your personal medical dashboard
                will be ready shortly.
              </p>

              <Link
                to="/onboarding"
                className="px-6 py-3 text-sm bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white rounded-xl font-bold tracking-wide transition-all shadow-md hover:shadow-lg w-full max-w-xs"
              >
                Start New Screening
              </Link>
            </div>
          </CardLayout>
        }
      />
    </Routes>
  );
}

export default App;
