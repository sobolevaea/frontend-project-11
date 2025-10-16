import 'bootstrap'
import * as yup from 'yup'
import _ from 'lodash'
import axios from 'axios'
import i18next from 'i18next'
import watch from './view.js'
import parse from './parser.js'
import resources from '../locale/index.js'
import yupLocale from '../locale/yupLocale.js'

const defaultLanguage = 'ru'
const waitingTimeout = 10000
const updateInterval = 5000

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

const getErrorKey = (error) => {
  switch (true) {
    case error.isAxiosError:
      return 'network'
    case error.isParserError:
      return 'notRss'
    default:
      return 'unknown'
  }
}

const load = (watchedState, url) => {
  watchedState.process = { status: 'loading', error: '' }
  axios.get(addProxy(url), {
    timeout: waitingTimeout,
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
    .catch(error => watchedState.process = { status: 'error', error: getErrorKey(error) })
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

const updatePosts = (watchedState) => {
  const promises = watchedState.feeds
    .map(feed => axios.get(addProxy(feed.url), {
      timeout: waitingTimeout,
    })
      .then((response) => {
        const feedPostsUrls = watchedState.posts
          .filter(post => post.feedId === feed.id)
          .map(post => post.url)
        const data = parse(response)
        data.posts.forEach((post) => {
          if (!_.includes(feedPostsUrls, post.url)) {
            post.id = _.uniqueId()
            post.feedId = feed.id
            watchedState.posts.push(post)
          }
        })
      }).catch(() => null))
  Promise.all(promises)
    .then(() => setTimeout(() => updatePosts(watchedState), updateInterval))
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
    moreButton: document.querySelector('.full-article'),
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
    seen: new Set(),
  }

  const i18nextInstance = i18next.createInstance()
  i18nextInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  }).then(() => {
    const watchedState = watch(elements, state, i18nextInstance)
    elements.form.addEventListener('submit', handleSubmit(watchedState))
    updatePosts(watchedState)
  })
}

export default app
