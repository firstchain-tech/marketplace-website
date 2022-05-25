const getWeb3StorageList = () => {
  let localLength = localStorage.getItem('web3storage_number') || '0'
  let localWeb3StorageList = []
  for (let i = 0; i < Number(localLength); i++) {
    let obj: any = localStorage.getItem(`web3storage_list_${i}`)
    let listObj = JSON.parse(obj)
    localWeb3StorageList.push(...listObj)
  }
  return localWeb3StorageList
}

const initState = {
  igoList: [],
  igoDefaultEmail: '',
  web3StorageList: getWeb3StorageList() as any,
}

function reducer(state = initState, action: any) {
  const { type } = action

  switch (type) {
    case 'setInfo':
      return {
        ...state,
        igoList: action.res.igoList,
        igoDefaultEmail: action.res.igoDefaultEmail,
      }
    case 'setWeb3Storage':
      return { ...state, web3StorageList: action.web3StorageList }
    default:
      return state
  }
}
export default reducer
