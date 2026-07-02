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
        max_tokens: 800
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

function getFallbackAdvice() {
  return `## 最小试点建议

建议你先从"最耗时、最重复、价值最高"的工作点入手。

## 行动步骤
1. **选一个具体场景**：挑一个你每周花时间最多、且流程相对明确的环节
2. **选一个工具**：根据推荐的AI能力类型，选择对应的工具开始试用
3. **设定衡量标准**：记录试点的耗时对比（如"原来花3小时，现在花多久"）

## ROI验证方法
- 对比试点前后的时间投入
- 记录产出质量的提升（如方案通过率、数据准确率）
- 收集团队反馈

## 预计节省时间
根据行业经验，合理预期可节省 **30%-50%** 的事务性工作时间。`;
}