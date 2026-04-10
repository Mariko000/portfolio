import dagre from 'dagre'

export function getLayoutedElements(nodes, edges, direction = 'TB') {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: direction })  // TB＝縦並び, LR＝横並び

  nodes.forEach((node) => {
    g.setNode(node.id, { width: 160, height: 80 })
  })

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  dagre.layout(g)

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id)
    return {
      ...node,
      position: {
        x: pos.x - 80,  // 中心揃え調整
        y: pos.y - 40,
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}
