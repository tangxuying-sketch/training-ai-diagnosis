import recommendationsData from '../data/recommendations.json';
import { getDefaultPrompt } from './promptTemplates';

const QUICK_TOOLS_MAP = {
  generative: [
    { name: 'Kimi', desc: '擅长长文本处理，适合写方案、课件、详细文档' },
    { name: '通义千问', desc: '阿里巴巴出品，中文内容生成能力强' },
    { name: 'Gamma', desc: '一键生成演示文稿和文档' },
  ],
  analytical: [
    { name: '通义千问', desc: '数据分析与摘要能力强，支持深度推理' },
    { name: '小浣熊（Raccoon）', desc: 'AI数据分析工具，上传数据自动出报表' },
    { name: 'Kimi', desc: '支持长文档分析，快速提炼核心结论' },
  ],
  process: [
    { name: '扣子空间（Coze）', desc: '字节跳动出品，零门槛搭建AI工作流' },
    { name: 'Dify', desc: '开源AI应用开发平台，支持复杂流程编排' },
    { name: '钉钉AI', desc: '与钉钉深度集成，适合企业内部审批通知自动化' },
  ],
  organizational: [
    { name: '飞书多维表格', desc: '适合团队协作的信息整理平台，支持AI辅助' },
    { name: '语雀', desc: '阿里巴巴出品，知识库管理工具' },
    { name: 'Workbuddy', desc: '面向企业的智能知识服务平台' },
  ],
  knowledge: [
    { name: 'Workbuddy', desc: '企业级知识管理AI助手，帮助沉淀组织经验' },
    { name: '扣子空间', desc: '搭建可问答的知识库Bot，无需编写代码' },
    { name: '语雀AI', desc: '知识库管理 + AI问答能力' },
  ],
  development: [
    { name: 'Python + 通义千问API', desc: '快速开发自动化脚本或内容生成工具' },
    { name: '低代码平台（钉钉宜搭等）', desc: '无需代码基础即可搭建业务工具' },
  ],
};

const ADVANCED_TOOLS_MAP = {
  generative: [
    { name: 'Trae', desc: 'AI驱动的IDE，用自然语言描述需求即可生成课程生成器或内容创作工具' },
    { name: 'CodeX', desc: 'AI辅助编程，适合搭建专属的课程/文档生成应用' },
  ],
  analytical: [
    { name: 'Python + 通义千问API', desc: '快速搭建数据分析仪表盘，让分析自动化' },
    { name: 'Dify + 本地模型', desc: '搭建企业级智能分析Agent，处理复杂分析流程' },
  ],
  process: [
    { name: '扣子空间（Coze）', desc: '零门槛构建多步骤AI工作流，打通内部系统' },
    { name: 'Dify', desc: '开源AI应用平台，支持复杂流程串联' },
  ],
  organizational: [
    { name: '飞书多维表格 + AI', desc: '搭建企业级知识管理系统，自动归类沉淀经验' },
    { name: 'RAG方案 + 通义API', desc: '搭建可问答的内部知识库，让组织经验活起来' },
  ],
  knowledge: [
    { name: 'RAG + 通义千问API', desc: '搭建企业内部AI知识问答系统' },
    { name: 'Workbuddy定制', desc: '基于Workbuddy搭建专属知识库' },
  ],
  development: [
    { name: 'Trae', desc: 'AI编程助手，适合从头搭建AI原生应用' },
    { name: 'CodeX', desc: 'AI辅助开发，实现端到端工具定制' },
  ],
};

const PATH_DESCRIPTIONS = {
  generative: {
    quick: '直接用AI内容创作工具，输入需求即可秒出方案、课件、文档，零成本上手。推荐Kimi、通义千问等国内工具。',
    advanced: '用Trae或CodeX搭建专属的内容生成平台，自动适配你团队的工作流程和模板标准。',
  },
  analytical: {
    quick: '用AI分析工具上传数据/资料，自动提炼结论。推荐小浣熊、Kimi等国内工具。',
    advanced: '用Dify或Trae搭建数据分析Agent，定时跑数、自动出报告，告别重复手工分析。',
  },
  process: {
    quick: '用AI工作流平台把重复步骤串联起来，推荐扣子空间（Coze）、Dify、钉钉AI等国内平台。',
    advanced: '用扣子空间或Dify自建自动化流程引擎，深度对接内部系统，实现端到端无人值守。',
  },
  organizational: {
    quick: '用飞书多维表格或语雀整理零散信息，快速搭建团队知识库。',
    advanced: '用飞书+AI或Workbuddy搭建企业级知识和文档管理系统，自动归类、检索、沉淀。',
  },
  knowledge: {
    quick: '用扣子空间或Workbuddy构建内部问答系统，快速沉淀团队经验。',
    advanced: '用RAG + 通义千问搭建专属AI知识助手，让每一个员工都能问出答案。',
  },
  development: {
    quick: '用低代码平台或AI辅助脚本，快速开发小工具满足日常需求。',
    advanced: '用Trae或CodeX开发AI原生应用，构建完整的数字化工具体系。',
  },
};

/** 按AI能力类型组织的解决方案模板（深度引用用户输入） */
const SOLUTION_TEMPLATES = {
  generative: {
    focus: '内容生成',
    summary: '快速将你的经验和方法论转化为标准化的文档、案例和课件',
    painResolve: {
      content: '直接从零开始生成内容，不需要每次都重新构思框架',
      quality: '基于你提供的标准和范例，生成质量稳定的内容',
      update: '在已有内容基础上快速迭代，增减调整秒级完成',
    },
    toolHints: '推荐Kimi（方案撰写）、Gamma（课件制作）、通义千问（内容创作）',
  },
  analytical: {
    focus: '数据分析与洞察',
    summary: '从分散的数据和信息中快速提炼结论，支撑业务决策',
    painResolve: {
      content: '自动分析海量调研数据，提取关键模式',
      quality: '标准化分析框架，确保每次输出质量一致',
      update: '定时自动拉取数据更新分析报告',
    },
    toolHints: '推荐通义千问（深度分析）、小浣熊（数据报表）',
  },
  process: {
    focus: '流程自动化',
    summary: '把多环节的手工操作串联成自动化流水线',
    painResolve: {
      content: '自动完成内容催收、审核、发布的全链路',
      quality: '标准化每个流转节点的交付物质量',
      update: '实时监控流程状态，自动预警异常',
    },
    toolHints: '推荐扣子空间（工作流搭建）、Dify（复杂流程编排）',
  },
  organizational: {
    focus: '信息整理与知识管理',
    summary: '将零散的资料结构化、体系化，变成可检索复用的知识资产',
    painResolve: {
      content: '自动归类海量文档资料，建立清晰的分类体系',
      quality: '统一内容模板标准，确保入库质量',
      update: '自动追踪版本变更，保持知识库时效性',
    },
    toolHints: '推荐飞书多维表格（信息整理）、语雀（知识库）、Workbuddy（智能知识服务）',
  },
  knowledge: {
    focus: '知识检索与智能问答',
    summary: '把隐性经验显性化，沉淀为可交互的智能知识库',
    painResolve: {
      content: '自动从历史资料中提取知识点，构建问答对',
      quality: '基于权威源回答，避免信息失真',
      update: '持续学习新资料，知识库自动更新',
    },
    toolHints: '推荐Workbuddy（知识管理）、扣子空间（智能Bot搭建）',
  },
  development: {
    focus: 'AI Coding定制工具',
    summary: '根据你的业务场景，开发完全匹配需求的专属数字工具',
    painResolve: {
      content: '按你的业务流程定制工具，无需迁就通用软件',
      quality: '开发过程AI辅助编程，质量可控',
      update: '需求变化时快速修改迭代',
    },
    toolHints: '推荐Trae（AI编程IDE）、CodeX（AI辅助开发）',
  },
};

export function matchAIRecommendations(answers) {
  const { role, behaviors, painpoints, structure, customBehaviors } = answers;
  const { rules, aiTypes, structureModifiers } = recommendationsData;

  let matchedRule = null;
  let highestScore = 0;

  const effectiveBehaviors = behaviors.length > 0
    ? behaviors
    : guessBehaviorsFromCustom(customBehaviors);

  for (const rule of rules) {
    const ruleConditions = rule.if;
    let match = true;

    if (ruleConditions.role && ruleConditions.role !== role) match = false;
    if (match && ruleConditions.behaviors) {
      if (!ruleConditions.behaviors.some(b => effectiveBehaviors.includes(b))) match = false;
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

  const primaryDetail = generatePersonalizedDetail(answers, primary);
  const secondaryDetail = generatePersonalizedDetail(answers, secondary);
  const reasons = generateReasons(answers, { primary, secondary }, recommendationsData);
  const structureInfo = buildStructureInfo(structure);
  const paths = generatePaths(answers, primary);

  return {
    primary: { key: primary, ...primaryInfo, detail: primaryDetail },
    secondary: { key: secondary, ...secondaryInfo, detail: secondaryDetail },
    reasons,
    structureInfo,
    paths,
    matchedScore: highestScore,
    deepseekPrompt: getDefaultPrompt(answers, { primary: primaryInfo, secondary: secondaryInfo }, reasons)
  };
}

function guessBehaviorsFromCustom(customText) {
  if (!customText || !customText.trim()) return [];
  const t = customText.trim();
  const hits = [];
  if (/课程|课件|教案|教学|培训内容/.test(t)) hits.push('course_build');
  if (/需求|调研|访谈|摸底/.test(t)) hits.push('need_research');
  if (/方案|规划|计划|设计/.test(t)) hits.push('plan_scheme');
  if (/路径|学习旅途|成长/.test(t)) hits.push('design_path');
  if (/协调|资源|沟通|对接/.test(t)) hits.push('resource_coord');
  if (/跟进|执行|进度|推动/.test(t)) hits.push('track_exec');
  if (/复盘|优化|总结|评估/.test(t)) hits.push('review_opt');
  if (/讲师|培训师|选拔|培养/.test(t)) hits.push('trainer_train');
  if (/讲师|教师|排课|调度/.test(t)) hits.push('trainer_mgmt');
  if (/供应商|采购|招标|评估/.test(t)) hits.push('eval_vendor');
  if (/知识库|文档|资料|归档|案例/.test(t)) hits.push('build_kb');
  if (/通知|公告|发布/.test(t)) hits.push('send_notice');
  if (/报名|登记|注册/.test(t)) hits.push('manage_reg');
  if (/作业|练习|考核|批改/.test(t)) hits.push('track_hw');
  if (/数据|统计|报表|汇总/.test(t)) hits.push('summarize_data');
  if (/预算|成本|采购|支出/.test(t)) hits.push('budget_track');
  return hits;
}

/** 生成深度个性化的AI能力描述 */
function generatePersonalizedDetail(answers, typeKey) {
  const { role, behaviors, painpoints, customBehaviors } = answers;
  const template = SOLUTION_TEMPLATES[typeKey];
  if (!template) return '';

  const behaviorLabels = getBehaviorLabels(behaviors);
  const workName = customBehaviors.trim() || behaviorLabels || '相关工作';

  let painText = '';
  if (painpoints && typeof painpoints === 'object') {
    const otherP = painpoints.__other;
    if (otherP && otherP.length > 0) {
      painText = otherP[0];
    }
  }

  const roleLabels = { project: '项目落地', resource: '资源建设', operation: '行政运营' };
  const roleLabel = roleLabels[role] || '培训管理';

  let painSolution = '';
  if (painText) {
    if (/效率|耗时|速度|慢|周期|时间/.test(painText)) painSolution = template.painResolve.content;
    else if (/质量|标准|参差|不统一/.test(painText)) painSolution = template.painResolve.quality;
    else if (/更新|维护|迭代|版本/.test(painText)) painSolution = template.painResolve.update;
    else painSolution = template.summary;
  } else {
    painSolution = template.summary;
  }

  const typeLabel = typeKey === 'development' ? 'AI Coding方案' : 'AI工具';
  const parts = [
    '你在' + roleLabel + '工作中关注"' + workName + '"。',
    painText ? '你提到主要困难是"' + painText + '"。' : '',
    template.focus + '类的' + typeLabel + '可以帮助你：' + painSolution,
    '适用工具：' + template.toolHints + '。',
  ];

  return parts.filter(Boolean).join(' ');
}

function generateReasons(answers, result, data) {
  const reasons = [];
  const { role, behaviors, painpoints, customBehaviors } = answers;
  const roleMap = { project: '项目落地层', resource: '资源建设层', operation: '行政运营层' };
  reasons.push(`你在**${roleMap[role] || '培训管理'}**领域工作`);
  if (behaviors && behaviors.length > 0) {
    reasons.push(`重点关注**${getBehaviorLabels(behaviors)}**等工作行为`);
  }
  if (customBehaviors && customBehaviors.trim()) {
    reasons.push(`你提到还涉及**${customBehaviors.trim()}**方面的工作`);
  }
  if (painpoints && typeof painpoints === 'object') {
    if (painpoints.__other && painpoints.__other.length > 0) {
      reasons.push(`你遇到的主要困难包括**${painpoints.__other[0]}**`);
    }
    const presetPains = Object.entries(painpoints)
      .filter(([k]) => k !== '__other' && k !== '__suggestions')
      .flatMap(([, v]) => v);
    if (presetPains.length > 0) {
      const painLabels = getPainPointLabels(presetPains);
      if (painLabels) {
        reasons.push(`你在工作中感受到**${painLabels}**等痛点`);
      }
    }
  }
  const pt = data.aiTypes[result.primary];
  const st = data.aiTypes[result.secondary];
  reasons.push(`最适合的AI能力是**${pt.label}**，辅以**${st.label}**`);
  return reasons;
}

function getPainPointLabels(painIds) {
  const m = {
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
    real_time_hard: '实时更新难', overrun_risk: '超支风险难预警', hard_report: '报表生成费时'
  };
  return painIds.filter(id => m[id]).map(id => m[id]).join('、');
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

function generatePaths(answers, primaryType) {
  const type = primaryType || 'generative';
  const quickTools = QUICK_TOOLS_MAP[type] || QUICK_TOOLS_MAP.generative;
  const advancedTools = ADVANCED_TOOLS_MAP[type] || ADVANCED_TOOLS_MAP.generative;
  const descs = PATH_DESCRIPTIONS[type] || PATH_DESCRIPTIONS.generative;

  return {
    quick: { description: descs.quick, tools: quickTools },
    advanced: { description: descs.advanced, tools: advancedTools },
  };
}

