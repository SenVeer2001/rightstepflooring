export interface KanbanItemBase {
  id: string
  status: string
}

export interface KanbanColumn {
  id: string
  title: string
  description?: string
  headerClass?: string
}

export interface KanbanTheme {
  boardBg?: string
}

export interface Job extends KanbanItemBase {
  id: string
  jobNumber?: string
  clientName?:string
  jobType?:string
  totalPrice?: number
}

