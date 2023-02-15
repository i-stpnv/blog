import { FC, useState } from 'react'

import heart from '../../../img/heart.svg'
import { useDislikePostMutation, useGetPostQuery, useLikePostMutation } from '../../../redux/reducers/postsApi'
import likedHeart from '../../../img/liked.svg'
import { useTypedSelector } from '../../../hooks/useTypedSelector'

const HeartLike: FC<{ slug: string }> = ({ slug }) => {
  const [reload, setReload] = useState(0)
  const { isLogin } = useTypedSelector((state) => state.isLogin)
  const [likePost] = useLikePostMutation()
  const [dislikePost] = useDislikePostMutation()
  const { isSuccess, data } = useGetPostQuery(slug)

  const like = () => {
    if (isLogin || localStorage.getItem('auth')) {
      likePost([slug, localStorage.getItem('token')])
      setReload(reload + 1)
    }
  }

  const dislike = () => {
    if (isLogin || localStorage.getItem('auth')) {
      dislikePost([slug, localStorage.getItem('token')])
      setReload(reload + 1)
    }
  }

  if (isSuccess) {
    if (data.article.favorited) {
      return <img onClick={dislike} src={likedHeart} alt="" className="post-link-wrapper__likes-on-post-img" />
    }
  }

  return <img onClick={like} src={heart} alt="" className="post-link-wrapper__likes-on-post-img" />
}

export { HeartLike }
