import { reactive, shallowReactive } from '../utils/reactive.js'
import { effect } from '../utils/effect.js'

const data = {
  foo: {
    deep: 1,
    shallow: 1
  }
}
// 深响应
const deepProxy = reactive(data)
// 浅响应
const shallowProxy = shallowReactive(data)

effect(() => {
  console.log(deepProxy.foo.deep)
})

deepProxy.foo.deep = 2

console.log('-------------------')

effect(() => {
  console.log(shallowProxy.foo.shallow)
})

shallowProxy.foo.shallow = 2
