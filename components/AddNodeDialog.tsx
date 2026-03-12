"use client"

import { useState } from "react"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
export default function AddNodeDialog({ onAdd }: any) {
  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")
  const [open, setOpen] = useState(false);
  const handleSubmit = () => {
    if (!title) return

    onAdd(title, note)

    setTitle("")
    setNote("")
  }

  return (
   <div className="absolute left-4 top-14 p-4 rounded-xl">
      <Button className="text-2xl p-3" onClick={() => setOpen(true)}>Add Node</Button>
          
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add Node</h3>

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

        <Button className="mt-4 w-full" onClick={handleSubmit}>
          Add Node
        </Button>
      </DialogContent>
    </Dialog>
    </div>
  )
}