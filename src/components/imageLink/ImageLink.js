import React from 'react';
import './imageLink.css';

const ImageLink =({onInputChange, onSubmit})=>{
  return(
    <div className=''>
      <p className='f3'>
        {'This app will detect factes in your pictures. Paste an image link URL to start!'}
      </p>
      <div className='center'>
        <div className='pa4 br3 center form shadow-5'>
          <input className='f4 pa2 w-70 center' type='text' onChange={onInputChange}/>
          <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple br5' onClick={onSubmit}>Detect</button>
        </div>
      </div>
    </div>
  );
}

export default ImageLink;
