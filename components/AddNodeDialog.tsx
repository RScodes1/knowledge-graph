"use client"

import { useState } from "react"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

export default function AddNodeDialog({ onAdd }: any) {
  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")

  const handleSubmit = () => {
    if (!title) return

    onAdd(title, note)

    setTitle("")
    setNote("")
  }

  return (
    <div className="absolute left-4 top-4 bg-white p-4 shadow rounded w-64">
      <h3 className="font-semibold mb-2">Add Node</h3>

      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Textarea
        placeholder="Note"
        className="mt-2"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <Button className="mt-2 w-full" onClick={handleSubmit}>
        Add Node
      </Button>
    </div>
  )
}