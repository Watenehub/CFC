import { useCallback, useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import * as megapayApi from '../../api/megapay'
import * as givingApi from '../../api/giving'

const FILTERS = [
  ['', 'All'],
  ['success', 'Successful'],
  ['pending', 'Pending'],
  ['failed', 'Failed'],
  ['cancelled', 'Cancelled'],
]

const STATUS_COLORS = {
  success: { background: '#dcfce7', color: '#166534' },
  pending: { background: '#fef9c3', color: '#854d0e' },
  failed: { background: '#fee2e2', color: '#991b1b' },
  cancelled: { background: '#e5e7eb', color: '#374151' },
}

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [givingOptions, setGivingOptions] = useState([])
  const [status, setStatus] = useState('')
  const [givingFilter, setGivingFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async (refresh = false) => {
    setLoading(true)
    setError('')
    try {
      setTransactions(await megapayApi.getMegapayTransactions(status, refresh))
    } catch (err) {
      setError(err.message || 'Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }, [status])

  const loadGivingOptions = useCallback(async () => {
    try {
      const data = await givingApi.getGiving()
      setGivingOptions(data)
    } catch (err) {
      console.error('Failed to load giving options:', err)
    }
  }, [])

  useEffect(() => { load(true) }, [load])
  useEffect(() => { loadGivingOptions() }, [loadGivingOptions])

  const filteredTransactions = givingFilter
    ? transactions.filter(t => t.giving_id === parseInt(givingFilter))
    : transactions

  const total = filteredTransactions
    .filter((item) => item.status === 'success')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)

  const downloadCSV = () => {
    const headers = ['Date', 'Time', 'Phone', 'Amount (KSh)', 'Giving', 'Status', 'Receipt']
    const rows = filteredTransactions.map(item => [
      item.created_at ? new Date(item.created_at).toLocaleDateString() : '-',
      item.created_at ? new Date(item.created_at).toLocaleTimeString() : '-',
      item.phone,
      Number(item.amount || 0).toLocaleString(),
      item.reference,
      item.status,
      item.receipt || '-'
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <DashboardLayout role="admin" title="Transactions">
      <div className="admin-page">
        <h2>Digital giving transactions</h2>
        <p>All M-PESA payments started from the website, including successful, pending, failed and cancelled ones.</p>
        {error && <p className="error-state">{error}</p>}

        <div className="page-action-bar">
          <span>
            {filteredTransactions.length} shown · Successful total: KSh {total.toLocaleString()}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={downloadCSV} disabled={filteredTransactions.length === 0}>
              Download CSV
            </button>
            <button type="button" className="btn btn-primary" onClick={() => load(true)} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className="filter-buttons" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {FILTERS.map(([value, label]) => (
            <button
              key={value || 'all'}
              type="button"
              className={`btn ${status === value ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatus(value)}
            >
              {label}
            </button>
          ))}
          <select
            value={givingFilter}
            onChange={(e) => setGivingFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}
          >
            <option value="">All Giving Options</option>
            {givingOptions.map(option => (
              <option key={option.id} value={option.id}>{option.title}</option>
            ))}
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '0.6rem' }}>Date</th>
                <th style={{ padding: '0.6rem' }}>Time</th>
                <th style={{ padding: '0.6rem' }}>Phone</th>
                <th style={{ padding: '0.6rem' }}>Amount (KSh)</th>
                <th style={{ padding: '0.6rem' }}>Giving</th>
                <th style={{ padding: '0.6rem' }}>Status</th>
                <th style={{ padding: '0.6rem' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 && !loading && (
                <tr><td colSpan="7" style={{ padding: '1rem' }}>No transactions found.</td></tr>
              )}
              {filteredTransactions.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.6rem' }}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</td>
                  <td style={{ padding: '0.6rem' }}>{item.created_at ? new Date(item.created_at).toLocaleTimeString() : '-'}</td>
                  <td style={{ padding: '0.6rem' }}>{item.phone}</td>
                  <td style={{ padding: '0.6rem' }}>{Number(item.amount || 0).toLocaleString()}</td>
                  <td style={{ padding: '0.6rem' }}>{item.reference}</td>
                  <td style={{ padding: '0.6rem' }}>
                    <span style={{ ...STATUS_COLORS[item.status], padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 700, textTransform: 'capitalize' }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.6rem' }}>{item.receipt || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Transactions
