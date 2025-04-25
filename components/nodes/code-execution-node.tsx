"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"
import { NodeDeleteButton } from "@/components/node-delete-button"

interface CodeExecutionNodeProps {
  data: {
    label: string
  }
  id: string
}

export function CodeExecutionNode({ data, id }: CodeExecutionNodeProps) {
  const [code, setCode] = useState(`function transform(input) {
  const result = {
    ...input,
  }
  return result
}`)
  const [inputs, setInputs] = useState([
    { name: "input_1", type: "string", description: "" },
    { name: "input_2", type: "number", description: "" },
  ])
  const [outputs, setOutputs] = useState([{ name: "result", type: "string", description: "" }])

  const addInput = () => {
    setInputs([...inputs, { name: `input_${inputs.length + 1}`, type: "string", description: "" }])
  }

  const addOutput = () => {
    setOutputs([...outputs, { name: `output_${outputs.length + 1}`, type: "string", description: "" }])
  }

  return (
    <div className="shadow-md rounded-md bg-white border border-gray-200 w-[350px] relative">
      <NodeDeleteButton id={id} />
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-medium flex items-center">
        {data.label || "代码执行"}
        <span className="text-xs text-gray-500 ml-2">CodeExecutionNode</span>
        <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
          <span className="sr-only">更多选项</span>
          <span>⋯</span>
        </Button>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">输入</h3>
          {inputs.map((input, index) => (
            <div key={index} className="mb-3 flex items-center gap-2">
              <Input
                value={input.name}
                className="flex-1"
                onChange={(e) => {
                  const newInputs = [...inputs]
                  newInputs[index].name = e.target.value
                  setInputs(newInputs)
                }}
              />
              <Select
                value={input.type}
                onValueChange={(value) => {
                  const newInputs = [...inputs]
                  newInputs[index].type = value
                  setInputs(newInputs)
                }}
              >
                <SelectTrigger className="w-24">
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
                value={input.description}
                placeholder="描述"
                className="flex-1"
                onChange={(e) => {
                  const newInputs = [...inputs]
                  newInputs[index].description = e.target.value
                  setInputs(newInputs)
                }}
              />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-2" onClick={addInput}>
            <PlusCircle className="h-4 w-4 mr-1" />
            添加输入
          </Button>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">代码编辑</h3>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono text-sm min-h-[150px]"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">输出</h3>
          {outputs.map((output, index) => (
            <div key={index} className="mb-3 flex items-center gap-2">
              <Input
                value={output.name}
                className="flex-1"
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
                <SelectTrigger className="w-24">
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
                value={output.description}
                placeholder="描述"
                className="flex-1"
                onChange={(e) => {
                  const newOutputs = [...outputs]
                  newOutputs[index].description = e.target.value
                  setOutputs(newOutputs)
                }}
              />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-2" onClick={addOutput}>
            <PlusCircle className="h-4 w-4 mr-1" />
            添加输出
          </Button>
        </div>
      </div>

      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  )
}
