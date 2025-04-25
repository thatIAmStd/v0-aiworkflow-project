"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Settings } from "lucide-react"
import { NodeDeleteButton } from "@/components/node-delete-button"

interface IntentMatchingNodeProps {
  data: {
    label: string
  }
  id: string
}

export function IntentMatchingNode({ data, id }: IntentMatchingNodeProps) {
  const [model, setModel] = useState("AzureopenAI/gpt-4o-mini")
  const [intents, setIntents] = useState([{ name: "添加意图示例", examples: "" }])
  const [userInput, setUserInput] = useState("")

  const addIntent = () => {
    setIntents([...intents, { name: "新意图", examples: "" }])
  }

  return (
    <div className="shadow-md rounded-md bg-white border border-gray-200 w-[350px] relative">
      <NodeDeleteButton id={id} />
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-medium flex items-center">
        {data.label || "意图匹配"}
        <span className="text-xs text-gray-500 ml-2">IntentMatchingNode</span>
        <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
          <span className="sr-only">更多选项</span>
          <span>⋯</span>
        </Button>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">模型设置</h3>
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
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">意图配置</h3>
            <Button variant="ghost" size="sm" onClick={addIntent}>
              <PlusCircle className="h-4 w-4 mr-1" />
              添加
            </Button>
          </div>

          {intents.map((intent, index) => (
            <div key={index} className="mb-3">
              <Input
                value={intent.name}
                className="mb-2"
                onChange={(e) => {
                  const newIntents = [...intents]
                  newIntents[index].name = e.target.value
                  setIntents(newIntents)
                }}
              />
              <Textarea
                placeholder="输入意图示例..."
                className="min-h-[80px]"
                value={intent.examples}
                onChange={(e) => {
                  const newIntents = [...intents]
                  newIntents[index].examples = e.target.value
                  setIntents(newIntents)
                }}
              />
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">输入</h3>
          <Textarea
            placeholder="输入用户文本..."
            className="min-h-[80px]"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">输出</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm w-16">intention</span>
            <span className="text-sm text-gray-500">string</span>
          </div>
        </div>
      </div>

      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  )
}
