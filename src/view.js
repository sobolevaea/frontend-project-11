import onChange from 'on-change'

export default (elements, state, i18nextInstance) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      // отображать посты
      // вызвать handlePosts()

      case 'form':
        // вызвать handleForm()
        if (watchedState.form.isValid) {
          elements.urlField.classList.remove('is-invalid')
          elements.feedback.classList.replace('text-danger', 'text-success')
          elements.feedback.textContent = i18nextInstance.t('messages.success')
        }
        else {
          elements.urlField.classList.add('is-invalid')
          elements.feedback.classList.add('text-danger')
          elements.feedback.textContent = i18nextInstance.t(`messages.errors.${watchedState.form.error.key}`)
        }
        break
      case 'process':
        switch (watchedState.process.status) {
          case 'success':
            elements.form.reset()
            elements.urlField.focus()
            elements.submitButton.disabled = false
            // написать сообщение, что поток успешно загружен
            break
          case 'error':
            elements.submitButton.disabled = false
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
        break
      default:
        break
    }
  })

  return watchedState
}
