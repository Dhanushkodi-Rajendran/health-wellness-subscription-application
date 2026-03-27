import { useState } from "react";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { useSubmitSession } from "../../hooks/useOnboarding";
import { useNavigate } from "react-router-dom";

export default function Step4ReviewAndSubmit() {
  const { data, prevStep, setStep } = useOnboardingStore();
  const { mutate: submitSession, isPending } = useSubmitSession();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    submitSession(data.sessionId!, {
      onSuccess: () => navigate("/dashboard"),
      onError: (err: any) => {
        const message = err?.message || "Submission failed. Please try again.";
        setError(message);
      },
    });
  };

  return (
    <div className="flex flex-col gap-5 w-full pb-3">
      <h3 className="text-xl font-bold mb-1 text-slate-800 tracking-tight">
        Review Your Application
      </h3>
      <p className="text-sm text-slate-600 mb-2 font-medium">
        Please verify all your details before generating your final
        subscription.
      </p>

      <div className="space-y-3">
        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative group transition-all hover:border-slate-300">
          <button
            onClick={() => setStep(1)}
            className="absolute right-3 top-3 text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
          >
            EDIT
          </button>
          <h4 className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider mb-1.5">
            Basic Info
          </h4>
          <p className="text-sm font-medium text-slate-800">
            {data.basicInfo.fullName} • {data.basicInfo.age} yrs •{" "}
            {data.basicInfo.country}
          </p>
          <p className="text-xs text-slate-600">{data.basicInfo.email}</p>
        </div>

        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative group transition-all hover:border-slate-300">
          <button
            onClick={() => setStep(2)}
            className="absolute right-3 top-3 text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
          >
            EDIT
          </button>
          <h4 className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider mb-1.5">
            Medical Profile
          </h4>
          <p className="text-sm font-medium text-slate-800">
            {data.healthScreening.conditions.join(", ")}
          </p>
          {data.healthScreening.diabetesControlled !== undefined && (
            <p className="text-xs text-slate-600 mt-1">
              Diabetes Medical Control:{" "}
              {data.healthScreening.diabetesControlled ? "Yes" : "No"}
            </p>
          )}
          {data.healthScreening.recentCardiacEvent !== undefined && (
            <p className="text-xs text-slate-600 mt-1">
              Recent Cardiac Event:{" "}
              {data.healthScreening.recentCardiacEvent ? "Yes" : "No"}
            </p>
          )}
        </div>

        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative group transition-all hover:border-slate-300">
          <button
            onClick={() => setStep(3)}
            className="absolute right-3 top-3 text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            EDIT
          </button>
          <h4 className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider mb-1.5">
            Selected Plan
          </h4>
          <p className="font-bold text-base text-slate-800">
            {data.planSelection} Subscription
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium text-sm">
          {error}
        </div>
      )}

      <div className="mt-5 flex gap-3">
        <button
          onClick={prevStep}
          disabled={isPending}
          className="w-1/3 py-3 cursor-pointer text-sm border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-slate-200 outline-none"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="flex-1 py-3 cursor-pointer text-sm bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white rounded-xl font-bold tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-50 focus:ring-2 focus:ring-green-400 outline-none"
        >
          {isPending ? "Submitting..." : "Confirm & Subscribe"}
        </button>
      </div>
    </div>
  );
}
