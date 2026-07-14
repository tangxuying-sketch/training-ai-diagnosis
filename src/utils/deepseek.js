import { DEEPSEEK_API_KEY } from '../config';

const API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function generateActionAdvice(prompt) {
  if (!DEEPSEEK_API_KEY) {
    return getFallbackAdvice();
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一位资深的企业培训数字化顾问，输出简洁专业的中文建议。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) throw new Error(`API请求失败: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return getFallbackAdvice();
  }
}

/** 调用DeepSeek为自定义行为生成难点建议 */
export async function generatePainPointSuggestions(customBehavior) {
  if (!DEEPSEEK_API_KEY || !customBehavior || !customBehavior.trim()) {
    return null; // 无API Key时返回null，调用方使用keyword fallback
  }

  const prompt = `你是企业培训领域专家。用户描述了自己的工作行为："${customBehavior.trim()}"。

请分析这个工作行为中可能遇到的3个常见困难，以JSON数组格式返回，不要加任何其他文字：
[
  { "id": "custom_1", "label": "困难描述，10-20字" },
  { "id": "custom_2", "label": "困难描述，10-20字" },
  { "id": "custom_3", "label": "困难描述，10-20字" }
]`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你只输出纯JSON数组，不输出任何其他内容。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) throw new Error(`API失败: ${response.status}`);
    const data = await response.json();
    const text = data.choices[0].message.content.trim();
    // 尝试解析JSON
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 3);
      }
    }
    return null;
  } catch (error) {
    console.error('生成难点建议失败:', error);
    return null;
  }
}

function getFallbackAdvice() {
  return `## 快速上手路径

- 切入场景：每周都要做的方案撰写或通知发布。打开AI对话工具，把需求描述清楚，秒级出大纲。
- 推荐工具：**Kimi** —— 适合写长篇方案和详细文档；**通义千问** —— 中文内容生成能力强，适合快速起草大纲。
- 预期效果：简单事务性工作可节省 **30%-50%** 的时间。

## 深度定制路径

- 定制思路：针对你日常重复且流程固定的环节（如培训通知发布 → 报名收集 → 作业批改），开发一个自动化工具把全链路串起来。
- 技术方案：**Trae** —— 用自然语言描述需求，AI自动生成可运行的代码和页面，零基础也能上手；**扣子空间** —— 拖拽式搭建工作流，无需写代码就能实现自动化。
- 开发价值：专属工具按你的流程定制，长期来看可压缩该环节 **70%** 以上的工时，且可复用于不同培训项目。`;
}


