import PropTypes from 'prop-types'
const showLoginForm = (props) => {

  return(
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={props.handleLogin}>
        <div>
          <label htmlFor="username">username:</label>
          <input
            id='username'
            type="text"
            value={props.username}
            name="Username"
            onChange={props.handleChangeUsername}
          />
        </div>
        <div>
          <label htmlFor="password">password:</label>
          <input
            id='password'
            type="password"
            value={props.password}
            name="Password"
            onChange={props.handleChangePassword}
          />
        </div>
        <button id="login-button" type ="Submit">Login</button>
      </form>
    </div>
  )
}

showLoginForm.propTypes ={
  handleChangeUsername:PropTypes.func.isRequired,
  handleChangePassword: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  handleLogin: PropTypes.func.isRequired

}

export default showLoginForm