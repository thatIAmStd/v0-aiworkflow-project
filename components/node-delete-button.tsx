"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useReactFlow } from "reactflow"

interface NodeDeleteButtonProps {
  id: string
}

export function NodeDeleteButton({ id }: NodeDeleteButtonProps) {
  const { deleteElements } = useReactFlow()

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation()
    deleteElements({ nodes: [{ id }] })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 h-6 w-6 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleDelete}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">删除节点</span>
    </Button>
  )
}
