import { Link } from 'react-router-dom'
import './HomePage.scss'

const HomePage = () => {
  return (
    <div className="home-page-wrapper">
      <h1 className="home-page-title">HomePage</h1>
      <Link to="/articles">К статьям</Link>
    </div>
  )
}

export { HomePage }
