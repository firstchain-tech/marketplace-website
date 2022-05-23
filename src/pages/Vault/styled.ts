import styled from 'styled-components'
import { ComLayout } from '@/common/styled'

export const VaultWrapper = styled.div`
  height: 71.4vh;
  padding-top: 5rem;
`

export const VaultTitle = styled(ComLayout)`
  height: 6.75rem;
  display: flex;
  justify-content: flex-start;
  align-items: end;
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

export const VaultContent = styled.div`
  height: calc(100% - 6.75rem);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .span {
    font-size: 1.25rem;
    font-weight: 500;
    text-align: center;
    color: #363639;
    line-height: 2.63rem;
    span {
      color: #5746fe;
    }
  }
`
