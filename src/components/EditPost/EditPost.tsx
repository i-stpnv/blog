import './EditPost.scss'
import { SubmitHandler, useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Spin } from 'antd'

import { IFormInput } from '../../types/interfaces'
import { useGetPostQuery, useUpdatePostMutation } from '../../redux/reducers/postsApi'
import { useTypedSelector } from '../../hooks/useTypedSelector'

const EditPost = () => {
  const [title, setTitle] = useState('.')
  const [desc, setDesc] = useState('.')
  const [textArea, setTextArea] = useState('.')
  const { slug } = useParams()
  const navigate = useNavigate()
  const [tagCount, setTagCount] = useState(0)
  const { isSuccess: postInfo, data } = useGetPostQuery(slug)
  const [updatePost, { isSuccess }] = useUpdatePostMutation()
  const { isLogin } = useTypedSelector((state) => state.isLogin)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (postInfo) setTagCount(data.article.tagList.length)
  }, [postInfo])

  useEffect(() => {
    if (isSuccess) {
      return navigate('/articles')
    }
  }, [isSuccess])

  const onSubmit: SubmitHandler<IFormInput> = (validate: any) => {
    const { Body, Desc, Title, ...tags } = validate

    const tagList = []

    for (const key in tags) {
      if (tags[key].trim() !== '') tagList.push(tags[key])
    }

    updatePost([
      slug,
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

  const elements: JSX.Element[] = Array.from(Array(tagCount).keys()).map((el) => {
    return (
      <li key={el + 1}>
        <input type="text" {...register(`Tag${el + 1}`)} placeholder="Tag" value={data.article.tagList[el]} />
        <button onClick={(e) => deleteTag(e)} className="delete-button">
          Delete
        </button>
      </li>
    )
  })

  const addTag = (e: any) => {
    e.preventDefault()
    setTagCount(tagCount + 1)
  }

  const deleteTag = (e: any) => {
    e.preventDefault()
    if (tagCount > 0) {
      setTagCount(tagCount - 1)
    }
  }

  const changeValue = (e: any) => {
    if (e.target.placeholder === 'Title') {
      setTitle(e.target.value)
    }
    if (e.target.placeholder === 'Short description') {
      setDesc(e.target.value)
    }
    if (e.target.placeholder === 'Text') {
      setTextArea(e.target.value)
    }
  }

  if (isLogin || localStorage.getItem('auth')) {
    if (postInfo) {
      if (data.article.author.username === localStorage.getItem('username')) {
        if (title === '.') {
          setTitle(data.article.title)
        }
        if (desc === '.') {
          setDesc(data.article.description)
        }
        if (textArea === '.') {
          setTextArea(data.article.body)
        }

        return (
          <form className="edit-post-form" onSubmit={handleSubmit(onSubmit)}>
            <h2>Edit article</h2>

            <div className="edit-post-input-wrapper">
              <label htmlFor="">Title</label>
              <input
                type="text"
                {...register('Title', {
                  required: true,
                  minLength: 3,
                  maxLength: 60,
                })}
                placeholder="Title"
                onChange={(e) => changeValue(e)}
                value={title}
              />
              {errors.Title?.type === 'required' ? <span style={{ color: 'red' }}>Required field</span> : null}
              {errors.Title?.type === 'maxLength' ? (
                <span style={{ color: 'red', marginBottom: '15px' }}>You can enter a maximum of 60 characters</span>
              ) : null}
              {errors.Title?.type === 'minLength' ? (
                <span style={{ color: 'red', marginBottom: '15px' }}>You need to enter at least 3 characters</span>
              ) : null}
            </div>

            <div className="edit-post-input-wrapper">
              <label htmlFor="">Short description</label>
              <input
                type="text"
                {...register('Desc', {
                  required: true,
                  minLength: 6,
                  maxLength: 250,
                })}
                placeholder="Short description"
                onChange={(e) => changeValue(e)}
                value={desc}
              />
              {errors.Desc?.type === 'minLength' ? (
                <span style={{ color: 'red', marginBottom: '15px' }}>You need to enter at least 6 characters</span>
              ) : null}
              {errors.Desc?.type === 'maxLength' ? (
                <span style={{ color: 'red', marginBottom: '15px' }}>You can enter a maximum of 250 characters</span>
              ) : null}
              {errors.Desc?.type === 'required' ? <span style={{ color: 'red' }}>Required field</span> : null}
            </div>

            <div className="edit-post-input-wrapper">
              <label htmlFor="">Text</label>
              <textarea
                placeholder="Text"
                {...register('Body', {
                  required: true,
                  minLength: 6,
                  maxLength: 1000,
                })}
                onChange={(e) => changeValue(e)}
                value={textArea}
              />
              {errors.Body?.type === 'minLength' ? (
                <span style={{ color: 'red', marginBottom: '15px' }}>You need to enter at least 6 characters</span>
              ) : null}
              {errors.Body?.type === 'maxLength' ? (
                <span style={{ color: 'red', marginBottom: '15px' }}>You can enter a maximum of 1000 characters</span>
              ) : null}
              {errors.Body?.type === 'required' ? <span style={{ color: 'red' }}>Required field</span> : null}
            </div>

            <div className="edit-post-input-wrapper">
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
    } else {
      return (
        <div style={{ padding: 20 }}>
          <Spin size="large" />
        </div>
      )
    }
  } else return <Navigate to="/articles" />
}

export { EditPost }
