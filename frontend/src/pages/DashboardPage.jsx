import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    { label: 'Organization', value: user?.organization?.name || `Org #${user?.organization}` },
    { label: 'Your Role', value: user?.role },
    { label: 'Status', value: 'Active' },
  ]

  return (
    <Layout>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Dashboard</h1>
          <p style={s.sub}>Welcome back, {user?.username}</p>
        </div>
      </div>

      <div style={s.statsRow}>
        {stats.map((stat, i) => (
          <div key={i} style={s.statCard}>
            <div style={s.statLabel}>{stat.label}</div>
            <div style={s.statValue}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={s.grid}>
        <div style={s.card}>
          <div style={s.cardIcon} />
          <h3 style={s.cardTitle}>Companies</h3>
          <p style={s.cardDesc}>Manage your organization's companies, view details, and manage contacts.</p>
          <a href="/companies" style={s.cardLink}>View Companies →</a>
        </div>
        <div style={s.card}>
          <div style={{...s.cardIcon, background: 'rgba(62,207,142,0.1)', borderColor: 'rgba(62,207,142,0.2)'}} />
          <h3 style={s.cardTitle}>Activity Logs</h3>
          <p style={s.cardDesc}>Track all CREATE, UPDATE, and DELETE actions across your organization.</p>
          <a href="/logs" style={s.cardLink}>View Logs →</a>
        </div>
      </div>
    </Layout>
  )
}

const s = {
  header: { marginBottom: '32px' },
  title: { fontSize: '24px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' },
  sub: { color: 'var(--text-muted)', fontSize: '14px' },
  statsRow: { display: 'flex', gap: '16px', marginBottom: '32px' },
  statCard: { 
    flex: 1, 
    background: 'var(--surface)', 
    border: '1px solid var(--border)', 
    borderRadius: '10px', 
    padding: '20px 24px' 
  },
  statLabel: { 
    fontSize: '12px', 
    color: 'var(--text-muted)', 
    fontWeight: '500', 
    letterSpacing: '0.05em', 
    textTransform: 'uppercase', 
    marginBottom: '8px' 
  },
  statValue: { 
    fontSize: '20px', 
    fontWeight: '600', 
    color: 'var(--text)' 
  },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(2, 1fr)', 
    gap: '16px' 
  },
  card: { 
    background: 'var(--surface)', 
    border: '1px solid var(--border)', 
    borderRadius: '10px', 
    padding: '28px' 
  },
  cardIcon: { 
    width: '40px', 
    height: '40px', 
    background: 'rgba(79,110,247,0.1)', 
    border: '1px solid rgba(79,110,247,0.2)', 
    borderRadius: '8px', 
    marginBottom: '16px' 
  },
  cardTitle: { 
    fontSize: '16px', 
    fontWeight: '600', 
    color: 'var(--text)', 
    marginBottom: '8px' 
  },
  cardDesc: { 
    fontSize: '13.5px', 
    color: 'var(--text-muted)', 
    lineHeight: 1.6, 
    marginBottom: '20px' 
  },
  cardLink: { 
    fontSize: '13px', 
    color: 'var(--accent)', 
    fontWeight: '500' 
  },
}