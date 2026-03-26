import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

export default function CompanyDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [company, setCompany] = useState(null)
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ full_name:'', email:'', phone:'', role:'' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [cRes, ctRes] = await Promise.all([
        api.get(`/crm/companies/${id}/`),
        api.get(`/crm/contacts/?company=${id}`)
      ])
      setCompany(cRes.data)
      setContacts(ctRes.data.results)
    } catch { setError('Failed to load data') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [id])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post('/crm/contacts/', { ...form, company: parseInt(id) })
      setForm({ full_name:'', email:'', phone:'', role:'' })
      setShowForm(false)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.email?.[0] || 'Failed to create contact')
    } finally { setSaving(false) }
  }

  const handleDelete = async (contactId) => {
    if (!window.confirm('Delete this contact?')) return
    await api.delete(`/crm/contacts/${contactId}/`)
    fetchData()
  }

  if (loading) return <Layout><div style={{color:'var(--text-muted)', padding:'48px', textAlign:'center'}}>Loading...</div></Layout>

  return (
    <Layout>
      <div style={s.breadcrumb}>
        <Link to="/companies" style={s.breadLink}>Companies</Link>
        <span style={s.breadSep}>/</span>
        <span style={s.breadCurrent}>{company?.name}</span>
      </div>

      <div style={s.header}>
        <div>
          <h1 style={s.title}>{company?.name}</h1>
          <p style={s.sub}>Company details and contacts</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={s.addBtn}>
          {showForm ? 'Cancel' : '+ Add Contact'}
        </button>
      </div>

      <div style={s.infoRow}>
        <div style={s.infoCard}>
          <div style={s.infoLabel}>Industry</div>
          <div style={s.infoValue}>{company?.industry || '—'}</div>
        </div>
        <div style={s.infoCard}>
          <div style={s.infoLabel}>Country</div>
          <div style={s.infoValue}>{company?.country || '—'}</div>
        </div>
        <div style={s.infoCard}>
          <div style={s.infoLabel}>Total Contacts</div>
          <div style={s.infoValue}>{contacts.length}</div>
        </div>
      </div>

      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>New Contact</h3>
          {error && <div style={s.errorBox}>{error}</div>}
          <form onSubmit={handleCreate} style={s.formRow}>
            <div style={s.field}>
              <label style={s.label}>Full Name *</label>
              <input value={form.full_name} onChange={e => setForm({...form, full_name:e.target.value})} placeholder="John Smith" required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Email *</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="john@company.com" required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Phone</label>
              <input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="Digits only" />
            </div>
            <div style={s.field}>
              <label style={s.label}>Role</label>
              <input value={form.role} onChange={e => setForm({...form, role:e.target.value})} placeholder="e.g. CEO" />
            </div>
            <div style={s.field}>
              <label style={s.label}>&nbsp;</label>
              <button style={s.saveBtn} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}

      <div style={s.tableWrap}>
        <div style={s.tableHeader}>
          <span style={s.tableTitle}>Contacts</span>
        </div>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Name</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Phone</th>
              <th style={s.th}>Role</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr><td colSpan="5" style={s.empty}>No contacts yet. Add one above.</td></tr>
            ) : contacts.map(c => (
              <tr key={c.id} style={s.tr}>
                <td style={s.td}><span style={s.name}>{c.full_name}</span></td>
                <td style={s.td}>{c.email}</td>
                <td style={s.td}>{c.phone || '—'}</td>
                <td style={s.td}><span style={s.tag}>{c.role || '—'}</span></td>
                <td style={s.td}>
                  {user?.role === 'Admin' && (
                    <button onClick={() => handleDelete(c.id)} style={s.deleteBtn}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

const s = {
  breadcrumb: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px' },
  breadLink: { fontSize:'13px', color:'var(--text-muted)' },
  breadSep: { color:'var(--border)', fontSize:'13px' },
  breadCurrent: { fontSize:'13px', color:'var(--text)' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px' },
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
  infoRow: { display:'flex', gap:'16px', marginBottom:'24px' },
  infoCard: { 
    flex:1, 
    background:'var(--surface)', 
    border:'1px solid var(--border)', 
    borderRadius:'10px', 
    padding:'18px 20px' 
  },
  infoLabel: { 
    fontSize:'11px', 
    fontWeight:'500', 
    color:'var(--text-muted)', 
    textTransform:'uppercase', 
    letterSpacing:'0.05em', 
    marginBottom:'6px' 
  },
  infoValue: { fontSize:'18px', fontWeight:'600', color:'var(--text)' },
  formCard: { 
    background:'var(--surface)', 
    border:'1px solid var(--border)', 
    borderRadius:'10px', 
    padding:'24px', 
    marginBottom:'24px' 
  },
  formTitle: { fontSize:'15px', fontWeight:'600', color:'var(--text)', marginBottom:'16px' },
  formRow: { display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'16px', alignItems:'end' },
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
  tableHeader: { 
    padding:'16px 20px', 
    borderBottom:'1px solid var(--border)' 
  },
  tableTitle: { fontSize:'15px', fontWeight:'600', color:'var(--text)' },
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
  tr: { borderBottom:'1px solid var(--border)' },
  td: { padding:'14px 16px', fontSize:'14px', color:'var(--text)' },
  name: { fontWeight:'500', color:'var(--text)' },
  tag: { 
    background:'var(--surface2)', 
    border:'1px solid var(--border)', 
    padding:'3px 10px', 
    borderRadius:'20px', 
    fontSize:'12px', 
    color:'var(--text-dim)' 
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
}