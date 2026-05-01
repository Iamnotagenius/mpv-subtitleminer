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

export interface WordCardSettings {
  deck: string
  noteType: string
  frontField: string
  definitionField: string
  sentenceField: string
  secondaryField: string
  audioField: string
  wordAudioField: string
  wordReadingField: string
  imageField: string
  maxCardAgeMinutes: number
  tags: string[]
}

export interface SentenceCardSettings {
  deck: string
  noteType: string
  primaryField: string
  secondaryField: string
  audioField: string
  imageField: string
  metadataField: string
  tags: string[]
}

export interface AnkiSettings {
  word: WordCardSettings
  sentence: SentenceCardSettings
}

export interface ConnectionSettings {
  host: string
  ports: number[]
}

export interface DisplaySettings {
  subtitleFontSize: number
  secondaryFontSize: number
  mediaFilenameRegex: string
  mediaFilenameRegexEnabled: boolean
  sentenceCleanRegex: string
  sentenceCleanRegexEnabled: boolean
  secondaryCleanRegex: string
  secondaryCleanRegexEnabled: boolean
  showSecondaryColumn: boolean
  timelineZoom: number
  primaryColumnFraction: number
}

export interface YomitanSettings {
  enabled: boolean
  scanLength: number
  maxEntries: number
}

export interface Settings {
  anki: AnkiSettings
  connection: ConnectionSettings
  media: MediaSettings
  display: DisplaySettings
  yomitan: YomitanSettings
}

