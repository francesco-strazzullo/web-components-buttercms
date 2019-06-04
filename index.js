import config from './config.js'

import ButterCMSList from './components/03_ListWithAsyncTemplate.js'

window.customElements.define('buttercms-list', ButterCMSList)

const list = document.querySelector('buttercms-list')

list.token = config.BUTTERCMS_TOKEN

document
  .querySelector('button')
  .addEventListener('click', () => {
    list.page = list.page + 1
  })
