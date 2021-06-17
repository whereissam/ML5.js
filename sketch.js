let video;
let features;
let knn
let labelP;
let ready = false
let x, y
let label = ''

function setup() {
  createCanvas(320, 240);
  video = createCapture(VIDEO);
  video.size(320, 240);
  
  // video.hide()
  features = ml5.featureExtractor('MobileNet', modelReady);
  knn = ml5.KNNClassifier()
  labelP = createP("Need training data")
  labelP.style('font-size', '32pt')
  x = width/2
  y = height/2
}

function goClassify(){
  const logits = features.infer(video)
  knn.classify(logits,function(error, result){
    if(error){
      console.log(error)
    }else{ 
      label = result.label
      if(label == '0'){
        label = 'up'
      }else if(label == '1'){
        label = 'down'
      }else if(label == '2'){
        label = 'left'
      }else if(label == '3'){
        label = 'right'
      }
      // label = result.label
      // label = result
      labelP.html(label)
      goClassify()
      // console.log(result)
    }
    
  })
}

function keyPressed(){
  const logits = features.infer(video)
  // knn.addExample('cat')
  if(key == 'l'){
    knn.addExample(logits, 'left')
    // console.log('left')
  }else if( key == 'r'){
    knn.addExample(logits, 'right')
    // console.log('right')
  }else if(key == 'u'){
    knn.addExample(logits, 'up')
    // console.log('up')
  }else if(key == 'd'){
    knn.addExample(logits, 'down')
    // console.log('down')
  }else if(key == 's'){
    knn.save('model.json')
    console.log('save model')
  }
  // console.log(logits)
  // logits.print()
  // console.log(logits.dataSync())
}

function modelReady(){
  console.log("model ready")
  video.style('transform', 'scale(-1,1')
  knn = ml5.KNNClassifier()
  knn.load('model.json', function(){
    goClassify()
  })
}

function draw(){
  background(0)
  fill(255)
  ellipse(x,y,36)

  if(label == "up"){
    y--
  }else if(label == "down"){
    y++
  }else if(label == "left"){
    x--
  }else if(label == "right"){
    x++
  }

  if(!ready && knn.getNumLabels()>0){
    goClassify();
    ready = true
  }
  x = constrain(x,0,width)
  y = constrain(y,0,height)
  // image(video, 0, 0)

  // if(!ready && knn.getNumLabels() > 0){
  //   goClassify()
  
  //   ready = true
  // }
}