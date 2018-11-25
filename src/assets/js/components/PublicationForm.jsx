import React, { Component } from 'react';
import axios from 'axios';

/* source: https://hackernoon.com/tutorial-how-to-make-http-requests-in-react-part-3-daa6b31b66be */

class PublicationForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sumited: false,
      image: '',
      labels: [],
    }

    this.handleImage = this.handleImage.bind(this)
    this.removeImage = this.removeImage.bind(this)
  }

  handleImage(event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    let url = reader.readAsDataURL(file);
    this.setState({ image: reader.result, })
    reader.onloadend = function (e) {
      axios.post(this.props.googleApiLink, { image: reader.result, } )
        .then(response =>  this.setState({ labels: response.data, image: reader.result } ))
    }.bind(this);
  }

  removeImage() {
    this.setState({ image: '', labels: []})
  }

  render() {
    let labeled_with = this.state.labels.map(label => label.description)
    console.log(labeled_with);
    if (this.state.image !== '' && labeled_with.includes('electronic device')) {
      return (
        <div>
          <img src={this.state.image} alt="pre-uploaded" />
          <button onClick={this.removeImage}>Clean Image</button>
          <form className="crud" action={this.props.submitPath} method="post">
            <div className="center">
              <label for="title">
                <span>Title</span>
                <input className="form-centered" type="text" name="title" id="title" />
              </label>
            </div>
            <div className="center">
              <label for="description">
                <span>Description</span>
                <input className="form-centered" type="text" name="description" id="description" />
              </label>
            </div>
            <div className="center">
              <label for="state">
                <span>State</span> <br/>
                <select className="form-centered" name="state" id="state">
                  <option value="exchange">Exchange</option>
                  <option value="gift">Gift</option>
                </select>
              </label>
            </div>
            <input className="from-centered" type="submit" value="Create"/>
          </form>
        </div>
      )
    } else {
      return (
        <div>
          <span>Image</span><br/>
          <input type="file" name="image" id="image" onChange={this.handleImage} />
          <img src={this.state.image} alt="" />
        </div>
      )
    }
  }
}
export default PublicationForm