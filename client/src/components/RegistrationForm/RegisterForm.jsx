import '../../App.css'

const RegisterForm = ({ setIsRegister }) => {
  return (
    <div className="login-signup-container">
      <h2>Register</h2>
      <form className="basic-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Create a username" required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Create a password" required />
        </div>
        <div className="input-group">
          <label htmlFor="password-confirm">Confirm Password</label>
          <input
            type="passwordConfirm"
            id="passwordConfirm"
            placeholder="Re-enter password"
            required
          />
        </div>
        <button type="submit" className="rounded-button">
          Register
        </button>
        <div style={{ marginTop: '20px' }}>
          <p>Already have an account?</p>
          <button className="rounded-button" onClick={() => setIsRegister(false)}>
            Log In
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm
