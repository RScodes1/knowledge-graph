"use client"

import { useEffect, useState } from "react"
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  addEdge,
  Position
} from "reactflow"
import "reactflow/dist/style.css"
import NodeSidebar from "./NodeSidebar"
import AddNodeDialog from "./AddNodeDialog"
import Papa from "papaparse"
import { getLayoutedElements } from "@/lib/layout"

export default function GraphCanvas() {
const [nodes, setNodes, onNodesChange] = useNodesState([])
const [edges, setEdges, onEdgesChange] = useEdgesState([])
const [selectedNode, setSelectedNode] = useState<Node | null>(null)
const [highlightedNodes, setHighlightedNodes] = useState<string[]>([])


const onNodeClick = (_: any, node: Node) => {
  setSelectedNode(node)

  const connected = edges
    .filter(
      (e) => e.source === node.id || e.target === node.id
    )
    .map((e) => (e.source === node.id ? e.target : e.source))

  setHighlightedNodes([node.id, ...connected])
}

const addNode = (title: string, note: string) => {
  const id = String(Date.now())

  const newNode = {
    id,
    position: { x: Math.random() * 400, y: Math.random() * 400 },
    data: {
      label: title,
      title,
      note
    },
   sourcePosition: Position.Right,
     targetPosition: Position.Left,
    style: {
      animation: "fadeIn 0.3s ease"
}
  }

  setNodes((nodes) => [...nodes, newNode])
}

const onEdgeClick = (_: any, edge: any) => {
  setEdges((edges) => edges.filter((e) => e.id !== edge.id))
}

const onConnect = (connection: any) => {
  const label = prompt("Enter relationship label")

  if (!label) return

  const newEdge = {
    ...connection,
    id: `${connection.source}-${connection.target}-${Date.now()}`,
    label,
  }

  setEdges((edges) => addEdge(newEdge, edges))
}

const updateNode = (id: string, title: string, note: string) => {
  setNodes((nds) =>
    nds.map((node) =>
      node.id === id
        ? {
            ...node,
            data: {
              ...node.data,
              label: title,
              title,
              note,
            },
          }
        : node
    )
  )
}

const onNodesDelete = (deleted: any[]) => {
  setEdges((edges) =>
    edges.filter(
      (edge) =>
        !deleted.some(
          (node) =>
            node.id === edge.source || node.id === edge.target
        )
    )
  )
}

const styledNodes = nodes.map((node) => ({
  ...node,
  style: highlightedNodes.includes(node.id)
    ? { border: "2px solid #2563eb", background: "#eff6ff" }
    : {}
}))

useEffect(() => {
  async function loadGraph() {

    const saved = localStorage.getItem("knowledge-graph")

    if (saved) {
      const parsed = JSON.parse(saved)

      setNodes(parsed.nodes)
      setEdges(parsed.edges)

      return
    }

    const nodesRes = await fetch("/nodes.csv")
    const edgesRes = await fetch("/edges.csv")

    const nodesText = await nodesRes.text()
    const edgesText = await edgesRes.text()

    const parsedNodes = Papa.parse(nodesText, { header: true }).data as any[]
    const parsedEdges = Papa.parse(edgesText, { header: true }).data as any[]

    const rfNodes: Node[] = parsedNodes.map((n) => ({
      id: n.id,
      data: {
        label: n.title,
        title: n.title,
        note: n.note
      },
      position: { x: 0, y: 0 },
    }))

    const rfEdges: Edge[] = parsedEdges.map((e, index) => ({
      id: `${e.source}-${e.target}-${index}`,
      source: e.source,
      target: e.target,
      label: e.label,
    }))

    const layouted = getLayoutedElements(rfNodes, rfEdges)

    setNodes(layouted.nodes)
    setEdges(layouted.edges)
}

  loadGraph()
}, [])

useEffect(() => {
  const graphState = {
    nodes,
    edges
  }

  localStorage.setItem(
    "knowledge-graph",
    JSON.stringify(graphState)
  )
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