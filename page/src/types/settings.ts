export interface MediaSettings {
  audioOffsetStart: number
  audioOffsetEnd: number
  imageFormat: 'webp' | 'jpeg' | 'avif'
  imageQuality: number
  imageAnimated: boolean
  audioFormat: 'opus' | 'mp3'
  audioQuality: number
  audioFilters: string
  imageSize: string
  imageAdvanced: boolean
  imageAdvancedArgs: string
  imageAdvancedExtension: string
  audioAdvanced: boolean
  audioAdvancedArgs: string
  audioAdvancedExtension: string
}

export interface AnkiSettings {
  deck: string
  noteType: string
  frontField: string
  definitionField: string
  sentenceField: string
  audioField: string
  wordAudioField: string
  wordReadingField: string
  imageField: string
  maxCardAgeMinutes: number
}

export interface ConnectionSettings {
  host: string
  ports: number[]
}

export interface YomitanSettings {
  enabled: boolean
}

export interface Settings {
  anki: AnkiSettings
  connection: ConnectionSettings
  media: MediaSettings
  yomitan: YomitanSettings
}

