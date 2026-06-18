import { Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { HomePage } from '@/pages/Home'
import { tools } from '@/tools/registry'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        {tools.map((tool) => {
          const Page = tool.Page
          const routePath = tool.path.replace(/^\//, '')
          return (
            <Route key={tool.id} path={routePath} element={<Page />} />
          )
        })}
      </Route>
    </Routes>
  )
}
