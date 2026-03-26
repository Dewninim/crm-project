import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.left}>
        <div style={s.brand}>
          <div style={s.logo}>C</div>
          <span style={s.brandName}>CRM System</span>
        </div>
        <div style={s.tagline}>
          <h1 style={s.headline}>Manage your<br />relationships,<br />beautifully.</h1>
          <p style={s.sub}>A modern multi-tenant CRM built for teams that care about quality.</p>
        </div>
        <div style={s.dots}>
          {[...Array(12)].map((_, i) => <div key={i} style={{...s.dot, opacity: 0.1 + (i % 4) * 0.15}} />)}
        </div>
      </div>

      <div style={s.right}>
        <div style={s.card}>
          <h2 style={s.cardTitle}>Sign in</h2>
          <p style={s.cardSub}>Enter your credentials to continue</p>

          {error && <div style={s.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={s.field}>
              <label style={s.label}>Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <button style={loading ? {...s.btn, opacity: 0.7} : s.btn} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { display: 'flex', minHeight: '100vh' },
  left: { 
    flex: 1, 
    background: 'linear-gradient(135deg, var(--bg) 0%, var(--surface) 50%, #1a2040 100%)', 
    padding: '48px', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-between', 
    position: 'relative', 
    overflow: 'hidden', 
    borderRight: '1px solid var(--border)' 
  },
  brand: { display: 'flex', alignItems: 'center', gap: '12px' },
  logo: { 
    width: '36px', 
    height: '36px', 
    background: 'var(--accent)', 
    borderRadius: '8px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontWeight: '700', 
    fontSize: '18px', 
    color: 'white' 
  },
  brandName: { 
    fontWeight: '600', 
    fontSize: '16px', 
    color: 'var(--text)', 
    letterSpacing: '0.01em' 
  },
  tagline: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  headline: { 
    fontSize: 'clamp(32px, 4vw, 48px)', 
    fontWeight: '300', 
    lineHeight: 1.2, 
    color: 'var(--text)', 
    marginBottom: '16px', 
    letterSpacing: '-0.02em' 
  },
  sub: { 
    color: 'var(--text-muted)', 
    fontSize: '15px', 
    maxWidth: '320px', 
    lineHeight: 1.7 
  },
  dots: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', width: 'fit-content' },
  dot: { 
    width: '6px', 
    height: '6px', 
    borderRadius: '50%', 
    background: 'var(--accent)' 
  },
  right: { 
    width: '480px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '48px', 
    background: 'var(--bg)' 
  },
  card: { 
    width: '100%', 
    maxWidth: '380px' 
  },
  cardTitle: { 
    fontSize: '24px', 
    fontWeight: '600', 
    color: 'var(--text)', 
    marginBottom: '6px' 
  },
  cardSub: { 
    color: 'var(--text-muted)', 
    marginBottom: '32px', 
    fontSize: '14px' 
  },
  errorBox: { 
    background: 'rgba(239,68,68,0.1)', 
    border: '1px solid rgba(239,68,68,0.3)', 
    color: 'var(--danger)', 
    padding: '10px 14px', 
    borderRadius: '8px', 
    marginBottom: '20px', 
    fontSize: '13px' 
  },
  field: { marginBottom: '18px' },
  label: { 
    display: 'block', 
    fontSize: '13px', 
    fontWeight: '500', 
    color: 'var(--text-muted)', 
    marginBottom: '6px', 
    letterSpacing: '0.02em' 
  },
  btn: { 
    width: '100%', 
    padding: '11px', 
    background: 'var(--accent)', 
    color: 'white', 
    fontSize: '14px', 
    fontWeight: '500', 
    borderRadius: '8px', 
    marginTop: '8px', 
    letterSpacing: '0.01em' 
  },
}