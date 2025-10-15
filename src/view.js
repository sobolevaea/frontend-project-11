import _ from 'lodash'
import onChange from 'on-change'

const handleSeen = (watchedState, id) => {
  if (!_.includes(watchedState.seen, id)) {
    watchedState.seen.push(id)
  }
}

const handleFeeds = (elements, watchedState, i18nextInstance) => {
  elements.feedsContainer.innerHTML = ''

  const card = document.createElement('div')
  card.classList.add('card', 'border-0')
  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  const cardTitle = document.createElement('h2')
  cardTitle.classList.add('card-title', 'h4')
  cardTitle.textContent = i18nextInstance.t('cards.feeds.cardTitle')
  cardBody.append(cardTitle)
  card.append(cardBody)

  const listGroup = document.createElement('ul')
  listGroup.classList.add('list-group', 'border-0', 'rounded-0')
  const feeds = watchedState.feeds.map(({ title, description }) => {
    const feed = document.createElement('li')
    feed.classList.add('list-group-item', 'border-0', 'border-end-0')
    const feedTitle = document.createElement('h3')
    feedTitle.classList.add('h6', 'm-0')
    feedTitle.textContent = title
    const feedDescription = document.createElement('p')
    feedDescription.classList.add('m-0', 'small', 'text-black-50')
    feedDescription.textContent = description
    feed.append(feedTitle, feedDescription)
    return feed
  })
  listGroup.append(...feeds)
  elements.feedsContainer.append(card, listGroup)
}

const handlePosts = (elements, watchedState, i18nextInstance) => {
  elements.postsContainer.innerHTML = ''

  const card = document.createElement('div')
  card.classList.add('card', 'border-0')
  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  const cardTitle = document.createElement('h2')
  cardTitle.classList.add('card-title', 'h4')
  cardTitle.textContent = i18nextInstance.t('cards.posts.cardTitle')
  cardBody.append(cardTitle)
  card.append(cardBody)

  const listGroup = document.createElement('ul')
  listGroup.classList.add('list-group', 'border-0', 'rounded-0')
  const posts = watchedState.posts.map(({ title, description, url, id, feedId }) => {
    const post = document.createElement('li')
    post.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')

    const postLink = document.createElement('a')
    // const linkClass = _.includes(watchedState.seen, id) ? 'fw-normal' : 'fw-bold'
    // postLink.classList.add(linkClass)
    // добавление серого цвета для просмотренных постов
    postLink.classList.add('fw-bold')
    if (_.includes(watchedState.seen, id)) {
      postLink.classList.replace('fw-bold', 'fw-normal')
      postLink.classList.add('link-secondary')
    }
    postLink.setAttribute('href', url)
    postLink.setAttribute('data-id', feedId)
    postLink.setAttribute('target', '_blank')
    postLink.setAttribute('rel', 'noopener noreferrer')
    postLink.textContent = title

    const viewButton = document.createElement('button')
    viewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm')
    viewButton.setAttribute('type', 'button')
    viewButton.setAttribute('data-id', feedId)
    viewButton.setAttribute('data-bs-toggle', 'modal')
    viewButton.setAttribute('data-bs-target', '#modal')
    viewButton.textContent = i18nextInstance.t('cards.posts.viewButton')

    postLink.addEventListener('click', () => {
      handleSeen(watchedState, id)
    })
    viewButton.addEventListener('click', () => {
      handleSeen(watchedState, id)
      elements.modalTitle.textContent = title
      elements.modalBody.textContent = description
      elements.moreButton.setAttribute('href', url)
    })

    post.append(postLink, viewButton)
    return post
  })
  listGroup.append(...posts)
  elements.postsContainer.append(card, listGroup)
}

const handleForm = (elements, watchedState, i18nextInstance) => {
  if (!watchedState.form.isValid) {
    elements.urlField.classList.add('is-invalid')
    elements.feedback.classList.add('text-danger')
    elements.feedback.textContent = i18nextInstance.t(`messages.errors.${watchedState.form.error.key}`)
  }
  return
}

const handleProcess = (elements, watchedState, i18nextInstance) => {
  const unknownErrorMessage = i18nextInstance.t('messages.errors.other')
  switch (watchedState.process.status) {
    case 'success':
      elements.form.reset()
      elements.urlField.focus()
      elements.submitButton.disabled = false
      elements.urlField.classList.remove('is-invalid')
      elements.feedback.classList.replace('text-danger', 'text-success')
      elements.feedback.textContent = i18nextInstance.t('messages.success')
      break
    case 'error':
      elements.submitButton.disabled = false
      elements.urlField.classList.add('is-invalid')
      elements.feedback.classList.add('text-danger')
      elements.feedback.textContent = i18nextInstance.t(`messages.errors.${watchedState.process.error}`, unknownErrorMessage)
      break
    case 'loading':
      elements.submitButton.disabled = true
      break
    case 'filling':
      elements.submitButton.disabled = false
      break
    default:
      break
  }
}

export default (elements, state, i18nextInstance) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'seen':
        handlePosts(elements, watchedState, i18nextInstance)
        break
      case 'feeds':
        handleFeeds(elements, watchedState, i18nextInstance)
        break
      case 'posts':
        handlePosts(elements, watchedState, i18nextInstance)
        break
      case 'form':
        handleForm(elements, watchedState, i18nextInstance)
        break
      case 'process':
        handleProcess(elements, watchedState, i18nextInstance)
        break
      default:
        break
    }
  })
  return watchedState
}
