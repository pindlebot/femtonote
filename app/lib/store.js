import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import * as redux from 'redux'
import { EditorState, RichUtils } from 'draft-js'

export const history = createBrowserHistory()

const SET_EDITOR_STATE = 'SET_EDITOR_STATE'
const TOGGLE_INLINE_STYLE = 'TOGGLE_INLINE_STYLE'
const TOGGLE_EXPAND = 'TOGGLE_EXPAND'
const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'

export const setEditorState = (payload) => ({
  payload,
  type: SET_EDITOR_STATE
})

export const toggleInlineStyle = (inlineStyle) => ({
  type: TOGGLE_INLINE_STYLE,
  payload: ({ editorState }) => RichUtils.toggleInlineStyle(editorState, inlineStyle)
})

const initialState = {
  editorState: EditorState.createEmpty(),
  minimized: true,
  s3Key: null,
  noteId: null,
  userId: null
}

const ID = () => Math.floor(Math.random() * Math.pow(2, 40)).toString(32)

const getUserId = () => {
  let token = window.localStorage.getItem('token')
  if (token) {
    return JSON.parse(atob(token)).sub
  }
  return ID()
}

const reducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case SET_EDITOR_STATE:
      return {
        ...state,
        editorState: action.payload
      }
    case TOGGLE_INLINE_STYLE:
      return {
        ...state,
        editorState: action.payload(state)
      }
    case TOGGLE_EXPAND:
      return {
        ...state,
        minimized: !state.minimized
      }
    case LOCATION_CHANGE:
      let noteId = action.payload.location.pathname.replace('/graph/', '')
      let userId = getUserId()
      return {
        ...state,
        noteId: noteId,
        userId: userId,
        s3Key: encodeURIComponent(
          `${userId}/${noteId}.json`
        )
      }
    default:
      return state
  }
}

export const rootReducer = redux.combineReducers({
  store: reducer
})

export const store = redux.createStore(
  connectRouter(history)(rootReducer),
  redux.compose(
    redux.applyMiddleware(
      routerMiddleware(history)
    )
  )
)
