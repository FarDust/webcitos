import React, { Component } from 'react';
import axios from 'axios';
import publicationSubmitPath from './services';
import ImageLoader from '../../images/loading.gif'

/* source: https://hackernoon.com/tutorial-how-to-make-http-requests-in-react-part-3-daa6b31b66be */

class PublicationForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      submited: false,
      image: '',
      uploadedFile: undefined,
      labels: [],
      model: undefined,
      brand: undefined,
      loading: true,
      SubmitPath: '/publications',
    }
    this.admited_labels = [
      'mobile phone',
      'watch',
      'handheld game console',
      'portable media player',
      'television',
      'tablet computer',
      'gadget',
      'smartphone',
    ]
    this.handleImage = this.handleImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.resetLoading = this.resetLoading.bind(this);
  }

  handleImage(event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    let url = reader.readAsDataURL(file);
    const uploadedFile = event.target;
    this.setState({ uploadedFile: uploadedFile});
    reader.onloadend = function (e) {
      this.setState({
        image: reader.result,
      })
      axios.post(this.props.googleApiLink, { image: reader.result, } )
        .then(response => {
          let model;
          let brand;
          if (response.data.webDetection) {
            model = response.data.webDetection.description;
          }
          if (response.data.logoDetection) {
            brand = response.data.logoDetection.description;
          }
          this.setState({
            labels: response.data.labels,
            image: reader.result,
            model: model,
            brand: brand,
            submited: true,
            loading: false,
          })
        })
    }.bind(this);
    this.resetLoading();
  }

  handleSubmit(event) {
    event.preventDefault()
    const form = document.getElementById('form')
    let formData = new FormData(form);
    formData.append('image', this.state.uploadedFile.files[0]);
    let request = new XMLHttpRequest();
    request.open(form.method, form.action);
    request.onload = function () {
      document.location.href = request.responseURL;
    };
    request.send(formData);
  }

  removeImage() {
    this.setState({ image: '', labels: [], submited: false,})
  }

  resetLoading() {
    this.setState({ loading: true })
  }

  render() {
    let labeled_with = this.state.labels.map(label => label.description)
    if (this.state.image !== '' && labeled_with.includes('electronic device') && labeled_with.includes('gadget')) {
      let score = 1;
      let best_label;
      for (let label_index in this.state.labels) {
        let label = this.state.labels[label_index];
        if (score >= label.score && this.admited_labels.includes(label.description)) {
          best_label = label.description;
        }
      }
      return (
        <div>
          <form id="form" className="crud" action={this.state.SubmitPath} method="post">
            <div className="center">
              <img id="image" className="col-12" src={this.state.image} alt="pre-uploaded" />
              <button className="button primary" onClick={this.removeImage}>Chosse another image</button>
            </div>
            <div className="center">
              <label htmlFor="title">
                <span>Add a descriptive title to your post</span>
                <input className="form-centered" type="text" name="title" id="title" />
              </label>
            </div>
            <div className="center">
              <label htmlFor="description">
                <span>What is this post about?</span>
                <input className="form-centered" type="text" name="description" id="description" />
              </label>
            </div>
            <div className="center">
              <label htmlFor="state">
                <span>Do you want to exchange it for something else or gift it?</span> <br />
                <select className="form-centered" name="state" id="state">
                  <option value="exchange">Exchange</option>
                  <option value="gift">Gift</option>
                </select>
              </label>
            </div>
            <ItemForm category={best_label} model={this.state.model} brand={this.state.brand}/>
            <input className="from-centered" type="submit" value="Create" onClick={this.handleSubmit}/>
          </form>
        </div>
      )
    } else {
      let message;
      if (this.state.submited) {
        message = "Seems to appear that your image is not allowed in our site";
      } else {
        message = "Show us what you want to submit";
      }
      if (this.state.loading && this.state.image) {
        return (<div>
          <span>Checking your image...</span><br/>
          <div className="centered-mid">
            <img className="col-2" src={ImageLoader} alt="" />
          </div>
          <div className="centered-mid">
            <h3> Loading... </h3>
          </div>
        </div>
      )} else {
        return (
          <div>
            <span>{message}</span><br />
            <ImageInput onChange={this.handleImage} />
            <img className="col-12" src={this.state.image} alt="" />
          </div>
        )
      }
    }
  }
}

class ImageInput extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="file-upload">
        <div class="image-upload-wrap">
          <input class="file-upload-input" type='file' onchange={this.props.handleImage} accept="image/*" />
          <div class="drag-text">
            <h3>Drag and drop a file or select add Image</h3>
          </div>
        </div>
      </div>
    )
  }
}

class ItemForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screenSize: 50,
      category: this.props.category,
      model: this.props.model,
      brand: this.props.brand,
    };
    this.handleSlider = this.handleSlider.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleModel = this.handleModel.bind(this);
  }

  handleSlider(event) {
    this.setState({ screenSize: event.target.value })
  }

  handleCategory(event) {
    this.setState({ category: event.target.value })
   }

  handleModel(event) {
    this.setState({ model: event.target.value })
  }

  handleBrand(event) {
    this.setState({ brand: event.target.value })
  }

  render() {
    return (
      <div>
        <h2>Add details about your item</h2>
        <div className="center">
          <label htmlFor="model">
            <span>Model of the item</span>
            <input className="form-centered" type="text" name="model" id="model" placeholder="e.g., Iphone 6" value={this.state.model} onChange={this.handleModel}/>
          </label>
        </div>
        <div className="center">
          <label htmlFor="brand">
            <span>Brand</span>
            <input className="form-centered" type="text" name="brand" id="brand" placeholder="e.g., Apple" value={this.state.brand} onChange={this.handleBrand}/>
          </label>
        </div>
        <div className="center">
          <label htmlFor="screenSize">
            <span>Screen size {this.state.screenSize} (inches)</span>
            <input className="form-centered" type="range" min="1" max="100" onChange={this.handleSlider} name="screenSize" id="screenSize"/>
          </label>
        </div>
        <div className="center">
          <label htmlFor="category">
            <span>Choose a category for your item</span>
            <select className="form-centered" name="category" id="category" onChange={this.handleCategory} value={this.state.category}>
              <option value="mobile phone">Mobile phone</option>
              <option value="smartphone">Smartphone</option>
              <option value="watch">Smartwatch</option>
              <option value="handheld game console">Video Game Console</option>
              <option value="portable media player">Music Player</option>
              <option value="television">Television</option>
              <option value="tablet computer">Tablet</option>
              <option value="gadget">Gadget</option>
            </select>
          </label>
        </div>
        <div className="center">
          <label htmlFor="state">
            <span>In what state is your item?</span>
            <input className="form-centered" type="text" name="item_state" id="item_state"  placeholder="e.g., Brand new, 2 years old"/>
          </label>
        </div>
        <div className="center">
          <label htmlFor="aditional">
            <span>Is there any other information you may want to add about it?</span>
            <input className="form-centered" type="text" name="aditional" id="aditional"  placeholder="e.g., Does not include charger"/>
          </label>
        </div>
      </div>
    )
  }
}



export default PublicationForm
