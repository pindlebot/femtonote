
import React from 'react'
import { Map } from 'immutable'
import { Block } from 'draft-js-blocks/lib/constants'
import  { DefaultDraftBlockRenderMap } from 'draft-js'

const Blockquote = (props) => (
  <blockquote>{props.children}</blockquote>
)

export default DefaultDraftBlockRenderMap.merge(Map({
  [Block.BLOCKQUOTE]: {
    element: 'div',
    wrapper: <Blockquote />
  },
  [Block.CAPTION]: {
    element: 'cite'
  },
  [Block.BLOCKQUOTE_CAPTION]: {
    element: 'blockquote'
  },
  [Block.TODO]: {
    element: 'div'
  },
  [Block.IMAGE]: {
    element: 'figure'
  },
  [Block.BREAK]: {
    element: 'div'
  }
}))