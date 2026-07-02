import recommendationsData from '../data/recommendations.json';
import { getDefaultPrompt } from './promptTemplates';

/**
 * 规则匹配引擎
 * 根据用户的Step1-Step4选择，匹配最合适的AI能力类型
 */

export function matchAIRecommendations(answers) {
  const { role, behaviors, painpoints, structure } = answers;
  const { rules, aiTypes, structureModifiers } = recommendationsData;

  let matchedRule = null;
  let highestScore = 0;

  for (const rule of rules) {
    const ruleConditions = rule.if;
    let match = true;

    if (ruleConditions.role && ruleConditions.role !== role) match = false;
    if (match && ruleConditions.behaviors) {
      if (!ruleConditions.behaviors.some(b => behaviors.includes(b))) match = false;
    }
    if (match && ruleConditions.painpoints_any) {
      const allPainPoints = Object.values(painpoints).flat();
      if (!ruleConditions.painpoints_any.some(p => allPainPoints.includes(p))) match = false;
    }

    if (match && rule.then.score > highestScore) {
      highestScore = rule.then.score;
      matchedRule = rule.then;
    }
  }

  // Structure modifiers
  let structureBoosts = {};
  if (structure) {
    for (const [dim, value] of Object.entries(structure)) {
      const modifier = structureModifiers[dim]?.[value];
      if (modifier) {
        if (modifier.add) {
          modifier.add.forEach(type => {
            structureBoosts[type] = (structureBoosts[type] || 0) + (modifier.boost || 0);
          });
        }
        if (modifier.boost && !modifier.add && matchedRule) {
          structureBoosts[matchedRule.primary] = (structureBoosts[matchedRule.primary] || 0) + modifier.boost;
        }
      }
    }
  }

  let primary = matchedRule?.primary || 'generative';
  let secondary = matchedRule?.secondary || 'organizational';

  if (structureBoosts[secondary] > (structureBoosts[primary] || 0) + 15) {
    [primary, secondary] = [secondary, primary];
  }

  const primaryInfo = aiTypes[primary];
  const secondaryInfo = aiTypes[secondary];
  const reasons = generateReasons(answers, { primary, secondary }, recommendationsData);
  const structureInfo = buildStructureInfo(structure, structureModifiers);

  return {
    primary: { key: primary, ...primaryInfo },
    secondary: { key: secondary, ...secondaryInfo },
    reasons,
    structureInfo,
    matchedScore: highestScore,
    deepseekPrompt: getDefaultPrompt(answers, { primary: primaryInfo, secondary: secondaryInfo }, reasons)
  };
}

function generateReasons(answers, result, data) {
  const reasons = [];
  const { role, behaviors } = answers;
  const roleMap = { project: '项目落地层', resource: '资源建设层', operation: '行政运营层' };
  reasons.push(`你在**${roleMap[role] || '培训管理'}**领域工作`);
  if (behaviors && behaviors.length > 0) {
    reasons.push(`重点关注**${getBehaviorLabels(behaviors)}**等工作行为`);
  }
  const pt = data.aiTypes[result.primary];
  const st = data.aiTypes[result.secondary];
  reasons.push(`最适合的AI能力是**${pt.label}型**，辅以**${st.label}型**`);
  reasons.push(pt.description);
  return reasons;
}

function getBehaviorLabels(behaviorIds) {
  const m = { need_research: '需求调研', plan_scheme: '方案规划', design_path: '学习路径设计',
    resource_coord: '资源协同', track_exec: '执行跟进', review_opt: '复盘优化',
    course_build: '课程建设', trainer_train: '讲师培养', trainer_mgmt: '讲师管理',
    eval_vendor: '供应商评估', build_kb: '知识库建设',
    send_notice: '发通知', manage_reg: '管报名', track_hw: '跟作业',
    summarize_data: '汇总数据', budget_track: '预算追踪' };
  return behaviorIds.filter(id => m[id]).map(id => m[id]).join('、');
}

function buildStructureInfo(structure) {
  if (!structure) return [];
  const dimLabels = { repeatability: '重复性', complexity: '复杂度', standardization: '标准化', collaboration: '协同性' };
  const valueLabels = { low: '低', medium: '中', high: '高', individual: '个人', dept: '部门', cross: '跨部门' };
  const descs = {
    repeatability: { low: '每次都不一样', medium: '部分重复', high: '大量重复动作' },
    complexity: { low: '简单清晰', medium: '有一定复杂度', high: '高度复杂' },
    standardization: { low: '无固定流程', medium: '部分可标准化', high: '流程明确可复制' },
    collaboration: { individual: '个人独立完成', dept: '部门内协同', cross: '跨部门协作' }
  };
  return Object.entries(structure).map(([dim, value]) => ({
    dim: dimLabels[dim] || dim,
    value: valueLabels[value] || value,
    desc: descs[dim]?.[value] || ''
  }));
}