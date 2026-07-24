import ELK from 'elkjs'
import { Position, useVueFlow } from '@vue-flow/core'
import type { Node, Edge } from '@vue-flow/core'

const elk = new ELK()

export function useLayout() {
  const { findNode } = useVueFlow()

  async function layout(nodes: Node[], edges: Edge[]) {
    const graph = {
      id: 'root',

      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.force.iterations': '500',
        'elk.spacing.nodeNode': '40',
        'elk.spacing.componentComponent': '120',
      },

      children: nodes.map((node) => {
        const graphNode = findNode(node.id)

        return {
          id: node.id,
          width: graphNode?.dimensions.width ?? 260,
          height: graphNode?.dimensions.height ?? 150,
        }
      }),

      edges: edges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    }

    const result = await elk.layout(graph)

    return nodes.map((node) => {
      const positioned = result.children?.find((child) => child.id === node.id)

      return {
        ...node,
        targetPosition: Position.Left,
        sourcePosition: Position.Right,
        position: {
          x: positioned?.x ?? 0,
          y: positioned?.y ?? 0,
        },
      }
    })
  }

  return {
    layout,
  }
}
