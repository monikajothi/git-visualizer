// claudeExtract.js — sends PDF pages to Claude API, gets structured notes back

const SYSTEM_PROMPT = `You are an expert at reading handwritten student notes about Git version control.
You will receive images of handwritten notebook pages. Extract ALL content carefully — commands, explanations, flags, use cases, tips, diagrams described in text.

Return ONLY a valid JSON object (no markdown, no backticks, no preamble) with this exact structure:
{
  "title": "Section title from notes",
  "summary": "One sentence summary of what this section covers",
  "concepts": [
    { "term": "concept name", "definition": "clear explanation", "tag": "core|command|tip|flag" }
  ],
  "commands": [
    { "cmd": "git command here", "desc": "what it does", "flags": [{"flag": "--name", "desc": "what it does"}] }
  ],
  "keyPoints": [
    "Important bullet point extracted from notes"
  ],
  "useCases": [
    "When to use this"
  ],
  "bestPractices": [
    "Best practice tip from notes"
  ],
  "warnings": [
    "Any caution or warning mentioned"
  ]
}

Be thorough. Extract every command, flag, and concept you can read. If handwriting is unclear, make your best interpretation.`

export async function extractNotesFromPDF(pdfFile, onProgress) {
  // Convert PDF file to base64
  onProgress?.('Reading PDF file...')
  const base64 = await fileToBase64(pdfFile)

  // Get page count estimate from file size (rough: 1 page ≈ 200KB for scanned handwriting)
  const estimatedPages = Math.max(1, Math.min(10, Math.ceil(pdfFile.size / 150000)))
  onProgress?.(`Sending ${estimatedPages} page(s) to Claude AI...`)

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: base64,
                },
              },
              {
                type: 'text',
                text: 'Please extract all Git notes from these handwritten pages. Return only the JSON structure as specified.',
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err?.error?.message || `API error ${response.status}`)
    }

    onProgress?.('Processing extracted content...')
    const data = await response.json()
    const raw = data.content?.map(b => b.text || '').join('')

    // Strip any markdown fences if model added them
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
    const parsed = JSON.parse(cleaned)
    onProgress?.('Done!')
    return { success: true, data: parsed }

  } catch (err) {
    console.error('Extraction error:', err)
    return { success: false, error: err.message }
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
