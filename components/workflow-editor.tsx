"use client"

import type React from "react"

import { useCallback, useState, useEffect } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  useNodesState,
  useEdgesState,
  type NodeTypes,
  MarkerType,
  type EdgeTypes,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"
import type { NodeType, Workflow } from "@/types/workflow"
import { StartNode } from "./nodes/start-node"
import { AIChatNode } from "./nodes/ai-chat-node"
import { IfElseNode } from "./nodes/if-else-node"
import { EndNode } from "./nodes/end-node"
import { KnowledgeSearchNode } from "./nodes/knowledge-search-node"
import { IntentMatchingNode } from "./nodes/intent-matching-node"
import { CodeExecutionNode } from "./nodes/code-execution-node"
import { ServiceCallNode } from "./nodes/service-call-node"
import { WorkflowJsonViewer } from "./workflow-json-viewer"
import { CustomEdge } from "./custom-edge"
import { Button } from "@/components/ui/button"
import { Save, Play, ZoomIn, ZoomOut, Maximize } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface WorkflowEditorProps {
  selectedNode: NodeType | null
  initialWorkflow?: Workflow
}

// Define custom node types
const nodeTypes: NodeTypes = {
  flow_start: StartNode,
  ai_chat: AIChatNode,
  if_else: IfElseNode,
  flow_end: EndNode,
  knowledge_search: KnowledgeSearchNode,
  intent_matching: IntentMatchingNode,
  code_execution: CodeExecutionNode,
  service_call: ServiceCallNode,
}

// Define custom edge types
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

export function WorkflowEditor({ selectedNode, initialWorkflow }: WorkflowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  // Initialize with workflow data if provided
  useEffect(() => {
    if (initialWorkflow) {
      // Convert workflow nodes to ReactFlow nodes
      const rfNodes = initialWorkflow.nodes.map((node) => ({
        id: node.nodeId,
        type: node.nodeType,
        position: node.position,
        data: {
          label: node.name,
          ...node.data,
        },
      }))

      // Convert workflow edges to ReactFlow edges
      const rfEdges = initialWorkflow.edges.map((edge, index) => ({
        id: `e${index}`,
        source: edge.source,
        sourceHandle: edge.sourceHandle || edge.source_port_id || null,
        target: edge.target,
        targetHandle: edge.targetHandle || null,
        type: "custom",
        markerEnd: { type: MarkerType.ArrowClosed },
      }))

      setNodes(rfNodes)
      setEdges(rfEdges)
    } else {
      // Default start node if no workflow provided
      setNodes([
        {
          id: "start-1",
          type: "flow_start",
          position: { x: 100, y: 150 },
          data: {
            label: "开始节点",
            outputs: [
              { type: "string", name: "userId", desc: "用户ID" },
              { type: "string", name: "userName", desc: "用户名" },
            ],
          },
        },
      ])
    }
  }, [initialWorkflow, setNodes, setEdges])

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      // Add custom edge type and arrow marker to new connections
      const edge = {
        ...params,
        type: "custom",
        markerEnd: { type: MarkerType.ArrowClosed },
      }
      setEdges((eds) => addEdge(edge, eds))
    },
    [setEdges],
  )

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      if (!reactFlowInstance) return

      // Get the node type from the drag event
      const nodeType = event.dataTransfer.getData("application/reactflow") as NodeType

      if (!nodeType) {
        // If no node type in dataTransfer, use the selectedNode (for backward compatibility)
        if (!selectedNode) return

        // Prevent adding another Start node if one already exists
        if (selectedNode === "flow_start" && nodes.some((node) => node.type === "flow_start")) {
          toast({
            title: "错误",
            description: "只能有一个开始节点",
            variant: "destructive",
          })
          return
        }
      } else {
        // Prevent adding another Start node if one already exists
        if (nodeType === "flow_start" && nodes.some((node) => node.type === "flow_start")) {
          toast({
            title: "错误",
            description: "只能有一个开始节点",
            variant: "destructive",
          })
          return
        }
      }

      // Get the position where the node is dropped
      const reactFlowBounds = event.currentTarget.getBoundingClientRect()
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      // Create a new node
      const newNode: Node = {
        id: `${nodeType || selectedNode}-${Date.now()}`,
        type: nodeType || selectedNode,
        position,
        data: {
          label: getNodeLabel(nodeType || selectedNode),
          ...getDefaultData(nodeType || selectedNode),
        },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, selectedNode, setNodes, nodes],
  )

  const getNodeLabel = (type: NodeType): string => {
    const labels: Record<string, string> = {
      flow_start: "开始节点",
      ai_chat: "AI模型",
      if_else: "条件判断",
      flow_end: "结束节点",
      knowledge_search: "知识库搜索",
      intent_matching: "意图匹配",
      code_execution: "代码执行",
      service_call: "服务调用",
    }
    return labels[type] || type
  }

  const getDefaultData = (type: NodeType) => {
    switch (type) {
      case "flow_start":
        return {
          outputs: [
            { type: "string", name: "userId", desc: "用户ID" },
            { type: "string", name: "userName", desc: "用户名" },
          ],
        }
      case "ai_chat":
        return {
          llmParam: {
            name: "deepseek-r1:32b",
            modelParam: {
              temperature: 0.8,
              chatMemoryResponseSize: 10,
              maxTokens: 512,
            },
            sysPrompt: "",
            userPrompt: "",
            supportThinking: false,
          },
          outputs: [{ type: "string", name: "content", desc: "AI回复内容" }],
        }
      case "if_else":
        return {
          selectParam: {
            branchs: [
              {
                name: "条件1",
                branch_key: "true",
                operator: "and",
                conditions: [
                  {
                    left: {
                      type: "ref",
                      content: {
                        refNode: "",
                        refPath: "",
                        type: "string",
                      },
                    },
                    comparator: "equals",
                    right: {
                      type: "input",
                      content: {
                        value: "",
                      },
                    },
                  },
                ],
              },
              {
                name: "默认",
                branch_key: "default",
                operator: "and",
                conditions: [],
              },
            ],
          },
        }
      case "flow_end":
        return {
          inputs: [
            {
              type: "ref",
              name: "refInput",
              content: {
                refNode: "",
                refPath: "",
                type: "string",
              },
            },
          ],
        }
      default:
        return {}
    }
  }

  const handleZoomIn = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut()
    }
  }

  const handleFitView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 })
    }
  }

  const handleSave = () => {
    toast({
      title: "功能待实现",
      description: "保存工作流功能正在开发中",
    })
  }

  const handleRun = () => {
    toast({
      title: "功能待实现",
      description: "运行工作流功能正在开发中",
    })
  }

  return (
    <div className="flex-1 h-full relative">
      <WorkflowJsonViewer nodes={nodes} edges={edges} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        deleteKeyCode="Delete"
        edgesFocusable={true}
        edgesUpdatable={true}
        elementsSelectable={true}
        selectNodesOnDrag={false}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-slate-50"
      >
        <Background variant="dots" gap={16} size={1} color="#e2e8f0" />
        <Controls className="bg-white border border-slate-200 shadow-sm rounded-md overflow-hidden" />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="bg-white border border-slate-200 shadow-sm rounded-md overflow-hidden"
          nodeBorderRadius={2}
        />

        <Panel position="top-left" className="flex gap-2 p-2">
          <Button variant="outline" size="sm" className="bg-white shadow-sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            保存
          </Button>
          <Button variant="outline" size="sm" className="bg-white shadow-sm" onClick={handleRun}>
            <Play className="h-4 w-4 mr-1" />
            运行
          </Button>
        </Panel>

        <Panel position="bottom-right" className="flex gap-2 p-2">
          <Button variant="outline" size="icon" className="h-8 w-8 bg-white shadow-sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 bg-white shadow-sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 bg-white shadow-sm" onClick={handleFitView}>
            <Maximize className="h-4 w-4" />
          </Button>
        </Panel>

        <svg>
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>
        </svg>
      </ReactFlow>
    </div>
  )
}
