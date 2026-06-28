import { ReactNode, useState } from 'react';

interface Step {
  title: string;
  content: ReactNode;
  isValid?: () => boolean;
}

interface StepModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  steps: Step[];
  onFinish: () => void;
}

export default function StepModal({ open, onClose, title, steps, onFinish }: StepModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!open) return null;

  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const canProceed = steps[currentStep].isValid?.() ?? true;

  const handleNext = () => {
    if (isLast) {
      onFinish();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) setCurrentStep(currentStep - 1);
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-800">{title}</h2>
          <button onClick={handleClose} className="text-neutral-400 hover:text-neutral-600 text-xl leading-none">&times;</button>
        </div>

        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === currentStep ? 'bg-primary text-white' :
                  i < currentStep ? 'bg-success text-white' :
                  'bg-neutral-200 text-neutral-500'
                }`}>
                  {i < currentStep ? '\u2713' : i + 1}
                </div>
                <span className={`text-sm ${i === currentStep ? 'font-semibold text-primary' : 'text-neutral-500'}`}>
                  {step.title}
                </span>
                {i < steps.length - 1 && <div className="w-6 h-px bg-neutral-300" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {steps[currentStep].content}
        </div>

        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={isFirst}
            className="px-4 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-300 rounded hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="px-6 py-2 text-sm font-bold text-white bg-primary rounded hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLast ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
