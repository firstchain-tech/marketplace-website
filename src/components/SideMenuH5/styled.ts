import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

export const SideMenuWrapper = styled.div`
  .tabbar-right {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
  }
`

const activeClassName = 'ACTIVE'
export const StyledNavLink = styled(NavLink).attrs({ activeClassName })`
  color: ${(props) => props.theme.gray};
  text-align: center;
  line-height: 5rem;
  .navlink-content {
    font-size: 1.75rem;
    line-height: 1.5rem;
    padding: 0 1.63rem;
    color: ${(props) => props.theme.gray};
  }
  .navlink-title {
    font-size: 1.75rem;
    font-weight: bold;
    color: ${(props) => props.theme.gray};
    line-height: 1.5rem;
    padding: 0 1.63rem;
  }
  .navlink-child-title {
    font-size: 1.75rem;
    color: #363639;
    padding: 0 1.63rem;
    &:hover {
      color: #363639 !important;
      font-weight: 600;
      content: none;
    }
  }
  &.${activeClassName} {
    color: #363639;
    font-weight: 600;
    .navlink-child-title {
      color: #363639;
      font-weight: 600;
    }
  }
  &:hover {
    color: #363639 !important;
    font-weight: 600;
    content: none;
  }
`
