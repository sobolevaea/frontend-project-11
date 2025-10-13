import * as yup from 'yup'
import axios from 'axios'
import watch from './view.js'
import i18next from 'i18next'
import ru from '../locale/index.js'
import yupLocale from '../locale/yupLocale.js'
import parseResponse from './parser.js'
import _ from 'lodash'

yup.setLocale(yupLocale)

const schema = yup.string().url().nullable()

const validate = (url, urls) => {
  return schema.notOneOf(urls).validate(url)
    .then(() => null)
    .catch(error => error.message)
}

const load = (watchedState, url) => {
  watchedState.process = { status: 'loading', error: '' }
  axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      const parsedResponse = parseResponse(response)
      // const feed = parsedResponse.feed
      // const posts = parsedResponse.posts
      parsedResponse.feed.id = _.uniqueId()
      parsedResponse.posts.forEach(post => {
        post.id = _.uniqueId()
        post.feedId = parsedResponse.feed.id
      })
      watchedState.process = { status: 'success', error: '' }
      watchedState.feeds.push(parsedResponse.feed)
      watchedState.posts.push(parsedResponse.posts)
    })
    // потом доделать
    // выяснить пришла ошибка парсера или еще какая-то (загрузка, парсер, время ожидания, неизвестная ошибка)
    .catch(error => {
      console.log(error)
      return watchedState.process = { status: 'error', error }
    })
}

const handleSubmit = watchedState => (event) => {
  event.preventDefault()
  const url = new FormData(event.target).get('url')
  const urls = watchedState.feeds.map(feed => feed.url)
  console.log(urls)
  validate(url, urls)
    .then((error) => {
      if (error) {
        watchedState.form = { isValid: false, error }
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
    posts: [],
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
