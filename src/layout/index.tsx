import React, { memo } from 'react'
import { LayoutWrapper, LayoutContent } from './styled'
import { renderRoutes } from 'react-router-config'
import TopBar from '@/components/TopBar'
import Footer from '@/components/Footer'
import { useHistory } from 'react-router-dom'

export default memo(function LayOutPages(props: any) {
  const { route } = props
  let history = useHistory()
  let pathname = history.location.pathname

  return (
    <LayoutWrapper>
      {pathname !== '/home' && <TopBar></TopBar>}
      <LayoutContent>{route && renderRoutes(route.routes)}</LayoutContent>
      <Footer />
    </LayoutWrapper>
  )
})
