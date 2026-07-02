import { LEAD_EMAIL } from '../config';

const FORM_SUBMIT_URL = 'https://formsubmit.co/ajax/';

export async function submitLeadForm(data) {
  try {
    const payload = {
      _subject: '培训管理AI诊断 - 新留资',
      _email: LEAD_EMAIL,
      _template: 'table',
      name: data.name,
      company: data.company,
      phone: data.phone,
      _honey: '',
      _captcha: false
    };
    const response = await fetch(FORM_SUBMIT_URL + LEAD_EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    return response.ok;
  } catch (error) {
    console.error('Form submit error:', error);
    return false;
  }
}