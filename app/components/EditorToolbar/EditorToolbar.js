import React from 'react'
import * as Icons from '../../icons'
import InlineStyleButton from '../InlineStyleButton'
import ToggleHeadingButton from '../ToggleHeadingButton'
import { connect } from 'react-redux'
import { toggleInlineStyle } from '../../lib/store'
import convertToHtml from '../../lib/convertToHtml'

const INLINE_STYLES = [
  'bold',
  'italic',
  'underline',
  'strikethrough'
]

class EditorToolbar extends React.Component {

  onMouseDown = (evt) => {
    evt.preventDefault()
  }

  download = () => {
    let contentState = this.props.store.editorState.getCurrentContent()
    let html = convertToHtml(contentState)
    let buffer = new TextEncoder().encode(html)
    let blob = new Blob([buffer], { type: 'text/html' })
    let url = window.URL.createObjectURL(blob)
    this.downloadRef.download = '123.html'
    this.downloadRef.href = url
    this.downloadRef.click()
  }

  render () {
    return (
      <header>
        <a
          style={{ display: 'none' }}
          ref={ref => {
            this.downloadRef = ref
          }}
        />
        <div className={'toolbar'}>
          {INLINE_STYLES.map(inlineStyle => (
            <InlineStyleButton
              key={inlineStyle}
              inlineStyle={inlineStyle}
              toggleInlineStyle={this.props.toggleInlineStyle}
              hasStyle={this.props.hasStyle}
            />
          ))}
          <ToggleHeadingButton
            editorState={this.props.store.editorState}
            setEditorState={this.props.setEditorState}
          />
        </div>
        <div className={'toolbar'}>
          <button
            onMouseDown={this.onMouseDown}
            onClick={this.download}
          >
            <Icons.Download />
          </button>
          <button
            onMouseDown={this.onMouseDown}
            onClick={this.props.toggleExpand}
          >
            {this.props.store.minimized ? <Icons.Maximize /> : <Icons.Minimize />}
          </button>
        </div>
      </header>
    )
  }
}

export default connect(
  state => state,
  dispatch => ({
    toggleInlineStyle: (style) => dispatch(toggleInlineStyle(style)),
    toggleExpand: () => dispatch({
      type: 'TOGGLE_EXPAND'
    })
  })
)(EditorToolbar)
