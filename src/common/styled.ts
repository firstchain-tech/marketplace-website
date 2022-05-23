import styled, { css } from 'styled-components'

export const ComLayout = styled.div`
  padding: 5rem 12.5rem 0;
  @media (max-width: 1700px) {
    padding: 5rem 11.5rem 0;
  }
  @media (max-width: 1500px) {
    padding: 5rem 10.5rem 0;
  }
  @media (max-width: 1400px) {
    padding: 5rem 9.5rem 0;
  }
  @media (max-width: 1300px) {
    padding: 5rem 8.5rem 0;
  }
  ${(props) =>
    props.theme.mediaWidth.screenLg(
      () => css`
        padding: 5rem 2.5rem 0;
      `,
    )}
  ${(props) =>
    props.theme.mediaWidth.screenMd(
      () => css`
        padding: 5rem 1.13rem 0;
      `,
    )}
`

export const ComLayoutTwo = styled.div`
  margin: 0 12.5rem;
  @media (max-width: 1700px) {
    margin: 0 11.5rem;
  }
  @media (max-width: 1500px) {
    margin: 0 10.5rem;
  }
  @media (max-width: 1400px) {
    margin: 0 9.5rem;
  }
  @media (max-width: 1300px) {
    margin: 0 8.5rem;
  }
  ${(props) =>
    props.theme.mediaWidth.screenLg(
      () => css`
        margin: 0 2.5rem;
      `,
    )}
  ${(props) =>
    props.theme.mediaWidth.screenMd(
      () => css`
        margin: 0 1.13rem;
      `,
    )}
`

export const ComContent = styled(ComLayout)`
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: calc(100vh - 12.5rem);
`
