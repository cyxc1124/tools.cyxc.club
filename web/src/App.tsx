import { Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { HomePage } from '@/pages/Home'
import { tools } from '@/tools/registry'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        {tools.map((tool) => (
          <Route
            key={tool.id}
            path={tool.path}
            element={<tool.Page />}
          />
        ))}
      </Route>
    </Routes>
  )
}
