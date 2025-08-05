import { auth } from '@/styles/auth';

// 회원 가입 단계를 시각적으로 표시하는 컴포넌트

const ProgressBar = ({ currentStep, totalSteps }) => {
  const stepLabels = {
    1: "기본 정보",
    2: "보안 설정",
    3: "이용 약관",
  };

  return (
    <div className={auth.progress.container}>
      <div className={auth.progress.step.container}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={
                index + 1 < currentStep
                  ? auth.progress.step.completed
                  : index + 1 === currentStep
                  ? auth.progress.step.active
                  : auth.progress.step.inactive
              }
            >
              {index + 1 < currentStep ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`
                  ${auth.progress.connector.container}
                  ${index + 1 < currentStep ? auth.progress.connector.active : auth.progress.connector.inactive}
                `}
              ></div>
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <span className={auth.progress.label}>
          {stepLabels[currentStep]}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
