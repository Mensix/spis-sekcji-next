import type { Timestamp } from 'firebase/firestore'

export interface Groups {
  groups: Group[]
  updateDate: string | Timestamp
}

export interface Group {
  link: string
  name: string
  members: number
  alias: string
}
