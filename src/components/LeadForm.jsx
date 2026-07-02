import React, { useState } from 'react';
import { submitLeadForm } from '../utils/formSubmit';

const RECEIVE_EMAIL = '53220132@QQ.COM';

export default function LeadForm({ onSubmit, onSkip }) {
  const [form, setForm] = useState({ name: '', company: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = '请填写姓名';
    if (!form.company.trim()) errs.company = '请填写公司/机构名称';
    if (!form.phone.trim()) errs.phone = '请填写手机号';
    else if (!/^1\d{10}$/.test(form.phone.trim())) errs.phone = '请输入正确的11位手机号';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      await submitLeadForm({
        _subject: '培训管理AI诊断 - 新留资',
        email: RECEIVE_EMAIL,
        name: form.name.trim(),
        company: form.company.trim(),
        phone: form.phone.trim(),
        _template: 'table'
      });
      onSubmit(form);
    } catch {
      // 即使提交失败，也允许用户继续
      onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-6">
        <div className="text-3xl mb-3">📋</div>
        <h2 className="page-title">获取你的专属诊断报告</h2>
        <p className="text-sm text-gray-400 mt-1">
          填写以下信息，即可查看完整的AI能力匹配报告
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">姓名 *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="请输入你的姓名"
            className={`w-full px-4 py-3 border-2 rounded-xl text-sm transition-all
              focus:outline-none focus:ring-2 focus:ring-blue-50
              ${errors.name ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-blue-400'}`}
          />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">公司/机构名称 *</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="请输入公司或机构名称"
            className={`w-full px-4 py-3 border-2 rounded-xl text-sm transition-all
              focus:outline-none focus:ring-2 focus:ring-blue-50
              ${errors.company ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-blue-400'}`}
          />
          {errors.company && <p className="text-xs text-red-400 mt-1">{errors.company}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">手机号 *</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="请输入手机号"
            maxLength={11}
            className={`w-full px-4 py-3 border-2 rounded-xl text-sm transition-all
              focus:outline-none focus:ring-2 focus:ring-blue-50
              ${errors.phone ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-blue-400'}`}
          />
          {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary mt-2 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              提交中...
            </>
          ) : (
            '查看诊断报告 →'
          )}
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors"
        >
          跳过，直接查看结果
        </button>
      </form>

      <p className="text-[10px] text-gray-300 text-center mt-6">
        提交即表示你同意我们收集以上信息用于发送诊断报告
      </p>
    </div>
  );
}
