import './CreateNewPost.scss'
import { SubmitHandler, useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { IFormInput } from '../../types/interfaces'
import { useCreatePostMutation } from '../../redux/reducers/postsApi'
import { useTypedSelector } from '../../hooks/useTypedSelector'

const CreateNewPost = () => {
  const [tag, setTag] = useState(0)
  const [createPost, { isSuccess }] = useCreatePostMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()
  const { isLogin } = useTypedSelector((state) => state.isLogin)
  useEffect(() => {
    if (isSuccess) {
      return navigate('/articles')
    }
  }, [isSuccess])

  const onSubmit: SubmitHandler<IFormInput> = (validate: any) => {
    const { Body, Desc, Title, ...tags } = validate

    const tagList = []

    for (const key in tags) {
      tagList.push(tags[key])
    }

    createPost([
      {
        article: {
          title: Title,
          description: Desc,
          body: Body,
          tagList: tagList,
        },
      },
      localStorage.getItem('token'),
    ])
  }

  const elements: JSX.Element[] = Array.from(Array(tag).keys()).map((el) => {
    return (
      <li key={Date.now()}>
        <input type="text" {...register(`Tag${el + 1}`)} placeholder="Tag" />
        <button onClick={(e) => deleteTag(e)} className="delete-button">
          Delete
        </button>
      </li>
    )
  })

  const addTag = (e: any) => {
    e.preventDefault()
    setTag(tag + 1)
  }

  const deleteTag = (e: any) => {
    e.preventDefault()
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (tag > 0) {
      setTag(tag - 1)
    }
  }

  if (isLogin || localStorage.getItem('auth')) {
    return (
      <form className="create-post-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Create new article</h2>
        <div className="create-post-input-wrapper">
          <label htmlFor="">Title</label>
          <input
            type="text"
            {...register('Title', {
              required: true,
              minLength: 3,
              maxLength: 60,
            })}
            placeholder="Title"
          />
          {errors.Title?.type === 'required' ? <span style={{ color: 'red' }}>Required field</span> : null}
          {errors.Title?.type === 'maxLength' ? (
            <span style={{ color: 'red', marginBottom: '15px' }}>You can enter a maximum of 60 characters</span>
          ) : null}
          {errors.Title?.type === 'minLength' ? (
            <span style={{ color: 'red', marginBottom: '15px' }}>You need to enter at least 3 characters</span>
          ) : null}
        </div>
        <div className="create-post-input-wrapper">
          <label htmlFor="">Short description</label>
          <input
            type="text"
            {...register('Desc', {
              required: true,
              minLength: 6,
              maxLength: 250,
            })}
            placeholder="Short description"
          />
          {errors.Desc?.type === 'minLength' ? (
            <span style={{ color: 'red', marginBottom: '15px' }}>You need to enter at least 6 characters</span>
          ) : null}
          {errors.Desc?.type === 'maxLength' ? (
            <span style={{ color: 'red', marginBottom: '15px' }}>You can enter a maximum of 250 characters</span>
          ) : null}
          {errors.Desc?.type === 'required' ? <span style={{ color: 'red' }}>Required field</span> : null}
        </div>
        <div className="create-post-input-wrapper">
          <label htmlFor="">Text</label>
          <textarea
            placeholder="Text"
            {...register('Body', {
              required: true,
              minLength: 6,
              maxLength: 1000,
            })}
          />
          {errors.Body?.type === 'minLength' ? (
            <span style={{ color: 'red', marginBottom: '15px' }}>You need to enter at least 6 characters</span>
          ) : null}
          {errors.Body?.type === 'maxLength' ? (
            <span style={{ color: 'red', marginBottom: '15px' }}>You can enter a maximum of 1000 characters</span>
          ) : null}
          {errors.Body?.type === 'required' ? <span style={{ color: 'red' }}>Required field</span> : null}
        </div>
        <div className="create-post-input-wrapper">
          <label htmlFor="">Tags</label>
          <ul>
            {elements.reverse()}
            <li key={0}>
              <input type="text" {...register('Tag0')} placeholder="Tag" />
              <button onClick={(e) => deleteTag(e)} className="delete-button">
                Delete
              </button>
              <button onClick={(e) => addTag(e)} className="add-button">
                Add Tag
              </button>
            </li>
          </ul>
        </div>
        <button className="send-button">Send</button>
      </form>
    )
  } else return <Navigate to="/articles" />
}

export { CreateNewPost }
