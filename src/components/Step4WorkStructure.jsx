import React from 'react';
import questions from '../data/questions.json';

const valueColors = {
  low: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  medium: 'border-amber-300 bg-amber-50 text-amber-700',
  high: 'border-rose-300 bg-rose-50 text-rose-700',
  individual: 'border-blue-300 bg-blue-50 text-blue-700',
  dept: 'border-purple-300 bg-purple-50 text-purple-700',
  cross: 'border-orange-300 bg-orange-50 text-orange-700'
};

const valueIcons = {
  low: '🟢', medium: '🟡', high: '🔴',
  individual: '👤', dept: '👥', cross: '🏢'
};

export default function Step4WorkStructure({ values = {}, onChange }) {
  const step = questions.step4;

  const setDimension = (key, value) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="page-title">{step.title}</h2>
      <p className="page-subtitle">每个维度选一项，描述你面对的工作特征</p>
      <div className="space-y-4">
        {step.dimensions.map((dim) => (
          <div key={dim.key} className="card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              {dim.label}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {dim.options.map((opt) => {
                const isSelected = values[dim.key] === opt.value;
                const colorClass = valueColors[opt.value] || 'border-gray-200 bg-white text-gray-600';
                return (
                  <button
                    key={opt.value}
                    onClick={() => setDimension(dim.key, opt.value)}
                    className={`py-2.5 px-3 rounded-xl border-2 text-center transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? colorClass + ' shadow-sm'
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    <div className="text-xs mb-0.5">{valueIcons[opt.value]}</div>
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-[10px] opacity-60 mt-0.5">{opt.desc}</div>
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
