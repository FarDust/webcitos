import React from 'react';
import { hot } from 'react-hot-loader';
import PublicationShow from './PublicationMainApp';

function PublicationApp ({ serverData }) {
  const publications = JSON.parse(serverData['publications']);
  return (
    <PublicationShow
      publications = {publications}
    />
  )
};

export default hot(module)(PublicationApp);
