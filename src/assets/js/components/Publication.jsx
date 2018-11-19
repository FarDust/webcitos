import React from 'react';
import { hot } from 'react-hot-loader';
import SearchForm from './SearchForm';
import {getShowPath, getItemImagePath} from './services.js';
import ItemFilter from './ItemFilter';

class Publication extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    let publication = this.props.publication
    return (
        <a className="box" style={{"textDecoration": "none"}} href={ getShowPath(publication) }>
          <h4>{publication.title}</h4>
          <img className="imgcard" src={ getItemImagePath(this.props.itemsIds[publication.id]) } alt="Photo of the item"/>
          <p style={{"textAlign": "justify"}}>{ publication.description }</p><br />
          <span style={{"fontWeight": "bold"}}>State:</span> { publication.state } <br />
          <span style={{"fontWeight": "bold"}}>Added by:</span> { this.props.usersNames[publication.id] } <br />
        </a>
    )
  }
}

class Publications extends React.Component {
  constructor(props) {
    super(props);
    this.adquirePublications = this.adquirePublications.bind(this);
    this.state = {
      publications: props.publications,
      all_new: props.publications,
    }
  }

  adquirePublications(publications) {
    if (publications === 'clear') {
      this.setState({publications: this.state.all_new})

    } else {
      this.setState({publications: publications});
    }
  }

  /*
  values userNames, getShowPath getItemPath itemsIds must be passed
  at the initialize of the react component
  */

  render() {
    const publications = this.state.publications;
    return (
      <div className="products">
        <SearchForm handleResponse={this.adquirePublications} publications={this.state.publications}></SearchForm>
        <div className="row">
          <div className="col-3">
             <ItemFilter
              publications={this.state.publications}
              handleResponse={this.adquirePublications}
            />
          </div>
          <div className="col-8 pcard">
            {this.state.publications.map(publication => {
              return <Publication
                publication={publication}
                usersNames={this.props.userNames}
                itemsIds={this.props.itemsIds}
              />
              }
            )}
          </div>
        </div>
      </div>
    )
  }

}

export default hot(module)(Publications);
