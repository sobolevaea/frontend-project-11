import * as yup from 'yup'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import watch from './view.js'
import i18next from 'i18next'
import ru from '../locale/index.js'
import yupLocale from '../locale/yupLocale.js'
import parse from './parser.js'
import _ from 'lodash'

yup.setLocale(yupLocale)

const schema = yup.string().url().nullable()

const validate = (url, urls) => {
  return schema.notOneOf(urls).validate(url)
    .then(() => null)
    .catch(error => error.message)
}

const addProxy = (url) => {
  const data = new URL('/get', 'https://allorigins.hexlet.app')
  data.searchParams.set('disableCache', true)
  data.searchParams.set('url', url)
  return data.href
}

const load = (watchedState, url) => {
  watchedState.process = { status: 'loading', error: '' }
  axios.get(addProxy(url), {
    timeout: 10000,
  })
    .then((response) => {
      const { feed, posts } = parse(response)
      feed.id = _.uniqueId()
      feed.url = url
      posts.forEach((post) => {
        post.id = _.uniqueId()
        post.feedId = feed.id
      })
      watchedState.process = { status: 'success', error: '' }
      watchedState.feeds.push(feed)
      watchedState.posts.push(...posts)
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        return watchedState.process = { status: 'error', error: 'badConnection' }
      }
      return watchedState.process = { status: 'error', error: error.message }
    })
}

const handleSubmit = watchedState => (event) => {
  event.preventDefault()
  const url = new FormData(event.target).get('url')
  const urls = watchedState.feeds.map(feed => feed.url)
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

const checkNewPosts = (watchedState) => {
  const updatedPostsUrls = watchedState.posts.map(post => post.url)
  console.log(updatedPostsUrls.length)
  const promises = watchedState.feeds
    .map(feed => axios.get(addProxy(feed.url), {
      timeout: 10000,
    })
      .then((response) => {
        const data = parse(response)
        data.posts.forEach((post) => {
          if (!_.includes(updatedPostsUrls, post.url)) {
            post.id = _.uniqueId()
            post.feedId = feed.id
            watchedState.posts.push(post)
          }
        })
      }).catch(() => null))
  Promise.all(promises)
}

const checkEveryFiveSeconds = (watchedState) => {
  checkNewPosts(watchedState)
  setTimeout(() => checkEveryFiveSeconds(watchedState), 5000)
}

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    urlField: document.getElementById('url-input'),
    submitButton: document.querySelector('[aria-label="add"]'),
    feedback: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
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
    seen: [],
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
    checkEveryFiveSeconds(watchedState)
  })
}

export default app
