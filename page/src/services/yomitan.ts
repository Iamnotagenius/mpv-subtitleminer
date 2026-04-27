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

async function request<T>(path: string, body: Object = {}): Promise<T> {
    let response: Response
    try {
        response = await fetch(`${YOMITAN_API_URL}/${path}`, {
            method: 'POST',
            body: JSON.stringify(body),
        })
    } catch(err) {
        const message = err instanceof Error ? err.message : String(err)
        throw new YomitanError(`[${path}] Network error: ${message}`)
    }

    if (!response.ok) {
        throw new YomitanError(`[${path}] HTTP ${response.status}: ${response.statusText}`)
    }
    let data: T
    try {
        data = (await response.json()) as T
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        throw new YomitanError(`[${path}] Failed to parse response: ${message}`)
    }

    return data
}

export async function tokenize(text: string, scanLength: number): Promise<Word[]> {
    let response = await request<TokenizeResponse[]>('tokenize', {
        text,
        scanLength,
        parser: 'scanning-parser',
    })

    return response[0]?.content.map(tokens => ({tokens})) ?? []
}

interface DictEntry {
    glossary: HTMLElement
    reading: string
    expression: string
    conjugation: string
}

interface AnkiFieldsResponse {
    fields: DictEntry[]
}

export async function definitions(text: string): Promise<DictEntry[]> {
    let response = await request<AnkiFieldsResponse>('ankiFields', {
        text,
        type: 'term',
        markers: ['glossary', 'reading', 'expression', 'conjugation'],
        includeMedia: false,
    })

    console.log(`[definitions]`, `Got ${response.fields.length} entries for ${text}`)
    return response.fields
}

interface AudioEntry {
  audio: string
}

interface AudioMedia {
    content: string
    ankiFilename: string
}

interface AudioFieldResponse {
  fields: AudioEntry[]
  audioMedia: AudioMedia[]
}

interface WordAudio {
    field: string
    filename: string
    content: string
}

export async function audio(text: string): Promise<WordAudio | null> {
    let response = await request<AudioFieldResponse>('ankiFields', {
        text,
        type: 'term',
        markers: ['audio'],
        maxEntries: 1,
        includeMedia: true,
    })

    if (!response.fields[0] || !response.audioMedia[0]) {
        return null
    }

    return {
        field: response.fields[0].audio,
        filename: response.audioMedia[0].ankiFilename,
        content: response.audioMedia[0].content,
    }
}


interface ServerVersionResponse {
    version: number
}

export async function getServerVersion(): Promise<number> {
    let response = await request<ServerVersionResponse>('serverVersion')

    return response.version
}

interface YomitanVersionResponse {
    version: string
}

export async function getYomitanVersion(): Promise<string> {
    let response = await request<YomitanVersionResponse>('yomitanVersion')

    return response.version
}
