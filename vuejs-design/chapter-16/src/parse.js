/**
 * 模板解析
 * @param {String} str 模板字符串
 * @returns {Object}
 */
function parse(str) {
  const context = {
    // 存储模板字符串
    source: str,
    // 前进 num 个字符
    advanceBy(num) {
      context.source = context.source.slice(num)
    }
  }
  const nodes = parseChildren(context, [])
  // 根节点
  const root = {
    type: 'Root',
    children: nodes
  }
  return root
}

/**
 * 解析子节点
 * @param {Object} context 上下文
 * @param {Array} ancestors 祖先节点
 */
function parseChildren(context, ancestors = []) {
  const nodes = []

  while (!isEnd(context, ancestors)) {
    let node
    const s = context.source

    if (s.startsWith('{{')) {
      // 解析插值表达式
      node = parseInterpolation(context)
    } else if (s[0] === '<') {
      if (s[1] === '/') {
        // 结束标签
      } else if (/[a-z]/i.test(s[1])) {
        // 解析标签
        node = parseElement(context, ancestors)
      }
    }
    if (!node) {
      node = parseText(context)
    }
    nodes.push(node)
  }

  return nodes
}

function parseInterpolation(context) {
  const { advanceBy } = context
  // 移除 {{
  advanceBy(2)
  const closeIndex = context.source.indexOf('}}')
  const rawContent = context.source.slice(0, closeIndex)
  // 去掉前后空格
  const content = rawContent.trim()
  advanceBy(rawContent.length)
  // 移除 }}
  advanceBy(2)

  return {
    type: 'Interpolation',
    content: {
      type: 'Expression',
      content
    }
  }
}

function parseElement(context, ancestors) {
  // 解析开始标签
  // <div></div>
  const element = parseTag(context)

  ancestors.push(element)
  element.children = parseChildren(context, ancestors)
  ancestors.pop()

  if (context.source.startsWith(`</${element.tag}`)) {
    // 解析结束标签
    parseTag(context, 'end')
  } else {
    console.error(`缺失结束标签：${element.tag}`)
  }

  return element
}

function parseTag(context, type = 'start') {
  const { source, advanceBy } = context
  // <div></div>
  // type=start: ['<div', 'div', index: 0, input: '<div>', groups: undefined]
  const match =
    type === 'start'
      ? /^<([a-z][^\t\r\n\f />]*)/i.exec(source)
      : /^<\/([a-z][^\t\r\n\f />]*)/i.exec(source)
  const tag = match[1]

  // 移除 <div
  advanceBy(match[0].length)
  // 暂时不处理自闭合标签
  // 移除 >
  advanceBy(1)

  return {
    type: 'Element',
    tag,
    children: []
  }
}

function parseText(context) {
  let endIndex = context.source.length
  const ltIndex = context.source.indexOf('<')
  const delimiterIndex = context.source.indexOf('{{')

  if (ltIndex > -1 && ltIndex < endIndex) {
    endIndex = ltIndex
  }
  if (delimiterIndex > -1 && delimiterIndex < endIndex) {
    endIndex = delimiterIndex
  }

  const content = context.source.slice(0, endIndex)

  context.advanceBy(content.length)

  return {
    type: 'Text',
    content
  }
}

function isEnd(context, ancestors) {
  if (!context.source) return true
  // 与节点栈内全部的节点比较
  for (let i = ancestors.length - 1; i >= 0; --i) {
    if (context.source.startsWith(`</${ancestors[i].tag}`)) {
      return true
    }
  }
}

console.log('开始解析:')
const ast = parse(`<div><p>{{ msg }}</p><p>Template</p></div>`)

console.dir(ast, { depth: null })
