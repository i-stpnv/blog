import './PostLink.scss'
import { Link } from 'react-router-dom'
import { FunctionComponent } from 'react'
import { parseISO } from 'date-fns'

import { IPost } from '../../../types/interfaces'
import { HeartLike } from '../HeartLike/HeartLike'

const PostLink: FunctionComponent<IPost> = ({
  createdAt,
  title,
  slug,
  favoritesCount,
  author,
  tagList,
  description,
}: IPost) => {
  return (
    <div className="post-link-wrapper">
      <div className="post-link-wrapper__left-content">
        <div className="post-link-wrapper__title-wrapper">
          <Link to={`${slug}`} className="post-link-wrapper__title">
            {title?.slice(0, 60)}
          </Link>
          <HeartLike slug={slug as string} />
          <span className="post-link-wrapper__likes-amount">{favoritesCount}</span>
        </div>

        <ul className="post-link-wrapper__tags-list">
          {tagList?.length > 0 ? (
            tagList.map((el) => {
              if (el !== '' && el !== null) {
                return <li key={tagList.indexOf(el)}>{el.slice(0, 20)}</li>
              }
              return <li key={Date.now()}>Нет тегов</li>
            })
          ) : (
            <li key={Date.now()}>Нет тегов</li>
          )}
        </ul>

        <p className="post-link-wrapper__overview">{description?.slice(0, 300)}</p>
      </div>

      <div className="post-link-wrapper__right-content">
        <div className="post-link-wrapper__post-author">
          <span className="post-link-wrapper__author">{author?.username.slice(0, 40)}</span>
          <span className="post-link-wrapper__date">
            {parseISO(createdAt as string)
              .toString()
              .slice(0, 25)}
          </span>
        </div>

        <img src={author?.image} alt="" className="post-link-wrapper__author-avatar" />
      </div>
    </div>
  )
}

export { PostLink }
