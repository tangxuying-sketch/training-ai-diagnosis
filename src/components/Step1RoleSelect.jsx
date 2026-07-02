import React from 'react';
import questions from '../data/questions.json';

export default function Step1RoleSelect({ value, onChange }) {
  const step = questions.step1;

  return (
    <div className="animate-fadeIn">
      <h2 className="page-title">{step.title}</h2>
      <p className="page-subtitle">请选择最符合你当前工作重心的一项</p>
      <div className="space-y-3">
        {step.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${
              value === opt.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">{opt.icon}</span>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-base ${
                  value === opt.id ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {opt.label}
                </div>
                <div className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {opt.subtitle}
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center ${
                value === opt.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}>
                {value === opt.id && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
