/* global AFRAME, THREE */
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('button', {
  dependencies: ['position'],
  schema: {
    clickOffset: {
      default: 0.05
    },
    ringColor: {
      default: '#00B9FF'
    }
  },
  init: function () {
    this.el.getAttribute('position') ? '' : this.el.setAttribute('position', {x: 0, y:0, z:0})
    this.el.addEventListener('click', this.onClick.bind(this));
    this.el.addEventListener('mouseenter', this.onMouseEnter.bind(this))
    this.el.addEventListener('mouseleave', this.onMouseLeave.bind(this))
    this.enabled = true;
    this.el.addEventListener('stateadded',this.onStateAdded.bind(this))
    this.el.addState('button:enabled');
  },
  // Create or update the line geometry.
  update: function () { },
  // Remove the line geometry.
  remove: function () {
    this.el.removeEventListener('click', this.onClick);
    this.el.removeEventListener('mouseenter', this.onMouseEnter);
    this.el.removeEventListener('mouseleave', this.onMouseLeave);
  },
  produceClickRing: function (evt) {
    var camera = document.querySelector('a-camera');
    var rayDirection = evt.detail.cursorEl.components.raycaster.direction;
    var clickDistance = evt.detail.intersection.distance;
    var intersectionPoint = evt.detail.intersection.point;
    var clickPosition = intersectionPoint.sub(rayDirection);
    var clickRotation = camera.components.rotation.data;
    var scene = document.querySelector('a-scene');
    var clickRing = document.createElement('a-entity');
    clickRing.id = 'clickring-'+new Date().getTime();
    clickRing.setAttribute('material','color:'+this.data.ringColor);
    clickRing.setAttribute('geometry','primitive: ring; radius-inner: 0.2; radius-outer:0.22');
    clickRing.setAttribute('position',clickPosition);
    clickRing.setAttribute('rotation',clickRotation);
    new AFRAME.TWEEN.Tween({ scale: 0.8 })
      .to({ scale: 1.3 },500)
      .easing(AFRAME.TWEEN.Easing.Quadratic.Out)
      .onUpdate(function () {
        clickRing.setAttribute('scale',this.scale+' '+this.scale+' '+this.scale);
      })
      .start()
    new AFRAME.TWEEN.Tween({ opacity: 1 })
      .to({ opacity: 0.0 },500)
      .easing(AFRAME.TWEEN.Easing.Quadratic.Out)
      .onUpdate(function () {
        clickRing.setAttribute('material','opacity',this.opacity);
      })
      .onComplete(function () {
        scene.removeChild(scene.querySelector('#'+clickRing.id))
      }.bind(this)).start()
    scene.appendChild(clickRing);
  },
  animateButton: function (evt) {
    if (this.animating) { return };
    var rayDirection = evt.detail.cursorEl.components.raycaster.direction;
    var from = Object.assign({},this.el.components.position.data);
    var to = rayDirection.normalize()
                        .multiplyScalar(this.data.clickOffset)
                        .add(from);
    var self = this;
    new AFRAME.TWEEN.Tween(this.el.getAttribute('position'))
      .to({ z: to.z, x: to.x, y: to.y },150)
      .easing(AFRAME.TWEEN.Easing.Quadratic.Out)
      .onUpdate(function () {
        evt.target.setAttribute('position',this);
      })
      .onStart(function () {
        self.animating = true;
      })
      .onComplete(function () {
        new AFRAME.TWEEN.Tween(this.el.getAttribute('position'))
          .to({ z: from.z, x: from.x, y: from.y },150)
          .easing(AFRAME.TWEEN.Easing.Back.Out)
          .onUpdate(function () {
            evt.target.setAttribute('position',this);
          })
          .onComplete(function () {
            self.animating = false;
          }).start()
      }.bind(this)).start()

  },
  onStateAdded: function (evt) {
    if (evt.detail.state === 'button:enabled') {
      this.enabled = true;
    } else if (evt.detail.state === 'button:disabled') {
      this.enabled = false;
    }
  },
  onClick: function (evt) {
    if (!this.enabled) return;
    this.produceClickRing(evt);
    this.animateButton(evt);
  },
  onMouseEnter: function (evt) {
    if (!this.enabled) return;
    this.el.emit('focus');
  },
  onMouseLeave: function (evt) {
    this.el.emit('blur');
  }
});


AFRAME.registerComponent('storyboard-frame', {
  multiple:true,
  schema: {
    front: {type: 'asset'},
    back: {type: 'asset'}
  },
  init: function () {
    if (this.data.front) {
      var frontHemisphere = document.createElement('a-sky');
      frontHemisphere.setAttribute('height','2048');
      frontHemisphere.setAttribute('width','2048');
      frontHemisphere.setAttribute('radius','300');
      frontHemisphere.setAttribute('src',this.data.front);
      frontHemisphere.setAttribute('phi-length','180');
      frontHemisphere.setAttribute('theta-length','180');
      frontHemisphere.setAttribute('rotation','0 180 0');
      this.el.appendChild(frontHemisphere);
    }
    if (this.data.back) {
      var backHemisphere = document.createElement('a-sky');
      backHemisphere.setAttribute('height','2048');
      backHemisphere.setAttribute('width','2048');
      backHemisphere.setAttribute('radius','300');
      backHemisphere.setAttribute('src',this.data.back);
      backHemisphere.setAttribute('phi-length','180');
      backHemisphere.setAttribute('theta-length','180');
      backHemisphere.setAttribute('rotation','0 0 0');
      this.el.appendChild(backHemisphere);
    }
  }
});

/* global AFRAME, THREE */
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('storyboard', {
  schema: {
    showNavigation: {
      type: 'boolean',
      default: true
    }
  },
  init: function () {
    // init flags
    this.uiVisible=false;
    this.hideUITimeout=null;
    this.storyboardFrames = [];
    this.currStoryboardFrameIndex = null;
    this.dotSize = 0.08;
    this.dotMargin = 0.25;
    this.arrowSize = 0.5;
    this.dotsContainerWidth;
    this.storyboardFrames = document.querySelectorAll('[storyboard-frame]');
    // construct UI
    if (this.data.showNavigation) {
      this.buildUI();
    }
    this.buildCamera();
    this.initializeScene();
    this.armStoryboardButtons();
  },
  tick: function () {
    if (this.$camera && !this.uiVisible && this.data.showNavigation) {
      var cameraY = this.$camera.getAttribute('rotation').y;
      this.$uiContainer.setAttribute('rotation','0 '+cameraY+' 0');
    }
  },
  initializeScene: function () {
    for (var i = 0; i<this.storyboardFrames.length; i++) {
      var frame = this.storyboardFrames[i];
      frame.setAttribute('position','0 0 10000');
    }
    this.navigateToIndex(0);
  },
  buildUI: function () {
    this.$uiContainer = document.createElement('a-entity');
    this.el.appendChild(this.$uiContainer);
    // create ui trigger
    this.$uiTrigger = document.createElement('a-plane');
    this.$uiTrigger.setAttribute('rotation','-36 0 0');
    this.$uiTrigger.setAttribute('position','0 -0.5 -1.9');
    this.$uiTrigger.setAttribute('width','4');
    this.$uiTrigger.setAttribute('height','1.5');
    this.$uiTrigger.setAttribute('material','color: yellow; visible: false');
    this.$uiTrigger.setAttribute('class','highlightable');
    this.$uiContainer.appendChild(this.$uiTrigger);
    this.$uiTrigger.addEventListener('mouseenter', this.showUI.bind(this));
    this.$uiTrigger.addEventListener('mouseleave', this.hideUI.bind(this));
    // create nav container
    this.$navigation = document.createElement('a-entity');
    this.$navigation.setAttribute('rotation','-36 0 0');
    this.$navigation.setAttribute('position','0 -0.5 -2');
    this.$uiContainer.appendChild(this.$navigation);
    // create right arrow
    this.$rightArrow = document.createElement('a-circle');
    this.$rightArrow.setAttribute('color','#00B9FF');
    this.$rightArrow.setAttribute('rotation','0 -25 0');
    this.$rightArrow.setAttribute('radius','0.25');
    this.$rightArrow.setAttribute('class','clickable');
    this.$rightArrow.setAttribute('button','');
    this.$rightArrow.setAttribute('transparent','true');
    this.$rightArrow.innerHTML='<a-text scale="0.8 0.8 0.8" value="next" align="center"></a-text>';
    this.$navigation.appendChild(this.$rightArrow);
    this.$rightArrow.addEventListener('click', this.handleRightArrowClick.bind(this));
    // create left arrow
    this.$leftArrow = document.createElement('a-circle');
    this.$leftArrow.setAttribute('color','#00B9FF');
    this.$leftArrow.setAttribute('rotation','0 25 0');
    this.$leftArrow.setAttribute('radius','0.25');
    this.$leftArrow.setAttribute('class','clickable');
    this.$leftArrow.setAttribute('button','');
    this.$leftArrow.setAttribute('transparent','true');
    this.$leftArrow.innerHTML='<a-text scale="0.8 0.8 0.8" value="prev" align="center"></a-text>';
    this.$navigation.appendChild(this.$leftArrow);
    this.$leftArrow.addEventListener('click', this.handleLeftArrowClick.bind(this));
    // create pagination container
    this.$paginationContainer = document.createElement('a-entity');
    this.$navigation.appendChild(this.$paginationContainer);
    // create pagination bg
    this.$paginationBG = document.createElement('a-plane');
    this.$paginationBG.setAttribute('color','#333');
    this.$paginationBG.setAttribute('width','2.5');
    this.$paginationBG.setAttribute('height','0.5');
    this.$paginationContainer.appendChild(this.$paginationBG);
    // create pagination highlight
    this.$paginationHighlight = document.createElement('a-ring');
    this.$paginationHighlight.setAttribute('color','#00B9FF');
    this.$paginationHighlight.setAttribute('radius-inner','0.08');
    this.$paginationHighlight.setAttribute('radius-outer','0.12');
    this.$paginationContainer.appendChild(this.$paginationHighlight);
    // create pagination dots
    this.$paginationDots = document.createElement('a-entity');
    this.$paginationContainer.appendChild(this.$paginationDots);
    // resize the navigation and initialize it to the first frame
    this.buildNavigation();
  },
  buildCamera: function () {
    // create camera
    this.$camera=document.createElement('a-camera');
    this.el.appendChild(this.$camera);
    // create clickable cursor
    this.$cursor=document.createElement('a-entity');
    this.$cursor.setAttribute('cursor','fuse: false');
    this.$cursor.setAttribute('geometry','primitive: ring');
    this.$cursor.setAttribute('material','color: #FF00E6; shader: flat; opacity: 0.5');
    this.$cursor.setAttribute('raycaster','objects: [link-to-frame], .clickable');
    this.$cursor.setAttribute('position','0 0 -2');
    this.$cursor.setAttribute('scale','0.025 0.025 0.025');
    this.$cursor.innerHTML='<a-animation begin="mouseenter" attribute="material.opacity" dur="150" from="0.5" to="1.0"></a-animation>'+
                        '<a-animation begin="mouseenter" easing="ease-in-out" attribute="scale" from="0.025 0.025 0.025" to="0.05 0.05 0.05" dur="150"></a-animation>'+
                        '<a-animation begin="mouseleave" easing="ease-out" attribute="material.opacity" from="1.0" to="0.1" dur="75"></a-animation>'+
                        '<a-animation begin="mouseleave" easing="ease-in-out" attribute="scale" from="0.05 0.05 0.05" to="0.025 0.025 0.025" dur="150"></a-animation>';
    this.$camera.appendChild(this.$cursor);
    this.$cursorHighlightable=document.createElement('a-entity');
    this.$cursorHighlightable.setAttribute('cursor','fuse: false');
    this.$cursorHighlightable.setAttribute('material','visible: false;');
    this.$cursorHighlightable.setAttribute('raycaster','objects: .highlightable');
    this.$camera.appendChild(this.$cursorHighlightable);
  },
  showUI: function() {
    this.uiVisible = true;
    clearTimeout(this.hideUITimeout);
    this.$navigation.setAttribute('scale','1 1 1');
  },
  hideUI: function () {
    var that = this;
    this.hideUITimeout = setTimeout(function() {
      that.$navigation.setAttribute('scale','0 0 0');
      that.uiVisible = false;
    }, 3000);
  },
  handleRightArrowClick: function () {
    if (this.currStoryboardFrameIndex<(this.storyboardFrames.length-1)) {
      this.navigateToIndex(this.currStoryboardFrameIndex+1);
    } else {
      this.navigateToIndex(0);
    }
  },
  handleLeftArrowClick: function () {
    if (this.currStoryboardFrameIndex>0) {
      this.navigateToIndex(this.currStoryboardFrameIndex-1);
    } else {
      this.navigateToIndex(this.storyboardFrames.length-1);
    }
  },
  armStoryboardButtons: function () {
    var storyboardButtons = document.querySelectorAll('[link-to-frame]');
    for (var i=0; i<storyboardButtons.length; i++) {
      var button = storyboardButtons[i];
      var that = this;
      (function(button){
        button.addEventListener('click', function () {
          that.navigateToId(button.getAttribute('link-to-frame'));
        }.bind(this));
      })(button)
    }
  },
  navigateToIndex: function (targetIndex) {
    console.log(targetIndex);
    var currFrame = this.storyboardFrames[this.currStoryboardFrameIndex];
    var targetFrame = this.storyboardFrames[targetIndex];
    if (this.currStoryboardFrameIndex != null) {
      currFrame.setAttribute('position','0 0 10000');
    }
    targetFrame.setAttribute('position','0 0 0');
    this.currStoryboardFrameIndex = targetIndex;
    if (this.data.showNavigation) {
      var highlightX = -this.dotsContainerWidth/2 + this.currStoryboardFrameIndex*this.dotMargin;
      this.$paginationHighlight.setAttribute('position', highlightX +' 0 0');
    }
  },
  navigateToId: function (id) {
    var index;
    for (var i=0; i<this.storyboardFrames.length; i++ ) {
      if (id == this.storyboardFrames[i].id) {
        index = i;
      }
    }
    this.navigateToIndex(index);
  },
  buildNavigation: function () {
    // initialize the frames
    for (var i = 0; i<this.storyboardFrames.length; i++) {
      var frame = this.storyboardFrames[i];
      var dot = document.createElement('a-circle');
      dot.setAttribute('color','#FFFFFF');
      dot.setAttribute('class','clickable');
      dot.setAttribute('scale',this.dotSize+' '+this.dotSize+' '+this.dotSize);
      var that = this;
      (function(i){
        dot.addEventListener('click', function () {
          that.navigateToIndex(i);
        });
      })(i)
      this.$paginationDots.appendChild(dot);
    }
    this.dotsContainerWidth = this.dotMargin*(this.storyboardFrames.length-1);
    this.$paginationDots.setAttribute('position', -.5*this.dotsContainerWidth+' 0 0');
    this.$paginationDots.setAttribute('layout','type: line; margin: '+this.dotMargin);
    this.$paginationBG.setAttribute('width',this.dotsContainerWidth+this.dotSize*4);
    this.$paginationBG.setAttribute('position','0 0 -.1');
    this.$leftArrow.setAttribute('position',(-this.dotsContainerWidth/2-this.arrowSize)+' 0 0');
    this.$rightArrow.setAttribute('position',(this.dotsContainerWidth/2+this.arrowSize)+' 0 0');
  }
});
