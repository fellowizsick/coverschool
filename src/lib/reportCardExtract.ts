// @ts-nocheck
// Report-card OCR: sends the uploaded report-card image to Gemini vision
// and returns a clean structured object for the ID card back + dashboards.

export interface ExtractedReportCard {
  studentName?: string
  grade?: string
  term?: string
  schoolYear?: string
  subjects: { name: string; grade: string }[]
  gpa?: string
  attendance?: string
  comments?: string
  raw?: string
}

const GEMINI_MODEL = 'gemini-2.5-flash'

export async function extractReportCard(
  imageBase64: string,
  mimeType: string
): Promise<ExtractedReportCard | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not set — skipping report card extraction')
    return null
  }

  const prompt = `You are a report-card reader. Read this report card image carefully and return ONLY valid JSON with this exact shape:
{
  "studentName": "first and last name if visible",
  "grade": "grade level if visible",
  "term": "term/quarter/semester label if visible",
  "schoolYear": "school year if visible",
  "subjects": [{"name": "subject name", "grade": "letter grade or score exactly as shown"}],
  "gpa": "GPA if visible",
  "attendance": "attendance summary if visible (e.g. 45/45 days)",
  "comments": "teacher comment if visible"
}
Rules:
- Only include fields actually visible on the card. Empty string for missing fields, [] for no subjects.
- Do NOT invent grades, names, or numbers.
- Keep grade values exactly as printed (e.g. "A", "92", "B+").
- Return ONLY the JSON, no markdown fences, no extra text.`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType || 'image/jpeg',
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1500,
            responseMimeType: 'application/json',
          },
        }),
      }
    )

    if (!res.ok) {
      console.error('Gemini extraction error:', res.status, (await res.text()).slice(0, 300))
      return null
    }

    const data = await res.json()
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text || '')
        .join('') || ''

    if (!text) return null

    // Strip any markdown fences just in case
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return {
      studentName: parsed.studentName || '',
      grade: parsed.grade || '',
      term: parsed.term || '',
      schoolYear: parsed.schoolYear || '',
      subjects: Array.isArray(parsed.subjects) ? parsed.subjects : [],
      gpa: parsed.gpa || '',
      attendance: parsed.attendance || '',
      comments: parsed.comments || '',
      raw: clean,
    }
  } catch (err) {
    console.error('Report card extraction error:', err)
    return null
  }
}
