"use client"

import { useState, useEffect } from "react"
import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import type { OutputField } from "@/types/workflow"
import { NodeDeleteButton } from "@/components/node-delete-button"

interface StartNodeProps {
  data: {
    label: string
    outputs: OutputField[]
  }
  id: string
}

export function StartNode({ data, id }: StartNodeProps) {
  const [outputs, setOutputs] = useState<OutputField[]>(data.outputs || [])

  // Update outputs when data changes
  useEffect(() => {
    if (data.outputs) {
      setOutputs(data.outputs)
    }
  }, [data.outputs])

  const addOutput = () => {
    setOutputs([...outputs, { type: "string", name: `output${outputs.length + 1}`, desc: "" }])
  }

  const deleteOutput = (index: number) => {
    const newOutputs = [...outputs]
    newOutputs.splice(index, 1)
    setOutputs(newOutputs)
  }

  const updateOutput = (index: number, field: keyof OutputField, value: string) => {
    const newOutputs = [...outputs]
    newOutputs[index] = { ...newOutputs[index], [field]: value }
    setOutputs(newOutputs)
  }

  return (
    <div className="shadow-md rounded-md bg-white border border-slate-200 w-[350px] relative group hover:shadow-lg transition-shadow">
      <NodeDeleteButton id={id} />
      <div className="bg-green-50 px-4 py-2 border-b border-slate-200 font-medium flex items-center rounded-t-md">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          {data.label || "开始节点"}
        </div>
        <span className="text-xs text-slate-500 ml-2">StartNode</span>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">输出参数</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={addOutput}
              className="h-7 px-2 text-slate-600 hover:text-slate-900"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              添加
            </Button>
          </div>

          {outputs.map((output, index) => (
            <div key={index} className="mb-3 flex items-center gap-2">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <Input
                  value={output.name}
                  placeholder="参数名称"
                  className="text-sm h-8"
                  onChange={(e) => updateOutput(index, "name", e.target.value)}
                />
                <Select value={output.type} onValueChange={(value) => updateOutput(index, "type", value)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">string</SelectItem>
                    <SelectItem value="number">number</SelectItem>
                    <SelectItem value="boolean">boolean</SelectItem>
                    <SelectItem value="object">object</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={output.desc || ""}
                  placeholder="描述"
                  className="text-sm h-8"
                  onChange={(e) => updateOutput(index, "desc", e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                onClick={() => deleteOutput(index)}
              >
                <span className="sr-only">删除</span>
                <span>×</span>
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </div>
  )
}
