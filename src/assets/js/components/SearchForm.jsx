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
    /* The form needs to call search url '/search/' with GET method */
    return (
      <form action='/search/api' onSubmit={this.handleSubmit} className="single-form" method="GET" >
        <p>Completa tus datos:</p>
        <Field name="query" labelText="Busqueda" value={search} onChange={this.handleSearchChange} />
        <div className="actions">
          <input type="submit" value="¡Buscar!" />
        </div>
      </form>
    );
  }
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};