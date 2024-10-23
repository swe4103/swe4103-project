const Button = ({
  type = 'button',
  children,
  onClick,
  className = '',
  style = {},
  isLoading = false,
  colour = 'bg-primary',
  hover = 'bg-accent',
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${isLoading ? hover : colour} rounded-md w-100 px-4 py-3 text-white hover:bg-accent transition-ease ${className}`}
      style={style}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  )
}

export default Button
