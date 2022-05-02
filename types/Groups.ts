export interface Groups {
  groups: Group[]
  lastUpdateDate: string
  name: string
}

export interface Group {
  category?: string[]
  keywords?: string[]
  link: string
  members: number
  name: string
  isSection?: boolean
}
