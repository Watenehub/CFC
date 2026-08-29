import DashboardLayout from '../../components/DashboardLayout'

function SermonsCreate() {
  return (
    <DashboardLayout role="admin" title="Sermons">
      <div className="admin-page">
        <h2>Add a sermon</h2>
        <p>Upload video or audio, add the speaker, Scripture, and a short summary. The upload form will appear here.</p>
      </div>
    </DashboardLayout>
  )
}

export default SermonsCreate
