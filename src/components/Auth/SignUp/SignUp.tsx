import { Link, Navigate } from 'react-router-dom'
import './SignUp.scss'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useDispatch } from 'react-redux'

import { useRegisterMutation } from '../../../redux/reducers/postsApi'
import { login } from '../../../redux/reducers/authSlice'

interface IFormInput {
  firstName?: string
  lastName?: string
  age?: number
}

const SignUp = () => {
  const dispatch = useDispatch()

  const [registerOnServer, { isSuccess, isError, data }] = useRegisterMutation()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit: SubmitHandler<IFormInput> = (validate: any) => {
    registerOnServer({
      user: {
        username: validate.Username,
        email: validate.Email,
        password: validate.Password,
      },
    })
  }

  if (isSuccess) {
    localStorage.setItem('token', data.user.token)
    localStorage.setItem('auth', 'true')
    localStorage.setItem('username', data.user.username)
    localStorage.setItem('email', data.user.email)
    dispatch(login())
    return <Navigate to="/articles" replace />
  }

  let style = {}
  if (errors.RepeatPassword) {
    console.log('Пароли не совпадают')
    style = {
      border: '1px solid red',
    }
  }
  if (watch('Password') === watch('RepeatPassword')) {
    style = {}
  }

  return (
    <form className="sign-up-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Create new account</h2>

      <div className="input-text-wrapper">
        <label htmlFor="">Username</label>
        <input
          type="text"
          {...register('Username', { required: true, minLength: 3, maxLength: 20 })}
          placeholder="Username"
        />
        {errors.Username?.type === 'minLength' ? (
          <span style={{ color: 'red' }}>Your username needs to be at least 6 characters.</span>
        ) : null}
        {errors.Username?.type === 'maxLength' ? (
          <span style={{ color: 'red' }}>Your username must be 40 characters or less.</span>
        ) : null}
        {errors.Username?.type === 'required' && <span style={{ color: 'red' }}>Required field</span>}
      </div>

      <div className="input-text-wrapper">
        <label htmlFor="">Email address</label>
        <input
          type="text"
          {...register('Email', {
            required: true,
            pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
          })}
          placeholder="Email address"
        />
        {errors.Email?.type === 'pattern' ? <span style={{ color: 'red' }}>Wrong email format</span> : null}
        {errors.Email?.type === 'required' ? <span style={{ color: 'red' }}>Required field</span> : null}
      </div>

      <div className="input-text-wrapper">
        <label htmlFor="">Password</label>
        <input
          type="password"
          style={style}
          {...register('Password', {
            required: true,
            minLength: 6,
            maxLength: 40,
          })}
          placeholder="Password"
        />
        {errors.Password?.type === 'minLength' ? (
          <span style={{ color: 'red' }}>Your password needs to be at least 6 characters.</span>
        ) : null}
        {errors.Password?.type === 'maxLength' ? (
          <span style={{ color: 'red' }}>Your password must be 40 characters or less.</span>
        ) : null}
      </div>

      <div className="input-text-wrapper">
        <label htmlFor="">Repeat Password</label>
        <input
          type="password"
          style={{ ...style, marginBottom: '5px' }}
          {...register('RepeatPassword', {
            required: true,
            validate: (val: string) => {
              if (watch('Password') !== val) {
                return 'Your passwords do no match";'
              }
            },
          })}
          placeholder="Repeat Password"
        />
        {errors.RepeatPassword ? <span style={{ color: 'red' }}>Passwords must match</span> : null}
      </div>

      <div className="input-checkbox-wrapper">
        <input type="checkbox" {...register('Checkbox', { required: true })} />
        <label htmlFor="">I agree to the processing of my personal information</label>
      </div>
      {errors.Checkbox ? <span style={{ color: 'red', marginBottom: '10px' }}>Required field</span> : null}

      <button>Create</button>
      {isError && (
        <span style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
          A user with this name or email already exists
        </span>
      )}

      <span>
        Already have an account? <Link to="/sign-in">Sign in.</Link>
      </span>
    </form>
  )
}

export { SignUp }
