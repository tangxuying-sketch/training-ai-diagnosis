import React from 'react';
import questions from '../data/questions.json';

export default function Step3PainPoints({ behaviors = [], values = {}, onChange }) {
  // 收集所有选中行为对应的痛点问题
  const painPointSections = behaviors
    .filter(b => questions.step3.mapping[b])
    .map(b => ({
      behaviorId: b,
      ...questions.step3.mapping[b]
    }));

  if (painPointSections.length === 0) return null;

  const togglePainPoint = (behaviorId, painId) => {
    const current = values[behaviorId] || [];
    const newPains = current.includes(painId)
      ? current.filter(p => p !== painId)
      : [...current, painId];
    onChange({ ...values, [behaviorId]: newPains });
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="page-title">在这些工作中，你遇到的主要困难是？</h2>
      <p className="page-subtitle">可多选，选择你实际感受到的痛点</p>
      <div className="space-y-5">
        {painPointSections.map((section) => (
          <div key={section.behaviorId} className="card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {section.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {section.options.map((opt) => {
                const selected = (values[section.behaviorId] || []).includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => togglePainPoint(section.behaviorId, opt.id)}
                    className={`chip text-sm ${
                      selected ? 'chip-active' : 'chip-inactive'
                    }`}
                  >
                    {selected && (
                      <svg className="w-3.5 h-3.5 mr-1.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
