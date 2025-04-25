"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileJson } from "lucide-react"
import type { Node, Edge } from "reactflow"
import type { Workflow, WorkflowNode } from "@/types/workflow"

interface WorkflowJsonViewerProps {
  nodes: Node[]
  edges: Edge[]
}

export function WorkflowJsonViewer({ nodes, edges }: WorkflowJsonViewerProps) {
  const [open, setOpen] = useState(false)

  const convertToWorkflow = (): Workflow => {
    // Convert ReactFlow nodes to Workflow nodes
    const workflowNodes: WorkflowNode[] = nodes.map((node) => ({
      nodeId: node.id,
      name: node.data.label || "",
      nodeType: node.type as any,
      position: { x: node.position.x, y: node.position.y },
      data: {
        ...node.data,
        label: undefined, // Remove label as it's moved to the name field
      },
    }))

    // Convert ReactFlow edges to Workflow edges
    const workflowEdges = edges.map((edge) => ({
      source: edge.source,
      sourceHandle: edge.sourceHandle || undefined,
      target: edge.target,
      targetHandle: edge.targetHandle || undefined,
    }))

    return {
      nodes: workflowNodes,
      edges: workflowEdges,
    }
  }

  const workflowJson = JSON.stringify(convertToWorkflow(), null, 2)

  const handleOpenDialog = () => {
    setOpen(true)
  }

  return (
    <>
      <Button
        variant="outline"
        className="absolute top-4 right-4 z-10 bg-white shadow-sm border-slate-200 hover:bg-slate-50 text-slate-700"
        onClick={handleOpenDialog}
      >
        <FileJson className="h-4 w-4 mr-2" />
        JSON预览
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>工作流配置JSON</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] rounded-md border border-slate-200 p-4 bg-slate-50">
            <pre className="text-xs font-mono text-slate-800">{workflowJson}</pre>
          </ScrollArea>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(workflowJson)
              }}
            >
              复制JSON
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              关闭
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
