import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Field from './Field';

export default class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.getInfo = this.getInfo.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleEnterPress = this.handleEnterPress.bind(this);

    this.state = {
      query: '',
      submitted: false,
      results: [],
      publications: props.publications,
    };
  }

  getInfo() {
    const result = this.state.publications.filter(publication => {
      if (publication.title.toLowerCase().includes(this.state.query.toLowerCase())) {
        return publication;
      }
    });

    if (result.length === 0) {
      alert('There are no publications that match your search :c');
    } else {
      this.state.results = result;
      this.props.handleResponse(result);
    }
  }

  handleEnterPress (target) {
    if (target.charCode === 13) {
      this.handleInputChange();
    }
  }


  handleInputChange () {

    this.setState({
      query: this.search.value
    }, () => {
      if (this.state.query && this.state.query.length > 0) {
          this.getInfo();
      }
      else {
        alert('You have to enter something! :o');
      }
    })
  }


  render() {

    return (
      <div className="single-form" id="search"  >
      <input
        placeholder="Search for..."
        ref={input => this.search = input}
        onKeyPress={this.handleEnterPress}
      />
        <button className="icon-container" onClick={this.handleInputChange} ><i className="fas fa-search"></i></button>
      </div>
    );
  }
}

// SearchForm.propTypes = {
//   onSubmit: PropTypes.func.isRequired,
// };
