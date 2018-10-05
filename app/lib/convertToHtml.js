import stateToHtml from 'draft-js-export-html/lib/stateToHTML'

const createBlockRenderers = contentState => {
  return {
    'atomic:image': contentBlock => {
      const src = contentBlock.getData().get('src')
      return `<img src="${src}" />`
    }
  }
}

export default (contentState) => {
  return stateToHtml(
    contentState, {
      blockRenderers: createBlockRenderers(contentState)
    })
}