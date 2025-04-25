"use client"

import { useState, useEffect } from "react"
import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import type { InputField } from "@/types/workflow"
import { NodeDeleteButton } from "@/components/node-delete-button"

interface EndNodeProps {
  data: {
    label: string
    inputs: InputField[]
  }
  id: string
}

export function EndNode({ data, id }: EndNodeProps) {
  const [inputs, setInputs] = useState<InputField[]>(data.inputs || [])

  // Update inputs when data changes
  useEffect(() => {
    if (data.inputs) {
      setInputs(data.inputs)
    }
  }, [data.inputs])

  const addInput = () => {
    setInputs([
      ...inputs,
      {
        type: "input",
        name: `input${inputs.length + 1}`,
        content: {
          value: "",
          type: "string",
        },
      },
    ])
  }

  const deleteInput = (index: number) => {
    const newInputs = [...inputs]
    newInputs.splice(index, 1)
    setInputs(newInputs)
  }

  const updateInputName = (index: number, name: string) => {
    const newInputs = [...inputs]
    newInputs[index] = { ...newInputs[index], name }
    setInputs(newInputs)
  }

  const updateInputType = (index: number, type: "ref" | "input") => {
    const newInputs = [...inputs]
    newInputs[index] = {
      ...newInputs[index],
      type,
      content: type === "ref" ? { refNode: "", refPath: "", type: "string" } : { value: "", type: "string" },
    }
    setInputs(newInputs)
  }

  const updateInputValue = (index: number, value: string) => {
    const newInputs = [...inputs]
    if (newInputs[index].type === "input") {
      newInputs[index].content = { ...newInputs[index].content, value }
    }
    setInputs(newInputs)
  }

  const updateRefNode = (index: number, refNode: string) => {
    const newInputs = [...inputs]
    if (newInputs[index].type === "ref") {
      newInputs[index].content = { ...newInputs[index].content, refNode }
    }
    setInputs(newInputs)
  }

  const updateRefPath = (index: number, refPath: string) => {
    const newInputs = [...inputs]
    if (newInputs[index].type === "ref") {
      newInputs[index].content = { ...newInputs[index].content, refPath }
    }
    setInputs(newInputs)
  }

  return (
    <div className="shadow-md rounded-md bg-white border border-slate-200 w-[350px] relative group hover:shadow-lg transition-shadow">
      <NodeDeleteButton id={id} />
      <div className="bg-red-50 px-4 py-2 border-b border-slate-200 font-medium flex items-center rounded-t-md">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
          {data.label || "结束节点"}
        </div>
        <span className="text-xs text-slate-500 ml-2">EndNode</span>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">输入参数</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={addInput}
              className="h-7 px-2 text-slate-600 hover:text-slate-900"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              添加
            </Button>
          </div>

          {inputs.map((input, index) => (
            <div key={index} className="mb-4 border border-slate-100 p-3 rounded-md bg-slate-50">
              <div className="flex items-center gap-2 mb-2">
                <Input
                  value={input.name}
                  placeholder="参数名称"
                  className="text-sm h-8 flex-1"
                  onChange={(e) => updateInputName(index, e.target.value)}
                />
                <Select value={input.type} onValueChange={(value: "ref" | "input") => updateInputType(index, value)}>
                  <SelectTrigger className="w-24 h-8 text-sm">
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ref">引用</SelectItem>
                    <SelectItem value="input">输入</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                  onClick={() => deleteInput(index)}
                >
                  <span className="sr-only">删除</span>
                  <span>×</span>
                </Button>
              </div>

              {input.type === "ref" ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium w-16 text-slate-600">引用节点</span>
                    <Input
                      value={input.content.refNode || ""}
                      placeholder="节点ID"
                      className="text-sm h-8 flex-1"
                      onChange={(e) => updateRefNode(index, e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium w-16 text-slate-600">引用参数</span>
                    <Input
                      value={input.content.refPath || ""}
                      placeholder="参数名"
                      className="text-sm h-8 flex-1"
                      onChange={(e) => updateRefPath(index, e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium w-16 text-slate-600">值</span>
                  <Input
                    value={input.content.value || ""}
                    placeholder="输入值"
                    className="text-sm h-8 flex-1"
                    onChange={(e) => updateInputValue(index, e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-red-500 border-2 border-white" />
    </div>
  )
}
