const YOMITAN_API_URL = 'http://127.0.0.1:19633'

class YomitanError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'YomitanError'
  }
}

interface TokenizeResponse {
    content: Token[][]
}

interface Word {
    tokens: Token[]
}

interface Token {
    text: string,
    reading?: string
}

export async function tokenize(text: string, scanLength: number): Promise<Word[]> {
    let response: Response
    try {
        response = await fetch(YOMITAN_API_URL+"/tokenize", {
            method: 'POST',
            body: JSON.stringify({
                text,
                scanLength,
                parser: 'scanning-parser',
            }),
        })
    } catch(err) {
        const message = err instanceof Error ? err.message : String(err)
        throw new YomitanError(`[tokenize] Network error: ${message}`)
    }

    if (!response.ok) {
        throw new YomitanError(`[tokenize] HTTP ${response.status}: ${response.statusText}`)
    }
    let data: TokenizeResponse[]
    try {
        data = (await response.json()) as TokenizeResponse[]
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        throw new YomitanError(`[tokenize] Failed to parse response: ${message}`)
    }

    return data[0]?.content.map(tokens => ({tokens})) ?? []
}

interface DictEntry {
    glossary: HTMLElement
    expression: string
    conjugation: string
}

interface AnkiFieldsResponse {
    fields: DictEntry[]
}

export async function definitions(text: string): Promise<DictEntry[]> {
    let response: Response
    try {
        response = await fetch(YOMITAN_API_URL+"/ankiFields", {
            method: 'POST',
            body: JSON.stringify({
                text,
                type: 'term',
                markers: ['glossary', 'expression', 'conjugation'],
                includeMedia: false,
            }),
        })
    } catch(err) {
        const message = err instanceof Error ? err.message : String(err)
        throw new YomitanError(`[definitions] Network error: ${message}`)
    }

    if (!response.ok) {
        throw new YomitanError(`[definitions] HTTP ${response.status}: ${response.statusText}`)
    }
    let data: AnkiFieldsResponse
    try {
        data = (await response.json()) as AnkiFieldsResponse
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        throw new YomitanError(`[tokenize] Failed to parse response: ${message}`)
    }

    return data.fields
}
