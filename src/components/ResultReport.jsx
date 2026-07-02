import React from 'react';
import { exportToPDF, formatDateTime } from '../utils/pdfExport';
import Step5AIRecommendation from './Step5AIRecommendation';
import Step6ActionPlan from './Step6ActionPlan';

export default function ResultReport({ answers, matchResult, leadInfo, onRestart }) {
  const { primary, secondary } = matchResult;

  return (
    <div className="animate-fadeIn">
      {/* 报告头部 */}
      <div className="text-center mb-6 print-only">
        <h1 className="text-xl font-bold text-gray-900">培训管理AI应用机会诊断报告</h1>
        <p className="text-xs text-gray-400 mt-1">生成时间：{formatDateTime()}</p>
        {leadInfo && (
          <div className="text-xs text-gray-400 mt-0.5">
            {leadInfo.name} | {leadInfo.company}
          </div>
        )}
      </div>

      {/* 操作栏 */}
      <div className="flex gap-2 mb-6 no-print">
        <button onClick={exportToPDF} className="flex-1 py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-xl
          hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          导出PDF
        </button>
        <button onClick={onRestart} className="py-2.5 px-4 border-2 border-gray-200 text-gray-600 text-sm font-medium rounded-xl
          hover:border-gray-300 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5">
          重新测试
        </button>
      </div>

      {/* AI能力推荐 */}
      <Step5AIRecommendation result={matchResult} />

      {/* 行动建议 */}
      <div className="mt-6">
        <Step6ActionPlan deepseekPrompt={matchResult.deepseekPrompt} />
      </div>

      {/* 页脚 */}
      <div className="mt-8 pt-6 border-t border-gray-100 text-center no-print">
        <p className="text-xs text-gray-400">
          培训管理AI应用机会诊断器 · 线下工作坊体验工具
        </p>
      </div>
    </div>
  );
}
