import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import PublicationApp from './publicationsApp/publicationApp';

const reactAppContainer = document.getElementById('react-app');

if (reactAppContainer) {
  ReactDOM.render(<App />, reactAppContainer);
}

const reactPublicationSearch = document.getElementById('react-main');

if (reactPublicationSearch) {
  ReactDOM.render(<PublicationApp serverData={reactPublicationSearch.dataset} />, reactPublicationSearch);
}
