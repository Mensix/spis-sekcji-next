import type { Timestamp } from 'firebase/firestore'

export interface Groups {
  groups: Group[]
  updateDate: string | Timestamp
}

export interface Group {
  category?: string[]
  index?: number
  isSection?: boolean
  keywords?: string[]
  link: string
  name: string
  members: number
}
