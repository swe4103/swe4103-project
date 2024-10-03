import '../App.css'

const LoginForm = ({ setIsRegister }) => {
  return (
    <div className="login-signup-container">
      <h2>Login</h2>
      <form className="basic-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter your username" required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" required />
        </div>
        <button type="submit" className="rounded-button">
          Login
        </button>
      </form>
      <div style={{ marginTop: '20px' }}>
        <p>Don&apos;t have an account?</p>
        <button className="rounded-button" onClick={() => setIsRegister(true)}>
          Register Now
        </button>
      </div>
    </div>
  )
}

export default LoginForm
