import React from 'react';
import { hot } from 'react-hot-loader';
import Publications from './Publication';

function PublicationApp ({ serverData }) {
  const publications = serverData['publications'];
  const userNames = serverData['usernames'];
  const itemsIds = serverData['itemsids'];
  return (
    <Publications
      publications = {JSON.parse(publications)}
      userNames = {JSON.parse(userNames)}
      itemsIds = {JSON.parse(itemsIds)}
    />
  )
};

export default hot(module)(PublicationApp);
