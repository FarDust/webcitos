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
      category: 'all',
    }
  }

  handleOption(event){
    this.props.handleResponse(event.target.value, 'category');
    this.setState({category: event.target.value});
  }

  render() {
    const categories = getData(this.props.items, 'category');
    if (this.props.query === '/empty/') {
      this.setState({category: 'all'});
    }
    return [
      <h3>Category:</h3>,
      <select className="col-12" key={0} value={this.state.category} onChange={this.handleOption}>
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
      brand: 'all',
    }
  }

  handleOption (event) {
    this.props.handleResponse(event.target.value, 'brand');
    this.setState({brand: event.target.value})
  }

  render() {
    const categories = getData(this.props.items, 'brand');
    if (this.props.query === '/empty/') {
      this.setState({brand: 'all'});
    }
    return [
      <h3> Brand: </h3>,
      <select className="col-12" value={this.state.brand} onChange={this.handleOption}>
        <option key={-1} value={'all'} > All Brands </option>
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
