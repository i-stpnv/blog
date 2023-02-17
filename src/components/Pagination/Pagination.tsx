import React, { MouseEvent, useEffect, useState } from 'react'
import './Pagination.scss'
import { useDispatch } from 'react-redux'

import Next from '../../img/next.svg'
import Back from '../../img/back.svg'
import { decrement, increment, setPageGlobal } from '../../redux/reducers/paginationSlice'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import { useGetPostsQuery } from '../../redux/reducers/postsApi'

const Pagination = () => {
  const dispatch = useDispatch()

  const { page } = useTypedSelector((state) => state.page)
  const { isSuccess: postsInfo, data } = useGetPostsQuery(null)
  const [pagesCount, setPagesCount] = useState(0)

  useEffect(() => {
    if (postsInfo) {
      setPagesCount(Math.ceil(data.articlesCount / 5))
    }
  }, [postsInfo])

  const pagesList = [page, page + 1, page + 2, page + 3, page + 4].map((el, index) => {
    const classNames = ['pagination-panel__page-link']
    if (el <= pagesCount) {
      if (index === 0) classNames.push('active')
      return (
        <li className={classNames.join(' ')} key={el}>
          <button onClick={(e) => onClickPage(e)}>{el}</button>
        </li>
      )
    }
  })

  const onClickPage = (e: MouseEvent<HTMLButtonElement>) => {
    if (parseInt(e.currentTarget.innerHTML) <= pagesCount) {
      dispatch(setPageGlobal(parseInt(e.currentTarget.innerHTML)))
    }
  }

  return (
    <div className="pagination-panel">
      <button onClick={() => (page > 1 ? dispatch(decrement()) : null)}>
        <img src={Back} alt="" />
      </button>

      <ul className="pagination-panel__pages-list">{pagesList}</ul>

      <button
        className="pagination-panel__next-page-button"
        onClick={() => (page < pagesCount ? dispatch(increment()) : null)}
      >
        <img src={Next} alt="" />
      </button>
    </div>
  )
}

export { Pagination }
