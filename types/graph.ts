export type GraphNode = {
  id: string
  title: string
  note?: string
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