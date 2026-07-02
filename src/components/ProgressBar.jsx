import React from 'react';

const stepLabels = ['职责层', '工作行为', '工作难点', '结构判断', 'AI推荐', '行动建议'];

export default function ProgressBar({ currentStep }) {
  return (
    <div className="px-1 py-4 no-print">
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isDone = stepNum < currentStep;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`progress-step ${
                  isDone
                    ? 'bg-blue-600 text-white'
                    : isActive
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {isDone ? '✓' : stepNum}
              </div>
              <span className={`text-[10px] mt-1 whitespace-nowrap ${
                isActive ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-0 left-0 h-1 bg-gray-200 rounded-full w-full" />
        <div
          className="absolute top-0 left-0 h-1 bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}
