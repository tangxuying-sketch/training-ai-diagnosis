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
          setAdvice('建议你先从最耗时、最重复的工作点入手，选择推荐的工具开始小范围试错。');
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

  // 简易Markdown渲染（支持 **bold**、##标题、-列表等）
  const renderLine = (line, i) => {
    // 处理 **加粗** — 将 **text** 替换为 <strong>text</strong>
    const renderBold = (text) => {
      const parts = text.split(/(\*\*[^*]+\*\*)/);
      return parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return React.createElement('strong', { key: j }, part.slice(2, -2));
        }
        return part;
      });
    };

    if (line.startsWith('## ')) {
      return <h3 key={i} className="text-base font-bold text-gray-800 mt-4 mb-2">{line.replace('## ', '')}</h3>;
    }
    if (line.startsWith('- ')) {
      return <li key={i} className="text-sm text-gray-600 ml-4 list-disc">{renderBold(line.replace('- ', ''))}</li>;
    }
    if (/^\d+\.\s*/.test(line)) {
      return <li key={i} className="text-sm text-gray-600 ml-4 list-decimal">{renderBold(line.replace(/^\d+\.\s*/, ''))}</li>;
    }
    return <p key={i} className="text-sm text-gray-600 leading-relaxed">{renderBold(line)}</p>;
  };

  const renderContent = (text) => {
    const lines = text.split('\n').filter(Boolean);
    return lines.map((line, i) => renderLine(line, i));
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
            <strong>小贴士：</strong>建议从一个小而具体的场景开始，跑通后再复制到其他环节。记住"先跑通、再优化"，不要追求一步到位。
          </div>
        </div>
      </div>
    </div>
  );
}
