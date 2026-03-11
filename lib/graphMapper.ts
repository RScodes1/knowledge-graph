import { Node, Edge, Position } from "reactflow"
import { GraphNode, GraphEdge } from "@/types/graph"

export function graphNodesToRF(nodes: GraphNode[]): Node[] {
  return nodes.map((n) => ({
    id: n.id,
    data: {
      label: n.title,
      title: n.title,
      note: n.note
    },
    position: { x: 0, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  }))
}

export function graphEdgesToRF(edges: GraphEdge[]): Edge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label
  }))
}