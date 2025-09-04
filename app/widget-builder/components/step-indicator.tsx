interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
}

const steps = [
  { number: 1, label: 'Choose Template' },
  { number: 2, label: 'Select Scope' },
  { number: 3, label: 'Configure Metrics' },
  { number: 4, label: 'Customize & Save' }
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex justify-center">
      <div className="flex items-center space-x-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${step.number <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {step.number}
              </div>
              <span className={`ml-3 text-sm font-medium ${
                step.number <= currentStep ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`ml-8 w-12 h-0.5 ${
                step.number < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}