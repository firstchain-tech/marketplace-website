import Layout from '@/layout'
import { Redirect } from 'react-router-dom'
import { RouteConfig } from 'react-router-config'
import Home from '@/pages/Home'
import No404 from '@/pages/404'
import Market from '@/pages/Market'
import Vault from '@/pages/Vault'
import Governance from '@/pages/Governance'
import Information from '@/pages/User/Information'
import MyNft from '@/pages/User/MyNft'
import MyProject from '@/pages/User/MyProject'
import Create from '@/pages/Create'
import IGOnft from '@/pages/IGOnft'

const Router: RouteConfig[] = [
  {
    path: '/',
    component: Layout,
    routes: [
      {
        path: '/',
        exact: true,
        render: () => <Redirect to="/home" />,
      },
      {
        path: '/home',
        exact: true,
        component: Home,
      },
      {
        path: '/market',
        exact: true,
        component: Market,
      },
      {
        path: '/vault',
        exact: true,
        component: Vault,
      },
      {
        path: '/governance',
        exact: true,
        component: Governance,
      },
      {
        path: '/information',
        exact: true,
        component: Information,
      },
      {
        path: '/mynft',
        exact: true,
        component: MyNft,
      },
      {
        path: '/myproject',
        exact: true,
        component: MyProject,
      },
      {
        path: '/create',
        exact: true,
        component: Create,
      },
      {
        path: '/igonft',
        exact: true,
        component: IGOnft,
      },
      {
        path: '/404',
        component: No404,
      },
      {
        path: '*',
        component: No404,
      },
    ],
  },
  {
    path: '/404',
    component: No404,
  },
  {
    path: '*',
    component: No404,
  },
]

export default Router
