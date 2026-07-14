import React from 'react';
import questions from '../data/questions.json';

const roleMap = { project: '项目落地层', resource: '资源建设层', operation: '行政运营层' };
const roleIcons = { project: '🎯', resource: '📚', operation: '⚙️' };

const behaviorLabels = {
  need_research: '需求调研', plan_scheme: '方案规划', design_path: '学习路径设计',
  resource_coord: '资源协同', track_exec: '执行跟进', review_opt: '复盘优化',
  course_build: '课程建设', trainer_train: '讲师培养', trainer_mgmt: '讲师管理',
  eval_vendor: '供应商评估', build_kb: '知识库建设',
  send_notice: '发通知', manage_reg: '管报名', track_hw: '跟作业',
  summarize_data: '汇总数据', budget_track: '预算追踪',
};

const painPointLabels = {
  info_scattered: '信息太散', hard_summarize: '难提炼重点', interview_tedious: '访谈整理耗时',
  restructure: '结构反复改', hard_align: '难对齐业务目标', no_template: '缺模板',
  unclear_path: '路径不清楚', hard_match: '难匹配岗位需求', content_scattered: '内容零散不成体系',
  multi_stakeholder: '多方协调难', timetight: '时间紧', change_frequent: '变更多',
  progress_hard: '进度透明难', response_slow: '推动响应慢', quality_uneven: '质量参差',
  result_hard_measure: '结果难量化', experience_lost: '经验流失', optimize_loop: '优化循环慢',
  data_chaos: '数据杂乱', teacher_level: '讲师水平参差', content_messy: '内容杂乱',
  hard_search: '查找不便', low_usage: '使用率低',
  many_channels: '渠道多易遗漏', hard_track_read: '难追踪已读未读', repeat_work: '重复工作多',
  info_disorder: '信息杂乱', hard_stat: '统计费时', frequent_changes: '变动频繁',
  collection_hard: '收集困难', hard_review: '批阅费时', no_reminder: '缺自动提醒',
  sources_many: '数据来源多', manual_tedious: '手工汇总繁琐', hard_visualize: '难形成可视化',
  real_time_hard: '实时更新难', overrun_risk: '超支风险难预警', hard_report: '报表生成费时',
};

const structLabels = {
  repeatability: { label: '重复性', values: { low: '低', medium: '中', high: '高' } },
  complexity: { label: '复杂度', values: { low: '低', medium: '中', high: '高' } },
  standardization: { label: '标准化', values: { low: '低', medium: '中', high: '高' } },
  collaboration: { label: '协同性', values: { individual: '个人', dept: '部门', cross: '跨部门' } },
};

export default function PrintSummary({ answers, leadInfo, matchResult }) {
  if (!answers) return null;

  const { role, behaviors, customBehaviors, painpoints, structure } = answers;
  const roleLabel = roleMap[role] || '未选择';
  const roleIcon = roleIcons[role] || '📋';

  // 收集所有选中的行为标签
  const behaviorItems = behaviors.filter(b => behaviorLabels[b]).map(b => behaviorLabels[b]);

  // 收集所有选中的痛点标签（排除 __other 和 __suggestions）
  const painItems = [];
  if (painpoints) {
    Object.entries(painpoints).forEach(([key, ids]) => {
      if (key === '__other') {
        if (ids && ids.length > 0) painItems.push(ids[0]);
      } else if (key !== '__suggestions') {
        ids.forEach(id => {
          if (painPointLabels[id]) painItems.push(painPointLabels[id]);
        });
      }
    });
  }

  // 工作结构
  const structItems = structure
    ? Object.entries(structure).map(([key, val]) => ({
        label: structLabels[key]?.label || key,
        value: structLabels[key]?.values[val] || val,
      }))
    : [];

  const hasContent = role || behaviorItems.length > 0 || customBehaviors || painItems.length > 0 || structItems.length > 0;
  if (!hasContent) return null;

  return (
    <div className="print-summary">
      <style>{`
        .print-summary { font-size: 12px; line-height: 1.6; color: #1f2937; }
        .ps-header { text-align: center; margin-bottom: 16px; }
        .ps-header h1 { font-size: 18px; font-weight: 800; color: #1f2937; margin: 0; }
        .ps-header .ps-meta { font-size: 11px; color: #9ca3af; margin-top: 4px; }
        .ps-divider { height: 1px; background: linear-gradient(to right, transparent, #d1d5db, transparent); margin: 16px 0; }
        .ps-section { margin-bottom: 14px; }
        .ps-section-title { font-size: 11px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .ps-role-row { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #1f2937; }
        .ps-role-icon { font-size: 20px; }
        .ps-tags { display: flex; flex-wrap: wrap; gap: 4px; }
        .ps-tag { display: inline-block; padding: 2px 8px; background: #eef2ff; color: #4338ca; border-radius: 4px; font-size: 11px; font-weight: 500; }
        .ps-tag-custom { background: #fef3c7; color: #92400e; }
        .ps-tag-pain { background: #fef2f2; color: #b91c1c; }
        .ps-tag-pain-custom { background: #fce7f3; color: #9d174d; }
        .ps-struct-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; }
        .ps-struct-item { display: flex; justify-content: space-between; padding: 3px 8px; background: #f9fafb; border-radius: 4px; font-size: 11px; }
        .ps-struct-label { color: #6b7280; }
        .ps-struct-value { font-weight: 600; color: #1f2937; }
        .ps-match { text-align: center; padding: 10px; background: linear-gradient(135deg, #eef2ff, #faf5ff); border-radius: 8px; }
        .ps-match-label { font-size: 11px; color: #6b7280; }
        .ps-match-types { font-size: 14px; font-weight: 700; color: #4338ca; margin-top: 2px; }
      `}</style>

      {/* 报告标题 */}
      <div className="ps-header">
        <h1>培训管理AI应用机会诊断报告</h1>
        {leadInfo && (
          <div className="ps-meta">
            {leadInfo.name} · {leadInfo.company}
          </div>
        )}
      </div>

      <div className="ps-divider" />

      {/* 关注层级 */}
      <div className="ps-section">
        <div className="ps-section-title">关注层级</div>
        <div className="ps-role-row">
          <span className="ps-role-icon">{roleIcon}</span>
          <span>{roleLabel}</span>
        </div>
      </div>

      {/* 工作行为 */}
      {(behaviorItems.length > 0 || customBehaviors) && (
        <div className="ps-section">
          <div className="ps-section-title">工作行为</div>
          <div className="ps-tags">
            {behaviorItems.map((label, i) => (
              <span key={i} className="ps-tag">{label}</span>
            ))}
            {customBehaviors && customBehaviors.trim() && (
              <span className="ps-tag ps-tag-custom">{customBehaviors.trim()}</span>
            )}
          </div>
        </div>
      )}

      {/* 工作难点 */}
      {painItems.length > 0 && (
        <div className="ps-section">
          <div className="ps-section-title">工作难点</div>
          <div className="ps-tags">
            {painItems.map((label, i) => (
              <span key={i} className="ps-tag ps-tag-pain">{label}</span>
            ))}
          </div>
        </div>
      )}

      {/* 工作结构 */}
      {structItems.length > 0 && (
        <div className="ps-section">
          <div className="ps-section-title">工作结构</div>
          <div className="ps-struct-grid">
            {structItems.map((item, i) => (
              <div key={i} className="ps-struct-item">
                <span className="ps-struct-label">{item.label}</span>
                <span className="ps-struct-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI能力匹配 */}
      {matchResult && (
        <>
          <div className="ps-divider" />
          <div className="ps-match">
            <div className="ps-match-label">AI能力匹配结果</div>
            <div className="ps-match-types">
              {matchResult.primary.emoji} {matchResult.primary.label} · {matchResult.secondary.emoji} {matchResult.secondary.label}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
