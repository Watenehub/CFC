import { useCallback, useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import * as megapayApi from '../../api/megapay'

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
  const [status, setStatus] = useState('')
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

  useEffect(() => { load(true) }, [load])

  const total = transactions
    .filter((item) => item.status === 'success')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)

  return (
    <DashboardLayout role="admin" title="Transactions">
      <div className="admin-page">
        <h2>Digital giving transactions</h2>
        <p>All M-PESA payments started from the website, including successful, pending, failed and cancelled ones.</p>
        {error && <p className="error-state">{error}</p>}

        <div className="page-action-bar">
          <span>
            {transactions.length} shown · Successful total: KSh {total.toLocaleString()}
          </span>
          <button type="button" className="btn btn-primary" onClick={() => load(true)} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="filter-buttons" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '0.6rem' }}>Date</th>
                <th style={{ padding: '0.6rem' }}>Phone</th>
                <th style={{ padding: '0.6rem' }}>Amount (KSh)</th>
                <th style={{ padding: '0.6rem' }}>Giving</th>
                <th style={{ padding: '0.6rem' }}>Status</th>
                <th style={{ padding: '0.6rem' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && !loading && (
                <tr><td colSpan="6" style={{ padding: '1rem' }}>No transactions found.</td></tr>
              )}
              {transactions.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.6rem' }}>{item.created_at ? new Date(item.created_at).toLocaleString() : '-'}</td>
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
