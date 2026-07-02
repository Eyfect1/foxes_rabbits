export interface WorklogImage {
  id: string
  name: string
  dataUrl: string
  addedAt: string
}

export interface WorklogCheckpoint {
  id: string
  title: string
  content: string
  images: WorklogImage[]
  createdAt: string
  order: number
}

export interface WorklogState {
  checkpoints: WorklogCheckpoint[]
}
