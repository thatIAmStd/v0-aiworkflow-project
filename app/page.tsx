"use client"

import { Sidebar } from "@/components/sidebar"
import { WorkflowEditor } from "@/components/workflow-editor"
import { useState, useEffect } from "react"
import type { NodeType, Workflow } from "@/types/workflow"
import { Toaster } from "@/components/ui/toaster"

// Example workflow data
const exampleWorkflow: Workflow = {
  nodes: [
    {
      nodeId: "start-1",
      name: "开始节点",
      nodeType: "flow_start",
      position: { x: 0, y: 0 },
      data: {
        outputs: [
          {
            type: "string",
            name: "userId",
            desc: "用户ID",
          },
          {
            type: "string",
            name: "userName",
            desc: "用户名",
          },
          {
            type: "string",
            name: "projectId",
            desc: "项目id",
          },
          {
            type: "string",
            name: "userRole",
            desc: "角色",
          },
          {
            type: "string",
            name: "projectStatus",
            desc: "项目状态",
          },
        ],
      },
    },
    {
      nodeId: "ai_chat_1",
      name: "Ai模型",
      nodeType: "ai_chat",
      position: {
        x: 100,
        y: 200,
      },
      data: {
        llmParam: {
          name: "deepseek-r1:32b",
          modelParam: {
            temperature: 0.8,
            chatMemoryResponseSize: 10,
            maxTokens: 512,
          },
          sysPrompt: "",
          userPrompt: "知识库用户问题{{nodeId.userId}}",
          supportThinking: false,
        },
        outputs: [
          {
            type: "string",
            name: "content",
            desc: "AI回复内容",
          },
        ],
      },
    },
    {
      nodeId: "if-else-1",
      name: "条件判断",
      nodeType: "if_else",
      position: { x: 0, y: 200 },
      data: {
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
                      refNode: "start-1",
                      refPath: "userId",
                      type: "string",
                    },
                  },
                  comparator: "equals",
                  right: {
                    type: "input",
                    content: {
                      value: "test-user-123",
                    },
                  },
                },
              ],
            },
            {
              name: "条件2",
              branch_key: "true_1",
              operator: "and",
              conditions: [
                {
                  left: {
                    type: "ref",
                    content: {
                      refNode: "start-1",
                      refPath: "userRole",
                      type: "string",
                    },
                  },
                  comparator: "equals",
                  right: {
                    type: "input",
                    content: {
                      value: "admin",
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
      },
    },
    {
      nodeId: "end-1",
      name: "结束节点",
      nodeType: "flow_end",
      position: { x: 200, y: 400 },
      data: {
        inputs: [
          {
            type: "ref",
            name: "myUserId",
            content: {
              refNode: "start-1",
              refPath: "userId",
              type: "string",
            },
          },
          {
            type: "input",
            name: "myInputValue",
            content: {
              value: "test-user-123",
              type: "string",
            },
          },
        ],
      },
    },
  ],
  edges: [
    {
      source: "start-1",
      sourceHandle: "right",
      target: "if-else-1",
      targetHandle: "left",
    },
    {
      source: "if-else-1",
      source_port_id: "true",
      sourceHandle: "true",
      target: "ai_chat_1",
      targetHandle: "left",
    },
    {
      source: "if-else-1",
      source_port_id: "true_1",
      sourceHandle: "true_1",
      target: "end-1",
      targetHandle: "left",
    },
    {
      source: "ai_chat_1",
      sourceHandle: "right",
      target: "end-1",
      targetHandle: "left",
    },
  ],
}

export default function Home() {
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null)
  const [workflow, setWorkflow] = useState<Workflow | undefined>(undefined)

  useEffect(() => {
    // Load the example workflow after a short delay to simulate loading from an API
    setTimeout(() => {
      setWorkflow(exampleWorkflow)
    }, 500)
  }, [])

  const handleImportWorkflow = (importedWorkflow: Workflow) => {
    setWorkflow(importedWorkflow)
  }

  return (
    <main className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar onSelectNode={setSelectedNode} onImportWorkflow={handleImportWorkflow} />
      <WorkflowEditor selectedNode={selectedNode} initialWorkflow={workflow} />
      <Toaster />
    </main>
  )
}
