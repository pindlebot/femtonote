import React from 'react'
import { render } from 'react-dom'
import '../../style.scss'
import genKey from '../../gen-key'
import { EditorState, Editor, RichUtils, Modifier, convertToRaw, convertFromRaw } from 'draft-js'
import * as Icons from '../../icons'
import Dropzone from '../../components/Dropzone'
import dropHandler from '../../createDropHandler'
import insertImage from '../../lib/insertImage'
import blockRenderMap from '../../lib/blockRenderMap'
import blockRenderer from '../../lib/blockRenderer'
import convertToHtml from '../../lib/convertToHtml'
import ToggleHeadingButton from '../../components/ToggleHeadingButton'
import debounce from 'debounce'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { routerMiddleware, connectRouter, ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import * as redux from 'redux'
import { Provider, connect } from 'react-redux'
import { store } from '../../lib/store'
import InlineStyleButton from '../../components/InlineStyleButton'
import EditorToolbar from '../../components/EditorToolbar'

export const history = createBrowserHistory()

const ENDPOINT = 'https://cbld8d8gvk.execute-api.us-east-1.amazonaws.com/prod/post'

const ID = () => Math.floor(Math.random() * Math.pow(2, 40)).toString(32)

class App extends React.Component {
  async componentDidMount () {
    this.editorRef.focus()
    let token = window.localStorage.getItem('token')
    if (!token) {
      token = btoa(JSON.stringify({ sub: this.props.store.userId }))
      window.localStorage.setItem('token', token)
    }
    let key = this.props.store.s3Key
    if (!key) return
    const  url = 'https://cbld8d8gvk.execute-api.us-east-1.amazonaws.com/prod/get'
    let data = await fetch(`${url}/${key}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(resp => resp.json())
      .catch(() => null)
    if (data) {
      let contentState = convertFromRaw(data)
      this.props.setEditorState(
        EditorState.push(
          this.props.store.editorState,
          contentState
        )
      )
    }
  }

  debounced = debounce(() => {
    let contentState = this.props.store.editorState.getCurrentContent()
    let raw = convertToRaw(contentState)
    let id = this.props.location.pathname.replace('/graph/', '')
    fetch(ENDPOINT, {
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        token: window.localStorage.getItem('token'),
        filename: `${id}.json`,
        body: btoa(JSON.stringify(raw))
      }),
      method: 'POST'
    })
      .then(resp => resp.json())
      .then(console.log.bind(console))
  }, 5000)

  onChange = editorState => {
    this.props.setEditorState(editorState)
    let type = editorState.getLastChangeType()
    if (type === 'insert-characters' || type === 'backspace-character') {
      setTimeout(() => {
        this.debounced()
      })
    }
  }

  onMouseDown = evt => {
    evt.preventDefault()
  }

  hasStyle = inlineStyle => {
    return this.props.store.editorState.getCurrentInlineStyle().toArray().includes(inlineStyle)
  }

  render () {
    let { minimized } = this.props.store
    return (
      <div className={minimized ? 'container' : 'container maximized'}>
        <div className={'pad'}>
          <EditorToolbar
            hasStyle={this.hasStyle}
            setEditorState={this.props.setEditorState}
          />
          <main className={'pad-content'}>
            <Dropzone {...this.props}>
              <Editor
                onChange={this.onChange}
                editorState={this.props.store.editorState}
                ref={ref => {
                  this.editorRef = ref
                }}
                blockRenderMap={blockRenderMap}
                blockRendererFn={blockRenderer}
              />
            </Dropzone>
          </main>
        </div>
      </div>
    )
  }
}


export default connect(
  state => state,
  dispatch => ({
    setEditorState: (editorState) => dispatch({
      type: 'SET_EDITOR_STATE',
      payload: editorState
    })
  })
)(App)
