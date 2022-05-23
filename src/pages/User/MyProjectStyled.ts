import styled, { css } from 'styled-components'
import { ComLayout } from '@/common/styled'

export const MyProjectWrapper = styled(ComLayout)`
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

export const MyProjectTitle = styled.div`
  height: 6.75rem;
  display: flex;
  justify-content: space-between;
  align-items: end;
  padding-top: 0;
  .title-right {
    .create-btn {
      margin-left: 1.25rem;
    }
  }
`

export const MyProjectTitle1 = styled.div`
  height: 6.75rem;
  display: flex;
  justify-content: space-between;
  align-items: end;
  padding-top: 0;
  .title-right {
    .create-btn {
      margin-left: 1.25rem;
    }
  }
  .title {
    line-height: 4rem;
  }
  ${(props) =>
    props.theme.mediaWidth.screenLg(
      () => css`
        flex-direction: column;
        align-items: flex-start;
        margin-top: 3rem;
        height: auto;
        .title-right {
          margin-top: 1.25rem;
          .create-btn {
            margin-left: 0;
          }
          .import-btn {
            margin-right: 1.25rem;
          }
          .ant-btn {
            margin-bottom: 0.63rem;
          }
        }
      `,
    )}
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

export const MyProjectList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 3.38rem;
`

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

export const ListInfo = styled.div`
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
  &:hover {
    box-shadow: 0rem 0rem 0.63rem 0rem rgba(67, 68, 82, 0.28);
  }
  span {
    font-size: 1rem;
    font-weight: 400;
    color: #363639;
    line-height: 1.56rem;
    margin-top: 0.88rem;
  }
  h5 {
    font-size: 0.88rem;
    font-weight: 400;
    color: #80808b;
    line-height: 1.56rem;
    margin: 0.81rem 0 1.81rem 0;
  }
`

export const TitleMin = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3.75rem;
  margin-top: 2.5rem;
  .left {
    display: flex;
    align-items: center;
    span {
      font-size: 0.88rem;
      font-weight: 400;
      color: ${(props) => props.theme.gray};
      line-height: 1.56rem;
    }
    p {
      font-size: 0.88rem;
      font-weight: 400;
      color: #363639;
      margin-left: 0.38rem;
      margin-right: 1.25rem;
      margin-bottom: 0;
      line-height: 1.56rem;
    }
    .theme {
      color: ${(props) => props.theme.themeColor};
    }
  }
  ${(props) =>
    props.theme.mediaWidth.screenLg(
      () => css`
        flex-direction: column;
        align-items: flex-start;
        height: auto;
        .left {
          margin-bottom: 1.25rem;
        }
      `,
    )}
`

export const MyProjectCurrent = styled.div`
  padding: 3.75rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
`
