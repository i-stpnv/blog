import { Link, useNavigate, useParams } from 'react-router-dom'
import './Post.scss'
import { FunctionComponent, useEffect, useState } from 'react'
import { parseISO } from 'date-fns'
import { Spin } from 'antd'
import ReactMarkdown from 'react-markdown'

import warning from '../../../img/warning.svg'
import { useDeletePostMutation, useGetPostQuery } from '../../../redux/reducers/postsApi'
import { HeartLike } from '../HeartLike/HeartLike'

const Post: FunctionComponent = () => {
  const [confirmDelete, setConfirmDelete] = useState(false)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { slug }: { slug: string } = useParams()
  const navigate = useNavigate()
  localStorage.setItem('slug', slug)

  const { isSuccess, isLoading, data } = useGetPostQuery(slug)
  const [deletePost, { isSuccess: postDelete }] = useDeletePostMutation()

  useEffect(() => {
    if (postDelete) {
      return navigate('/articles')
    }
  }, [postDelete])

  const deletePostOnClick = () => {
    deletePost([slug, localStorage.getItem('token')])
  }

  let content
  if (isLoading) {
    content = (
      <div style={{ padding: 20 }}>
        <Spin size="large" />
      </div>
    )
  }
  if (isSuccess) {
    const formatDate = parseISO(data.article.createdAt).toString().slice(0, 25)
    content = (
      <div className="post-wrapper">
        <div className="post-wrapper__left-content">
          <div className="post-wrapper__title-wrapper">
            <span className="post-wrapper__title">{data.article.title.slice(0, 60)}</span>
            <HeartLike slug={slug} />
            <span className="post-wrapper__likes-amount">{data.article.favoritesCount}</span>
          </div>

          <ul className="post-wrapper__tags-list">
            {data.article.tagList.length > 0 ? (
              data.article.tagList.map((el: string) => {
                if (el !== '' && el !== null) {
                  return (
                    <li style={{ marginRight: '10px' }} key={data.article.tagList.indexOf(el)}>
                      {el.slice(0, 20)}
                    </li>
                  )
                }
                return (
                  <li style={{ marginRight: '10px' }} key={Date.now()}>
                    Нет тегов
                  </li>
                )
              })
            ) : (
              <li style={{ marginRight: '10px' }} key={Date.now()}>
                Нет тегов
              </li>
            )}
          </ul>

          <p className="post-wrapper__overview">{data.article.description.slice(0, 300)}</p>

          <ReactMarkdown>{data.article.body}</ReactMarkdown>
        </div>

        <div className="post-wrapper__right-content">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="post-wrapper__post-author">
              <span className="post-wrapper__author">{data.article.author.username}</span>
              <span className="post-wrapper__date"> {formatDate} </span>
            </div>

            <img src={data.article.author.image} alt="" className="post-wrapper__author-avatar" />
          </div>

          {data.article.author.username === localStorage.getItem('username') ? (
            <div style={{ marginTop: '25px', position: 'relative' }}>
              <button onClick={() => setConfirmDelete(true)} className="delete-button">
                Delete
              </button>
              <Link to={`/articles/${slug}/edit`} className="edit-button">
                Edit
              </Link>
              {!confirmDelete ? null : (
                <div className="confirm-delete">
                  <div className="left-content">
                    <img src={warning} alt="" />
                    <span>Are you sure to delete this article?</span>
                  </div>
                  <div className="right-content">
                    <button className="no-button" onClick={() => setConfirmDelete(false)}>
                      No
                    </button>
                    <button className="yes-button" onClick={deletePostOnClick}>
                      Yes
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  return <>{content}</>
}

export { Post }
