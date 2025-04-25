"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import type { NodeType, Workflow } from "@/types/workflow"
import { FileOutput, GitBranch, Play, MessageSquare, BookOpen, Code, Server, Search, Plus } from "lucide-react"
import { ImportWorkflowDialog } from "./import-workflow-dialog"
import { toast } from "@/components/ui/use-toast"

interface SidebarProps {
  onSelectNode: (node: NodeType) => void
  onImportWorkflow?: (workflow: Workflow) => void
}

interface NodeTypeInfo {
  type: NodeType
  icon: React.ReactNode
  label: string
  category: "input" | "process" | "output" | "logic"
}

const nodeTypes: NodeTypeInfo[] = [
  {
    type: "flow_start",
    icon: <Play className="mr-2 h-4 w-4" />,
    label: "开始节点",
    category: "input",
  },
  {
    type: "ai_chat",
    icon: <MessageSquare className="mr-2 h-4 w-4" />,
    label: "AI模型",
    category: "process",
  },
  {
    type: "knowledge_search",
    icon: <BookOpen className="mr-2 h-4 w-4" />,
    label: "知识库搜索",
    category: "process",
  },
  {
    type: "intent_matching",
    icon: <Search className="mr-2 h-4 w-4" />,
    label: "意图匹配",
    category: "process",
  },
  {
    type: "if_else",
    icon: <GitBranch className="mr-2 h-4 w-4" />,
    label: "条件判断",
    category: "logic",
  },
  {
    type: "code_execution",
    icon: <Code className="mr-2 h-4 w-4" />,
    label: "代码执行",
    category: "process",
  },
  {
    type: "service_call",
    icon: <Server className="mr-2 h-4 w-4" />,
    label: "服务调用",
    category: "process",
  },
  {
    type: "flow_end",
    icon: <FileOutput className="mr-2 h-4 w-4" />,
    label: "结束节点",
    category: "output",
  },
]

export function Sidebar({ onSelectNode, onImportWorkflow }: SidebarProps) {
  // Get the current nodes from the workflow editor
  const [hasStartNode, setHasStartNode] = useState(true) // Default to true since we have a default start node
  const [importDialogOpen, setImportDialogOpen] = useState(false)

  // Update this state when nodes change
  useEffect(() => {
    // This is a simplified approach - in a real app, you'd use a context or state management
    const checkForStartNode = () => {
      const startNodeExists = document.querySelector('[data-id^="flow_start-"]') !== null
      setHasStartNode(startNodeExists)
    }

    // Check initially and set up a mutation observer to detect changes
    checkForStartNode()

    const observer = new MutationObserver(checkForStartNode)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  const handleDragStart = (event: React.DragEvent<HTMLButtonElement>, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  const handleNewWorkflow = () => {
    toast({
      title: "功能待实现",
      description: "新建工作流功能正在开发中",
    })
  }

  const handleImportWorkflow = (workflow: Workflow) => {
    if (onImportWorkflow) {
      onImportWorkflow(workflow)
    }
  }

  // Group nodes by category
  const inputNodes = nodeTypes.filter((node) => node.category === "input")
  const processNodes = nodeTypes.filter((node) => node.category === "process")
  const logicNodes = nodeTypes.filter((node) => node.category === "logic")
  const outputNodes = nodeTypes.filter((node) => node.category === "output")

  return (
    <div className="w-64 border-r border-slate-200 bg-white shadow-sm flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-slate-800">工作流编辑器</h1>
        </div>
        <Button className="w-full justify-center gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleNewWorkflow}>
          <Plus className="h-4 w-4" />
          新建工作流
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">输入节点</h2>
          <div className="space-y-1">
            {inputNodes.map((node) => (
              <Button
                key={node.type}
                variant="ghost"
                className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                disabled={node.type === "flow_start" && hasStartNode}
                onClick={() => onSelectNode(node.type)}
                draggable
                onDragStart={(e) => handleDragStart(e, node.type)}
              >
                {node.icon}
                {node.label}
                {node.type === "flow_start" && hasStartNode && (
                  <span className="ml-auto text-xs text-slate-400">已存在</span>
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">处理节点</h2>
          <div className="space-y-1">
            {processNodes.map((node) => (
              <Button
                key={node.type}
                variant="ghost"
                className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                onClick={() => onSelectNode(node.type)}
                draggable
                onDragStart={(e) => handleDragStart(e, node.type)}
              >
                {node.icon}
                {node.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">逻辑节点</h2>
          <div className="space-y-1">
            {logicNodes.map((node) => (
              <Button
                key={node.type}
                variant="ghost"
                className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                onClick={() => onSelectNode(node.type)}
                draggable
                onDragStart={(e) => handleDragStart(e, node.type)}
              >
                {node.icon}
                {node.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">输出节点</h2>
          <div className="space-y-1">
            {outputNodes.map((node) => (
              <Button
                key={node.type}
                variant="ghost"
                className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                onClick={() => onSelectNode(node.type)}
                draggable
                onDragStart={(e) => handleDragStart(e, node.type)}
              >
                {node.icon}
                {node.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-slate-200">
        <Button
          variant="outline"
          className="w-full justify-center text-slate-600"
          onClick={() => setImportDialogOpen(true)}
        >
          导入工作流
        </Button>
      </div>

      <ImportWorkflowDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImportWorkflow}
      />
    </div>
  )
}
