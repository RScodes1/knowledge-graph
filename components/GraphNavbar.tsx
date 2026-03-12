import { useState } from "react"
import { HelpCircle } from "lucide-react"

export default function GraphNavbar({ nodeCount, edgeCount }) {

     const [helpOpen, setHelpOpen] = useState(false)

  return (
    <div className="absolute top-0 text-white  left-0 w-full h-14 border-b bg-background/40 backdrop-blur flex items-center justify-between px-6 z-10">

      <div className="font-semibold text-lg">
        Knowledge Graph
      </div>

         <button
            onClick={() => setHelpOpen(true)}
            className="p-3 rounded text-white hover:bg-white hover:text-black transition"
            >
           <HelpCircle size={20} />
            </button>
       
{helpOpen && (
  <div className="fixed inset-0 bg-black/40 top-50 flex items-center justify-center z-[1000]">

    <div className="bg-slate-900 text-white w-[500px] rounded-xl p-6 shadow-lg">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Graph Guide</h2>

        <button
          onClick={() => setHelpOpen(false)}
          className="text-slate-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <ul className="space-y-3 text-sm text-slate-300">

        <li>• Click a node to edit its title and notes.</li>

        <li>• Drag nodes to rearrange the graph layout.</li>

        <li>• Connect nodes by dragging from one node handle to another.</li>

        <li>• Select a node and press <b>Delete</b> to remove it.</li>

        <li>• Use the <b>Undo</b> button to restore deleted nodes.</li>

        <li>• Use the minimap to quickly navigate large graphs.</li>

      </ul>

    </div>

  </div>
)}

      <div className="flex gap-6 text-sm text-muted-foreground">
        <span>Nodes: {nodeCount}</span>
        <span>Edges: {edgeCount}</span>
      </div>

    </div>
  )
}