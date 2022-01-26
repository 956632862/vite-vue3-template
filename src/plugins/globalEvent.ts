import any from "async-validator/dist-types/validator/any";

export default {
  /**
   * 日常使用函数
   */
  random(min:number, max:number) {
    return Math.round(Math.random() * (max - min)) + min;
  },

  // 获取数据类型
  getDataType(data: object) {
    return Object.prototype.toString.call(data).slice(8, -1)
  },

  // 判断数据是空 空为true
  isEmpty(data: any) {
    // 先判断空数组或者空对象
    this.getDataType(data) === 'Object' && (data = Object.keys(data))
    if (this.getDataType(data) === 'Array') return data.length === 0
    return !data
  },

  deepClone(target: any) {
    const whiteType = ['Object', 'Array']
    if (!whiteType.includes(this.getDataType(target))) return target
    if (this.isEmpty(target)) return target
    const _deepData: any = Array.isArray(target) ? [] : {}
    for (const deepDataKey in target) {
      if (target.hasOwnProperty(deepDataKey)) {
        const type = this.getDataType(target[deepDataKey])
        _deepData[deepDataKey] = whiteType.includes(type) ? this.deepClone(target[deepDataKey]) : target[deepDataKey]
      }
    }
    return _deepData
  },

  install(app: any, options: any) {
    const events = Object.keys(this).filter(n => n !== 'install')
    const _default: any = {}
    const that: any = this
    for (let i = 0; i < events.length; i++) {
      const key: string = events[i]
      _default[key] = that[key]
    }
    app.config.globalProperties.$g_event = _default
  }
}
