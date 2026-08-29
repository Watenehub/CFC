import DashboardLayout from '../../components/DashboardLayout'

function Users() {
  return (
    <DashboardLayout role="admin" title="Users">
      <div className="admin-page">
        <h2>Manage users</h2>
        <p>Add, update, and assign roles for church staff and members. The full user list will appear here.</p>
      </div>
    </DashboardLayout>
  )
}

export default Users
