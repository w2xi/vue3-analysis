function isAlpha(char) {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')
}

// <p>Vue</p>
// =>
// [
//   { type: 'tag', name: 'p' },
//   { type: 'text', content: 'Vue' },
//   { type: 'tagEnd', name: 'p' },
// ]

const State = {
  initial: 1, // 初始化状态
  tagOpen: 2, // 标签开始状态
  tagName: 3, // 标签名称状态
  text: 4, // 文本状态
  tagEnd: 5, // 结束标签状态
  tagEndName: 6 // 结束标签名称状态
}

function tokenize(str) {
  let currentState = State.initial
  let chars = ''
  while (str) {
    const c = str[0]
    if (c === '<') {
      currentState = State.tagOpen
      str = str.slice(1)
    } else if (isAlpha(c)) {
      currentState = State.tagName
      chars += c
      str = str.slice(1)
    } else if (c === '>') {
    } else if (c === '/') {
      currentState = State.tagEnd
    }
  }
}