import React from 'react';
import questions from '../data/questions.json';

export default function Step2Behaviors({ role, value = [], customValue = '', onChange, onCustomChange }) {
  const step = questions.step2;
  const roleData = step.mapping[role];

  if (!roleData) return null;

  const toggleOption = (id) => {
    const newVal = value.includes(id)
      ? value.filter(v => v !== id)
      : [...value, id];
    onChange(newVal);
  };

  const handleOtherChange = (e) => {
    onCustomChange(e.target.value);
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="page-title">{roleData.title}</h2>
      <p className="page-subtitle">可多选，选择与你日常工作相关的所有项</p>
      <div className="flex flex-wrap gap-2.5">
        {roleData.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggleOption(opt.id)}
            className={`chip ${
              value.includes(opt.id) ? 'chip-active' : 'chip-inactive'
            }`}
          >
            {value.includes(opt.id) && (
              <svg className="w-4 h-4 mr-1.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {opt.label}
          </button>
        ))}
      </div>
      {step.hasOther && (
        <div className="mt-4">
          <input
            type="text"
            placeholder={step.otherPlaceholder}
            value={customValue}
            onChange={handleOtherChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm
                       focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-50
                       placeholder-gray-400 transition-all"
          />
        </div>
      )}
    </div>
  );
}
