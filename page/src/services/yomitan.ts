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

interface Token {
    text: string,
    reading?: string
}

export async function tokenize(text: string, scanLength: number): Promise<Token[]> {
    let response: Response
    try {
        response = await fetch(YOMITAN_API_URL+"/tokenize", {
            method: 'POST',
            body: JSON.stringify({text, scanLength, parser: 'scanning-parser'}),
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

    return data[0]?.content.flat().filter(t => t.text) ?? []
}
