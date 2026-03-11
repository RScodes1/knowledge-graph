"use client"

import { useEffect, useState } from "react"
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Node,
  addEdge,
  Position
} from "reactflow"
import "reactflow/dist/style.css"
 
import NodeSidebar from "./NodeSidebar"
import AddNodeDialog from "./AddNodeDialog"

import { loadGraph } from "@/lib/storage"
import { saveGraph } from "@/lib/storage"
import { loadGraphFromCSV } from "@/lib/graphLoader"
import { graphNodesToRF, graphEdgesToRF } from "@/lib/graphMapper"

export default function GraphCanvas() {

const [nodes, setNodes, onNodesChange] = useNodesState([])
const [edges, setEdges, onEdgesChange] = useEdgesState([])

const [selectedNode, setSelectedNode] = useState<Node | null>(null)
const [highlightedNodes, setHighlightedNodes] = useState<string[]>([])

const onNodeClick = (_: any, node: Node) => {
  setSelectedNode(node)

  const connected = edges
    .filter(e => e.source === node.id || e.target === node.id)
    .map(e => (e.source === node.id ? e.target : e.source))

  setHighlightedNodes([node.id, ...connected])
}

const addNode = (title: string, note: string) => {
  const id = String(Date.now())

  const newNode = {
    id,
    position: { x: Math.random() * 400, y: Math.random() * 400 },
    data: { label: title, title, note },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { animation: "fadeIn 0.3s ease" }
  }

  setNodes(nodes => [...nodes, newNode])
}

const onConnect = (connection: any) => {
  const label = prompt("Enter relationship label")
  if (!label) return

  setEdges(edges =>
    addEdge(
      {
        ...connection,
        id: `${connection.source}-${connection.target}-${Date.now()}`,
        label
      },
      edges
    )
  )
}

const onEdgeClick = (_: any, edge: any) => {
  setEdges(edges => edges.filter(e => e.id !== edge.id))
}

const onNodesDelete = (deleted: any[]) => {
  setEdges(edges =>
    edges.filter(
      edge =>
        !deleted.some(
          node => node.id === edge.source || node.id === edge.target
        )
    )
  )
}

const updateNode = (id: string, title: string, note: string) => {
  setNodes(nodes =>
    nodes.map(node =>
      node.id === id
        ? { ...node, data: { ...node.data, label: title, title, note } }
        : node
    )
  )
}

const styledNodes = nodes.map(node => ({
  ...node,
  style: highlightedNodes.includes(node.id)
    ? { border: "2px solid #2563eb", background: "#eff6ff" }
    : {}
}))

useEffect(() => {

  async function initGraph() {

    const saved = loadGraph()

    if (saved) {
      setNodes(graphNodesToRF(saved.nodes))
      setEdges(graphEdgesToRF(saved.edges))
      return
    }

    const graph = await loadGraphFromCSV()

    setNodes(graph.nodes)
    setEdges(graph.edges)
  }

  initGraph()

}, [])

useEffect(() => {
  saveGraph({ nodes, edges })
}, [nodes, edges])

return (
  <div style={{ width: "100%", height: "100vh" }}>

    <ReactFlow
      nodes={styledNodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onConnect={onConnect}
      onEdgeClick={onEdgeClick}
      onNodesDelete={onNodesDelete}
      nodesDraggable
      nodesConnectable
      elementsSelectable
      fitView
    />

    <NodeSidebar node={selectedNode} onUpdate={updateNode} />
    <AddNodeDialog onAdd={addNode} />

  </div>
)

}