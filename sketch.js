let img;
let detector;

function preload(){
	img = loadImage('dogandcat.jpg')
	detector = ml5.objectDetector('cocossd')
}

function gotDectections(error, results){
	if(error){
		console.log(error)
	}
	console.log(results)
	for(let i =0; i< results.length; i++){
		let object = results[i];
		stroke(0,255,0)
		strokeWeight(4);
		noFill();
		rect(object.x, object.y, object.width, object.height)
		noStroke();
		fill(255);
		textSize(24);
		text(object.label, object.x +10, object.y +2)
	}
}

function setup() {
	createCanvas(910, 570);
	console.log(detector);
	image(img, 0,0, width, height)
	detector.detect(img, gotDectections)
}
