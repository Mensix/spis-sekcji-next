import type { Timestamp } from 'firebase/firestore'

export interface Groups {
  groups: Group[]
  updateDate: string | Timestamp
}

export interface Group {
  category?: string[]
  keywords?: string[]
  link: string
  name: string
  isSection?: boolean
}
