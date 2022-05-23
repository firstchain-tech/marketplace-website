import styled from 'styled-components'
import { ComLayout } from '@/common/styled'

export const UserHomeWrapper = styled.div`
  margin-top: 5rem;
  margin-bottom: 8.75rem;
  .content-home {
    padding: 2.5rem 0 0 0;
  }
  .details-home {
    .details-home-content {
      padding-top: 1.25rem;
      width: 100%;
    }
    .top-right {
      font-size: 1.25rem;
      color: #363639;
      font-weight: 400;
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 2.81rem;
      span {
        color: ${(props) => props.theme.gray};
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .anticon-wallet {
        font-size: 2.13rem;
        color: ${(props) => props.theme.themeColor};
      }
    }
  }
  .content-white {
    width: 100%;
    min-height: 13.19rem;
    background: ${(props) => props.theme['gary-4']};
    border-radius: 0.63rem;
    margin-bottom: 3.13rem;
    padding: 2.5rem 4.88rem 0;
    position: relative;
    ul {
      list-style-type: none;
      padding-inline-start: 0;
      li {
        margin-bottom: 2.5rem;
        font-size: 1.25rem;
        font-weight: 400;
        color: #363639;
        list-style-type: none;
        ::marker {
          content: '';
        }
        :nth-child(1) {
          margin-bottom: 1.25rem;
        }
      }
    }
  }
`
export const UserHomeTitle = styled(ComLayout)`
  height: 6.75rem;
  display: flex;
  justify-content: flex-start;
  align-items: end;
  position: relative;
  padding-top: 0;
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

export const ContentTitle = styled.div`
  height: 4.69rem;
  font-size: 2rem;
  font-weight: 600;
  line-height: 4.69rem;
  color: #363639;
  margin-bottom: 2.5rem;
`

export const GovernanceContent = styled.div`
  min-height: 17.13rem;
  display: flex;
  flex-wrap: wrap;
  .content {
    display: flex;
    width: 50%;
    flex-direction: column;
    align-items: center;
    .span {
      font-size: 2.25rem;
      font-weight: 600;
      color: #363639;
      line-height: 3rem;
      margin-top: 3.31rem;
    }
    h5 {
      font-size: 1.5rem;
      font-weight: 400;
      color: #363639;
      margin-bottom: 3.13rem;
    }
  }
  ${({ theme }) => theme.mediaWidth.screenSm`
    .content {
      width: 100%;
    }
  `}
`

export const ContentLi = styled.div`
  margin-top: 1.25rem;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  span {
    margin-left: 0.69rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.81rem;
    color: ${(props) => props.theme.gray};
  }
  ${({ theme }) => theme.mediaWidth.screenMd`
    width: 100%;
    padding-right: 2rem;
  `}
`
