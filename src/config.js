// ===== 配置 =====
// DeepSeek API 密钥 — 从环境变量读取，勿直接写在代码中
// 请在项目根目录创建 .env 文件，添加：
//   VITE_DEEPSEEK_API_KEY=你的密钥
export const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';

// 接收留资表单的邮箱
export const LEAD_EMAIL = '53220132@QQ.COM';
