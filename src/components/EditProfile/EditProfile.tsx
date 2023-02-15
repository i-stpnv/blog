import './EditProfile.scss'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { useEditProfileMutation } from '../../redux/reducers/postsApi'
import { IFormInput } from '../../types/interfaces'
import { useTypedSelector } from '../../hooks/useTypedSelector'

const EditProfile = () => {
  const navigate = useNavigate()
  const [userNameInForm, setUserNameInForm] = useState(localStorage.getItem('username') || '')
  const [userEmailInForm, setUserEmailInForm] = useState(localStorage.getItem('email') || '')
  const [editProfile, { error, isSuccess }] = useEditProfileMutation()
  const { isLogin } = useTypedSelector((state) => state.isLogin)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (isSuccess) {
      return navigate('/articles')
    }
  }, [isSuccess])

  const onSubmit: SubmitHandler<IFormInput> = (validate: any) => {
    editProfile([
      {
        user: {
          email: validate.Email,
          password: validate.Password,
          username: validate.Username,
          bio: '',
          image: validate.Image || '',
        },
      },
      localStorage.getItem('token'),
    ])
    localStorage.setItem('username', userNameInForm)
    localStorage.setItem('email', userEmailInForm)
  }

  const changeUserNameInForm = (e: any) => {
    if (e.target.placeholder === 'Username') {
      setUserNameInForm(e.target.value)
    }
  }

  const changeUserEmailInForm = (e: any) => {
    if (e.target.placeholder === 'Email address') {
      setUserEmailInForm(e.target.value)
    }
  }

  if (userNameInForm === '.') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setUserNameInForm(username)
  }

  if (isLogin || localStorage.getItem('auth')) {
    return (
      <form className="sign-up-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Edit Profile</h2>

        <div className="input-text-wrapper">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={userNameInForm}
            {...register('Username', { required: true, minLength: 3, maxLength: 20 })}
            placeholder="Username"
            onChange={(e) => changeUserNameInForm(e)}
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
          <label htmlFor="email">Email address</label>
          <input
            type="text"
            id="email"
            value={userEmailInForm}
            {...register('Email', {
              required: true,
              pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            })}
            placeholder="Email address"
            onChange={(e) => changeUserEmailInForm(e)}
          />
          {error && <span style={{ color: 'red' }}>Is already taken.</span>}
          {errors.Email?.type === 'pattern' ? <span style={{ color: 'red' }}>Wrong email format</span> : null}
          {errors.Email?.type === 'required' ? <span style={{ color: 'red' }}>Required field</span> : null}
        </div>

        <div className="input-text-wrapper">
          <label htmlFor="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            {...register('Password', {
              required: true,
              minLength: 6,
              maxLength: 40,
            })}
            placeholder="Password"
          />
          {errors.Password?.type === 'required' ? <span style={{ color: 'red' }}>Required field</span> : null}
          {errors.Password?.type === 'minLength' ? (
            <span style={{ color: 'red' }}>Your password needs to be at least 6 characters.</span>
          ) : null}
          {errors.Password?.type === 'maxLength' ? (
            <span style={{ color: 'red' }}>Your password must be 40 characters or less.</span>
          ) : null}
        </div>

        <div className="input-text-wrapper">
          <label htmlFor="avatar">Avatar image (url)</label>
          <input type="text" id="avatar" {...register('Image')} placeholder="Image" />
        </div>

        <button>Save</button>
      </form>
    )
  } else return <Navigate to="/articles" />
}

export { EditProfile }
