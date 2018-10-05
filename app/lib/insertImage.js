import { insertBlocks } from 'draft-js-blocks'
import { Map, List, Repeat } from 'immutable'
import { ContentBlock, genKey, CharacterMetadata } from 'draft-js'

const insertImage = (editorState, src) => insertBlocks(
  editorState, [
    new ContentBlock({
      key: genKey(),
      type: 'atomic:image',
      text: ' ',
      characterList: List(Repeat(CharacterMetadata.EMPTY, 1)),
      depth: 0,
      data: Map([['src', src]])
    }),
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: '',
      characterList: List(),
      depth: 0,
      data: Map()
    })
  ])

export default insertImage
