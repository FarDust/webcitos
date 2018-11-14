import React from 'react';
import { hot } from 'react-hot-loader';
import SearchForm from './SearchForm';
import {getShowPath, getItemImagePath} from './services.js';

class Publication extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    let publication = this.props.publication
    return (
        <a className="box" style={{"textDecoration": "none"}} hrefLang={ getShowPath(publication) }>
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
    this.state = {
      publications: props.publications,
    }
  }

  adquirePublications(publications) {
    this.setState({ publications });
  }

  /*
  values userNames, getShowPath getItemPath itemsIds must be passed
  at the initialize of the react component
  */

  render() {
    const publications = this.state.publications;
    return (
      <div className="products">
        <SearchForm handleResponce={this.adquirePublications} ></SearchForm>
        <div className="pcard">
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
    )
  }

}

export default hot(module)(Publications);
