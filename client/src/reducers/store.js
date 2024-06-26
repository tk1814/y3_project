import { createStore } from 'redux';

function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('state', serializedState)
  } catch (e) {
    console.log(e)
  }
}

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) return undefined
    return JSON.parse(serializedState)
  } catch (e) {
    console.log(e)
    return undefined
  }
}

const authenticationReducer = (state = false) => {
  return state;
};

const persistedState = loadFromLocalStorage()

const store = createStore(
  authenticationReducer,
  persistedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// saves changes when store changes
store.subscribe(() => saveToLocalStorage(store.getState()))

// Serialization is an expensive operation. You should use a throttle function to limit the number of saves.
// Eg: https://stackoverflow.com/questions/52161128/react-redux-state-is-lost-at-page-refresh
// import throttle from 'lodash/throttle';

// store.subscribe(throttle(() => {
//   saveState(store.getState());
// }, 1000));

export default store; 