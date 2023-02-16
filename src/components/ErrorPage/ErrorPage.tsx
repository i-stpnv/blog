import { Link } from 'react-router-dom'
import '../HomePage/HomePage.scss'

const ErrorPage = () => {
  return (
    <div className="home-page-wrapper">
      <h1 style={{ marginTop: 120 }} className="home-page-title">
        404 Not Found
      </h1>
      <h2 style={{ fontSize: 20, marginBottom: 20 }}>Seems like this page doesn&apos;t exist...</h2>
      <Link to="/articles">To articles</Link>
    </div>
  )
}

export { ErrorPage }
