export type NodeType =
  | "flow_start"
  | "ai_chat"
  | "if_else"
  | "flow_end"
  | "knowledge_search"
  | "intent_matching"
  | "code_execution"
  | "service_call"

export interface Position {
  x: number
  y: number
}

export interface OutputField {
  type: string
  name: string
  desc: string
}

export interface InputField {
  type: "ref" | "input"
  name: string
  content: {
    refNode?: string
    refPath?: string
    value?: string
    type?: string
  }
}

export interface LLMParam {
  name: string
  modelParam: {
    temperature: number
    chatMemoryResponseSize: number
    maxTokens: number
  }
  sysPrompt: string
  userPrompt: string
  supportThinking: boolean
}

export interface Condition {
  left: {
    type: "ref" | "input"
    content: {
      refNode?: string
      refPath?: string
      value?: string
      type?: string
    }
  }
  comparator: string
  right: {
    type: "ref" | "input"
    content: {
      refNode?: string
      refPath?: string
      value?: string
      type?: string
    }
  }
}

export interface Branch {
  name: string
  branch_key: string
  operator: "and" | "or"
  conditions: Condition[]
}

export interface SelectParam {
  branchs: Branch[]
}

export interface NodeData {
  outputs?: OutputField[]
  inputs?: InputField[]
  llmParam?: LLMParam
  selectParam?: SelectParam
}

export interface WorkflowNode {
  nodeId: string
  name: string
  nodeType: NodeType
  position: Position
  data: NodeData
}

export interface Edge {
  source: string
  sourceHandle?: string
  source_port_id?: string
  target: string
  targetHandle?: string
}

export interface Workflow {
  nodes: WorkflowNode[]
  edges: Edge[]
}
