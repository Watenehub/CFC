import DashboardLayout from '../../components/DashboardLayout'

function Settings() {
  return (
    <DashboardLayout role="admin" title="Settings">
      <div className="admin-page">
        <h2>Church website settings</h2>
        <p>Service times, contact details, and livestream links can be updated here when the settings form is connected.</p>
      </div>
    </DashboardLayout>
  )
}

export default Settings
