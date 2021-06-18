let model, env, wav;
let targetLabel= 'C'
let state = 'collection'

let notes = {
  C: 261.6256,
  D: 293.6648,
  E: 329.6276,
  F: 349.2282,
  G: 391.9954,
  A: 440.0,
  B: 493.8833
};

function setup() {
	createCanvas(400,400);
	
  env = new p5.Envelope()
  env.setADSR(0.5, 0.25, 0.5, 0.1)
  env.setRange(0.8, 0)
  
  wave = new p5.Oscillator('sine');
  wave.start()
  wave.freq(440)
  wave.amp(env)

	let options = {
		inputs: ['x', 'y'],
		outputs: ['frequency'],
		task: 'regression',
    debug: 'true',
    // learningRate: 0.5
	}
	model = ml5.neuralNetwork(options)
  // model.loadData('mouse-notes.json', dataLoaded);
  // model.loadData('mouse-notes.json')
  // model.load()
  // const modelInfo = {
  //   model: 'model/model.json',
  //   metadata: 'model/model_meta.json',
  //   weights: 'model/model.weights.bin',
  // };

  // model.load(modelInfo, modelLoaded)
  // model.load(modelInfo)
  background(255)
}

// function modelLoaded(){
//   console.log('model is loaded')
//   state = 'prediction'
// }
// function dataLoaded(){
//   console.log('data is loaded')
//   console.log(model.data)
// }

// function dataLoaded(){
//   console.log('data is load')
//   console.log(model)
//   let data = model.data.training;
//   // let data = model.getData();
//   for (let i = 0; i < data.length; i++) {
//     let inputs = data[i].xs;
//     let target = data[i].ys;
//     stroke(0);
//     noFill();
//     ellipse(inputs.x, inputs.y, 24);
//     fill(0);
//     noStroke();
//     textAlign(CENTER, CENTER);
//     text(target.label, inputs.x, inputs.y);
//   }
//   // state = 'training';
//   // console.log('starting training');
//   // model.normalizeData();
//   // let options = {
//   //   epochs: 200
//   // };
//   // model.train(options, whileTraining, finishedTraining);
// }

function keyPressed(){
  if(key == 't'){
    state = 'training'
    console.log('starting training')
      model.normalizeData()
      let options = {
          epochs: 50
      }
      model.train(options, whileTraining, finishedTraining)
      //neuralNetwork.train(?optionsOrCallback, ?optionsOrWhileTraining, ?callback);
  }else if(key == 's'){
    model.saveData('mouse-notes')
  }else if(key == 'm'){
    model.save()
  }
  else{
      targetLabel = key.toUpperCase()
  }
}

function whileTraining(epoch, loss){
	console.log(epoch)
} 
//it's to see how many loss in epoch(in this period of time)


function finishedTraining(){
	console.log('finished training')
  state = 'prediction'
  // console.log(model.data)

  // let data = model.data.training
  // //let data = model.getData() //get more data info
  // for(let i =0; i<data.length; i++){
  //   let inputs = data[i].xs;
  //   console.log(inputs)
  //   let target = data[i].ys
  //   stroke(0)
  //   fill(0,0,255,100)
  //   ellipse(inputs.x, inputs.y, 24)
  //   fill(0);
  //   noStroke();
  //   textAlign(CENTER, CENTER)
  //   text(target.label, inputs.x, inputs.y)
  // }
  
}

function mousePressed(){

  let inputs = {
		x: mouseX, 
		y: mouseY
	}

	if (state == 'collection'){
    let targetFrequency = notes[targetLabel]
		let target = {
			frequency: targetFrequency
		}
		model.addData(inputs, target)
		stroke(0)
		noFill()
		ellipse(mouseX, mouseY, 24)
		fill(0);
		noStroke();
		textAlign(CENTER, CENTER)
		text(targetLabel, mouseX, mouseY)

    wave.freq(targetFrequency)
    env.play()

	}else if (state =='prediction'){
		model.predict(inputs, gotResults)
	}
}

function gotResults(error, results){
  if(error){
		console.log(error)
		return
	}
	console.log(results);

  stroke(0);
  fill(0, 0, 255, 100);
  ellipse(mouseX, mouseY, 24);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  let label = results[0].value;
  text(floor(label), mouseX, mouseY);
  // let label = results[0].label
	// text(label, mouseX, mouseY)
  wave.freq(label)
  env.play()
}
