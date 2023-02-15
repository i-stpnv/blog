import './Posts.scss'
import { Spin } from 'antd'
import { FunctionComponent } from 'react'
import { useDispatch } from 'react-redux'

import { setMaxCountPages } from '../../redux/reducers/paginationSlice'
import { IPost } from '../../types/interfaces'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import { useGetPostsQuery } from '../../redux/reducers/postsApi'
import { Pagination } from '../Pagination/Pagination'

import { PostLink } from './PostLink/PostLink'

const Posts: FunctionComponent = () => {
  const { page } = useTypedSelector((state) => state.page)
  const { data, isSuccess } = useGetPostsQuery((page - 1) * 5)
  const dispatch = useDispatch()

  let posts
  if (isSuccess) {
    const maxPages = Math.floor(Number(data.articlesCount / 5 + 1))
    if (maxPages === 0) {
      return <h1>Сегодня постов нет, приходите завтра</h1>
    }
    dispatch(setMaxCountPages(maxPages))
    posts = data.articles.map((el: IPost) => {
      return (
        <li key={el.slug}>
          <PostLink {...el} />
        </li>
      )
    })
  } else {
    return (
      <div style={{ padding: 20 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="posts-wrapper">
      <ul>{posts}</ul>

      <Pagination />
    </div>
  )
}

export { Posts }
