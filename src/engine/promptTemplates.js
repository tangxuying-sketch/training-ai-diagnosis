/**
 * DeepSeek 提示词模板
 * 用于生成个性化行动建议
 */

export function getDefaultPrompt(answers, result, reasons) {
  const { primary, secondary } = result;
  const behaviors = answers.behaviors || [];
  const roleMap = { project: "项目落地层", resource: "资源建设层", operation: "行政运营层" };
  const role = roleMap[answers.role] || "培训管理";

  return `你是一位资深的企业培训数字化顾问。请根据以下用户信息，生成一段专业、有启发性的"最小试点行动建议"。

## 用户画像
- 当前关注层级：${role}
- 核心工作行为：${behaviors.join("、")}
- 推荐AI能力：${primary.label}型（主要）+ ${secondary.label}型（辅助）

## 输出要求
请用中文，以第一人称"你"的口吻，生成以下内容（控制在300字以内）：

1. **最小试点建议**：建议用户从哪个具体工作点开始尝试AI
2. **推荐工具**：结合推荐的AI能力类型，推荐1-2个具体工具及使用方法
3. **验证ROI的方法**：建议如何衡量AI带来的效率提升
4. **预计节省时间**：给出一个百分比范围

语气要专业、务实、有启发性，避免夸大其词。`;
}
