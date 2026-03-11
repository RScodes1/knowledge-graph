import { GraphState } from "@/types/graph"

const STORAGE_KEY = "knowledge-graph"

export function saveGraph(state: GraphState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function loadGraph(): GraphState | null {
  const data = localStorage.getItem(STORAGE_KEY)

  if (!data) return null

  return JSON.parse(data)
}