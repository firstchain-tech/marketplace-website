import styled from 'styled-components'

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

export const CreateDetailsModalWrapper = styled.div`
  .details-shop {
    .details-shop-left {
      display: flex;
      align-items: center;
      padding-top: 1.25rem;
      flex-direction: column;
      .ant-image {
        max-width: 95%;
        max-height: 37.5rem;
        border-radius: 0.31rem;
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

export const DescribeDiv = styled.div`
  width: 100%;
  min-height: 12.25rem;
  background: ${(props) => props.theme['gary-4']};
  border-radius: 0.63rem;
  display: flex;
  flex-direction: column;
  padding: 2.5rem 3.13rem 0 3.13rem;
  margin-bottom: 3.13rem;
  justify-content: center;
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

export const CurrentThemeDiv = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: ${(props) => props.theme.gray};
`
