const Button = ({
  type = 'button',
  children,
  onClick,
  className = '',
  style = {},
  isLoading = false,
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${isLoading ? 'bg-accent' : 'bg-primary'} rounded-md w-100 px-4 py-3 text-white hover:bg-accent transition-ease ${className}`}
      style={style}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  )
}

export default Button
