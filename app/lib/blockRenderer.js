
import unionClassNames from 'union-class-names'
import React, { Component } from 'react'

class Image extends Component {
  render () {
    const {
      block,
      className,
      theme = {},
      ...otherProps
    } = this.props
    const {
      blockProps, // eslint-disable-line no-unused-vars
      customStyleMap, // eslint-disable-line no-unused-vars
      customStyleFn, // eslint-disable-line no-unused-vars
      decorator, // eslint-disable-line no-unused-vars
      forceSelection, // eslint-disable-line no-unused-vars
      offsetKey, // eslint-disable-line no-unused-vars
      selection, // eslint-disable-line no-unused-vars
      tree, // eslint-disable-line no-unused-vars
      contentState,
      blockStyleFn,
      ...elementProps
    } = otherProps
    const combinedClassName = unionClassNames(theme.image, className)
    const src = block.getData().get('src')
    return (
      <img
        {...elementProps}
        src={src}
        role='presentation'
        className={combinedClassName}
      />
    )
  }
}

function blockRenderer (contentBlock) {
  const type = contentBlock.getType()
  if (type === 'atomic:image') {
    return {
      component: Image,
      editable: false,
      props: {
        theme: {
          image: 'image'
        }
      }
    }
  }
}

export default blockRenderer