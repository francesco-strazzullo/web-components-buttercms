const htmlToElement = htmlAsString => {
  const temp = document.createElement('div')
  temp.innerHTML = htmlAsString
  return temp.firstElementChild
}

const generateRemoteElement = async url => {
  const response = await window.fetch(url)
  const html = await response.text()
  return htmlToElement(html)
}

const generatePostElement = (baseElement, post) => {
  const element = baseElement.cloneNode(true)

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
const DEFAULT_LIST_TEMPLATE_URL = '/templates/list.html'
const DEFAULT_ROW_TEMPLATE_URL = '/templates/row.html'

export default class ButterCMSList extends HTMLElement {
  static get observedAttributes () {
    return [
      'page'
    ]
  }

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

  get listTemplateURL () {
    if (!this.hasAttribute('list-template-url')) {
      return DEFAULT_LIST_TEMPLATE_URL
    }

    return this.getAttribute('list-template-url')
  }

  set listTemplateURL (value) {
    this.setAttribute('list-template-url', value)
  }

  get rowTemplateURL () {
    if (!this.hasAttribute('row-template-url')) {
      return DEFAULT_ROW_TEMPLATE_URL
    }

    return this.getAttribute('row-template-url')
  }

  set rowTemplateURL (value) {
    this.setAttribute('row-template-url', value)
  }

  async loadPosts () {
    const options = {
      page: this.page,
      page_size: this.pageSize
    }

    if (this.category) {
      options.category_slug = this.category
    }

    const response = await this.butter.post.list(options)

    const posts = response.data.data

    const postElements = posts.map(post => {
      return generatePostElement(this.baseListItem, post)
    })

    postElements.forEach(element => {
      this.list.appendChild(element)
    })
  }

  async connectedCallback () {
    const listContainer = await generateRemoteElement(this.listTemplateURL)
    this.list = listContainer.querySelector('[data-list]')

    this.baseListItem = await generateRemoteElement(this.rowTemplateURL)

    this.butter = new Butter(this.token)

    await this.loadPosts()

    this.appendChild(listContainer)
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (oldValue !== null) {
      this.list.innerHTML = ''
      this.loadPosts()
    }
  }
}
