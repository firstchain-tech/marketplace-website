import styled, { css } from 'styled-components'

export const CreateContent = styled.div`
  margin-top: 6.25rem;
`

export const Title = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #363639;
  margin-bottom: 2.5rem;
`

export const TitleTrue = styled.div`
  font-size: 0.88rem;
  font-weight: 400;
  color: ${(props) => props.theme.gray};
  line-height: 3.13rem;
  span {
    color: #e6110c;
    margin-right: 0.25rem;
  }
`

export const UploadCusDiv = styled.div`
  position: absolute;
  z-index: 1;
  height: calc(16.25rem - 2.5rem);
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  .ant-btn {
    width: 100%;
    color: ${(props) => props.theme.gray};
    font-size: 1rem;
    font-weight: 600;
  }

  video {
    width: 100%;
    height: 100%;
  }
  ${(props) =>
    props.theme.mediaWidth.screenLg(
      () => css`
        width: 100%;
      `,
    )}
`
