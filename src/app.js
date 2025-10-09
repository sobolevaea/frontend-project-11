import * as yup from 'yup'
import axios from 'axios'
import watch from './view.js'
import i18next from 'i18next'
import ru from '../locale/index.js'
import yupLocale from '../locale/yupLocale.js'

yup.setLocale(yupLocale)

const schema = yup.string().url().nullable()

const validate = (url, urls) => {
  return schema.notOneOf(urls).validate(url)
    .then(() => null)
    .catch(error => error.message)
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

const handleSubmit = watchedState => (event) => {
  event.preventDefault()
  const url = new FormData(event.target).get('url')
  // нужно ли нам вводить переменную urls
  // или просто написать watchedState.feeds?
  const urls = watchedState.feeds
  validate(url, urls)
    .then((error) => {
      if (error) {
        watchedState.form = { isValid: false, error }
        // console.log(watchedState.form.error)
        return
      }
      watchedState.form = { isValid: true, error: '' }
      load(watchedState, url)
    })
}

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    urlField: document.getElementById('url-input'),
    submitButton: document.querySelector('[aria-label="add"]'),
    feedback: document.querySelector('.feedback'),
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

  const defaultLanguage = 'ru'
  const i18nextInstance = i18next.createInstance()
  i18nextInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources: {
      ru,
    },
  }).then(() => {
    const watchedState = watch(elements, state, i18nextInstance)
    elements.form.addEventListener('submit', handleSubmit(watchedState))
  })
}

export default app
