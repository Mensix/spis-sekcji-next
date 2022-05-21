export interface Groups {
  groups: Group[]
  favouriteGroups?: Record<string, string>
  lastUpdateDate: string
  name: string
}

export interface Group {
  index?: number
  category?: string[] | null
  keywords?: string[]
  link: string
  members?: number
  name: string
  isFavourite?: boolean
  isSection?: boolean
}
