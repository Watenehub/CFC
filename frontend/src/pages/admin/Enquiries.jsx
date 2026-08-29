import DashboardLayout from '../../components/DashboardLayout'

function Enquiries() {
  return (
    <DashboardLayout role="admin" title="Enquiries">
      <div className="admin-page">
        <h2>Contact enquiries</h2>
        <p>Messages sent from the website contact form will be listed here so the church office can reply.</p>
      </div>
    </DashboardLayout>
  )
}

export default Enquiries
