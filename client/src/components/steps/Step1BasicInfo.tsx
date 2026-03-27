import { useState } from "react";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { useSaveProgress } from "../../hooks/useOnboarding";
import { z } from "zod";
import { step1Schema } from "../../schemas/onboarding-schemas";

export default function Step1BasicInfo() {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const { data, updateBasicInfo, nextStep } = useOnboardingStore();
  const { mutate: saveProgress, isPending } = useSaveProgress();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBasicInfo({ [e.target.name]: e.target.value });
    setLocalErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    try {
      // parse and get the formatted data, useful for coercion
      const parsed = step1Schema.parse(data.basicInfo);
      // update the store with parsed numbers/strings just in case
      updateBasicInfo(parsed);
      return true;
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errs: Record<string, string> = {};
        err.issues.forEach((e: z.ZodIssue) => {
          if (e.path[0]) errs[e.path[0] as string] = e.message;
        });
        setLocalErrors(errs);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validate()) {
      saveProgress(
        {
          sessionId: data.sessionId!,
          step: 2,
          data: { basicInfo: data.basicInfo },
        },
        { onSuccess: () => nextStep() },
      );
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full pb-3">
      <h3 className="text-xl font-bold mb-1 text-slate-800 tracking-tight">
        Personal Information
      </h3>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-slate-700">
            Full Name
          </label>
          <input
            name="fullName"
            value={data.basicInfo.fullName || ""}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full p-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 ${localErrors.fullName ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"}`}
          />
          {localErrors.fullName && (
            <p className="text-red-500 text-sm font-medium mt-1.5">
              {localErrors.fullName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 text-slate-700">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={data.basicInfo.email || ""}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`w-full p-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 ${localErrors.email ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"}`}
          />
          {localErrors.email && (
            <p className="text-red-500 text-sm font-medium mt-1.5">
              {localErrors.email}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1.5 text-slate-700">
              Age
            </label>
            <input
              name="age"
              type="number"
              value={data.basicInfo.age === "" ? "" : data.basicInfo.age || ""}
              onChange={handleChange}
              placeholder="18"
              className={`w-full p-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 ${localErrors.age ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"}`}
            />
            {localErrors.age && (
              <p className="text-red-500 text-sm font-medium mt-1.5">
                {localErrors.age}
              </p>
            )}
          </div>

          <div className="flex-[2]">
            <label className="block text-sm font-semibold mb-1.5 text-slate-700">
              Country
            </label>
            <input
              name="country"
              value={data.basicInfo.country || ""}
              onChange={handleChange}
              placeholder="United States"
              className={`w-full p-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 ${localErrors.country ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"}`}
            />
            {localErrors.country && (
              <p className="text-red-500 text-sm font-medium mt-1.5">
                {localErrors.country}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={isPending}
        className="mt-6 w-full py-3 px-5 text-sm bg-orange-500 hover:bg-orange-600 cursor-pointer active:scale-[0.98] text-white rounded-xl font-bold tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-50"
      >
        {isPending ? "Saving securely..." : "Save & Continue"}
      </button>
    </div>
  );
}
