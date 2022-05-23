import styled, { css } from 'styled-components'
import { ComLayout } from '@/common/styled'
import { Row } from 'antd'

export const IGOnftWrapper = styled(ComLayout)`
  .igo-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2.5rem;
    .ant-btn {
      width: auto !important;
    }
  }
  .details-igonft {
    .details-igonft-left {
      display: flex;
      align-items: center;
      padding-top: 1.25rem;
      flex-direction: column;
      margin-bottom: 2.5rem;
      .ant-image {
        width: 100%;
        border-radius: 1.25rem;
        height: auto;
        box-shadow: 0.13rem 0.13rem 0.63rem 0rem rgba(18, 18, 27, 0.08);
      }
      .ant-image-img {
        border-radius: 1.25rem;
      }
    }
    .details-igonft-right {
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
  .igonft-two {
    ${(props) =>
      props.theme.mediaWidth.screenXl(
        () => css`
          margin: 0 2.5rem;
        `,
      )}
    ${(props) =>
      props.theme.mediaWidth.screenLg(
        () => css`
          margin: 0 1.13rem;
        `,
      )}
  }
`

export const IGOnftTitle = styled.div`
  height: 6.75rem;
  display: flex;
  justify-content: flex-start;
  align-items: end;
  padding-top: 0;
  .css-1okebmr-indicatorSeparator {
    display: none;
  }
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
  ${({ theme }) => theme.mediaWidth.screenMd`
    font-size: 2.31rem;
  `}
  ${({ theme }) => theme.mediaWidth.screenSm`
    font-size: 1.88rem;
  `}
`

export const IGOnftContent = styled.div`
  margin-top: 3.75rem;
  h3 {
    font-size: 1.88rem;
    font-weight: bold;
    color: #5746fe;
  }
  h5 {
    font-size: 0.88rem;
    font-weight: 400;
    color: #363639;
    line-height: 1.56rem;
  }
`

export const ContentList = styled(Row)`
  margin-top: 2.5rem;
  .ant-col {
    margin-bottom: 4.38rem;
  }
  .ant-cols {
    flex-direction: row;
    display: flex;
    height: 17.5rem;
    border: 0.06rem solid #5746fe;
    border-radius: 0.63rem;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .ant-image {
      width: 95%;
      margin: 0 2.5%;
      max-width: 12.5rem;
      height: auto;
      max-height: 12.5rem;
      border-radius: 0.63rem;
      .ant-image-img {
        border-radius: 0.63rem;
      }
    }
    .right {
      width: 95%;
      margin: 0 2.5%;
      span {
        font-size: 1.25rem;
        font-weight: 400;
        color: #363639;
        line-height: 1.56rem;
      }
      p {
        font-size: 0.88rem;
        font-weight: 400;
        color: #363639;
        line-height: 1.56rem;
      }
    }
    .ant-col {
      margin-bottom: 0;
    }
  }
`
