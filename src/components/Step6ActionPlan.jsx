import React, { useState, useEffect } from 'react';
import { generateActionAdvice } from '../utils/deepseek';

export default function Step6ActionPlan({ deepseekPrompt, onLoadingChange }) {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      onLoadingChange?.(true);
      try {
        const result = await generateActionAdvice(deepseekPrompt);
        if (mounted) {
          setAdvice(result);
        }
      } catch (e) {
        if (mounted) {
          setAdvice('建议你先从最耗时、最重复的工作点入手，选择推荐的工具开始小范围试点。');
        }
      } finally {
        if (mounted) {
          setLoading(false);
          onLoadingChange?.(false);
        }
      }
    }

    load();
    return () => { mounted = false; };
  }, [deepseekPrompt]);

  // 简单Markdown渲染
  const renderContent = (text) => {
    const lines = text.split('\n').filter(Boolean);
    return lines.map((line, i) => {
      if (line.startsWith('## ')) {
        return <h3 key={i} className="text-base font-bold text-gray-800 mt-4 mb-2">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="text-sm text-gray-600 ml-4 list-disc">{line.replace('- ', '')}</li>;
      }
      if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.')) {
        return <li key={i} className="text-sm text-gray-600 ml-4 list-decimal">{line.replace(/^\d+\.\s*/, '')}</li>;
      }
      return <p key={i} className="text-sm text-gray-600 leading-relaxed">{line}</p>;
    });
  };

  if (loading) {
    return (
      <div className="animate-fadeIn text-center py-12">
        <div className="inline-block w-8 h-8 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-gray-400">AI正在为你生成个性化行动建议...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-4">
      <div>
        <h2 className="page-title">你的最小试点行动建议</h2>
        <p className="page-subtitle">基于DeepSeek AI为你量身定制的落地计划</p>
      </div>

      <div className="card bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
        <div className="prose prose-sm max-w-none">
          {renderContent(advice)}
        </div>
      </div>

      <div className="card bg-amber-50 border-amber-100">
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0">💡</span>
          <div className="text-sm text-amber-800 leading-relaxed">
            <strong>小贴士：</strong>建议从一个小而具体的场景开始，跑通后再复制到其他环节。
            先"跑通"再"优化"，不要追求一步到位。
          </div>
        </div>
      </div>
    </div>
  );
}
