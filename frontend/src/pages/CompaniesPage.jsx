import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

export default function CompaniesPage() {
  const { user } = useAuth()
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name:'', industry:'', country:'' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/crm/companies/?search=${search}&page=${page}`)
      setCompanies(res.data.results)
      setTotalPages(Math.ceil(res.data.count / 10) || 1)
    } catch { setError('Failed to load companies') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCompanies() }, [search, page])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/crm/companies/', form)
      setForm({ name:'', industry:'', country:'' })
      setShowForm(false)
      fetchCompanies()
    } catch { setError('Failed to create company') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this company?')) return
    await api.delete(`/crm/companies/${id}/`)
    fetchCompanies()
  }

  return (
    <Layout>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Companies</h1>
          <p style={s.sub}>Manage your organization's companies</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={s.addBtn}>
          {showForm ? 'Cancel' : '+ Add Company'}
        </button>
      </div>

      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>New Company</h3>
          <form onSubmit={handleCreate} style={s.formRow}>
            <div style={s.field}>
              <label style={s.label}>Company Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Acme Corp" required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Industry</label>
              <input value={form.industry} onChange={e => setForm({...form, industry:e.target.value})} placeholder="e.g. Technology" />
            </div>
            <div style={s.field}>
              <label style={s.label}>Country</label>
              <input value={form.country} onChange={e => setForm({...form, country:e.target.value})} placeholder="e.g. USA" />
            </div>
            <div style={s.field}>
              <label style={s.label}>&nbsp;</label>
              <button style={s.saveBtn} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}

      <div style={s.toolbar}>
        <input
          style={s.search}
          placeholder="Search by name, industry, country..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      {error && <div style={s.errorBox}>{error}</div>}

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Company</th>
              <th style={s.th}>Industry</th>
              <th style={s.th}>Country</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={s.empty}>Loading...</td></tr>
            ) : companies.length === 0 ? (
              <tr><td colSpan="4" style={s.empty}>No companies found</td></tr>
            ) : companies.map(c => (
              <tr key={c.id} style={s.tr}>
                <td style={s.td}>
                  <Link to={`/companies/${c.id}`} style={s.companyLink}>{c.name}</Link>
                </td>
                <td style={s.td}><span style={s.tag}>{c.industry || '—'}</span></td>
                <td style={s.td}>{c.country || '—'}</td>
                <td style={s.td}>
                  <div style={{display:'flex', gap:'8px'}}>
                    <Link to={`/companies/${c.id}`} style={s.viewBtn}>View</Link>
                    {user?.role === 'Admin' && (
                      <button onClick={() => handleDelete(c.id)} style={s.deleteBtn}>Delete</button>
                    )}
                  </div>
                </td>
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
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'28px' },
  title: { fontSize:'24px', fontWeight:'600', color:'var(--text)', marginBottom:'4px' },
  sub: { color:'var(--text-muted)', fontSize:'14px' },
  addBtn: { 
    padding:'9px 18px', 
    background:'var(--accent)', 
    color:'white', 
    borderRadius:'8px', 
    fontSize:'13.5px', 
    fontWeight:'500' 
  },
  formCard: { 
    background:'var(--surface)', 
    border:'1px solid var(--border)', 
    borderRadius:'10px', 
    padding:'24px', 
    marginBottom:'24px' 
  },
  formTitle: { fontSize:'15px', fontWeight:'600', color:'var(--text)', marginBottom:'16px' },
  formRow: { display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px', alignItems:'end' },
  field: { display:'flex', flexDirection:'column' },
  label: { 
    fontSize:'12px', 
    fontWeight:'500', 
    color:'var(--text-muted)', 
    marginBottom:'6px', 
    letterSpacing:'0.04em', 
    textTransform:'uppercase' 
  },
  saveBtn: { 
    padding:'10px 20px', 
    background:'var(--accent)', 
    color:'white', 
    borderRadius:'8px', 
    fontWeight:'500', 
    fontSize:'13.5px', 
    width:'100%' 
  },
  toolbar: { marginBottom:'16px' },
  search: { maxWidth:'360px' },
  errorBox: { 
    background:'rgba(239,68,68,0.1)', 
    border:'1px solid rgba(239,68,68,0.3)', 
    color:'var(--danger)', 
    padding:'10px 14px', 
    borderRadius:'8px', 
    marginBottom:'16px', 
    fontSize:'13px' 
  },
  tableWrap: { 
    background:'var(--surface)', 
    border:'1px solid var(--border)', 
    borderRadius:'10px', 
    overflow:'hidden' 
  },
  table: { width:'100%', borderCollapse:'collapse' },
  th: { 
    padding:'12px 16px', 
    textAlign:'left', 
    fontSize:'12px', 
    fontWeight:'500', 
    color:'var(--text-muted)', 
    textTransform:'uppercase', 
    letterSpacing:'0.05em', 
    borderBottom:'1px solid var(--border)' 
  },
  tr: { borderBottom:'1px solid var(--border)', transition:'background 0.12s' },
  td: { padding:'14px 16px', fontSize:'14px', color:'var(--text)' },
  companyLink: { color:'var(--text)', fontWeight:'500', fontSize:'14px' },
  tag: { 
    background:'var(--surface2)', 
    border:'1px solid var(--border)', 
    padding:'3px 10px', 
    borderRadius:'20px', 
    fontSize:'12px', 
    color:'var(--text-dim)' 
  },
  viewBtn: { 
    padding:'5px 12px', 
    background:'rgba(79,110,247,0.1)', 
    color:'var(--accent)', 
    borderRadius:'6px', 
    fontSize:'12.5px', 
    fontWeight:'500', 
    border:'1px solid rgba(79,110,247,0.3)' 
  },
  deleteBtn: { 
    padding:'5px 12px', 
    background:'rgba(239,68,68,0.1)', 
    color:'var(--danger)', 
    borderRadius:'6px', 
    fontSize:'12.5px', 
    fontWeight:'500', 
    border:'1px solid rgba(239,68,68,0.3)' 
  },
  empty: { padding:'48px', textAlign:'center', color:'var(--text-muted)' },
  pagination: { display:'flex', justifyContent:'center', alignItems:'center', gap:'16px', marginTop:'20px' },
  pageInfo: { fontSize:'13px', color:'var(--text-muted)' },
  pageBtn: { 
    padding:'7px 16px', 
    background:'var(--surface)', 
    border:'1px solid var(--border)', 
    color:'var(--text-muted)', 
    borderRadius:'7px', 
    fontSize:'13px' 
  },
}