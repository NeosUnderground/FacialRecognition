import React, {Component} from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLink from './components/imageLink/ImageLink';
import Rank from './components/rank/Rank';
import FaceRocognition from './components/faceRocognition/FaceRocognition';
import SignIn from './components/signIn/SignIn';
import Register from './components/register/Register';

import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '98310685812b4ce6863efa8c2b1a1181'
});

const particleOptions ={
    particles: {
      number: {
      	 value: 125,
         density: {
           enable: true,
           value_area: 800,
      }
    }
  }
}


const initialState={
  input:'',
  imageUrl:'',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user:{
    id:'',
    name:'',
    email:'',
    entries:0,
    joined: ''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state=initialState
  }

loadUser=(data)=>{
  this.setState({user:{
    id:data.id,
    name:data.name,
    email:data.email,
    entries:data.entries,
    joined: data.joined
  }})
}

calculateFaceLocation =(data)=>{
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputImage');
  const width = Number(image.width);
  const height = Number(image.height);

  return{
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height),
  }
}

displayFaceBox = (box) => {
  this.setState({box: box});
}

onInputChange=(event)=>{
  this.setState({input: event.target.value});
}

onSubmit=()=>{
  this.setState({imageUrl: this.state.input});

  app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => {
      if(response){
        fetch('https://guarded-waters-78473.herokuapp.com/image', {
            method:'put',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count=>{
          this.setState(Object.assign(this.state.user, {entries:count}))
        })
        .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
  })
      // there was an error
    .catch (err => console.log(err));
}

onRouteChange =(route) =>{
  if (route === 'signout'){
    this.setState(initialState)
  }
  else if (route ==='home') {
      this.setState({isSignedIn: true})
  }
  this.setState({route:route});
}

  render(){
    const {isSignedIn, imageUrl, route, box} = this.state
    return (
      <div className="App">
        <Particles className='particles' params={particleOptions}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {route === 'home'
          ?<div>
            <Logo/>
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLink onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
            <FaceRocognition box={box} imageUrl={imageUrl}/>
          </div>
          :(
            route==='signin'
              ?  <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
              :  <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          )
        }
      </div>
    );
  }
}

export default App;
