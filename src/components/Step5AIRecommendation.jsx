import React from 'react';

function renderText(text) {
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
  const { primary, secondary, reasons, structureInfo, paths } = result;

  return (
    <div className="animate-fadeIn space-y-5">
      <div>
        <h2 className="page-title">你的AI应用机会</h2>
        <p className="page-subtitle">基于你的工作特征，我们为你推荐以下AI能力组合</p>
      </div>

      <div className="card border-l-4 border-l-blue-500">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{primary.emoji}</span>
          <div>
            <div className="text-xs text-gray-400 font-medium">核心推荐</div>
            <div className="text-lg font-bold text-gray-900">{primary.label}</div>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{primary.detail}</p>
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
              <div className="text-lg font-bold text-gray-900">{secondary.label}</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{secondary.detail}</p>
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

      {/* 两条行动路径 */}
      {paths && (
        <div className="space-y-4">
          <div className="card border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🚀</span>
              <div>
                <div className="text-xs text-gray-400 font-medium">快速上手</div>
                <div className="text-base font-bold text-gray-900">拿来即用 — 直接用AI工具提效</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{paths.quick.description}</p>
            <div className="space-y-1.5">
              {paths.quick.tools.map((tool, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-500 flex-shrink-0 mt-0.5">▸</span>
                  <div>
                    <span className="font-medium text-gray-700">{tool.name}</span>
                    <span className="text-gray-400"> — {tool.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card border-l-4 border-l-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔧</span>
              <div>
                <div className="text-xs text-gray-400 font-medium">深度定制</div>
                <div className="text-base font-bold text-gray-900">AI Coding — 开发专属工具</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{paths.advanced.description}</p>
            <div className="space-y-1.5">
              {paths.advanced.tools.map((tool, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-indigo-500 flex-shrink-0 mt-0.5">▸</span>
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
