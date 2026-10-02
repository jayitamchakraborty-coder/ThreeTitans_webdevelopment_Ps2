const { GoogleGenerativeAI } = require('@google/generative-ai');

async function parseUnstructuredContent(rawText) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY;

  if (apiKey && apiKey !== 'your_key' && apiKey.trim().length > 10) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are an AI assistant for Vicinus, a hyperlocal community information hub.
Your task is to extract structured post information from this raw community announcement, WhatsApp forward, notice, or event flyer.

Allowed categories:
- internships
- scholarships
- events
- lost_found
- emergencies
- local_issues
- announcements

Allowed types:
- NOTICE
- EVENT
- UPDATE
- LOST_FOUND
- EMERGENCY
- QUESTION

Extract the information and respond ONLY with a raw JSON object matching this schema:
{
  "title": "Concise title",
  "category": "one of the allowed categories",
  "type": "one of the allowed types",
  "location": "Specific venue or address",
  "date": "YYYY-MM-DD or readable date",
  "time": "HH:MM AM/PM",
  "validUntil": "ISO Date string or empty",
  "description": "Clean summary",
  "link": "URL",
  "contact": "Contact info if any"
}

Raw text to analyze:
"${rawText}"`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('[Gemini AI] Call failed:', err.message);
    }
  }

  // Fallback
  return fallbackRuleBasedParser(rawText);
}

function fallbackRuleBasedParser(text) {
  return {
    title: text.substring(0, 50) + '...',
    category: 'announcements',
    type: 'NOTICE',
    location: 'Vicinus Community',
    date: '2026-10-02',
    time: '10:00 AM',
    validUntil: '',
    description: text,
    link: '',
    contact: ''
  };
}

async function moderateContentAI(information) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY;
  if (!apiKey || apiKey.length < 10 || apiKey === 'your_key') {
      return {
          flagged: true,
          reason: "Fallback: Requires manual moderator review",
          recommendation: "Manual review required"
      };
  }
  
  try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `You are an AI moderator assistant for Vicinus.
Review the following piece of community information and its reports.

Title: ${information.title}
Description: ${information.description}
Category: ${information.category}
Location: ${information.location}
Reports: ${JSON.stringify(information.reports.map(r => r.reason))}

Respond ONLY with a JSON object:
{
  "flagged": boolean,
  "reason": "short explanation of why it might be misleading, spam, or okay",
  "recommendation": "Moderator review required | Approve | Reject"
}`;

      const result = await model.generateContent(prompt);
      const cleanJson = result.response.text().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      return JSON.parse(cleanJson);
  } catch(e) {
      return {
          flagged: true,
          reason: "AI Error: Requires manual moderator review",
          recommendation: "Manual review required"
      };
  }
}

module.exports = {
  parseUnstructuredContent,
  moderateContentAI
};
