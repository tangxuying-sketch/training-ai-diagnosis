/**
 * DeepSeek 提示词模板
 * 用于生成个性化行动建议
 */

export function getDefaultPrompt(answers, result, reasons) {
  const { primary, secondary } = result;
  const behaviors = answers.behaviors || [];
  const customBehaviors = answers.customBehaviors || '';
  const painpoints = answers.painpoints || {};
  const otherPain = painpoints.__other;
  const structure = answers.structure || {};

  const roleMap = { project: "项目落地层", resource: "资源建设层", operation: "行政运营层" };
  const role = roleMap[answers.role] || "培训管理";

  const behaviorLabels = getBehaviorLabelText(behaviors);
  const structureText = getStructureText(structure);

  const extraInfo = [];
  if (customBehaviors.trim()) extraInfo.push(`其他涉及工作：${customBehaviors.trim()}`);
  if (otherPain && otherPain.length > 0) extraInfo.push(`其他困难：${otherPain[0]}`);

  return `你是一位资深的企业培训数字化顾问。请根据以下用户信息，为培训管理者生成一份"AI应用行动建议"。要求输出结构清晰、有可读性，方便快速浏览。

## 用户画像
- 当前关注层级：${role}
- 核心工作行为：${behaviorLabels || '（未详细说明）'}
${extraInfo.length > 0 ? '- 其他补充：' + extraInfo.join('；') : ''}
${structureText}
- 推荐AI能力：${primary.label}（主要）+ ${secondary.label}（辅助）

## 输出格式（务必遵守）
用以下固定格式输出，使用Markdown标记让结构清晰：

## 快速上手路径

- 切入场景：[1-2句话]结合用户的实际工作描述，建议从哪个具体工作点开始试用AI
- 推荐工具：[工具名称] —— [具体怎么用，给一个实际的使用案例]
- 预期效果：[具体数据]预计节省的时间或效率提升百分比

## 深度定制路径

- 定制思路：[2-3句话]针对用户的具体业务场景（不要泛泛而谈），描述可以开发一个什么样的专属AI工具，它具体能解决什么问题
- 技术方案：[工具/框架名称] —— [说明为什么选这个方案，它能带来什么好处，以及具体怎么实现]
- 开发价值：[具体数据]相比通用AI对话，专属工具能额外节省多少时间或带来什么优势

## 工具推荐约束
- 优先推荐国内可用低门槛工具：Kimi、通义千问、文心一言（通用AI）；小浣熊（数据分析）；扣子空间、Dify（自动化）；语雀、飞书（知识管理）；Trae、CodeX（AI Coding）。不要推荐需翻墙的国际工具。
- 用**工具名**加粗标注关键术语和数字，让内容更醒目。
- 语气要专业、务实，避免夸大其词。深度定制路径必须结合用户的实际工作场景，给出具体的工具名称和实现方法，不要泛泛而谈。`;
}

function getBehaviorLabelText(behaviorIds) {
  const m = {
    need_research: '培训需求调研', plan_scheme: '规划项目方案', design_path: '设计学习路径',
    resource_coord: '安排资源协同', track_exec: '跟进项目执行', review_opt: '复盘优化',
    course_build: '课程资源建设', trainer_train: '内训师培养', trainer_mgmt: '内训师管理',
    eval_vendor: '评估供应商', build_kb: '建知识库',
    send_notice: '发通知', manage_reg: '管报名', track_hw: '跟作业',
    summarize_data: '汇总数据', budget_track: '做预算追踪'
  };
  return behaviorIds.filter(id => m[id]).map(id => m[id]).join('、');
}

function getStructureText(structure) {
  const dimLabels = { repeatability: '重复性', complexity: '复杂度', standardization: '标准化', collaboration: '协同性' };
  const parts = [];
  for (const [dim, value] of Object.entries(structure)) {
    if (dimLabels[dim]) {
      const vMap = { low: '低', medium: '中', high: '高', individual: '个人', dept: '部门', cross: '跨部门' };
      parts.push(`${dimLabels[dim]}：${vMap[value] || value}`);
    }
  }
  return parts.length > 0 ? `- 工作结构特征：${parts.join('，')}` : '';
}
