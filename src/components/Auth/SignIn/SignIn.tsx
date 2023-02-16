import { useDispatch } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'

import { useLoginMutation } from '../../../redux/reducers/postsApi'
import { login } from '../../../redux/reducers/authSlice'
import { IFormInput } from '../../../types/interfaces'
import './SignIn.scss'
import { useTypedSelector } from '../../../hooks/useTypedSelector'

const SignIn = () => {
  const dispatch = useDispatch()

  const [loginOnServer, { isSuccess, data, error }] = useLoginMutation()
  const { isLogin } = useTypedSelector((state) => state.isLogin)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const onSubmit: SubmitHandler<IFormInput> = (validate: any) => {
    loginOnServer({
      user: {
        email: validate.Email,
        password: validate.Password,
      },
    })
  }

  if (isSuccess) {
    localStorage.setItem('image', data.user.image)
    localStorage.setItem('token', data.user.token)
    localStorage.setItem('auth', 'true')
    localStorage.setItem('username', data.user.username)
    localStorage.setItem('email', data.user.email)
    dispatch(login())
    setTimeout(() => window.location.reload(), 100)
    return <Navigate to="/articles" replace />
  }

  if (!(isLogin || localStorage.getItem('auth'))) {
    return (
      <form className="sign-in-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign In</h2>
        <div>
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
        <div>
          <label htmlFor="">Password</label>
          <input
            type="password"
            {...register('Password', {
              required: true,
              minLength: 6,
              maxLength: 40,
            })}
            placeholder="Password"
          />
          {errors.Password?.type === 'minLength' ? (
            <span style={{ color: 'red', marginBottom: '15px' }}>Your password needs to be at least 6 characters.</span>
          ) : null}
          {errors.Password?.type === 'maxLength' ? (
            <span style={{ color: 'red', marginBottom: '15px' }}>Your password must be 40 characters or less.</span>
          ) : null}
          {errors.Password?.type === 'required' ? <span style={{ color: 'red' }}>Required field</span> : null}
        </div>
        {error && <span style={{ color: 'red' }}>Wrong password or email</span>}
        <button>Login</button>
        <span>
          Don’t have an account? <Link to="/sign-up">Sign Up.</Link>
        </span>
      </form>
    )
  } else return <Navigate to="/articles" />
}

export { SignIn }
