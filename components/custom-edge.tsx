"use client"

import type React from "react"

import { useCallback } from "react"
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath, useReactFlow } from "reactflow"
import { X } from "lucide-react"

export function CustomEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow()
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const onEdgeClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      // 直接使用 setEdges 来删除边
      setEdges((edges) => edges.filter((edge) => edge.id !== id))
    },
    [id, setEdges],
  )

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd="url(#arrow)"
        style={{
          ...style,
          strokeWidth: 2,
          stroke: "#64748b",
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="absolute flex items-center justify-center w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors z-10"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          onClick={onEdgeClick}
        >
          <X className="w-3 h-3 text-slate-500 hover:text-red-500" />
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
