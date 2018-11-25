import React from 'react';
import { hot } from 'react-hot-loader';
import SearchForm from './SearchForm';
import {getShowPath, getItemImagePath} from './services.js';
import ItemFilter from './ItemFilter';
import ImageLoader from '../../images/loading.gif';


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
        <a className="box" href={ getShowPath(publication) }>
          <div class="header_card">
            <div class="title_header">
              <h4>{publication.title}</h4>
            </div>
            <div>
              { if(publication.state == 'exchange') { }
                <img class="stateimg" src="https://storage.googleapis.com/webcitos_images/exchange.png" alt="State"/>
              { } else if (publication.state == 'gift') { }
                <img class="stateimg" src="https://storage.googleapis.com/webcitos_images/gift.png" alt="State"/>
              { } else if (publication.state == 'pendent'){ }
                <img class="stateimg" src="https://storage.googleapis.com/webcitos_images/gift.png" alt="State"/>
              { } else { }
                <img class="stateimg" src="https://storage.googleapis.com/webcitos_images/gift.png" alt="State"/>
              { } }
            </div>
          </div>
          <img style={{"textAlign": "center"}} className="imgcard" src={this.state.real_image.src}/>
          <p>{ publication.description }</p>
          <p>
            <span>Added by:</span> { this.props.usersNames[publication.id] } <br />
          </p>
        </a>
    )
  }
}

class Publications extends React.Component {
  constructor(props) {
    super(props);
    this.adquirePublications = this.adquirePublications.bind(this);
    this.clearForm = this.clearForm.bind(this);
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
                    query: '/empty/'})
    } else {
      this.setState({publications: publications});
    }
  }

  clearForm(){
    this.setState({query: ''})
  }

  render() {
    const publications = this.state.publications;
    return (
      <div className="products">
        <SearchForm
          key={1}
          handleResponse={this.adquirePublications}
          publications={this.state.publications}
          query={this.state.query}
          clearForm={this.clearForm} />
        <div className="row">
          <div className="col-2">
             <ItemFilter
              key={2}
              publications={this.state.publications}
              handleResponse={this.adquirePublications}
              query={this.state.query}
            />
          </div>
          <div className="col-8 pcard">
            {this.state.publications.map((publication, index) => {
              return <Publication
               key={index}
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
