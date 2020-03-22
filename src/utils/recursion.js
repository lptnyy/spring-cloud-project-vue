const recursion = {
  // 转换树结构并将需要的值存进树中
  // 存值为：除了树结构必须的值外，我需要发送给后台的值 (code)
  convertTree: function (tree, map) {
    const result = []
    tree.forEach((item) => {
      // 读取 map 的键值映射
      let expand = true
      let checked = false
      let title = item[ map.title ]
      let code = item[ map.code ]
      let children = item[ map.children ]
      // 如果有子节点，递归
      if (children) {
        children = this.convertTree(children, map)
      }
      result.push({ expand, checked, code, title, children })
    })
    return result
  }
}
export default recursion
