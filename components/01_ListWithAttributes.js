const generateListContainerElement = () => {
  const template = document.querySelector('template[data-list-container]')
  return document.importNode(template.content.firstElementChild, true)
}

const generatePostElement = post => {
  const template = document.querySelector('template[data-row]')
  const element = document.importNode(template.content.firstElementChild, true)

  element
    .querySelector('[data-title]')
    .textContent = post.title

  element
    .querySelector('[data-published]')
    .textContent = (new Date(post.published).toLocaleString())

  return element
}

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 2

export default class ButterCMSList extends HTMLElement {
  get token () {
    return this.getAttribute('token')
  }

  set token (value) {
    this.setAttribute('token', value)
  }

  get page () {
    if (!this.hasAttribute('page')) {
      return DEFAULT_PAGE
    }

    return parseInt(this.getAttribute('page'))
  }

  set page (value) {
    this.setAttribute('page', value)
  }

  get pageSize () {
    if (!this.hasAttribute('page-size')) {
      return DEFAULT_PAGE_SIZE
    }

    return parseInt(this.getAttribute('page-size'))
  }

  set pageSize (value) {
    this.setAttribute('page-size', value)
  }

  get category () {
    return this.getAttribute('category')
  }

  set category (value) {
    this.setAttribute('category', value)
  }

  async connectedCallback () {
    const listContainer = generateListContainerElement()
    const list = listContainer.querySelector('[data-list]')

    const butter = new Butter(this.token)

    const options = {
      page: this.page,
      page_size: this.pageSize
    }

    if (this.category) {
      options.category_slug = this.category
    }

    const response = await butter.post.list(options)

    const posts = response.data.data

    const postElements = posts.map(generatePostElement)

    postElements.forEach(element => {
      list.appendChild(element)
    })

    this.appendChild(listContainer)
  }
}
