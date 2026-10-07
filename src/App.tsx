import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Index from './Index'

const V1 = lazy(() => import('./video/v1'))
const V2 = lazy(() => import('./video/v2'))
const Soon = lazy(() => import('./video/Soon'))

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/v1" element={<V1 />} />
        <Route path="/v2" element={<V2 />} />
        <Route path="/v3" element={<Soon n={3} />} />
        <Route path="/v4" element={<Soon n={4} />} />
        <Route path="*" element={<Index />} />
      </Routes>
    </Suspense>
  )
}
