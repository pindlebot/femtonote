import React from 'react'
import { render } from 'react-dom'
import './style.scss'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { Provider } from 'react-redux'
import { store } from './lib/store'
import App from './containers/App'

export const history = createBrowserHistory()

const ID = () => Math.floor(Math.random() * Math.pow(2, 40)).toString(32)

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route
          exact
          path={'/'}
          render={props => (
            <Redirect
              to={{
                pathname: `/graph/${ID()}`,
                state: { from: props.location }
              }}
            />
          )}
        />
        <Route path={'/graph/:id'} component={App} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
