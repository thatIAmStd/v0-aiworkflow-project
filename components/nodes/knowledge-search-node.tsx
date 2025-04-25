"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { PlusCircle, Settings } from "lucide-react"
import { NodeDeleteButton } from "@/components/node-delete-button"

interface KnowledgeSearchNodeProps {
  data: {
    label: string
  }
  id: string
}

export function KnowledgeSearchNode({ data, id }: KnowledgeSearchNodeProps) {
  const [model, setModel] = useState("AzureopenAI/gpt-4o-mini")
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2000)
  const [systemPrompt, setSystemPrompt] = useState("")
  const [userPrompt, setUserPrompt] = useState("")
  const [knowledgeBases, setKnowledgeBases] = useState([{ name: "知识库1" }, { name: "知识库2" }])

  const addKnowledgeBase = () => {
    setKnowledgeBases([...knowledgeBases, { name: `知识库${knowledgeBases.length + 1}` }])
  }

  return (
    <div className="shadow-md rounded-md bg-white border border-gray-200 w-[350px] relative">
      <NodeDeleteButton id={id} />
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-medium flex items-center">
        {data.label || "知识库搜索"}
        <span className="text-xs text-gray-500 ml-2">KnowledgeSearchNode</span>
        <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
          <span className="sr-only">更多选项</span>
          <span>⋯</span>
        </Button>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">模型设置</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm w-16">模型</span>
              <div className="flex-1 relative">
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择模型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AzureopenAI/gpt-4o-mini">AzureopenAI/gpt-4o-mini</SelectItem>
                    <SelectItem value="OpenAI/gpt-4">OpenAI/gpt-4</SelectItem>
                    <SelectItem value="Anthropic/claude-3">Anthropic/claude-3</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm w-16">温度</span>
              <div className="flex-1">
                <Slider
                  value={[temperature]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={(value) => setTemperature(value[0])}
                />
              </div>
              <span className="text-sm w-8 text-right">{temperature}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm w-16">最大长度</span>
              <div className="flex-1">
                <Slider
                  value={[maxTokens]}
                  min={100}
                  max={4000}
                  step={100}
                  onValueChange={(value) => setMaxTokens(value[0])}
                />
              </div>
              <span className="text-sm w-12 text-right">{maxTokens}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm w-16">用格式化</span>
              <Select defaultValue="是">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="是">是</SelectItem>
                  <SelectItem value="否">否</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">知识库设置</h3>
            <Button variant="ghost" size="sm" onClick={addKnowledgeBase}>
              <PlusCircle className="h-4 w-4 mr-1" />
              添加
            </Button>
          </div>

          <div className="space-y-2">
            {knowledgeBases.map((kb, index) => (
              <div key={index} className="flex gap-2">
                <Input value={kb.name} className="flex-1" />
                <Select defaultValue="相关度">
                  <SelectTrigger>
                    <SelectValue placeholder="选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="相关度">相关度</SelectItem>
                    <SelectItem value="时间">时间</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">系统提示词</h3>
          <Textarea
            placeholder="输入系统提示词..."
            className="min-h-[80px]"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">输入</h3>
          <Textarea
            placeholder="输入用户提示词..."
            className="min-h-[80px]"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">输出</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm w-16">content</span>
            <span className="text-sm text-gray-500">string</span>
          </div>
        </div>
      </div>

      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  )
}
