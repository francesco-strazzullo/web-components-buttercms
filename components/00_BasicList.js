import config from '../config.js'

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

export default class ButterCMSList extends HTMLElement {
  async connectedCallback () {
    const listContainer = generateListContainerElement()
    const list = listContainer.querySelector('[data-list]')

    const butter = new Butter(config.BUTTERCMS_TOKEN)
    const response = await butter.post.list({
      page: 1,
      page_size: 2,
      category_slug: 'webcomponents'
    })

    const posts = response.data.data

    const postElements = posts.map(generatePostElement)

    postElements.forEach(element => {
      list.appendChild(element)
    })

    this.appendChild(listContainer)
  }
}
