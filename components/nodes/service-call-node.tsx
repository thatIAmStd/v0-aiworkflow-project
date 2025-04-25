"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import { NodeDeleteButton } from "@/components/node-delete-button"

interface ServiceCallNodeProps {
  data: {
    label: string
  }
  id: string
}

export function ServiceCallNode({ data, id }: ServiceCallNodeProps) {
  const [inputs, setInputs] = useState([{ name: "jsonPath", type: "string", value: "" }])
  const [outputs, setOutputs] = useState([
    { name: "code", type: "string", description: "状态码" },
    { name: "data", type: "object", description: "返回数据" },
    { name: "error", type: "string", description: "错误信息" },
    { name: "time", type: "string", description: "时间戳" },
    { name: "msg", type: "string", description: "返回消息" },
    { name: "requestId", type: "string", description: "请求ID" },
  ])

  const addInput = () => {
    setInputs([...inputs, { name: "", type: "string", value: "" }])
  }

  return (
    <div className="shadow-md rounded-md bg-white border border-gray-200 w-[350px] relative">
      <NodeDeleteButton id={id} />
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-medium flex items-center">
        {data.label || "服务调用"}
        <span className="text-xs text-gray-500 ml-2">ServiceCallNode</span>
        <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
          <span className="sr-only">更多选项</span>
          <span>⋯</span>
        </Button>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">输入</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm w-16">endpoint</span>
              <Select defaultValue="POST">
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="方法" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
              <Input defaultValue="" placeholder="API URL" className="flex-1" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm w-16">headers</span>
              <Select defaultValue="application/json">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Content-Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="application/json">application/json</SelectItem>
                  <SelectItem value="text/plain">text/plain</SelectItem>
                  <SelectItem value="multipart/form-data">multipart/form-data</SelectItem>
                </SelectContent>
              </Select>
              <Input defaultValue="" placeholder="Authorization" className="flex-1" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm w-16">body</span>
              <Select defaultValue="raw">
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="raw">raw</SelectItem>
                  <SelectItem value="form">form</SelectItem>
                  <SelectItem value="json">json</SelectItem>
                </SelectContent>
              </Select>
              <Input defaultValue="" placeholder="请求体" className="flex-1" />
            </div>

            {inputs.map((input, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={input.name || ""}
                  placeholder="参数名"
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
                  value={input.value}
                  placeholder="值"
                  className="flex-1"
                  onChange={(e) => {
                    const newInputs = [...inputs]
                    newInputs[index].value = e.target.value
                    setInputs(newInputs)
                  }}
                />
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3" onClick={addInput}>
            <PlusCircle className="h-4 w-4 mr-1" />
            添加参数
          </Button>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">输出</h3>
          <div className="space-y-2">
            {outputs.map((output, index) => (
              <div key={index} className="flex items-center">
                <span className="text-sm w-24">{output.name}</span>
                <span className="text-sm text-gray-500 w-24">{output.type}</span>
                <span className="text-sm text-gray-500 flex-1">{output.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  )
}
