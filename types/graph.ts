export type GraphNode = {
  id: string
  title: string
  note?: string
  position: {
    x: number
    y: number
  }
}

export type GraphEdge = {
  id: string
  source: string
  target: string
  label: string
}

export type GraphState = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}