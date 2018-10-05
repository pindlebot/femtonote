import React from 'react'
import union from 'union-class-names'
import * as Icons from '../../icons'

const InlineStyleButton = props => {
  const inlineStyle = props.inlineStyle.toUpperCase()
  const IconComponent = Icons[inlineStyle.slice(0, 1) + props.inlineStyle.slice(1, inlineStyle.length)]
  return (
    <button
      onMouseDown={evt => {
        evt.preventDefault()
      }}
      onClick={evt => props.toggleInlineStyle(inlineStyle)}
      className={union(
        props.inlineStyle,
        props.hasStyle(inlineStyle) ? 'toggled' : ''
      )}
    >
      <IconComponent />
    </button>
  )
}

export default InlineStyleButton
