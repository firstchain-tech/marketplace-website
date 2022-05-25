import styled, { css } from 'styled-components'

export const TopBarWrapper = styled.div`
  width: 100%;
  height: 5rem;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 99;
  color: #5f6469;
  .logo {
    width: 9.13rem;
    height: auto;
    margin-left: 0.63rem;
  }
  .tabbar-left {
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    ${(props) => props.theme.mediaWidth.screenLg`
      justify-content: flex-start;
    `}
  }
  .tabbar-right {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
  }
  .tabbar-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ${(props) =>
    props.theme.mediaWidth.screenXl(
      () => css`
        .tabbar-center {
          justify-content: flex-start;
        }
      `,
    )}
`
