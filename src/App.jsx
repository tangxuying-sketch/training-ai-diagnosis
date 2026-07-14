import React, { useState, useCallback } from 'react';
import ProgressBar from './components/ProgressBar';
import Step1RoleSelect from './components/Step1RoleSelect';
import Step2Behaviors from './components/Step2Behaviors';
import Step3PainPoints from './components/Step3PainPoints';
import Step4WorkStructure from './components/Step4WorkStructure';
import Step5AIRecommendation from './components/Step5AIRecommendation';
import Step6ActionPlan from './components/Step6ActionPlan';
import LeadForm from './components/LeadForm';
import PrintSummary from './components/PrintSummary';
import { matchAIRecommendations } from './engine/matchEngine';

export default function App() {
  const [step, setStep] = useState(1);
  const [showLeadForm, setShowLeadForm] = useState(true);
  const [leadInfo, setLeadInfo] = useState(null);
  const [answers, setAnswers] = useState({ role: null, behaviors: [], customBehaviors: '', painpoints: {}, structure: {} });
  const [matchResult, setMatchResult] = useState(null);

  const updateAnswer = useCallback((key, value) => {
    setAnswers(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'role') { next.behaviors = []; next.customBehaviors = ''; next.painpoints = {}; next.structure = {}; }
      if (key === 'behaviors') {
        const kept = {};
        value.forEach(b => { if (prev.painpoints[b]) kept[b] = prev.painpoints[b]; });
        next.painpoints = kept;
      }
      return next;
    });
  }, []);

  const canProceed = () => {
    switch (step) {
      case 1: return !!answers.role;
      case 2: return answers.behaviors.length > 0 || answers.customBehaviors.trim().length > 0;
      case 3: return Object.values(answers.painpoints).some(a => a.length > 0);
      case 4: return ['repeatability','complexity','standardization','collaboration'].every(d => answers.structure[d]);
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < 4) { setStep(s => s + 1); }
    else if (step === 4) {
      const result = matchAIRecommendations(answers);
      setMatchResult(result);
      setStep(5);
    }
  };

  const handlePrev = () => { if (step > 1) setStep(s => s - 1); };

  const handleLeadSubmit = (info) => { setLeadInfo(info); setShowLeadForm(false); };
  const handleLeadSkip = () => { setShowLeadForm(false); };
  const handleRestart = () => {
    setAnswers({ role: null, behaviors: [], customBehaviors: '', painpoints: {}, structure: {} });
    setMatchResult(null); setLeadInfo(null); setShowLeadForm(true); setStep(1);
  };

  const renderStepContent = () => {
    const components = {
      1: <Step1RoleSelect value={answers.role} onChange={(v) => updateAnswer('role', v)} />,
      2: <Step2Behaviors
           role={answers.role}
           value={answers.behaviors}
           customValue={answers.customBehaviors}
           onChange={(v) => updateAnswer('behaviors', v)}
           onCustomChange={(v) => updateAnswer('customBehaviors', v)}
         />,
      3: <Step3PainPoints behaviors={answers.behaviors} customBehaviors={answers.customBehaviors} values={answers.painpoints} onChange={(v) => updateAnswer('painpoints', v)} />,
      4: <Step4WorkStructure values={answers.structure} onChange={(v) => updateAnswer('structure', v)} />
    };
    return components[step];
  };

  // Step 5 - Show recommendation only
  if (step === 5 && matchResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10 no-print">
          <div className="max-w-md mx-auto px-4 py-3">
            <h1 className="text-base font-bold text-gray-900 text-center">
              培训管理<span className="text-blue-600">AI</span>应用机会诊断器
            </h1>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 py-4">
          <ProgressBar currentStep={5} />
          <div className="mt-4 mb-20">
            {/* 打印用：用户选择摘要 */}
          <div className="print-only">
            <PrintSummary answers={answers} leadInfo={leadInfo} matchResult={matchResult} />
          </div>

          <Step5AIRecommendation result={matchResult} />
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 p-4 no-print">
            <div className="max-w-md mx-auto">
              <button onClick={() => { setStep(6); setShowLeadForm(true); }} className="btn-primary">
                获取个性化行动建议 →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 6 - Lead form first, then full report
  if (step === 6) {
    if (showLeadForm) {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10 no-print">
            <div className="max-w-md mx-auto px-4 py-3">
              <h1 className="text-base font-bold text-gray-900 text-center">
                培训管理<span className="text-blue-600">AI</span>应用机会诊断器
              </h1>
            </div>
          </div>
          <div className="max-w-md mx-auto px-4 py-8">
            <ProgressBar currentStep={6} />
            <div className="mt-6">
              <LeadForm onSubmit={handleLeadSubmit} onSkip={handleLeadSkip} />
            </div>
          </div>
        </div>
      );
    }

    // Full result report
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10 no-print">
          <div className="max-w-md mx-auto px-4 py-3">
            <h1 className="text-base font-bold text-gray-900 text-center">
              培训管理<span className="text-blue-600">AI</span>应用机会诊断器
            </h1>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 py-4">
          <ProgressBar currentStep={6} />

          {/* 报告头部 - 打印时可见 */}
          <div className="text-center mb-4 print-only">
            <h1 className="text-xl font-bold text-gray-900">培训管理AI应用机会诊断报告</h1>
            {leadInfo && <p className="text-xs text-gray-400 mt-1">{leadInfo.name} | {leadInfo.company}</p>}
          </div>

          {/* 操作栏 */}
          <div className="flex gap-2 mb-6 no-print">
            <button onClick={() => window.print()} className="flex-1 py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              导出PDF
            </button>
            <button onClick={handleRestart} className="py-2.5 px-4 border-2 border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-gray-300 active:scale-[0.98] transition-all">重新测试</button>
          </div>

          {/* 打印用：用户选择摘要 */}
          <div className="print-only">
            <PrintSummary answers={answers} leadInfo={leadInfo} matchResult={matchResult} />
          </div>

          <Step5AIRecommendation result={matchResult} />
          <div className="mt-6">
            <Step6ActionPlan deepseekPrompt={matchResult.deepseekPrompt} />
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center no-print">
            <p className="text-xs text-gray-400">培训管理AI应用机会诊断器 · 线下工作坊体验工具</p>
          </div>
        </div>
      </div>
    );
  }

  // Steps 1-4
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10 no-print">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-base font-bold text-gray-900 text-center">
            培训管理<span className="text-blue-600">AI</span>应用机会诊断器
          </h1>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 py-4">
        <ProgressBar currentStep={step} />
        <div className="mt-4 mb-20">{renderStepContent()}</div>
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 p-4 no-print">
          <div className="max-w-md mx-auto flex gap-3">
            {step > 1 && <button onClick={handlePrev} className="btn-outline flex-shrink-0 w-24">上一步</button>}
            <button onClick={handleNext} disabled={!canProceed()} className="btn-primary flex-1">
              {step === 4 ? '查看诊断结果' : '下一步'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
