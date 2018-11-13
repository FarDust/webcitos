import React from 'react';
import { hot } from 'react-hot-loader';
import SearchForm from './SearchForm';

class Publication extends React.Component{ 
  constructor() {
    super();
  }

  render() { 
    let publication = this.props.publication
    return (
      <div>
        <a className="box" hrefLang={ this.props.getShowPath(publication) } style="text-decoration:none;">
          <h4>{publication.title}</h4>
          <img className="imgcard" src={ this.props.getItemImagePath(this.props.itemsIds[publication.id]) } alt="Photo of the item"/>
          <p style="text-align: justify;">{ publication.description }</p><br />
          <span style="font-weight: bold;">State:</span> { publication.state } <br />
          <span style="font-weight: bold;">Added by:</span> { this.props.usersNames[publication.id] } <br />
        </a>
      </div>
    )
  }
}

class Publications extends React.Component { 
  constructor(props) { 
    super(props);
    this.state = {
      publications: {},
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
    return (
      <div>
        <SearchForm handleResponce={this.adquirePublications} ></SearchForm>
        <div className="pcard">
          {this.state.publications.map(publication => { 
            return <Publication
              publication={publication}
              usersNames={userNames}
              getShowPath={getShowPath}
              getItemImagePath={getItemImagePath}
              itemsIds={itemsIds}
            />
            }
          )}
        </div>
      </div>
    )
  }

}

export default hot(module)(Publications);
