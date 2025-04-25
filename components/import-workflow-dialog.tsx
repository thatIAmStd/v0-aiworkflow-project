"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type { Workflow } from "@/types/workflow"

interface ImportWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (workflow: Workflow) => void
}

export function ImportWorkflowDialog({ open, onOpenChange, onImport }: ImportWorkflowDialogProps) {
  const [jsonInput, setJsonInput] = useState("")

  const handleImport = () => {
    try {
      const workflow = JSON.parse(jsonInput) as Workflow

      // 简单验证
      if (!workflow.nodes || !Array.isArray(workflow.nodes) || !workflow.edges || !Array.isArray(workflow.edges)) {
        throw new Error("无效的工作流JSON格式")
      }

      onImport(workflow)
      onOpenChange(false)
      setJsonInput("")
      toast({
        title: "导入成功",
        description: `成功导入工作流，包含 ${workflow.nodes.length} 个节点和 ${workflow.edges.length} 个连接`,
      })
    } catch (error) {
      toast({
        title: "导入失败",
        description: error instanceof Error ? error.message : "无效的JSON格式",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>导入工作流</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="粘贴工作流JSON配置..."
            className="min-h-[300px] font-mono text-sm"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleImport}>导入</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
