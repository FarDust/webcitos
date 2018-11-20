import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

function getData (items, category){
  const data = new Set([]);
  items.forEach(elem => {
    data.add(elem[category]);
  });

  return Array.from(data);
}


export class CategoryFilter extends React.Component{
  constructor(props) {
    super(props);
    this.handleOption = this.handleOption.bind(this);
    this.state = {
      items: props.items,
    }
  }

  handleOption(event){
    this.props.handleResponse(event.target.value, 'category');
  }

  render() {
    const categories = getData(this.props.items, 'category');
    return [
      <h3>Category:</h3>,
      <select onChange={this.handleOption}>
        <option key={-1} value={'all'}> All Categories </option>
        {categories.map((item, index) => {
          return <option key={index} value={item}> {item} </option>
        }
        )}
      </select>
    ]
  }
}

export class BrandFilter extends React.Component{
  constructor(props) {
    super(props);
    this.handleOption = this.handleOption.bind(this);
    this.state = {
      items: props.items,
    }
  }

  handleOption (event) {
    this.props.handleResponse(event.target.value, 'brand');
  }

  render() {
    const categories = getData(this.props.items, 'brand');
    return [
      <h3> Brand: </h3>,
      <select onChange={this.handleOption}>
        <option key={-1} value={'all'}> All Brands </option>
        {categories.map((item, index) => {
          return <option key={index} value={item}> {item} </option>
        }
        )}
      </select>
    ]
  }
}

export class ScreenFilter extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
    }
  }

  render() {
    const categories = getData(this.state.items, 'screenSize');
    return (
      <select>
        {categories.forEach(item => {
          <option> {item} </option>
        }
        )}
      </select>
    )
  }
}
