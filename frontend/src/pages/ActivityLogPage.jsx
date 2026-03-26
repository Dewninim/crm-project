import { useEffect, useState } from 'react'
import api from '../api/axios'
import Layout from '../components/Layout'

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setLoading(true)
    api.get(`/logs/?page=${page}`)
      .then(res => {
        setLogs(res.data.results)
        setTotalPages(Math.ceil(res.data.count / 10) || 1)
      })
      .finally(() => setLoading(false))
  }, [page])

  const actionStyle = {
    CREATE: { 
      background: 'rgba(62,207,142,0.15)', 
      color: 'var(--success)', 
      border: '1px solid rgba(62,207,142,0.3)',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '11.5px',
      fontWeight: '600'
    },
    UPDATE: { 
      background: 'rgba(79,110,247,0.15)', 
      color: 'var(--accent)', 
      border: '1px solid rgba(79,110,247,0.3)',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '11.5px',
      fontWeight: '600'
    },
    DELETE: { 
      background: 'rgba(224,92,92,0.15)', 
      color: 'var(--danger)', 
      border: '1px solid rgba(224,92,92,0.3)',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '11.5px',
      fontWeight: '600'
    },
  }

  return (
    <Layout>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Activity Logs</h1>
          <p style={s.sub}>Audit trail of all actions in your organization</p>
        </div>
      </div>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>User</th>
              <th style={s.th}>Action</th>
              <th style={s.th}>Model</th>
              <th style={s.th}>Object ID</th>
              <th style={s.th}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={s.empty}>Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="5" style={s.empty}>No activity logs yet</td></tr>
            ) : logs.map(log => (
              <tr key={log.id} style={s.tr}>
                <td style={s.td}><span style={s.user}>{log.user}</span></td>
                <td style={s.td}>
                  <span style={{...actionStyle[log.action]}}>{log.action}</span>
                </td>
                <td style={s.td}>{log.model_name}</td>
                <td style={s.td}><span style={s.mono}>#{log.object_id}</span></td>
                <td style={s.td}>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={s.pagination}>
        <button disabled={page===1} onClick={() => setPage(p=>p-1)} style={s.pageBtn}>Previous</button>
        <span style={s.pageInfo}>Page {page} of {totalPages}</span>
        <button disabled={page>=totalPages} onClick={() => setPage(p=>p+1)} style={s.pageBtn}>Next</button>
      </div>
    </Layout>
  )
}

const s = {
  header: { marginBottom: '28px' },
  title: { fontSize: '24px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' },
  sub: { color: 'var(--text-muted)', fontSize: '14px' },
  tableWrap: { 
    background: 'var(--surface)', 
    border: '1px solid var(--border)', 
    borderRadius: '10px', 
    overflow: 'hidden' 
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { 
    padding: '12px 16px', 
    textAlign: 'left', 
    fontSize: '12px', 
    fontWeight: '500', 
    color: 'var(--text-muted)', 
    textTransform: 'uppercase', 
    letterSpacing: '0.05em', 
    borderBottom: '1px solid var(--border)' 
  },
  tr: { borderBottom: '1px solid var(--border)' },
  td: { 
    padding: '14px 16px', 
    fontSize: '14px', 
    color: 'var(--text)' 
  },
  user: { fontWeight: '500', color: 'var(--text)' },
  mono: { 
    fontFamily: 'DM Mono, monospace', 
    fontSize: '13px', 
    color: 'var(--text-dim)' 
  },
  empty: { 
    padding: '48px', 
    textAlign: 'center', 
    color: 'var(--text-muted)' 
  },
  pagination: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: '16px', 
    marginTop: '20px' 
  },
  pageInfo: { fontSize: '13px', color: 'var(--text-muted)' },
  pageBtn: { 
    padding: '7px 16px', 
    background: 'var(--surface)', 
    border: '1px solid var(--border)', 
    color: 'var(--text-muted)', 
    borderRadius: '7px', 
    fontSize: '13px' 
  },
}