"use client"

import { useState, useEffect } from "react"
import { Handle, Position } from "reactflow"
import type { SelectParam } from "@/types/workflow"
import { NodeDeleteButton } from "@/components/node-delete-button"
import { GitBranch } from "lucide-react"

interface IfElseNodeProps {
  data: {
    label: string
  }
  id: string
}

export function IfElseNode({ data, id }: IfElseNodeProps) {
  const [selectParam, setSelectParam] = useState<SelectParam>({
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
  })

  // Update state when data changes
  useEffect(() => {
    // if (data.selectParam) {
    //   setSelectParam(data.selectParam)
    // }
  }, [data])

  return (
    <div className="shadow-md rounded-md bg-white border border-slate-200 w-[350px] relative group hover:shadow-lg transition-shadow">
      <NodeDeleteButton id={id} />
      <div className="bg-purple-50 px-4 py-2 border-b border-slate-200 font-medium flex items-center rounded-t-md">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
          {data.label || "条件判断"}
        </div>
        <span className="text-xs text-slate-500 ml-2">IfElseNode</span>
      </div>

      <div className="p-4">
        <div className="px-3 py-2 mb-2 text-sm font-medium bg-purple-100 text-purple-800 rounded-md flex items-center">
          <GitBranch className="h-4 w-4 mr-2" />
          IF
        </div>

        <div className="px-3 py-2 mb-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-md flex items-center">
          <GitBranch className="h-4 w-4 mr-2" />
          ELSE IF
        </div>

        <div className="px-3 py-2 mb-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-md flex items-center">
          <GitBranch className="h-4 w-4 mr-2" />
          ELSE
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ top: "30%" }}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ top: "70%" }}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
    </div>
  )
}
