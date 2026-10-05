import { Link } from 'react-router-dom'

export default function Soon({ n }: { n: number }) {
  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '96px 24px', fontFamily: 'Inter, sans-serif' }}>
      <h1>V{n} · coming next</h1>
      <p style={{ color: '#5e625d' }}>This video is built after V1. <Link to="/">Back to the index</Link></p>
    </main>
  )
}
