import React from 'react';
import ReactDOM from 'react-dom';
import PublicationApp from './components/publicationApp';
import PublicationForm from './components/PublicationForm';

const PublicationFormContainer = document.getElementById('PublicationForm');

if (PublicationFormContainer) { 
  ReactDOM.render(<PublicationForm
    googleApiLink={PublicationFormContainer.getAttribute('data-googleApiLink')}
    submitPath={PublicationFormContainer.getAttribute('data-submitPath')}
  />, PublicationFormContainer);
}

const reactPublicationSearch = document.getElementById('react-main');

if (reactPublicationSearch) {
  ReactDOM.render(<PublicationApp serverData={reactPublicationSearch.dataset} />, reactPublicationSearch);
}
