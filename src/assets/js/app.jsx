import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import LoginForm from "./components/login_form";
import SearchBar from "./components/search_bar";
import CommentPost from "./components/coments_post";
import CommentDisplay from "./components/comments_display";
import CommentSection from "./components/comments_section";

import OfferCommentPost from "./components/offercoments_post";
import OfferCommentDisplay from "./components/offercomments_display";
import OfferCommentSection from "./components/offercomments_section";

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from './reducers'

const reactAppContainer = document.getElementById('react-app');
const reactLogin = document.getElementById('react-login');
const reactSearch = document.getElementById('react-search');
const reactCommentPost = document.getElementById('react_comment_post');
const reactCommentDisplay = document.getElementById('react-comment-display');
const reactCommentSection = document.getElementById('react_comment_section');

const reactOfferCommentPost = document.getElementById('react_offercomment_post');
const reactOfferCommentDisplay = document.getElementById('react-offercomment-display');
const reactOfferCommentSection = document.getElementById('react_offercomment_section');

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

if (reactAppContainer) {
  ReactDOM.render(<App />, reactAppContainer);
}
if (reactLogin) {
  ReactDOM.render(<LoginForm data={JSON.stringify(reactLogin.dataset)}/>, reactLogin);
}
if (reactSearch) {
  ReactDOM.render(<SearchBar data={JSON.stringify(reactSearch.dataset)}/>, reactSearch);
}
if (reactCommentPost) {
  ReactDOM.render(<CommentPost data={JSON.stringify(reactCommentPost.dataset)}/>, reactCommentPost);
}
if (reactCommentDisplay) {
  ReactDOM.render(<CommentDisplay data={JSON.stringify(reactCommentDisplay.dataset)}/>, reactCommentDisplay);
}
if (reactCommentSection) {
  ReactDOM.render((
    <Provider store={store}>
      <CommentSection data={JSON.stringify(reactCommentSection.dataset)}/>
    </Provider>
  ), reactCommentSection);
}
if (reactOfferCommentPost) {
  ReactDOM.render(<OfferCommentPost data={JSON.stringify(reactOfferCommentPost.dataset)}/>, reactOfferCommentPost);
}
if (reactOfferCommentDisplay) {
  ReactDOM.render(<OfferCommentDisplay data={JSON.stringify(reactOfferCommentDisplay.dataset)}/>, reactOfferCommentDisplay);
}
if (reactOfferCommentSection) {
  ReactDOM.render((
    <Provider store={store}>
      <OfferCommentSection data={JSON.stringify(reactOfferCommentSection.dataset)}/>
    </Provider>
  ), reactOfferCommentSection);
}