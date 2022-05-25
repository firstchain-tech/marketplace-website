export const infoAction = (res: any) => ({
  type: 'setInfo',
  res,
})

export const SaveInfoWeb3Storage = (res: any[]) => ({
  type: 'setWeb3Storage',
  web3StorageList: res,
})
