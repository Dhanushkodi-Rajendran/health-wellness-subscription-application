import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useOnboardingSession } from "../hooks/useOnboarding";
import { onboardingApi } from "../api/apiClient";
import Step1BasicInfo from "./steps/Step1BasicInfo";
import Step2HealthScreening from "./steps/Step2HealthScreening";
import Step3PlanSelection from "./steps/Step3PlanSelection";
import Step4ReviewAndSubmit from "./steps/Step4ReviewAndSubmit";

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initRef = useRef(false);

  const sessionId = useOnboardingStore((s) => s.data.sessionId);
  const currentStep = useOnboardingStore((s) => s.data.currentStep);
  const status = useOnboardingStore((s) => s.data.status);
  const setSessionId = useOnboardingStore((s) => s.setSessionId);
  const setFullData = useOnboardingStore((s) => s.setFullData);
  const setStep = useOnboardingStore((s) => s.setStep);
  const resetSession = useOnboardingStore((s) => s.resetSession);

  const { data: serverSession } = useOnboardingSession(sessionId);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const localSessionId = localStorage.getItem("sessionId");

    if (localSessionId && !sessionId) {
      setSessionId(localSessionId);
    } else if (!localSessionId && !sessionId) {
      onboardingApi
        .initSession()
        .then((data) => {
          setSessionId(data.sessionId);
          localStorage.setItem("sessionId", data.sessionId);
        })
        .catch(console.error);
    }
  }, [sessionId, setSessionId]);

  const currentStepRef = useRef(currentStep);
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    if (serverSession && serverSession.status === "in_progress") {
      // Only sync currentStep from server if server is ahead (e.g., page reload).
      // Otherwise, keep local step to avoid overwriting nextStep() calls.
      const { currentStep: serverStep, ...rest } = serverSession;
      if (serverStep > currentStepRef.current) {
        setFullData(serverSession);
      } else {
        setFullData(rest);
      }
    } else if (serverSession && serverSession.status === "ineligible") {
      navigate("/ineligible", { replace: true });
    } else if (serverSession && serverSession.status === "completed") {
      // Session already submitted — clear and start fresh
      localStorage.removeItem("sessionId");
      initRef.current = false;
      resetSession();
    }
  }, [serverSession, setFullData, navigate, resetSession]);

  useEffect(() => {
    if (status === "ineligible") {
      navigate("/ineligible", { replace: true });
    }
  }, [status, navigate]);

  // Sync URL → step ONLY on initial mount (deep linking support)
  const urlSyncRef = useRef(false);
  useEffect(() => {
    if (urlSyncRef.current) return;
    urlSyncRef.current = true;
    const urlStep = Number(searchParams.get("step"));
    if (urlStep && urlStep !== currentStep && urlStep <= 4 && urlStep >= 1) {
      setStep(urlStep);
    }
  }, [searchParams, setStep, currentStep]);

  // Sync step → URL (always keep URL in sync with current step)
  useEffect(() => {
    const urlStep = Number(searchParams.get("step"));
    if (currentStep !== urlStep) {
      setSearchParams({ step: currentStep.toString() }, { replace: true });
    }
  }, [currentStep, setSearchParams]);

  if (!sessionId)
    return (
      <div className="text-slate-500 animate-pulse font-medium">
        Initializing secure session...
      </div>
    );

  return (
    <div
      className="w-full flex-1 flex flex-col relative"
      role="group"
      aria-labelledby="step-title"
    >
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`flex-1 h-2 rounded-full mx-1 transition-all duration-300 ${step <= currentStep ? "bg-orange-500 shadow-[0_0_8px_rgba(255,108,26,0.4)]" : "bg-slate-200"}`}
            aria-current={currentStep === step ? "step" : undefined}
          />
        ))}
      </div>

      <div className="flex-1 w-full max-w-md mx-auto relative animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h2 id="step-title" tabIndex={-1} className="sr-only">
          Step {currentStep}
        </h2>
        {currentStep === 1 && <Step1BasicInfo />}
        {currentStep === 2 && <Step2HealthScreening />}
        {currentStep === 3 && <Step3PlanSelection />}
        {currentStep === 4 && <Step4ReviewAndSubmit />}
      </div>
    </div>
  );
}
