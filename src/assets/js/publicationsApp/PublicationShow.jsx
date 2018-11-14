import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

function PublicationShow (props) {
    const objeto = props.results.map((publication) => {
      <li key={publication.id}>
        {publication.title}
      </li>
    });
    return <ul> {objeto} </ul>

}

export default PublicationShow;
