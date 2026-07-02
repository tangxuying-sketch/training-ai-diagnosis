import React from 'react';

function renderText(text) {
  // Convert **bold** to <strong>bold</strong>
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return React.createElement('strong', { key: i }, part.slice(2, -2));
    }
    return part;
  });
}

export default function Step5AIRecommendation({ result }) {
  if (!result) return null;
  const { primary, secondary, reasons, structureInfo } = result;

  return (
    <div className="animate-fadeIn space-y-5">
      <div>
        <h2 className="page-title">你的AI能力匹配报告</h2>
        <p className="page-subtitle">基于你的工作特征，我们为你推荐以下AI能力组合</p>
      </div>

      <div className="card border-l-4 border-l-blue-500">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{primary.emoji}</span>
          <div>
            <div className="text-xs text-gray-400 font-medium">核心推荐</div>
            <div className="text-lg font-bold text-gray-900">{primary.label}型</div>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{primary.detail}</p>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-400 font-medium mb-2">推荐工具</div>
          <div className="space-y-2">
            {primary.tools.map((tool, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
                <div>
                  <span className="font-medium text-gray-700">{tool.name}</span>
                  <span className="text-gray-400"> — {tool.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {secondary && (
        <div className="card border-l-4 border-l-purple-400">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{secondary.emoji}</span>
            <div>
              <div className="text-xs text-gray-400 font-medium">辅助能力</div>
              <div className="text-lg font-bold text-gray-900">{secondary.label}型</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{secondary.detail}</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-400 font-medium mb-2">推荐工具</div>
            <div className="space-y-2">
              {secondary.tools.map((tool, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0 mt-1.5" />
                  <div>
                    <span className="font-medium text-gray-700">{tool.name}</span>
                    <span className="text-gray-400"> — {tool.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">推荐理由</h3>
        <ul className="space-y-2">
          {reasons.map((reason, i) => (
            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
              <span>{renderText(reason)}</span>
            </li>
          ))}
        </ul>
      </div>

      {structureInfo && structureInfo.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">工作结构特征</h3>
          <div className="grid grid-cols-2 gap-3">
            {structureInfo.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-400 mb-1">{item.dim}</div>
                <div className="text-sm font-semibold text-gray-700">{item.value}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}