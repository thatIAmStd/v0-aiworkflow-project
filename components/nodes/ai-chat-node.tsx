"use client"

import { useState, useEffect } from "react"
import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Settings, MessageSquare } from "lucide-react"
import type { LLMParam, OutputField } from "@/types/workflow"
import { NodeDeleteButton } from "@/components/node-delete-button"

interface AIChatNodeProps {
  data: {
    label: string
    llmParam: LLMParam
    outputs: OutputField[]
  }
  id: string
}

export function AIChatNode({ data, id }: AIChatNodeProps) {
  const [llmParam, setLlmParam] = useState<LLMParam>(
    data.llmParam || {
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
  )
  const [outputs, setOutputs] = useState<OutputField[]>(data.outputs || [])

  // Update state when data changes
  useEffect(() => {
    if (data.llmParam) {
      setLlmParam(data.llmParam)
    }
    if (data.outputs) {
      setOutputs(data.outputs)
    }
  }, [data.llmParam, data.outputs])

  const updateModelParam = (field: keyof typeof llmParam.modelParam, value: number) => {
    setLlmParam({
      ...llmParam,
      modelParam: {
        ...llmParam.modelParam,
        [field]: value,
      },
    })
  }

  return (
    <div className="shadow-md rounded-md bg-white border border-slate-200 w-[350px] relative group hover:shadow-lg transition-shadow">
      <NodeDeleteButton id={id} />
      <div className="bg-blue-50 px-4 py-2 border-b border-slate-200 font-medium flex items-center rounded-t-md">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
          {data.label || "AI模型"}
        </div>
        <span className="text-xs text-slate-500 ml-2">AIChatNode</span>
        <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0 text-slate-400 hover:text-slate-700">
          <span className="sr-only">更多选项</span>
          <span>⋯</span>
        </Button>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 text-slate-700 flex items-center">
            <MessageSquare className="h-3.5 w-3.5 mr-1 text-blue-500" />
            模型设置
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm w-16 text-slate-600">模型</span>
              <div className="flex-1 relative">
                <Select value={llmParam.name} onValueChange={(value) => setLlmParam({ ...llmParam, name: value })}>
                  <SelectTrigger className="w-full h-8 text-sm">
                    <SelectValue placeholder="选择模型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deepseek-r1:32b">deepseek-r1:32b</SelectItem>
                    <SelectItem value="AzureopenAI/gpt-4o-mini">AzureopenAI/gpt-4o-mini</SelectItem>
                    <SelectItem value="OpenAI/gpt-4">OpenAI/gpt-4</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-8 w-8 text-slate-400 hover:text-slate-700"
                >
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm w-16 text-slate-600">温度</span>
              <div className="flex-1">
                <Slider
                  value={[llmParam.modelParam.temperature]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={(value) => updateModelParam("temperature", value[0])}
                  className="py-1"
                />
              </div>
              <span className="text-sm w-8 text-right text-slate-600">{llmParam.modelParam.temperature}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm w-16 text-slate-600">最大长度</span>
              <div className="flex-1">
                <Slider
                  value={[llmParam.modelParam.maxTokens]}
                  min={100}
                  max={4000}
                  step={100}
                  onValueChange={(value) => updateModelParam("maxTokens", value[0])}
                  className="py-1"
                />
              </div>
              <span className="text-sm w-12 text-right text-slate-600">{llmParam.modelParam.maxTokens}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm w-16 text-slate-600">记忆大小</span>
              <div className="flex-1">
                <Slider
                  value={[llmParam.modelParam.chatMemoryResponseSize]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={(value) => updateModelParam("chatMemoryResponseSize", value[0])}
                  className="py-1"
                />
              </div>
              <span className="text-sm w-8 text-right text-slate-600">
                {llmParam.modelParam.chatMemoryResponseSize}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 text-slate-700">系统提示词</h3>
          <Textarea
            placeholder="输入系统提示词..."
            className="min-h-[80px] text-sm resize-none"
            value={llmParam.sysPrompt}
            onChange={(e) => setLlmParam({ ...llmParam, sysPrompt: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 text-slate-700">用户提示词</h3>
          <Textarea
            placeholder="输入用户提示词..."
            className="min-h-[80px] text-sm resize-none"
            value={llmParam.userPrompt}
            onChange={(e) => setLlmParam({ ...llmParam, userPrompt: e.target.value })}
          />
          <div className="text-xs text-slate-500 mt-1">使用 {"{{nodeId.paramName}}"} 引用其他节点的输出</div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2 text-slate-700">输出</h3>
          {outputs.map((output, index) => (
            <div
              key={index}
              className="flex items-center gap-2 mb-2 p-2 bg-slate-50 rounded-md border border-slate-100"
            >
              <span className="text-sm w-16 font-medium text-slate-700">{output.name}</span>
              <span className="text-sm text-slate-500 px-2 py-0.5 bg-slate-100 rounded">{output.type}</span>
              <span className="text-sm text-slate-500 flex-1">{output.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-blue-500 border-2 border-white" />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  )
}
