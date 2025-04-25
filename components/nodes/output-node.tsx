"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import { Handle, Position } from "reactflow"

export function OutputNode({ data }: { data: { label: string; outputs: any[] } }) {
  const [outputs, setOutputs] = useState(
    data.outputs || [{ name: "输出结果", type: "string", description: "最终输出结果" }],
  )

  const addOutput = () => {
    setOutputs([...outputs, { name: "新输出", type: "string", description: "" }])
  }

  const deleteOutput = (index: number) => {
    const newOutputs = [...outputs]
    newOutputs.splice(index, 1)
    setOutputs(newOutputs)
  }

  return (
    <div className="shadow-md rounded-md bg-white border border-gray-200 w-[350px]">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-medium flex items-center">
        {data.label}
        <span className="text-xs text-gray-500 ml-2">OutputNode</span>
        <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
          <span className="sr-only">更多选项</span>
          <span>⋯</span>
        </Button>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">输入</h3>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input value="输入内容" placeholder="参数名称" className="text-sm" readOnly />
              <Select defaultValue="string">
                <SelectTrigger>
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">string</SelectItem>
                  <SelectItem value="number">number</SelectItem>
                  <SelectItem value="boolean">boolean</SelectItem>
                  <SelectItem value="object">object</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">输出</h3>

          {outputs.map((output, index) => (
            <div key={index} className="mb-3 flex items-center gap-2">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <Input
                  value={output.name}
                  placeholder="参数名称"
                  className="text-sm"
                  onChange={(e) => {
                    const newOutputs = [...outputs]
                    newOutputs[index].name = e.target.value
                    setOutputs(newOutputs)
                  }}
                />
                <Select
                  value={output.type}
                  onValueChange={(value) => {
                    const newOutputs = [...outputs]
                    newOutputs[index].type = value
                    setOutputs(newOutputs)
                  }}
                >
                  <SelectTrigger>
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
                  value={output.description || ""}
                  placeholder="描述"
                  className="text-sm"
                  onChange={(e) => {
                    const newOutputs = [...outputs]
                    newOutputs[index].description = e.target.value
                    setOutputs(newOutputs)
                  }}
                />
              </div>
              <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => deleteOutput(index)}>
                <span className="sr-only">删除</span>
                <span>×</span>
              </Button>
            </div>
          ))}

          <Button variant="outline" size="sm" className="w-full mt-2 text-gray-500" onClick={addOutput}>
            <PlusCircle className="h-4 w-4 mr-1" />
            添加输出
          </Button>
        </div>
      </div>

      <Handle type="target" position={Position.Left} />
    </div>
  )
}
