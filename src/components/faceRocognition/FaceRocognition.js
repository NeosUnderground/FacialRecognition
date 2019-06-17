import React from 'react';
import './faceRecognition.css';

const FaceRocognition =({imageUrl, box})=>{
  return(
    <div className='center ma'>
      <div className='absolute ma2'>
        <img alt='' id='inputImage' src={imageUrl} width='500px' height='auto'/>
        <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
      </div>
  </div>
  );
}

export default FaceRocognition;
