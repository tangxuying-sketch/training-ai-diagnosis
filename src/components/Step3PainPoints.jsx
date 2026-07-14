import React, { useState, useEffect } from 'react';
import questions from '../data/questions.json';
import { generatePainPointSuggestions } from '../utils/deepseek';

// 关键词匹配的备用难点建议（API不可用时使用）
function fallbackSuggestions(customText) {
  if (!customText || !customText.trim()) return [];
  const t = customText.trim();
  const result = [];
  if (/课程|课件|教案|培训内容|教学设计/.test(t))
    result.push({ id: 'suggest_content', label: '内容产出效率低，制作耗时长' });
  if (/数据|统计|报表|汇总|分析/.test(t))
    result.push({ id: 'suggest_scattered', label: '数据来源分散，收集困难' });
  if (/通知|公告|发布|沟通/.test(t))
    result.push({ id: 'suggest_channels', label: '渠道多，容易遗漏' });
  if (/协调|资源|沟通|对接|多方/.test(t))
    result.push({ id: 'suggest_coord', label: '多方协调难度大' });
  if (/调研|需求|访谈|摸底/.test(t))
    result.push({ id: 'suggest_scatter', label: '信息太散，难提炼重点' });
  if (/讲师|培训师|选拔|培养/.test(t))
    result.push({ id: 'suggest_level', label: '讲师水平参差' });
  if (/方案|规划|设计|路径/.test(t))
    result.push({ id: 'suggest_restructure', label: '方案结构反复调整' });
  if (/预算|成本|采购|支出/.test(t))
    result.push({ id: 'suggest_realtime', label: '预算实时更新困难' });
  return result.slice(0, 3);
}

export default function Step3PainPoints({ behaviors = [], values = {}, onChange, customBehaviors = '' }) {
  const [otherText, setOtherText] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const painPointSections = behaviors
    .filter(b => questions.step3.mapping[b])
    .map(b => ({
      behaviorId: b,
      ...questions.step3.mapping[b]
    }));

  const hasPresetBehaviors = painPointSections.length > 0;

  // 当自定义行为变化时，尝试AI生成难点建议
  useEffect(() => {
    if (!hasPresetBehaviors && customBehaviors.trim()) {
      setAiLoading(true);
      generatePainPointSuggestions(customBehaviors).then(aiResult => {
        if (aiResult && aiResult.length > 0) {
          setAiSuggestions(aiResult);
        } else {
          // AI不可用，使用关键词匹配
          setAiSuggestions(fallbackSuggestions(customBehaviors));
        }
        setAiLoading(false);
      });
    } else {
      setAiSuggestions([]);
    }
  }, [customBehaviors, hasPresetBehaviors]);

  const togglePainPoint = (behaviorId, painId) => {
    const current = values[behaviorId] || [];
    const newPains = current.includes(painId)
      ? current.filter(p => p !== painId)
      : [...current, painId];
    onChange({ ...values, [behaviorId]: newPains });
  };

  const toggleSuggestion = (painId) => {
    const current = values.__suggestions || [];
    const newPains = current.includes(painId)
      ? current.filter(p => p !== painId)
      : [...current, painId];
    onChange({ ...values, __suggestions: newPains });
  };

  const handleOtherChange = (e) => {
    const text = e.target.value;
    setOtherText(text);
    const newValues = { ...values };
    if (text.trim()) {
      newValues.__other = [text];
    } else {
      delete newValues.__other;
    }
    onChange(newValues);
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="page-title">在这些工作中，你遇到的主要困难是？</h2>
      <p className="page-subtitle">可多选，选择你实际感受到的痛点</p>
      <div className="space-y-5">
        {hasPresetBehaviors ? (
          <>
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
          </>
        ) : (
          /* 只有自定义行为 — AI生成难点建议 */
          <div className="card bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <div className="flex items-start gap-2 mb-3">
              <span className="text-lg flex-shrink-0">💡</span>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">
                  根据"<span className="text-blue-600">{customBehaviors}</span>"，AI为你推荐以下可能的困难：
                </h3>
              </div>
            </div>
            {aiLoading ? (
              <div className="flex items-center gap-2 py-2">
                <span className="w-4 h-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-sm text-gray-400">AI正在分析你的工作场景...</span>
              </div>
            ) : aiSuggestions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {aiSuggestions.map((opt) => {
                  const selected = (values.__suggestions || []).includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleSuggestion(opt.id)}
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
            ) : (
              <p className="text-sm text-gray-500">请在下方输入框中描述你遇到的主要困难</p>
            )}
          </div>
        )}

        {/* 自由输入其他困难 */}
        {questions.step3.hasOther && (
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {hasPresetBehaviors ? '其他困难' : '补充描述困难'}
            </h3>
            <input
              type="text"
              placeholder={questions.step3.otherPlaceholder}
              value={otherText}
              onChange={handleOtherChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm
                         focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-50
                         placeholder-gray-400 transition-all"
            />
          </div>
        )}
      </div>
    </div>
  );
}
