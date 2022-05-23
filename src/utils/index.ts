import type { CardType } from '@/common/data.d'

/** address interception */
export const formatStrAddress = (a: number, b: number, str: string) =>
  str.substring(0, a) + new Array(4).join('.') + str.substring(str.length - b, str.length)

/** scroll throttle */
export const throttle = (fn: Function, rateTime: number) => {
  let timer: any = null
  return (...args: any[]) => {
    if (!timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, rateTime)
  }
}

/** Anti-Shake Search */
export const debounced = (fn: any, debTime: number) => {
  let timer: any = null
  return (...args: any[]) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, debTime)
  }
}

/** Anchor */
export const scrollToAnchor = (anchorName: string) => {
  if (anchorName) {
    let anchorElement = document.getElementById(anchorName)
    if (anchorElement) anchorElement.scrollIntoView({ block: 'end' })
  }
}

/** Validation retains 6 decimal places */
export const validateValue = (value: any) => {
  let rs = /^[0-9]+(\.[0-9]{1,6})?$/
  if (!rs.test(value)) return false
  else return true
}

export const Adapth5 = 768
export const AdaptFontSize = 992

/** The array of cartype objects has tokenid de duplication */
export const objArrayDuplicateRemoval = (oldArr: CardType[]) => {
  let obj: { [key: string]: boolean } = {}
  let arr_new: CardType[] = oldArr.reduce<CardType[]>((cur: any, next: any) => {
    if (!obj[next.tokenId]) {
      cur.push(next)
      obj[next.tokenId] = true
    }
    return cur
  }, [])

  return arr_new
}

export const getBase64 = (img: any, callback: any) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export const fuzzyMatch = (str: string, key: string) => {
  let index = -1,
    flag = false
  let arr: any[] = key.split('')
  for (let i = 0; i < arr.length; i++) {
    if (str.indexOf(arr[i]) < 0) {
      break
    } else {
      let match = str.matchAll(arr[i])
      let next: any = match.next()
      while (!next.done) {
        if (next.value.index > index) {
          index = next.value.index
          if (i === arr.length - 1) {
            flag = true
          }
          break
        }
        next = match.next()
      }
    }
  }
  return flag
}
