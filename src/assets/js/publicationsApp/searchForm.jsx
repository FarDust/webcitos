import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import PublicationShow from './PublicationShow';

export default class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = { query: '', results: [], publications: props.publications };
  };

  getInfo() {
    const result = this.state.publications.filter(publication => {
      if (publication.title.toLowerCase().includes(this.state.query.toLowerCase())) {
        return publication;
      }
    });
    this.state.results = result;
  }

  handleInputChange () {
    this.setState({
      query: this.search.value
    }, () => {
      if (this.state.query && this.state.query.length > 1) {
        if (this.state.query.length % 2 === 0) {
          this.getInfo()
        }
      }
    })
  }

  render() {
    console.log(this.state.results, 'En form');
    return (
      <form>
        <input
          placeholder="Search for..."
          ref={input => this.search = input}
          onChange={this.handleInputChange}
        />
        <PublicationShow
        results = {this.state.results}
        />
      </form>
    )
  }
}
