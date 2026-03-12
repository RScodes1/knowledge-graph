"use client"

import { useEffect, useState } from "react"
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Node,
  addEdge,
  Position,
  MiniMap,
  Controls,
  Background
} from "reactflow"
import "reactflow/dist/style.css"

import NodeSidebar from "./NodeSidebar"
import AddNodeDialog from "./AddNodeDialog"

import { loadGraph } from "@/lib/storage"
import { saveGraph } from "@/lib/storage"
import { loadGraphFromCSV } from "@/lib/graphLoader"
import { graphNodesToRF, graphEdgesToRF, rfNodesToGraph, rfEdgesToGraph  } from "@/lib/graphMapper"
import GraphNavbar from "./GraphNavbar"

export default function GraphCanvas() {

const [nodes, setNodes, onNodesChange] = useNodesState([])
const [edges, setEdges, onEdgesChange] = useEdgesState([])

const [selectedNode, setSelectedNode] = useState<Node | null>(null)
const [highlightedNodes, setHighlightedNodes] = useState<string[]>([])
const [lastDeleted, setLastDeleted] = useState<{
        nodes: any[]
        edges: any[]
      } | null>(null)

const onNodeClick = (_: any, node: Node) => {
  setSelectedNode(node)

  const connected = edges
    .filter(e => e.source === node.id || e.target === node.id)
    .map(e => (e.source === node.id ? e.target : e.source))

  setHighlightedNodes([node.id, ...connected])
}

const closeSidebar = () => {
  setSelectedNode(null)
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
        label,
          style: {
        stroke: "#abc00a",
        strokeWidth: 2
      },
      labelStyle: {
        fill: "#a723a0",
        fontWeight: 500
      }
      },
      
      edges
    )
  )
}

const onEdgeClick = (_: any, edge: any) => {
  setEdges(edges => edges.filter(e => e.id !== edge.id))
}

const onNodesDelete = (deleted: any[]) => {

   console.log("deleted nodes:", deleted)
  const connectedEdges = edges.filter(edge =>
    deleted.some(
      node => node.id === edge.source || node.id === edge.target
    )
  )

  setLastDeleted({
    nodes: deleted,
    edges: connectedEdges
  })

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

const undoDelete = () => {
   console.log("undodeleted nodes:")
  if (!lastDeleted) return

  setNodes(nodes => [...nodes, ...lastDeleted.nodes])
  setEdges(edges => [...edges, ...lastDeleted.edges])

  setLastDeleted(null)
}
const styledNodes = nodes.map(node => ({
  ...node,
  style: {
  padding: "8px 14px",
  borderRadius: "10px",
  border: highlightedNodes.includes(node.id)
    ? "2px solid #60a5fa"
    : "1px solid rgba(255,255,255,0.1)",
  background: highlightedNodes.includes(node.id)
    ? "linear-gradient(135deg,#1e40af,#3b82f6)"
    : "rgba(30,41,59,0.8)",
  color: "white",
  backdropFilter: "blur(6px)",
  boxShadow: highlightedNodes.includes(node.id)
    ? "0 0 18px rgba(59,130,246,0.6)"
    : "0 4px 12px rgba(0,0,0,0.3)"
}
}))

const styledEdges = edges.map(edge => ({
  ...edge,
  style: {
    stroke: highlightedNodes.includes(edge.source)
      ? "#60a5fa"
      : "#334155",
    strokeWidth: highlightedNodes.includes(edge.source) ? 2.5 : 1
  }
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
   saveGraph({  nodes: rfNodesToGraph(nodes), edges: rfEdgesToGraph(edges) })
  
}, [nodes, edges])

return (
<div className="w-full pt-14 h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black">
  <GraphNavbar
  nodeCount={nodes.length}
  edgeCount={edges.length}
/>
<ReactFlow
  nodes={styledNodes}
  edges={styledEdges}
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
>

 {lastDeleted && (
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow flex items-center gap-4">

    Node deleted

    <button
      onClick={undoDelete}
      className="underline text-blue-400"
    >
      Undo
    </button>

  </div>
)}

  <MiniMap
     nodeColor={() => "#3b82f6"}
  maskColor="rgba(15,23,42,0.7)"
  style={{ borderRadius: 8 }}
  />

  <Controls />

  <Background
    gap={40}
    color="rgba(255,255,255,0.08)"
  />

</ReactFlow>
 {lastDeleted && (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow flex gap-4">
      Node deleted

      <button
        onClick={undoDelete}
        className="underline text-blue-400"
      >
        Undo
      </button>
    </div>
  )}
    <NodeSidebar node={selectedNode} onUpdate={updateNode} onClose={closeSidebar} />
    <AddNodeDialog onAdd={addNode} />

  </div>
)

}