import React from 'react';
import { hot } from 'react-hot-loader';
import SearchForm from './SearchForm';
import {getShowPath, getItemImagePath} from './services.js';
import ItemFilter from './ItemFilter';
import ImageLoader from '../../images/loading.gif';

// class Image extends React.Component{
//   constructor(props) {
//     super(props);
//     this.handleLoad = this.handleLoad.bind(this);
//     this.state = {
//       loaded: false,
//     }
//   }
//
//   handleLoad(){
//     this.setState({loaded: true})
//   }
//
//   render() {
//     return (
//
//     )
//   }
// }


class Publication extends React.Component{
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    const myImage = new Image();
    myImage.src = ImageLoader;

    this.state = {
      loaded: false,
      real_image: myImage,
      publication: props.publication,
    }
  }

  componentDidMount() {
    const src_real = getItemImagePath(this.props.itemsIds[this.state.publication.id]);
    const finalImage = new Image()
    finalImage.onload = () => {
      this.setState({real_image: finalImage})
    }
    finalImage.src = src_real;
  }

  handleChange(){
    this.state.publication = this.props.publication;
    this.state.real_image.src = ImageLoader;
    const src_real = getItemImagePath(this.props.itemsIds[this.state.publication.id]);
    const finalImage = new Image()
    finalImage.onload = () => {
      this.setState({real_image: finalImage})
    }
    finalImage.src = src_real;
  }

  render() {
    let publication = this.props.publication
    if (publication !== this.state.publication) {
      this.handleChange();
    }

    return (
        <a className="box" style={{"textDecoration": "none"}} href={ getShowPath(publication) }>
          <h4>{publication.title}</h4>
          <img className="imgcard" src={this.state.real_image.src}/>
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
    const publicationViews = {};
    props.publications.forEach(publication => {
       publicationViews[publication.id] = <Publication
        publication={publication}
        usersNames={this.props.userNames}
        itemsIds={this.props.itemsIds}
      />
      }
    );
    this.state = {
      publications: props.publications,
      all_new: props.publications,
      publicationViews: publicationViews,
    }
  }

  adquirePublications(publications) {
    if (publications === 'clear') {
      this.setState({publications: this.state.all_new,
                    query: ''})
    } else {
      this.setState({publications: publications});
    }
  }

  render() {
    const publications = this.state.publications;
    return (
      <div className="products">
        <SearchForm
          handleResponse={this.adquirePublications}
          publications={this.state.publications}
          query={this.state.query} />
        <div className="row">
          <div className="col-2">
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
