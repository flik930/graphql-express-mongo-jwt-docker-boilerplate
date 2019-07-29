import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import ResetPage from "./components/ResetPage";
import Profile from "./components/Profile";

ReactDOM.render(
  <BrowserRouter>
    <Route path="/" excat component={App} />
    <Route path="/reset/:token" component={ResetPage} />
    <Route path="/profile" component={Profile} />
  </BrowserRouter>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
