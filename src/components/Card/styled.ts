import styled, { css } from 'styled-components'

export const ImageDiv = styled.div`
  width: 100%;
  height: 15rem;
  border-radius: 0.31rem 0.31rem 0 0;
  .ant-image,
  .card-img {
    width: 100%;
    height: 15rem;
    border-radius: 0.31rem 0.31rem 0 0;
    object-fit: cover;
  }
`

export const CardWrapper = styled.div`
  width: calc(100% - 1.31rem);
  min-height: 14rem;
  background: #ffffff;
  border: 0.06rem solid #e8e9ee;
  border-radius: 0.31rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  position: relative;
  flex-direction: column;
  cursor: pointer;

  .eth-span {
    position: relative;
    font-weight: 400;
    float: right;
    display: flex;
    font-size: 0.88rem;
    width: 100%;
    .ant-image {
      display: flex;
      align-items: center;
    }
    span {
      width: calc(100% - 1.25rem);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &:hover {
    box-shadow: 0rem 0rem 0.63rem 0rem rgba(67, 68, 82, 0.28);
  }
  .divss {
    display: flex;
    justify-content: space-between;
    width: 95%;
    margin-top: 1.19rem;
    margin-bottom: 1rem;
    .b {
      font-size: 0.75rem;
      color: #363639;
    }
    h5 {
      width: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.75rem;
      font-weight: 400;
      color: ${(props) => props.theme.gray};
      :nth-child(2) {
        text-align: end;
      }
    }
    .price-h4 {
      justify-content: flex-end;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: end;
    }
    h4 {
      margin-top: 0;
      font-size: 0.88rem;
      font-weight: 400;
      color: #363639;
      display: flex;
      align-items: center;
      width: 50%;
      .icosns {
        margin-right: 0.56rem;
        width: 0.69rem;
        height: auto;
      }
      span {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .dirce {
    margin-top: 0;
    border-bottom: 1px solid rgba(232, 233, 238, 0.4);
  }
  ${({ theme }) => theme.mediaWidth.screenMd`
    .divss {
      flex-wrap: wrap;
      .b {
        font-size: 1.25rem;
      }
      h5, h4 {
        font-size: 1.25rem;
        text-align: start !important;
      }
      .buy-now-btn, .buy-now-btn1 {
        min-width: 90%;
        margin-left: 5%;
        margin-top: 1.25rem;
        font-size: 1.5rem;
      }
    }
    .divss.ssss-h5 {
      display: flex;
      flex-direction: column-reverse;
    }
  `}
`

export const Span = styled.div`
  font-size: 0.88rem;
  font-weight: 400;
  color: ${(props) => props.theme.gray};
  line-height: 1.56rem;
  width: calc(100% - 1.88rem);
  margin: 1.88rem 0;
  text-align: center;
  ${({ theme }) => theme.mediaWidth.screenMd`
    font-size: 1.25rem;
    height: 3.63rem;
  `}
`

export const SpanStatus3 = styled.div`
  font-size: 0.88rem;
  font-weight: 400;
  color: ${(props) => props.theme.gray};
  line-height: 1.56rem;
  margin-top: 1rem;
  width: calc(100% - 1.88rem);
  position: relative;
  .three-span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #363639;
    margin-bottom: 0.63rem;
  }
  .three-span1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0.63rem;
  }
  ${({ theme }) => theme.mediaWidth.screenMd`
    font-size: 1.25rem;
    height: 3.63rem;
  `}
`

export const MyNftContent = styled.div`
  margin-bottom: 1.38rem;
  width: 100%;
  .ant-col {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .ant-btn[disabled],
  .ant-btn[disabled]:hover,
  .ant-btn[disabled]:focus,
  .ant-btn[disabled]:active {
    border-color: #c0c3da;
    color: #c0c3da;
    background: transparent;
  }
`

export const CardModalImage = styled.div`
  width: 95%;
  height: auto;
  min-height: 16.25rem;
  max-height: 16.25rem;
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const CardModalWrapper = styled.div`
  min-height: 14rem;
  background: #ffffff;
  border-radius: 0.31rem;
  .card-modal-img {
    height: auto;
    max-width: 95%;
    width: auto;
    border-radius: 0.31rem;
    max-height: 16.25rem;
    ${(props) =>
      props.theme.mediaWidth.screenLg(
        () => css`
          height: 100%;
          width: auto;
        `,
      )}
  }
  .ant-image {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title {
    font-size: 1.88rem;
    font-weight: 600;
    color: #363639;
    text-align: center;
    margin-top: 1.88rem;
  }
`

// export const MyNftTitleToken = styled.div`
//   min-width: 5.63rem;
//   height: 1.75rem;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 0 0.63rem;
//   background: rgba(47, 48, 59, 0.2);
//   font-size: 0.75rem;
//   font-weight: 400;
//   position: absolute;
//   right: 7%;
//   top: 0.88rem;
//   color: ${({ theme }) => theme.themeColor};
//   span {
//     color: #fff;
//   }
//   ${({ theme }) => theme.mediaWidth.screenMd`
//     font-size: 1.25rem;
//   `}
// `

export const CardBuilt = styled.div`
  min-width: 3.13rem;
  padding: 0 0.63rem;
  height: 1.5rem;
  background: ${(props) => props.theme.themeColor};
  border-radius: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  color: #fff;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
`
