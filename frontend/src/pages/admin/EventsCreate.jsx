import DashboardLayout from '../../components/DashboardLayout'

function EventsCreate() {
  return (
    <DashboardLayout role="admin" title="Events">
      <div className="admin-page">
        <h2>Create an event</h2>
        <p>Publish dates, times, and details for conferences, classes, and gatherings. The event form will appear here.</p>
      </div>
    </DashboardLayout>
  )
}

export default EventsCreate
