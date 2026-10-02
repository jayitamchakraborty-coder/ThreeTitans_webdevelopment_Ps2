const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Parses unstructured announcements/flyers/notes into structured LocalLoop post fields.
 * Includes graceful heuristic extraction fallback if GEMINI_API_KEY is not configured.
 */
async function parseUnstructuredContent(rawText) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Check if API key is provided and not the initial placeholder
  if (apiKey && apiKey !== 'your_key' && apiKey.trim().length > 10) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are an AI assistant for LocalLoop, a hyperlocal community information hub.
Your task is to extract structured post information from this raw community announcement, WhatsApp forward, notice, or event flyer.

Allowed categories:
- internship
- events
- announcements
- emergencies
- infrastructure
- lost_found
- scholarships
- local-issues

Extract the information and respond ONLY with a raw JSON object (no markdown fences, no backticks, no explanatory text) matching this schema:
{
  "title": "Concise, descriptive title (under 80 chars)",
  "category": "one of the allowed categories above (default to 'announcements' if unsure)",
  "location": "Specific venue or street address (e.g. Auditorium 2, DBIT Campus, Kurla West)",
  "locality": "Neighborhood/area name (e.g. DBIT/Kurla, Bandra West, Andheri East, Powai Central)",
  "date": "YYYY-MM-DD or readable date string if mentioned, else empty string",
  "time": "HH:MM AM/PM or readable time string if mentioned, else empty string",
  "validUntil": "ISO Date string or empty string",
  "description": "Clean, well-formatted summary of the announcement",
  "link": "Any URL found in text, else empty string",
  "suggestedUrgency": "low | medium | high"
}

Raw text to analyze:
"${rawText}"`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      
      // Remove any potential markdown block markers if returned
      const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('[Gemini AI] Call failed, falling back to rule-based parser:', err.message);
    }
  }

  // Graceful rule-based heuristic fallback (ensures UI always works even before key setup)
  return fallbackRuleBasedParser(rawText);
}

function fallbackRuleBasedParser(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || 'Community Notice';
  const title = firstLine.length > 80 ? firstLine.substring(0, 77) + '...' : firstLine;

  // Infer category
  const lower = text.toLowerCase();
  let category = 'announcements';
  if (lower.includes('intern') || lower.includes('stipend') || lower.includes('hiring') || lower.includes('job')) {
    category = 'internship';
  } else if (lower.includes('emergency') || lower.includes('urgent') || lower.includes('alert') || lower.includes('watercut')) {
    category = 'emergencies';
  } else if (lower.includes('event') || lower.includes('workshop') || lower.includes('webinar') || lower.includes('fest')) {
    category = 'events';
  } else if (lower.includes('lost') || lower.includes('found') || lower.includes('missing')) {
    category = 'lost_found';
  } else if (lower.includes('road') || lower.includes('pipe') || lower.includes('power') || lower.includes('metro') || lower.includes('repair')) {
    category = 'infrastructure';
  } else if (lower.includes('scholarship') || lower.includes('grant') || lower.includes('fee waiver')) {
    category = 'scholarships';
  } else if (lower.includes('garbage') || lower.includes('pothole') || lower.includes('streetlight') || lower.includes('complaint')) {
    category = 'local-issues';
  }

  // Extract link if any
  const linkMatch = text.match(/(https?:\/\/[^\s]+)/i);
  const link = linkMatch ? linkMatch[0] : '';

  // Extract location cues
  let location = '';
  let locality = 'DBIT/Kurla';
  if (lower.includes('bandra')) locality = 'Bandra West';
  else if (lower.includes('andheri')) locality = 'Andheri East';
  else if (lower.includes('powai')) locality = 'Powai Central';
  else if (lower.includes('kurla') || lower.includes('dbit')) locality = 'DBIT/Kurla';

  const venueMatch = text.match(/(?:at|venue|location|room|hall|auditorium)[\s:]+([^\n,.]+)/i);
  if (venueMatch) {
    location = venueMatch[1].trim();
  }

  // Extract time cues
  const timeMatch = text.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM))/);
  const time = timeMatch ? timeMatch[1] : '';

  return {
    title,
    category,
    location: location || `${locality} Community Space`,
    locality,
    date: new Date().toISOString().split('T')[0],
    time: time || '10:00 AM',
    validUntil: '',
    description: text,
    link,
    suggestedUrgency: category === 'emergencies' ? 'high' : 'medium'
  };
}

module.exports = {
  parseUnstructuredContent
};
