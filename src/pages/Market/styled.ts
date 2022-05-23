import styled, { css } from 'styled-components'
import { Row } from 'antd'

export const TradingFloorWrapper = styled.div`
  margin-top: 5rem;
  width: 100%;
  .addDes {
    display: flex;
    justify-content: center;
  }
  .content-nft {
    padding-top: 3.75rem;
  }
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
  .left {
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
  .details-shop {
    .details-shop-left {
      display: flex;
      align-items: center;
      padding-top: 1.25rem;
      flex-direction: column;
      .ant-image {
        max-width: 95%;
        border-radius: 0.31rem;
        max-height: 37.5rem;
        box-shadow: 0.13rem 0.13rem 0.63rem 0rem rgba(18, 18, 27, 0.08);
      }
      .ant-image-img {
        border-radius: 0.31rem;
        max-height: 37.5rem;
      }
    }
    .details-shop-right {
      display: flex;
      flex-direction: column;
      padding-top: 1.25rem;
      h2 {
        font-size: 1.88rem;
        margin: 1.69rem 0;
        font-weight: 700;
      }
      h4 {
        font-size: 1rem;
        font-weight: 400;
        color: #363639;
        margin-bottom: 1.88rem;
      }
    }
  }
  ${({ theme }) => theme.mediaWidth.screenSm`
    .content-shop {
      padding: 1.25rem 1rem 0 1rem;
    }
  `}
`

export const TradingFloorLeft = styled.div`
  min-height: 80vh;
  background: #ffffff;
  position: relative;
  .left-icon {
    position: absolute;
    top: 2.38rem;
    font-size: 1.48rem;
    color: ${({ theme }) => theme.themeColor};
    left: calc(50% - 0.94rem);
    cursor: pointer;
  }
  .left-active-icon {
    font-size: 1.48rem;
    color: ${({ theme }) => theme.themeColor};
    cursor: pointer;
  }
`

export const TradingFloorContent = styled.div<{ active: boolean }>`
  ${(props) =>
    props.active
      ? css`
          padding: 0 0 0 1.56rem;
          ${(props) =>
            props.theme.mediaWidth.screenMd(
              () => css`
                padding: 0 1.13rem;
              `,
            )}
        `
      : css`
          padding: 0 12.5rem;
          @media (max-width: 1700px) {
            padding: 0 11.5rem;
          }
          @media (max-width: 1500px) {
            padding: 0 10.5rem;
          }
          @media (max-width: 1400px) {
            padding: 0 9.5rem;
          }
          @media (max-width: 1300px) {
            padding: 0 8.5rem;
          }
          ${(props) =>
            props.theme.mediaWidth.screenLg(
              () => css`
                padding: 0 2.5rem;
              `,
            )}
          ${(props) =>
            props.theme.mediaWidth.screenMd(
              () => css`
                padding: 0 1.13rem;
              `,
            )}
        `}
`

export const TradingFloorTitle = styled.div<{ active: boolean }>`
  min-height: 6.75rem;
  display: flex;
  justify-content: space-between;
  align-items: end;
  ${(props) =>
    props.active
      ? css`
          padding: 0 0 0 1.56rem;
          ${(props) =>
            props.theme.mediaWidth.screenMd(
              () => css`
                padding: 0 1.13rem;
              `,
            )}
        `
      : css`
          padding: 0 12.5rem;
          @media (max-width: 1700px) {
            padding: 0 11.5rem;
          }
          @media (max-width: 1500px) {
            padding: 0 10.5rem;
          }
          @media (max-width: 1400px) {
            padding: 0 9.5rem;
          }
          @media (max-width: 1300px) {
            padding: 0 8.5rem;
          }
          ${(props) =>
            props.theme.mediaWidth.screenLg(
              () => css`
                padding: 0 2.5rem;
              `,
            )}
          ${(props) =>
            props.theme.mediaWidth.screenMd(
              () => css`
                padding: 0 1.13rem;
              `,
            )}
        `}
  .css-1okebmr-indicatorSeparator {
    display: none;
  }
  ${({ theme }) => theme.mediaWidth.screenMd`
    flex-direction: column;
    align-items: start;
    justify-content: end;
  `}
`

export const Title = styled.div`
  font-size: 3.5rem;
  font-weight: 600;
  color: #363639;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1.88rem;
  a {
    color: #363639;
  }
  span {
    font-size: 3rem;
  }
  ${({ theme }) => theme.mediaWidth.screenMd`
    font-size: 2.31rem;
    line-height: 4.75rem;
    span {
      line-height: 4.75rem;
      font-size:  2.31rem;
    }
  `}
  ${({ theme }) => theme.mediaWidth.screenSm`
    font-size: 1.88rem;
    span {
      font-size: 1.88rem;
    }
  `}
`

export const TitlteRight = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .css-1okebmr-indicatorSeparator {
    display: none;
  }
  .left {
    width: 60%;
    display: flex;
    align-items: center;
  }
  margin-top: 3.75rem;
  ${({ theme }) =>
    theme.mediaWidth.screenMd(
      () => css`
        flex-direction: column;
        margin-top: 2.75rem;
        .left {
          width: 100%;
          margin-bottom: 1.25rem;
          display: flex;
          flex-wrap: wrap;
        }
      `,
    )}
`

export const RightContent = styled.div`
  padding-top: 2.56rem;
  .price-number {
    margin: 1.31rem 1.25rem 1.25rem 1.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .ant-input-number {
      width: 100%;
      height: 2.38rem;
      background: #ffffff;
      border: 0.06rem solid #e8e9ee;
      border-radius: 0.63rem;
    }
    .ant-input-number-input {
      height: 2.38rem;
    }
    ${(props) =>
      props.theme.mediaWidth.screenLg(
        () => css`
          .ant-input-number {
            height: 3.38rem;
          }
          .ant-input-number-input {
            height: 3.38rem;
          }
        `,
      )}
  }
  .price-num-to {
    font-size: 1rem;
    font-weight: 500;
    color: #363639;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .nft-list {
    margin: 1.38rem 1.25rem;
    display: flex;
    flex-wrap: wrap;
    .nft-btn {
      width: calc(50% - 0.5rem);
      height: 2.38rem;
      ${(props) => props.theme.mediaWidth.screenLg`
        height: 3.38rem;
      `}
      background: #ffffff;
      border: 0.06rem solid #e8e9ee;
      border-radius: 0.63rem;
      margin-bottom: 0.88rem;
      font-size: 1rem;
      font-weight: 500;
      color: #363639;
      &:nth-child(2n-1) {
        margin-right: 1rem;
      }
      &:hover {
        border-color: ${(props) => props.theme.themeColor};
        color: ${(props) => props.theme.themeColor};
      }
    }
    .nft-btn.active {
      border-color: ${(props) => props.theme.themeColor};
      color: ${(props) => props.theme.themeColor};
    }
  }
  ${({ theme }) => theme.mediaWidth.screenMd`
    .price-num-to {
      font-size: 1.25rem;
    }
    .nft-list {
      .nft-btn {
        font-size: 1.25rem;
      }
    }
  `}
`

export const RightTitle = styled.div`
  height: 4rem;
  padding-left: 1.5rem;
  background: ${(props) => props.theme['gary-4']};
  line-height: 4rem;
  font-size: 1rem;
  font-weight: bold;
  color: #363639;
  ${({ theme }) => theme.mediaWidth.screenMd`
    font-size: 1.25rem;
  `}
`

export const SelectionDiv = styled.div`
  padding: 0 1.5rem;
  padding-bottom: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 1.5rem;
    font-weight: 600;
    margin-left: 0.94rem;
    color: #363639;
  }
`

export const ThemeList = styled.div`
  width: 14rem;
  height: 2.38rem;
  background: #fff;
  border: 0.06rem solid #5746fe;
  border-radius: 0.63rem;
  font-size: 1rem;
  font-weight: 400;
  color: #5746fe;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.25rem 0 2.5rem 1.38rem;
  ${({ theme }) => theme.mediaWidth.screenMd`
    font-size: 1.25rem;
    width: 15rem;
    height: 3.38rem;
  `}
`

export const PriceDivCard = styled(Row)`
  width: 100%;
  margin-top: 1.44rem;
  justify-content: center;
  align-items: center;
  .css-1okebmr-indicatorSeparator {
    display: none;
  }
`

export const customStylesPay = {
  placeholder: (provided: any) => ({
    ...provided,
    color: '#80808B',
    fontWeight: 400,
    fontSize: '0.88rem',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    minWidth: '11.88rem',
    height: '2.38rem',
    minHeight: 'auto',
    color: '#ffffff',
    // textIndent: '2em',
    textAlign: 'center',
    border: '0.9px solid #5746FE',
    borderRadius: '0.63rem',
    display: 'flex',
    background: 'transparent',
    boxShadow: '1px solid transparent',
    '&:hover': {
      borderColor: '#5746FE',
    },
    '@media screen and (max-width: 992px)': {
      height: '3.38rem',
    },
    '@media screen and (max-width: 1200px)': {
      minWidth: '8.88rem',
    },
    '@media screen and (max-width: 1400px)': {
      minWidth: '9.88rem',
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    borderBottom: 'none',
    color: state.isSelected ? '#5746FE' : '#ffffff',
    background: '#ffffff',
    textAlign: 'center',
    fontSize: '14px',
    margin: 0,
    ':active': {
      backgroundColor: '#EFEEFD',
    },
    ':hover': {
      color: '#5746FE',
      backgroundColor: '#EFEEFD',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    boxShadow: 'none',
    borderRadius: '0.31rem',
    // marginTop: '1.5rem',
    backgroundColor: '#ffffff',
  }),
  menuList: (provided: any) => ({
    ...provided,
    borderRadius: '0.31rem',
    padding: '0.5rem 0',
    boxShadow: '0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)',
  }),
  singleValue: (provided: any, state: any) => {
    const transition = 'opacity 300ms'
    return { ...provided, transition, color: '#80808B', fontSize: '0.88rem' }
  },
}

export const SelectionNumDiv = styled.div`
  min-width: 17.5rem;
  height: 2.5rem;
  border: 0.06rem solid #5746fe;
  border-radius: 0.63rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  margin-right: 1.25rem;
  .icons {
    width: 0.69rem;
    height: auto;
    margin-left: 1.81rem;
    margin-right: 0.75rem;
  }
  .leftsss {
    margin-left: 1.81rem;
  }
  .right-icons {
    font-size: 1.13rem;
    color: #a3b7c3;
    margin-right: 1.25rem;
    cursor: pointer;
  }
  span {
    color: #5746fe;
  }
  ${({ theme }) => theme.mediaWidth.screenMd`
   width: 10.75rem;
   height: 3.25rem;
   font-size: 1.25rem;
   margin: 1rem 0;
   margin-right: 1rem;
  `}
`

export const H5Bottom = styled.div`
  height: 6rem;
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  .su-btn {
    background: ${({ theme }) => theme.themeColor};
    border-radius: 0.63rem;
    width: 50%;
    height: 39px;
    color: #fff;
    border-color: ${({ theme }) => theme.themeColor};
  }
`

export const PriceDiv = styled.div`
  font-size: 1.88rem;
  font-weight: bold;
  color: #5746fe;
  display: flex;
  align-items: center;
  .ant-image {
    margin-right: 0.75rem;
  }
`

export const CurrentThemeDiv = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: ${(props) => props.theme.gray};
`

export const DescribeDiv = styled.div`
  width: 100%;
  min-height: 10.25rem;
  background: ${(props) => props.theme['gary-4']};
  border-radius: 0.63rem;
  display: flex;
  flex-direction: column;
  padding: 2.5rem 3.13rem 0 3.13rem;
  margin-bottom: 3.13rem;
  .price-content {
    display: flex;
    flex-direction: column;
    margin-bottom: 2.5rem;
    h5 {
      font-size: 0.88rem;
      font-weight: 400;
      color: ${(props) => props.theme.gray};
      margin-top: 2.06rem;
    }
  }
  h3 {
    font-size: 1.63rem;
    font-weight: bold;
    color: #363639;
    margin-bottom: 1.88rem;
  }
  ul {
    list-style-type: none;
    padding-inline-start: 0;
  }
  li {
    list-style-type: none;
    font-size: 1rem;
    font-weight: 400;
    color: ${(props) => props.theme.gray};
    margin-bottom: 2.19rem;
    word-break: break-all;
    &::marker {
      content: '';
    }
  }
  .info {
    margin-bottom: 2rem;
    font-size: 1rem;
    font-weight: 400;
    color: #363639;
    display: flex;
    margin-left: 0.88rem;
    .span {
      font-weight: 400;
      width: 44%;
      color: ${(props) => props.theme.gray};
    }
  }
`

export const NftList = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const ShopDiv = styled.div`
  background: ${(props) => props.theme['gary-4']};
  padding: 2.5rem 3.13rem;
  border-radius: 0.63rem;
  h3 {
    font-size: 1.63rem;
    font-weight: bold;
    color: #363639;
    margin-bottom: 1.88rem;
  }
  ${({ theme }) => theme.mediaWidth.screenMd`
    padding: 1.5rem 1.13rem;
  `}
`
export const TableList = styled.table`
  background: #ffffff;
  border-radius: 0.63rem;
  width: 100%;
  tr {
    width: 100%;
    th {
      width: 25%;
      font-size: 1rem;
      font-weight: 400;
      color: ${(props) => props.theme.gray};
      line-height: 1.56rem;
      height: 2.44rem;
      border-bottom: 0.06rem solid #e5e5e5;
      &:nth-child(1) {
        text-indent: 1.25rem;
      }
    }
    td {
      width: 25%;
      font-size: 1rem;
      font-weight: 400;
      color: ${(props) => props.theme.gray};
      line-height: 1.56rem;
      height: 2.44rem;
      text-align: center;
      &:nth-child(1) {
        text-indent: 1.25rem;
      }
    }
  }
`

export const ImageDiv = styled.div`
  width: 100%;
  height: 37.5rem;
  border-radius: 0.31rem;
  box-shadow: 0.13rem 0.13rem 0.63rem 0rem rgba(18, 18, 27, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  video {
    width: 100%;
    height: 100%;
  }
`

export const SearchInput = styled.div`
  width: 15.75rem;
  ${(props) => props.theme.mediaWidth.screenMd`
    width: 100%;
  `}
`
