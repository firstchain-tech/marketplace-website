import styled, { css } from 'styled-components'
import { NavLink } from 'react-router-dom'

export const ConnectWalletWrapper = styled.div`
  .loginout-icon {
    cursor: pointer;
  }
`

export const DivTest = styled.div`
  margin-top: 1.25rem;
  font-size: 0.88rem;
  line-height: 1.85rem;
  font-weight: 400;
  color: #80808b;
  span {
    color: #ff4d4f;
    margin-right: 0.25rem;
  }
`

export const ModalTitle = styled.div`
  font-size: 0.88rem;
  font-weight: 600;
  position: relative;
  text-indent: 2.5em;
  .span {
    position: absolute;
    left: 0;
    top: 0;
    width: 1.5rem;
    height: 1.5rem;
    text-indent: 0;
    text-align: center;
    border-radius: 100%;
    color: ${({ theme }) => theme.gray};
    background: ${({ theme }) => theme['gary-4']};
  }
  .choose-info {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.63rem 0;
    flex-direction: column;
    text-indent: 0;
    :hover {
      background: ${({ theme }) => theme['gary-4']};
    }
    .choose-span {
      font-size: 0.88rem;
      line-height: 2.5rem;
      font-weight: 400;
      color: ${({ theme }) => theme.gray};
    }
    .choose-icon {
      background: ${({ theme }) => theme.white};
    }
  }

  ${({ theme }) => theme.mediaWidth.screenMd`
    text-indent: 3.5em;
    font-size: 1rem;
    line-height: 2.5rem;
      .span{
        width: 2.5rem;
        height: 2.5rem;
      }
    `}
`

export const NoChainIdTips = styled.div`
  position: fixed;
  top: 5.5rem;
  left: 0;
  width: 100%;
  z-index: 2;
  line-height: 3.38rem;
  height: 3.38rem;
  display: flex;
  justify-content: center;
  font-size: 1rem;
  font-weight: 400;
  align-items: center;
  background: ${({ theme }) => `${theme.themeColor}`};
  color: ${({ theme }) => theme.white};
  ${({ theme }) => theme.mediaWidth.screenMd`
    top: 5.5rem;
    height: 4.38rem;
  `}
`

export const WalletTitleAddress = styled.div`
  font-size: 0.88rem;
  font-weight: 400;
  color: ${(props) => props.theme.gray};
  margin-right: 1.88rem;
  min-width: 8.13rem;
  height: 2.38rem;
  background: ${(props) => props.theme['gary-4']};
  border-radius: 1.25rem;
  padding: 0 0.31rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  .anticon-wallet {
    font-size: 2.13rem;
    color: ${(props) => props.theme.themeColor};
    margin-right: 0.63rem;
  }
  ${(props) =>
    props.theme.mediaWidth.screenLg(
      () => css`
        margin-right: 0.88rem;
        height: 3.38rem;
        border-radius: 0.31rem;
        .anticon-wallet {
          font-size: 2.38rem;
          margin-right: 0;
        }
      `,
    )}
`

const activeClassName = 'ACTIVE'
export const StyledNavLink = styled(NavLink).attrs({ activeClassName })`
  font-size: 0.88rem;
  font-weight: 400;
  color: ${(props) => props.theme.gray};
  text-align: center;
  &.${activeClassName} {
    font-weight: 600;
    color: #363639 !important;
  }
  &:hover {
    content: none;
    color: #363639;
  }
`

export const AccountMoveWrapper = styled.div`
  position: absolute;
  top: 3rem;
  width: 100%;
  height: auto;
  z-index: 100;
`

export const AccountContent = styled.div`
  width: 8.94rem;
  background: #ffffff;
  border: 0.06rem solid #e5e5e5;
  border-bottom: none;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 1rem;
  font-weight: 500;
  line-height: 3rem;
  a {
    color: ${(props) => props.theme.gray};
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    &:hover {
      color: #363639;
    }
  }
`

export const WalletDivCreate = styled.div`
  padding: 2.5rem 1.25rem;
  border-radius: 0.63rem;
  box-shadow: 0rem 0rem 0.63rem 0rem rgba(67, 68, 82, 0.18);
`
