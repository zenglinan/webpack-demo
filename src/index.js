import "./index.scss";
import imgSrc from './common/images/nan.jpg'
import get from './common/js/get'
const path = require('path')

get()

if(false) {
  console.log('test tree-shaking')
}
const img = document.createElement('img')
img.src = imgSrc
document.querySelector('#app').appendChild(img)