/**
 *
 * @param mayExistArr Returns an array that must exist in the value
 * @param transferFilterArr transfer event filtered array (sell or buy market)
 * @param marketAddress Market contract address
 * @returns An array of tokenids that exist in the market
 */
export const getOwendTokendsMarketData = async (mayExistArr: any[], transferFilterArr: any[], marketAddress: string) => {
  let marketOwnedTokens: string[] = []
  mayExistArr.forEach((item) => {
    let obj = transferFilterArr.find(
      (ite) =>
        ite.tokenId === item.tokenId &&
        ite.from.toLowerCase() !== marketAddress.toLowerCase() &&
        ite.to.toLowerCase() === marketAddress.toLowerCase(),
    )
    if (obj && obj instanceof Object) marketOwnedTokens.push(obj.tokenId)
  })
  return marketOwnedTokens
}

/**
 *
 * @param transferFilterArr transfer event filtered array (create or buy market)
 * @param mAddress My Address
 * @param marketAddress Market contract address
 * @returns array of tokenids that exist in my backpack
 */
export const getOwendTokendsMyNftData = async (transferFilterArr: any[], mAddress: string, marketAddress: string) => {
  let myTransferSource: string[] = []
  transferFilterArr.forEach((item) => {
    if (item.to.toLowerCase() === mAddress.toLowerCase()) {
      if (item.from === '0x0000000000000000000000000000000000000000' || item.from.toLowerCase() === marketAddress.toLowerCase()) {
        myTransferSource.push(item.tokenId)
      }
    }
  })
  return myTransferSource
}
