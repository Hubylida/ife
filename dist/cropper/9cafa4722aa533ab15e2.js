/*!
 * Copyright 2017 by Ding
 * @author Ding <ding-js@outlook.com>
 */
var ding3=webpackJsonpding_id_([3],{108:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),i(258);var r=i(275),h=document.querySelector("#cropper"),o=document.querySelector("#preview"),a=document.querySelector("#file"),s=new r.Cropper(h,{preview:o});a.addEventListener("change",function(t){var e=t.target;""===e.value||e.files.length<1||s.changeImage(e.files[0])})},258:function(t,e){},275:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){this._scaleOffset=0,this._container=t,this._options=e,this.init()}return t.prototype.init=function(){var t=this,e=this._container,i=document.createElement("canvas"),r=i.getContext("2d");this._width=+e.offsetWidth,this._height=+e.offsetHeight,Object.assign(i,{width:this._width,height:this._height}),this._cropperCtx=r,e.appendChild(i),i.addEventListener("mousewheel",function(e){t._image&&(t._scaleOffset+=e.deltaY,t.draw())})},t.prototype.fillBackground=function(){var t=this._cropperCtx,e=this._width,i=this._height,r=e/40,h=Math.ceil(e/r),o=Math.ceil(i/r);t.save(),t.fillStyle="#ccc";for(var a=0,s=0;s<o;s++)for(var n=0;n<h;n++)(a+s)%2===0&&t.fillRect(n*r,s*r,r,r),a++;t.fillStyle="rgba(0,0,0,0.2)",t.fillRect(0,0,e,i),t.restore()},t.prototype.fillImage=function(){var t=this._image;if(t){var e=this._scaleOffset,i=t.width,r=t.height;if(0!==e){var h=void 0;h=e>0?1/(1+e/800):1+Math.abs(e)/800,i*=h,r*=h,this._imageWidth=i,this._imageHeight=r}this._cropperCtx.drawImage(t,(this._width-i)/2,(this._height-r)/2,i,r)}},t.prototype.fillCropper=function(){this._cropperWidth?this._cropperWidth>this._imageWidth&&(this._cropperWidth=this._imageWidth):this._cropperWidth=this._imageWidth/2,this._cropperHeight?this._cropperHeight>this._imageHeight&&(this._cropperHeight=this._imageHeight):this._cropperHeight=this._imageHeight/2,this._cropperX||(this._cropperX=this._width/2)},t.prototype.draw=function(){var t=this._cropperCtx;t.clearRect(0,0,this._width,this._height),this.fillBackground(),this.fillImage()},t.prototype.changeImage=function(t){var e=this;if(!t.type.match(/^image\/.+$/))return void console.error("请选择正确的图片文件");var i=new FileReader;this._image=null,i.onload=function(t){var i=new Image;i.src=t.target.result,i.onload=function(){e._image=i,e._imageWidth=i.width,e._imageHeight=i.height,e.draw()}},i.readAsDataURL(t)},t}();e.Cropper=r},279:function(t,e,i){i(108),t.exports=i(28)}},[279]);