//4th of july edition
$(document).ready( startApp );
var player = null;
var launcher = null;
var launcherPosition = null;
var gravity = 1;
var updateTime = 30;
var rocketVelocity = 32;
var pageWidth = null;
var pageHeight = null;
var updatesPerSecond = 1000 / updateTime;
var lifeSpan = 1000;
var lifespanIntervalsMax = Math.ceil(lifeSpan / updateTime);
var degreeConvertConstant = Math.PI / 180;
var minParticles = 5;
var maxParticles = 50;
var startingFireworks = 100;
var accelerateLaunchFireworks = Math.floor(startingFireworks * .25);
var twoPi = Math.PI * 2;
var fireWorkMaxLaunchTime = 500;
var fireWorkMinLaunchTime = 100;
var volume = {
  music: 1,
  launch: .2,
  explode: .1
}
var particleVelocity = {
	min: 3,
	max: 5
}
var particleLife = {
	min: 200,
	max: 700
}
var fireworksToFire=startingFireworks;

/* word showing data */

var wordIntervals = {
    betweenLetters: 80,
    betweenEntries: 2000
}

var targetWordDisplayElement = null;


function startApp(){
  makeLauncher();
  //$("body").click( shootFirework )
  launcherPosition = launcher.position();
  player = new Audio();
  pageWidth = $("body").width();
  
  pageHeight = $("body").height()*.25;
  player.oncanplaythrough=showLoaded;
  player.onpause = function(){
    player.currentTime = 0;
    player.play();
  }
  //player.src="baby_elephant.mp3";
  player.src="mainstreet.mp3";
  //player.src='https://thebeautybrains.com/wp-content/uploads/podcast/soundfx/m80.wav';
  player.volume = volume.music;
  //console.log('done start load');
  $("button").click(startTheShow);
  targetWordDisplayElement = $("#loading");
  displayWordInArc( $('#joseName'),180 )
}

function showLoaded(){
  $("#loading").hide();
  $("#startButton").show();

}
function startTheShow(){
  $("#startButton").hide();
  player.play();
  fireRandomFirework();
  $("#loading").show();
  targetWordDisplayElement = $("#loading");
  displayAllWordsInSequence([
    'Thank you to every one here!',
    'We appreciate you celebrating with us on this special day',
    'We celebrate the impending arrival of Josephine Thi Paschal',
    'She will arrive in mid-December'
  ],targetWordDisplayElement)
}

function displayWordInArc( targetWord, arcDistance ){
  var letterArray = $(targetWord).text().split('');
  var elementArray = [];
  var angleBetweenLetters = Math.floor(arcDistance / letterArray.length);
  var startAngle = 270 -  angleBetweenLetters * (letterArray.length / 2 - .5 ) ;
  var colorConverter = {
    'pink': 'cornflowerblue',
    'cornflowerblue': 'fuscia',
    'fuscia': 'yellow',
    'yellow': 'pink'
  }
  var currentColor = 'pink';
  for( var letterIndex = 0, currentAngle = startAngle; letterIndex < letterArray.length; letterIndex++, currentAngle+=angleBetweenLetters){
    var spoke = $('<div>',{
      class: 'spoke',
      css:{
        'transform': 'rotateZ('+currentAngle+'deg)'
      }
    });
    var letter = $("<div>",{
      class: 'letter',
      text: letterArray[letterIndex],
      css:{
        'transform': 'translate(-50%, -50%) rotateZ(90deg)',
        color: currentColor
      }
    });
    currentColor = colorConverter[currentColor];
    spoke.append(letter);
    elementArray.push( spoke );
  }
  $(targetWord).text('').append(elementArray);
}
function displayAllWordsInSequence( sequence, targetElement ){
    var currentSentenceInSequence = 0;
    displaySentenceOneLetterAtATime();

    function displaySentenceOneLetterAtATime( ){
        targetElement.text('');
        var sentencePosition = 0;
        displayOneLetter();
        function displayOneLetter(){
            targetElement.append( sequence[ currentSentenceInSequence][sentencePosition]);
            if(++sentencePosition !== sequence[ currentSentenceInSequence ].length){
                setTimeout( displayOneLetter, wordIntervals.betweenLetters);
            } else {
                if(++currentSentenceInSequence !== sequence.length ){
                    setTimeout( displaySentenceOneLetterAtATime, wordIntervals.betweenEntries);
                } else {
                  setTimeout( displayAllWordsInSequence, wordIntervals.betweenEntries,  sequence, targetElement )
                }
            }
        }
    }

}



function fireRandomFirework(){
  if(--fireworksToFire>0){
    var randomX = (Math.random() * pageWidth)*0.5 + pageWidth*.25;
    var randomY = Math.random() * pageHeight;
    var launchPlayer = new Audio('launch.mp3');
    launchPlayer.volume= volume.launch;
    launchPlayer.play();
    shootFirework(randomX,randomY);
  } else {
    fireworksToFire = startingFireworks;
    fireWorkMaxLaunchTime = 500;
    fireWorkMinLaunchTime = 100;
    // $("#loading").text('Happy 4th of July!').show(200);
  }
  if(fireworksToFire < accelerateLaunchFireworks){
    console.log('turbo boost');
    fireWorkMaxLaunchTime = 100;
    fireWorkMinLaunchTime = 50;
  }
  var next = Math.random()*fireWorkMaxLaunchTime+fireWorkMinLaunchTime;
  setTimeout(fireRandomFirework, next);
}

function makeLauncher(){
  launcher = $("<div>").addClass('launcher');
  $('body').append(launcher);
  
}

function shootFirework(targetX, targetY){
  var currentInterval = 0;
  var thisLifeSpan = lifespanIntervalsMax;
  var targetLocation = {
    x: targetX,
    y: targetY
  };
  var currentLocation = {
    x: launcherPosition.left,
    y: launcherPosition.top
  };
  var colors = ['red', 'lime','white','white','blue','purple']
//   var color = {
//     r: Math.random()*255 >> 0,
//     g: Math.random()*255 >> 0,
//     b: Math.random()*255 >> 0
//   }
  var backgroundColor = colors[(Math.random()*colors.length)>>0];;
  var rocket = $("<div>")
    .addClass('rocket')
    .css({
      left: launcherPosition.left + 'px',
      top: launcherPosition.top + 'px',
      backgroundColor: backgroundColor
    });
  var xDiff = launcherPosition.left - targetLocation.x ;
  var yDiff = launcherPosition.top - targetLocation.y;
  var angleRadians = (Math.atan2(xDiff, yDiff) * -1 - 1.5707963267948966)	;
  //console.log('apparent degrees ' + (angleRadians*180/Math.PI));
  
//   rad = deg * pi/180
//   rad / 180 = deg * pi
//   deg = rad * 180 / pi
  //console.log(xDiff, yDiff)
  var velocity = {
    x: Math.cos(angleRadians) * rocketVelocity,
    y: Math.sin(angleRadians) * rocketVelocity
  }
  $("body").append(rocket);
  function moveRocket(){
    thisLifeSpan--;
    if(thisLifeSpan===0){
    	//console.log('done');
      clearInterval(timer);
      rocket.css({
      	backgroundColor: 'rgba(0,0,0,0)'
      })
      explode();
      return;
    }
    velocity.y+=gravity;
    currentLocation.x += velocity.x;
    currentLocation.y += velocity.y;
    rocket.css({
      left: currentLocation.x + 'px',
      top: currentLocation.y + 'px'
    })
  }
  function explode(){
    var explodePlayer = new Audio('explode.wav');
    explodePlayer.volume=volume.explode;
    explodePlayer.play();
  	var randomParticleCount = Math.ceil( Math.random() * maxParticles - minParticles) + minParticles;
  	for(var particleI = 0; particleI < randomParticleCount; particleI++){
  		makeParticle();
  	}
	function makeParticle(){
		
		var randomDirection = Math.random() * twoPi;
		var particleVelocityAmount = (Math.random() * (particleVelocity.max - particleVelocity.min + 1)) + particleVelocity.min;
		var particlePosition = {
			top: 0,
			left: 0
		};
		//console.log(particlePosition)
		var thisParticleVelocity = {
			x: Math.cos(randomDirection) * particleVelocityAmount,
			y: Math.sin(randomDirection) * particleVelocityAmount
		}
		var particle = $("<div>")
			.addClass('particle')
			.css({
				left: particlePosition.left + 'px',
				top: particlePosition.top + 'px',
				backgroundColor: backgroundColor
			})
			//console.log(particlePosition);
		var particleLifeTotal = Math.floor( Math.random() * (particleLife.max - particleLife.min ) ) + particleLife.min;
		function moveParticle(){

			particleLifeTotal-=updateTime
			if(particleLifeTotal<0){
				clearInterval(particleTimer);
				particle.remove();
				if(--randomParticleCount===0){
					rocket.remove();
				}
				return;
			}
			particlePosition.top +=thisParticleVelocity.y;
			particlePosition.left += thisParticleVelocity.x;
			particle.css({
				left: particlePosition.left+'px',
				top: particlePosition.top+'px'
			})
		}
		rocket.append(particle);
		var particleTimer = setInterval(moveParticle, updateTime);
	  }
  }

  var timer = setInterval(moveRocket, updateTime)
}
