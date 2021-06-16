let mobilenet;
let classifier;
let video;
let label = 'test';
let ukeButton;
let whistleButton;
let trainButton;

function modelReady(){
	console.log('Model is ready');
	//ensure model is load
}

function videoReady(){
	console.log('Video is ready')
	//check classification is load
}

function whileTraining(loss) {
	if (loss == null) {
	  console.log('Training Complete');
	  classifier.classify(gotResults);
	} else {
	  console.log(loss);
	}
  }

function gotResults(error, result){
	if(error){
		console.error(error)
	}else{
		label = result[0].label;
		// console.log(label)
		classifier.classify(gotResults);
	}
}

function setup() {
	createCanvas(320, 270);
	video = createCapture(VIDEO);
	video.hide();
	background(0);
	mobilenet = ml5.featureExtractor('MobileNet', modelReady);
	//call feacture to load mobilenet

	classifier = mobilenet.classification(video, videoReady);
	//call classification function

	ukeButton = createButton('happy')
	ukeButton.mousePressed(function(){
		classifier.addImage('happy')
	})

	whistleButton = createButton('sad')
	whistleButton.mousePressed(function(){
		classifier.addImage('sad')
	})

	trainButton = createButton('train')
	trainButton.mousePressed(function(){
		classifier.train(whileTraining)
	})
}

function draw(){
	background(0)
	image(video, 0, 0, 320, 240)
	fill(255);
    textSize(16);
    text(label, 10,height - 10);
}