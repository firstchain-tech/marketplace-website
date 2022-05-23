import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export interface ListType {
  key?: string | number
  img: string
  icon: string
  name: string
  content: string[]
  title: string
  serialNumber: string
}

export const useIGOnftHooks = () => {
  const [list, setList] = useState<ListType[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const { igoList } = useSelector((state: any) => state.infoInfo)

  useEffect(() => {
    if (igoList.length > 0) {
      setLoading(true)
      getList()
    }
    return () => {
      setList([])
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [igoList])

  const getList = async () => {
    try {
      setList(igoList)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return { loading, listData: list }
}
