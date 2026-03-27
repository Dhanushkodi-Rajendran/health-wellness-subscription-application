export default function IneligiblePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-12 px-6 animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8 shadow-sm border border-red-100">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-10 h-10 font-bold"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-extrabold text-slate-800 mb-4 tracking-tight">
        Unable to Proceed
      </h2>
      <p className="text-slate-600 mb-8 leading-relaxed text-base font-medium">
        Based on your clinical profile, our medical safety guidelines restrict
        us from safely offering you a subscription plan at this time. Should you
        wish to discuss this further, please consult with your primary care
        team. Your safety is our absolute priority.
      </p>
      {/* <button onClick={() => window.location.href = "/"} 
        className="px-8 py-4 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white rounded-xl font-bold tracking-wide transition-all shadow-lg hover:shadow-xl w-full">
        Return to Homepage
      </button> */}
    </div>
  );
}
