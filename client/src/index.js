import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import { Provider } from 'react-redux';
import store from './reducers/store';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// import { createStore } from 'redux';
// import allReducer from './reducers'; 
// const rdxStore = createStore(
//     allReducer,
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// ); 

// import drizzle functions and contract artifact
// import { Drizzle, generateStore } from "@drizzle/store";

// // let drizzle know what contracts we want
// const options = { contracts: [Addition] };

// // setup the drizzle store and drizzle
// const drizzleStore = generateStore(options);
// const drizzle = new Drizzle(options, drizzleStore);

// // pass in the drizzle instance
// // ReactDOM.render(<App drizzle={drizzle} />, document.getElementById("root"));

// ReactDOM.render(
//   <React.StrictMode>
//     <App drizzle={drizzle} />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
