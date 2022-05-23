import styled from 'styled-components'

export const UserMyNftWrapper = styled.div`
  margin-top: 5rem;
  margin-bottom: 8.75rem;
  .pagination-nft {
    height: 8.31rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .ant-pagination-item,
    .ant-pagination-item-link {
      border-radius: 0.25rem;
    }
  }
  .mynft-details {
    padding-top: 0;
  }
  .content-nft {
    padding: 3.75rem 0 0 0;
  }
  .content-nft-info {
    width: 20%;
    display: flex;
    justify-content: center;
    ${({ theme }) => theme.mediaWidth.screebXll`
      width: 25%;
    `}
    ${({ theme }) => theme.mediaWidth.screenMd`
      width: 50%;
    `}
    ${({ theme }) => theme.mediaWidth.screenXl`
      width: 33%;
    `}
    ${({ theme }) => theme.mediaWidth.screenSm`
      width: 50%;
    `}
  }
`

export const TitleVice = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: ${(props) => props.theme.gray};
  width: 100%;
  height: 3.75rem;
  background: ${(props) => props.theme['gary-4']};
  border-radius: 0.63rem;
  display: flex;
  padding-left: 2.5rem;
  align-items: center;
  margin-bottom: 1.88rem;
  .titlesssssss {
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  ${({ theme }) => theme.mediaWidth.screenMd`
    margin-top: 1.88rem;
  `}
`

export const StateList = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: flex-end;
  .span {
    font-size: 1.25rem;
    font-weight: 400;
    color: ${(props) => props.theme.gray};
    line-height: 1.56rem;
    margin-top: 3.75rem;
    cursor: pointer;
  }
  .span.active {
    color: ${({ theme }) => theme.themeColor};
    font-weight: bold;
  }
  background: ${(props) => props.theme['gary-4']};
  border-radius: 0.63rem;
  height: 100%;
  ${({ theme }) => theme.mediaWidth.screenMd`
    .span {
      font-size: 1.5rem;
      margin-left: 2.5rem;
      margin-top: 0;
      height: 4.38rem;
      line-height: 4.38rem;
    }
    flex-direction: row-reverse;
  `}
`

export const NftList = styled.div`
  display: flex;
  flex-wrap: wrap;
`
