"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Node } from "reactflow"

type Props = {
  node: Node | null
  onUpdate: (id: string, title: string, note: string) => void
}

export default function NodeSidebar({ node, onUpdate }: Props) {
  if (!node) return null

  const { title, note } = node.data

  return (
    <div className="absolute right-0 top-0 h-full w-80 border-l bg-white p-4">
      <h2 className="text-lg font-semibold mb-4">Node Details</h2>

      <label className="text-sm">Title</label>
      <Input
        value={title}
        onChange={(e) =>
          onUpdate(node.id, e.target.value, note ?? "")
        }
      />

      <label className="text-sm mt-4 block">Note</label>
      <Textarea
        value={note ?? ""}
        onChange={(e) =>
          onUpdate(node.id, title, e.target.value)
        }
      />
    </div>
  )
}