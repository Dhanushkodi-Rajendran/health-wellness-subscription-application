import { useOnboardingStore } from "../../store/useOnboardingStore";
import { useSaveProgress } from "../../hooks/useOnboarding";

const PLANS = ["Monthly", "Quarterly", "Annual"] as const;

export default function Step3PlanSelection() {
  const { data, setPlan, nextStep, prevStep } = useOnboardingStore();
  const { mutate: saveProgress, isPending } = useSaveProgress();

  const handleNext = () => {
    if (!data.planSelection) return;
    saveProgress(
      {
        sessionId: data.sessionId!,
        step: 4,
        data: { planSelection: data.planSelection },
      },
      { onSuccess: () => nextStep() },
    );
  };

  return (
    <div className="flex flex-col gap-5 w-full pb-3">
      <h3 className="text-xl font-bold mb-1 text-slate-800 tracking-tight">
        Select a Plan
      </h3>
      <p className="text-sm text-slate-600 mb-3 font-medium">
        You are fully validated. Please select your subscription cadence.
      </p>

      <div className="space-y-4">
        {PLANS.map((plan) => (
          <label
            key={plan}
            className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-300 ${data.planSelection === plan ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500 shadow-md" : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"}`}
          >
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              {plan} Plan
            </span>
            <input
              type="radio"
              name="plan"
              className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-slate-300"
              checked={data.planSelection === plan}
              onChange={() => setPlan(plan)}
            />
          </label>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={prevStep}
          disabled={isPending}
          className="w-1/3 py-3 text-sm border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-slate-200 outline-none cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={isPending || !data.planSelection}
          className="flex-1 py-3 text-sm bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white rounded-xl font-bold tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-50 focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer"
        >
          {isPending ? "Saving..." : "Review Order"}
        </button>
      </div>
    </div>
  );
}
