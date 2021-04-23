import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import store from './reducers/store';
import App from './App';
import { Provider } from 'react-redux';

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
  <Provider store={store}>
      <App />
  </Provider>
  ,document.getElementById('root')
);

if (window.Cypress) {
  window.store = store
}