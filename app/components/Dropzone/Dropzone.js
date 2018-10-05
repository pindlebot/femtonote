import React from 'react'
import './dropzone.scss'
import dropHandler from '../../createDropHandler'
import insertImage from '../../lib/insertImage'

class Dropzone extends React.Component {
  state = {
    drag: false
  }
  
  onDragOver = evt => {
    this.setState(prevState => {
      return prevState.drag
        ? null
        : { drag: true }
    })
    evt.stopPropagation()
    evt.preventDefault()
  }

  dragLeave = (evt) => {
    this.setState(prevState => {
      return !prevState.drag
        ? null
        : { drag: false }
    })
  }

  handleDrop = async (files) => {
    let results = await dropHandler(files)
    let editorState = results.reduce((acc, val) => {
      return insertImage(acc, val.dataURL)
    }, this.props.store.editorState)
    this.props.setEditorState(editorState)
  }

  onDrop = evt => {
    let files = Array.from(evt.dataTransfer.files)
    evt.preventDefault()
    evt.stopPropagation()
    this.setState({
      drag: false
    }, () => {
      this.onDrop(files)
    })
  }

  onDragEnter = (evt) => {}

  render () {
    return (
      <div
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
        onDragLeave={this.dragLeave}
        className={this.state.drag ? 'drag dropzone' : 'dropzone'}
      >
        {this.props.children}
      </div>
    )
  }
}

export default Dropzone
