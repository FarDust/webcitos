import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import {CategoryFilter, BrandFilter, ScreenFilter} from './Filters';

export default class ItemFilter extends React.Component{
  constructor(props) {
    super(props);
    this.getItems = this.getItems.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.state = {
      publications: props.publications,
    }
  }

  getItems (publications) {
    const avaibleItems = [];
    publications.forEach(pub => {
      avaibleItems.push(pub.item);
    });
    return avaibleItems;
  }

  handleSelection(selector, category) {
    if (selector === 'all') {
      this.handleClear();
    } else {
      const new_publications = this.props.publications.filter(pub => {
        return pub.item[category] === selector
      });
      this.props.handleResponse(new_publications);
    }
  }

  handleClear() {
    this.props.handleResponse('clear');
  }


  render() {
    const items = this.getItems(this.props.publications);
    return [
        <h2> Filter by: </h2>,
          // <ScreenFilter
          //   handleResponse={this.props.adquirePublications}
          //   items={items}
          // />
        <BrandFilter
          key={0}
          handleResponse={this.handleSelection}
          items={items}
          query={this.props.query}
          className="col-12"
        />,
        <CategoryFilter
          key={1}
          handleResponse={this.handleSelection}
          items={items}
          query={this.props.query}
          className="col-12"
        />,
        <div>
          <button className="button primary" onClick={this.handleClear}> Clear All! </button>
        </div>
    ]
  }

}
