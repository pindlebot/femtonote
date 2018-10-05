import React from 'react'
import { Modifier, EditorState } from 'draft-js'
// import HeadingIcon from '../../icons/Heading'
import * as Icons from '../../icons'

const HEADINGS = [{
  value: 'header-one',
  label: 'H1'
}, {
  value: 'header-two',
  label: 'H2'
}, {
  value: 'header-three',
  label: 'H3'
}]

class ToggleHeadingButton extends React.Component {
  state = {
    show: false
  }

  onMouseDown = evt => {
    evt.preventDefault()
  }

  toggleMenu = evt => {
    this.setState(prevState => ({
      show: !prevState.show
    }))
  }

  renderToggleButton = () => {
    return (
      <button
        onMouseDown={this.onMouseDown}
        onClick={this.toggleMenu}
      >
        <Icons.Heading />
      </button>
    )
  }

  renderBlockquoteButton = () => (
      <button
        onClick={evt => this.toggleBlockType('blockquote')}
        onMouseDown={this.onMouseDown}
        className={this.isToggled('blockquote') ? 'toggled' : ''}
      >
        <Icons.Blockquote />
      </button>
  )

  isToggled = blockType => {
    let { editorState } = this.props
    let currentContent = editorState.getCurrentContent()
    let blockKey = editorState.getSelection().focusKey
    let block = currentContent.getBlockForKey(blockKey)
    let type = block.getType()
    return type === blockType
  }

  toggleBlockType = (blockType) => {
    let toggled = this.isToggled(blockType)
    let { editorState } = this.props
    let contentState = editorState.getCurrentContent()
    let selection = editorState.getSelection()
    let block = contentState.getBlockForKey(selection.focusKey)
    let nextContentState = Modifier.setBlockType(
      contentState,
      selection.merge({
        focusOffset: block.getLength(),
        anchorOffset: 0
      }),
      toggled ? 'unstyled' : blockType
    )
    this.props.setEditorState(
      EditorState.push(
        editorState,
        nextContentState,
        'change-block-type'
      )
    )
  }

  render () {
    return (
      <React.Fragment>
        {this.renderToggleButton()}
        {this.state.show && (
          HEADINGS.map(heading => (
            <button
              onClick={evt => this.toggleBlockType(heading.value)}
              onMouseDown={this.onMouseDown}
              className={this.isToggled(heading.value) ? 'toggled' : ''}
            >
              {heading.label}
            </button>
          ))
        )}
        {this.renderBlockquoteButton()}
      </React.Fragment>
    )
  }
}

export default ToggleHeadingButton
