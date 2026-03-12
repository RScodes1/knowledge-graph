"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Node } from "reactflow"
import { Button } from "@base-ui/react"

type Props = {
  node: Node | null
  onUpdate: (id: string, title: string, note: string) => void
  onClose: () => void
}

export default function NodeSidebar({ node, onUpdate, onClose }: Props) {
  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")

  useEffect(() => {
    if (node) {
      setTitle(node.data.title || "")
      setNote(node.data.note || "")
    }
  }, [node])

  if (!node) return null

  return (
    <div className="absolute right-0 top-14 h-[calc(100%-56px)] w-80 border-l border-slate-800 bg-slate-900/90 backdrop-blur p-5">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Node Details</h2>

        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          ✕
        </button>
      </div>

      <label className="text-sm text-white">Title</label>
      <Input
        value={title}
        className="text-white"
        onChange={(e) => {
          setTitle(e.target.value)
          onUpdate(node.id, e.target.value, note)
        }}
      />

      <label className="text-sm mt-4 block text-white">Note</label>
      <Textarea
        value={note}
        className="text-white"
        onChange={(e) => {
          setNote(e.target.value)
          onUpdate(node.id, title, e.target.value)
        }}
      />
      <Button onClick={onClose} className="text-white text-sm bg-gray-800 rounded p-2 mt-4 border">
           Update
      </Button>
    </div>
  )
}