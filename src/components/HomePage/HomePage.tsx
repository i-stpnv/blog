import { Link } from 'react-router-dom'
import './HomePage.scss'

const HomePage = () => {
  return (
    <div className="home-page-wrapper">
      <h1 className="home-page-title">Welcome to Realworld Blog!</h1>
      <Link to="/articles">To articles</Link>
    </div>
  )
}

export { HomePage }
