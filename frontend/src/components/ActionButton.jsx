import LoadingSpinner from './LoadingSpinner'

function ActionButton({
  children,
  loading = false,
  className = 'btn btn-primary',
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`${className} action-button`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="small" />}
      <span>{children}</span>
    </button>
  )
}

export default ActionButton
