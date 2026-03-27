import { useState } from "react";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { useSaveProgress } from "../../hooks/useOnboarding";
import { step2Schema } from "../../schemas/onboarding-schemas";

const ALL_CONDITIONS = [
  "Diabetes",
  "High Blood Pressure",
  "Sleep Apnea",
  "Heart Disease",
  "None of the above",
];

export default function Step2HealthScreening() {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const { data, updateHealthScreening, nextStep, prevStep, terminateFlow } =
    useOnboardingStore();
  const { mutate: saveProgress, isPending } = useSaveProgress();
  const config = data.healthScreening;

  const handleCheckbox = (condition: string) => {
    let newConditions = [...config.conditions];
    if (condition === "None of the above") {
      newConditions = ["None of the above"];
      updateHealthScreening({
        conditions: newConditions,
        diabetesControlled: undefined,
        recentCardiacEvent: undefined,
      });
      return;
    }

    newConditions = newConditions.filter((c) => c !== "None of the above");

    if (newConditions.includes(condition)) {
      newConditions = newConditions.filter((c) => c !== condition);
    } else {
      newConditions.push(condition);
    }

    const updates: any = { conditions: newConditions };
    if (!newConditions.includes("Diabetes"))
      updates.diabetesControlled = undefined;
    if (!newConditions.includes("Heart Disease"))
      updates.recentCardiacEvent = undefined;

    updateHealthScreening(updates);
    setLocalErrors({});
  };

  const validate = () => {
    try {
      step2Schema.parse(config);
      return true;
    } catch (err: any) {
      if (err?.errors) {
        const errs: Record<string, string> = {};
        err.errors.forEach((e: any) => (errs[e.path[0] as string] = e.message));
        setLocalErrors(errs);
      }
      return false;
    }
  };

  const checkEligibilityAndProceed = () => {
    if (!validate()) return;

    const hasTriad = ["Diabetes", "High Blood Pressure", "Sleep Apnea"].every(
      (c) => config.conditions.includes(c),
    );
    if (hasTriad) {
      saveProgress(
        {
          sessionId: data.sessionId!,
          step: 2,
          data: {
            healthScreening: config,
            status: "ineligible",
            ineligibilityReason: "Elevated Medical Risk Triad",
          },
        },
        { onSuccess: () => terminateFlow("Elevated Medical Risk Triad") },
      );
      return;
    }

    if (
      config.conditions.includes("Diabetes") &&
      config.diabetesControlled === false
    ) {
      saveProgress(
        {
          sessionId: data.sessionId!,
          step: 2,
          data: {
            healthScreening: config,
            status: "ineligible",
            ineligibilityReason:
              "Diabetes is not currently under medical control",
          },
        },
        {
          onSuccess: () =>
            terminateFlow("Diabetes is not currently under medical control"),
        },
      );
      return;
    }

    if (
      config.conditions.includes("Heart Disease") &&
      config.recentCardiacEvent === true
    ) {
      saveProgress(
        {
          sessionId: data.sessionId!,
          step: 2,
          data: {
            healthScreening: config,
            status: "ineligible",
            ineligibilityReason:
              "Recent cardiac event within the past 12 months",
          },
        },
        {
          onSuccess: () =>
            terminateFlow("Recent cardiac event within the past 12 months"),
        },
      );
      return;
    }

    saveProgress(
      {
        sessionId: data.sessionId!,
        step: 3,
        data: { healthScreening: config },
      },
      { onSuccess: () => nextStep() },
    );
  };

  return (
    <div className="flex flex-col gap-5 w-full pb-3">
      <h3 className="text-xl font-bold mb-1 text-slate-800 tracking-tight">
        Health Screening
      </h3>
      <p className="text-sm text-slate-600 mb-3 font-medium">
        Please answer the following medical questions to ensure our plans are
        safe for you.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            Do you currently have any of the following conditions?
          </label>
          <div className="space-y-2">
            {ALL_CONDITIONS.map((cond) => (
              <label
                key={cond}
                className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-200 ${config.conditions.includes(cond) ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-slate-200 hover:border-blue-300 bg-white hover:shadow-sm"}`}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                  checked={config.conditions.includes(cond)}
                  onChange={() => handleCheckbox(cond)}
                />
                <span className="ml-3 text-sm text-slate-800 font-medium">
                  {cond}
                </span>
              </label>
            ))}
          </div>
          {localErrors.conditions && (
            <p className="text-red-500 text-xs font-medium mt-1.5">
              {localErrors.conditions}
            </p>
          )}
        </div>

        {config.conditions.includes("Diabetes") && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-semibold mb-2 text-slate-800">
              Is your diabetes currently under medical control?
            </label>
            <div className="flex gap-5">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                <input
                  type="radio"
                  name="diabetes"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  checked={config.diabetesControlled === true}
                  onChange={() =>
                    updateHealthScreening({ diabetesControlled: true })
                  }
                />{" "}
                Yes
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                <input
                  type="radio"
                  name="diabetes"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  checked={config.diabetesControlled === false}
                  onChange={() =>
                    updateHealthScreening({ diabetesControlled: false })
                  }
                />{" "}
                No
              </label>
            </div>
            {localErrors.diabetesControlled && (
              <p className="text-red-500 text-xs font-medium mt-2">
                {localErrors.diabetesControlled}
              </p>
            )}
          </div>
        )}

        {config.conditions.includes("Heart Disease") && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-semibold mb-2 text-slate-800">
              Have you had any cardiac events in the past 12 months?
            </label>
            <div className="flex gap-5">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                <input
                  type="radio"
                  name="cardiac"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  checked={config.recentCardiacEvent === true}
                  onChange={() =>
                    updateHealthScreening({ recentCardiacEvent: true })
                  }
                />{" "}
                Yes
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                <input
                  type="radio"
                  name="cardiac"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  checked={config.recentCardiacEvent === false}
                  onChange={() =>
                    updateHealthScreening({ recentCardiacEvent: false })
                  }
                />{" "}
                No
              </label>
            </div>
            {localErrors.recentCardiacEvent && (
              <p className="text-red-500 text-xs font-medium mt-2">
                {localErrors.recentCardiacEvent}
              </p>
            )}
          </div>
        )}
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
          onClick={checkEligibilityAndProceed}
          disabled={isPending || config.conditions.length === 0}
          className="flex-1 py-3 text-sm bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white rounded-xl font-bold tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-50 focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer"
        >
          {isPending ? "Saving securely..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}
