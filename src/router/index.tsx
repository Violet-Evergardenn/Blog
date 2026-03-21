import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import Essays from '@/pages/Essays'
import EssayDetail from '@/pages/EssayDetail'
import Projects from '@/pages/Projects'
import Pictures from '@/pages/Pictures'
import About from '@/pages/About'
import Blogroll from '@/pages/Blogroll'
import NotFound from '@/pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'essays', element: <Essays /> },
      { path: 'essays/:id', element: <EssayDetail /> },
      { path: 'projects', element: <Projects /> },
      { path: 'pictures', element: <Pictures /> },
      { path: 'about', element: <About /> },
      { path: 'blogroll', element: <Blogroll /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])