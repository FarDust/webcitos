import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import SearchForm from './SearchForm';

function SearchBar() {
  return (
    <SearchForm />
  )
}

export default hot(module)(SearchBar);
