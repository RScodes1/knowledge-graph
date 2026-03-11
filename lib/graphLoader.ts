import { Node, Edge } from "reactflow"
import { parseCSV } from "./csvParser"
import { getLayoutedElements } from "./layout"

type RawNode = {
  id: string
  title: string
  note?: string
}

type RawEdge = {
  source: string
  target: string
  label: string
}

export async function loadGraphFromCSV(): Promise<{
  nodes: Node[]
  edges: Edge[]
}> {
  const nodesRes = await fetch("/nodes.csv")
  const edgesRes = await fetch("/edges.csv")

  const nodesText = await nodesRes.text()
  const edgesText = await edgesRes.text()

  const parsedNodes = parseCSV<RawNode>(nodesText)
  const parsedEdges = parseCSV<RawEdge>(edgesText)

  const rfNodes: Node[] = parsedNodes.map((n) => ({
    id: n.id,
    data: {
      label: n.title,
      title: n.title,
      note: n.note
    },
    position: { x: 0, y: 0 }
  }))

  const rfEdges: Edge[] = parsedEdges.map((e, index) => ({
    id: `${e.source}-${e.target}-${index}`,
    source: e.source,
    target: e.target,
    label: e.label
  }))

  return getLayoutedElements(rfNodes, rfEdges)
}