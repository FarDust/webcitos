import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Field from './Field';

export default class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      search: '',
      submitted: false,
    };
  }

  handleSearchChange(event) {
    const name = event.target.value;
    this.setState(name);
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { search } = this.state;

    this.setState({ submitted: true });
    const { onSubmit } = this.props;
    const { publications } = await onSubmit(search);
    this.props.handleResponce(publications) /* This function is defined in Publication.jsx*/
    this.setState({
      search: '',
      submitted: false,
    });
  }

  render() {
    const {
      search,
    } = this.state;
    console.log(search);
    /* The form needs to call search url '/search/' with GET method */
    return (
      <form className="form-inline" id="search" action='/search/api' onSubmit={this.handleSubmit} className="single-form" method="GET" >
        <Field name="query" labelText="Busqueda" value={search} onChange={this.handleSearchChange} />
        <button className="icon-container" type="submit"><i className="fas fa-search"></i></button>
      </form>
    );
  }
}

// SearchForm.propTypes = {
//   onSubmit: PropTypes.func.isRequired,
// };
