import * as yup from 'yup'
import * as _ from 'lodash'
import axios from 'axios'
import fs from 'fs'
import watch from './view.js'

const schema = yup.string().url().nullable()

const validate = (url, urls) => {
  return schema.notOneOf(urls).validate(url)
    .then(() => null)
    .catch((error) => error.message)
}

const load = (watchedState, url) => {
  watchedState.process = { status: 'sending', error: '' }
  axios.get(url)
    .then(() => {
      watchedState.process = { status: 'sent', error: '' }
      watchedState.feeds.push(url)
    })
    .catch(error => watchedState.process = { status: 'error', error })
}

const app = () => {
  // исправить на асинхронную библиотеку
  const i18nextInstance = ''

  const elements = {
    form: document.querySelector('.rss-form'),
    urlField: document.getElementById('url-input'),
    submitButton: document.querySelector('[aria-label="add"]'),
  }

  const state = {
    process: {
      status: 'filling',
      error: '',
    },
    form: {
      isValid: true,
      error: '',
    },
    feeds: [],
  }

  const watchedState = watch(elements, state, i18nextInstance)

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()

    const url = new FormData(e.target).get('url')
    // нужно ли нам вводить переменную urls
    // или просто написать watchedState.feeds?
    const urls = watchedState.feeds
    validate(url, urls)
      .then(error => {
        if (error) {
          // нужно же сгенерировать эту ошибку, а не просто выйти?
          // у нас все равно привязана на изменения генерация визуала
          watchedState.form = { isValid: false, error }
          return
        }
        watchedState.form = { isValid: true, error: '' }
        load(watchedState, url)
      })
  })
}

export default app