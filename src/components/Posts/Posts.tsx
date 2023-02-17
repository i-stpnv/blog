import './Posts.scss'
import { Spin } from 'antd'
import React, { FunctionComponent, useEffect, useState } from 'react'

import { IPost } from '../../types/interfaces'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import { useGetPostsQuery } from '../../redux/reducers/postsApi'
import { Pagination } from '../Pagination/Pagination'

import { PostLink } from './PostLink/PostLink'

const Posts: FunctionComponent = () => {
  const { page } = useTypedSelector((state) => state.page)
  const { data, isSuccess } = useGetPostsQuery((page - 1) * 5)

  const [loading, setLoading] = useState(true)
  useEffect(() => setLoading(true), [page])
  useEffect(() => setLoading(false), [data])

  let posts
  if (isSuccess) {
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

  if (!loading) {
    return (
      <div className="posts-wrapper">
        <ul>{posts}</ul>

        <Pagination />
      </div>
    )
  } else {
    return (
      <div className="posts-wrapper">
        <div style={{ padding: 20 }}>
          <Spin size="large" />
        </div>

        <Pagination />
      </div>
    )
  }
}

export { Posts }
