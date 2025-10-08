import onChange from 'on-change'

export default (elements, state, i18next) => {
  const watchedState = onChange(state, (path) => {
    console.log(path)
    switch (path) {
      case 'form':
        if (watchedState.form.isValid) {
          elements.urlField.classList.remove('is-invalid')
          return
        } else {
          elements.urlField.classList.add('is-invalid')
        }
        // что происходит при изменении полей формы?
        // посмотреть, валидна ли форма
        // если нет, то вывести ошибку
        // а если да, то убрать все предупреждения об ошибках
        break
      case 'process':
        switch (watchedState.process.status) {
          case 'sent':
            elements.form.reset()
            elements.urlField.focus()
            elements.submitButton.disabled = false
            // написать сообщение, что поток успешно загружен
            break
          case 'error':
            elements.submitButton.disabled = false
            break

          case 'sending':
            elements.submitButton.disabled = true
            break

          case 'filling':
            elements.submitButton.disabled = false
            break

          default:
            break
        }
        default:
          break
    }
  })

  return watchedState
}
