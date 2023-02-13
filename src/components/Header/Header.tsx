import './Header.scss'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { useTypedSelector } from '../../hooks/useTypedSelector'
import { logout } from '../../redux/reducers/authSlice'
import avatar from '../../img/avatar.png'

const Header = () => {
  const dispatch = useDispatch()

  const userName = localStorage.getItem('username')
  const userImg = localStorage.getItem('image')

  const { isLogin } = useTypedSelector((state) => state.isLogin)

  const logoutOnclick = () => {
    localStorage.removeItem('auth')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    localStorage.removeItem('token')
    localStorage.removeItem('image')
    dispatch(logout())
    window.location.reload()
  }

  if (isLogin || localStorage.getItem('auth')) {
    return (
      <header className="header">
        <Link className="header__blog-name" to="/">
          Realworld Blog
        </Link>
        <div className="header__auth-wrapper">
          <Link className="header__create-post" to="/new-article">
            Create post
          </Link>
          <Link className="header__profile" to={`/profile/${userName}`}>
            <span>{userName}</span>
            <img
              style={{ width: '46px', height: '42px', borderRadius: '50px' }}
              src={userImg ? userImg : avatar}
              alt=""
            />
          </Link>
          <Link onClick={logoutOnclick} className="header__logout" to="/articles">
            Log Out
          </Link>
        </div>
      </header>
    )
  }

  return (
    <header className="header">
      <Link className="header__blog-name" to="/">
        Realworld Blog
      </Link>

      <div className="header__auth-wrapper">
        <Link className="header__sign-in" to="/sign-in">
          Sign In
        </Link>
        <Link className="header__sign-up" to="/sign-up">
          Sign Up
        </Link>
      </div>
    </header>
  )
}

export { Header }
