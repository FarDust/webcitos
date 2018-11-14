import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import SearchForm from './searchForm';

export default class PublicationShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publications: props.publications,
      results: [],
    };
  };

  render() {
    return (
      <div className="centered">
        <SearchForm
          publications = {this.state.publications}
        />
        <div className="col-4">
          Aquí van los filtros
        </div>

      </div>
    )
  }
}
