import styled from 'styled-components'
import { ComLayoutTwo } from '@/common/styled'

export const HomeWrapper = styled.div`
  margin-top: 5rem;
  .h5-anim {
    ${({ theme }) => theme.mediaWidth.screenMd`
      width: 80%;
    `}
    ${({ theme }) => theme.mediaWidth.screenSm`
      width: 100%;
    `}
  }
  .IntroduceA {
    width: 15rem;
    height: 3.75rem;
    border: 0.06rem solid #5746fe;
    border-radius: 0.63rem;
    font-size: 1.88rem;
    font-weight: bold;
    color: #5746fe;
    line-height: 1.56rem;
    margin-bottom: 5rem;
    border-color: #5746fe;
    :hover {
      color: #5746fe;
      border-color: #5746fe;
    }
    ${({ theme }) => theme.mediaWidth.screenMd`
      font-size: 1.5rem;
    `}
  }
  .HomeBannerTitle {
    width: 22.5rem;
    height: 4.38rem;
    background: #5746fe;
    border-radius: 0.63rem;
    text-align: center;
    font-weight: bold;
    color: #ffffff;
    font-size: 2.5rem;
    cursor: pointer;
    border-color: transparent;
  }
`

export const Banner = styled.div`
  position: relative;
  margin-top: 6.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const IntroduceDiv = styled.div`
  display: flex;
  align-items: center;
  /* min-height: 57.06rem; */
  flex-direction: column;
  ${({ theme }) => theme.mediaWidth.screenMd`
    // min-height: 56.56rem;
  `}
`

export const IntroduceTitle = styled.div`
  font-size: 3rem;
  font-weight: 600;
  color: #363639;
  margin-top: 6.25rem;
  margin-bottom: 3.13rem;
  span {
    color: #363639;
  }
  ${({ theme }) => theme.mediaWidth.screenMd`
    margin-bottom: 2.69rem;
    margin-top: 3.31rem;
    text-align: center;
  `}
`

export const IntroduceSpan = styled.div`
  font-size: 1.13rem;
  font-weight: 400;
  color: ${(props) => props.theme.gray};
  margin-bottom: 3.75rem;
  ${({ theme }) => theme.mediaWidth.screenMd`
    width: 35.13rem;
    margin-bottom: 2.06rem;
    text-align: center;
    font-size: 1.5rem;
  `}
`

export const IntroduceList = styled.div`
  display: flex;
  margin-bottom: 6.25rem;
  ${({ theme }) => theme.mediaWidth.screenMd`
    justify-content: space-between;
    margin: 0 1.38rem;
  `}
  ${({ theme }) => theme.mediaWidth.screenSm`
    flex-wrap: wrap;
    justify-content: center;
  `}
`

export const ImageDiv = styled.div`
  width: 20.13rem;
  height: 20.13rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem 0;
`

export const ListInfo = styled.div`
  width: 21rem;
  min-height: 26.13rem;
  background: #ffffff;
  border: 0.06rem solid #5746fe;
  border-radius: 0.63rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  :nth-child(1) {
    margin-right: 2.19rem;
  }
  img {
    width: 100%;
    height: auto;
    max-height: 20.13rem;
    border-radius: 0.63rem;
  }
  span {
    font-size: 1.25rem;
    font-weight: 400;
    color: #363639;
    text-align: center;
    margin-top: 1.88rem;
    margin-bottom: 1.88rem;
  }
  ${({ theme }) => theme.mediaWidth.screenMd`
    :nth-child(1) { margin-right: 0; }
    span {font-size: 1.5rem;}
  `}
  ${({ theme }) => theme.mediaWidth.screenSm`
    :nth-child(1) { margin-bottom: 1.5rem; }
  `}
`

export const AboutDiv = styled.div`
  position: relative;
  margin-bottom: 9.81rem;
  min-height: 25rem;
  ${({ theme }) => theme.mediaWidth.screenMd`
    margin-top: 3.44rem;
    margin-bottom: 2.81rem;
  `}
`

export const AboutDivContent = styled(ComLayoutTwo)`
  min-height: 25rem;
  border: 0.06rem solid #e5e5e5;
  border-radius: 0.63rem;
  background: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  ul {
    width: 95%;
    margin-left: 2.5%;
    margin-bottom: 4.5rem;
    list-style-type: none;
    padding-inline-start: 0;
    li {
      font-size: 1.25rem;
      font-weight: 400;
      color: ${(props) => props.theme.gray};
      margin-bottom: 1.75rem;
      list-style-type: none;
      &::marker {
        content: '';
      }
    }
  }
  ${({ theme }) => theme.mediaWidth.screenMd`
    width: calc(100% - 1.38rem);
    min-height: 36.13rem;
    height: auto;
    border-radius: 0.63rem;
    margin-left: 0.69rem;
    ul {
      width: calc(100% - 8.75rem);
      margin-left: 4.375rem;
      li {
        font-size: 1.5rem;
      }
    }
  `}
  ${({ theme }) => theme.mediaWidth.screenSm`
      ul {
        margin-left: 5%;
        width: 90%;
      }
    `}
`

export const AboutTitle = styled.div`
  font-size: 3rem;
  font-weight: 600;
  color: #363639;
  margin: 3.75rem 0;
  position: relative;
  ${({ theme }) => theme.mediaWidth.screenMd`
    margin: 2.75rem 0;
  `}
`
