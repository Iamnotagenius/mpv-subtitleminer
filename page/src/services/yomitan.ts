const YOMITAN_API_URL = 'http://127.0.0.1:19633'

class YomitanError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'YomitanError'
  }
}

export interface TokenizeResponse {
    content: Token[][]
}

export interface Word {
    tokens: Token[]
}

export interface Token {
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
    const response = await request<TokenizeResponse[]>('tokenize', {
        text,
        scanLength,
        parser: 'scanning-parser',
    })

    return response[0]?.content.map(tokens => ({tokens})) ?? []
}

export interface DictEntry {
    glossary: string
    reading: string
    expression: string
    conjugation: string
}

export interface AnkiFieldsResponse {
    fields: DictEntry[]
}

export async function definitions(text: string, maxEntries: number): Promise<DictEntry[]> {
    const response = await request<AnkiFieldsResponse>('ankiFields', {
        text,
        type: 'term',
        markers: ['glossary', 'reading', 'expression', 'conjugation'],
        maxEntries,
        includeMedia: false,
    })

    return response.fields
}

export interface AudioEntry {
  audio: string
}

export interface AudioMedia {
    content: string
    ankiFilename: string
}

export interface AudioFieldResponse {
  fields: AudioEntry[]
  audioMedia: AudioMedia[]
}

export interface WordAudio {
    field: string
    filename: string
    content: string
}

export async function audio(text: string): Promise<WordAudio | null> {
    const response = await request<AudioFieldResponse>('ankiFields', {
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


export interface ServerVersionResponse {
    version: number
}

export async function getServerVersion(): Promise<number> {
    const response = await request<ServerVersionResponse>('serverVersion')

    return response.version
}

export interface YomitanVersionResponse {
    version: string
}

export async function getYomitanVersion(): Promise<string> {
    const response = await request<YomitanVersionResponse>('yomitanVersion')

    return response.version
}
