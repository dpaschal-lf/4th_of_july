//4th of july edition
$(document).ready( startApp );
var player = null;
var launcher = null;
var launcherPosition = null;
var gravity = 1;
var updateTime = 30;
var rocketVelocity = 25;
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
  explode: .3
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


function startApp(){
  makeLauncher();
  //$("body").click( shootFirework )
  launcherPosition = launcher.position();
  player = new Audio();
  pageWidth = $("body").width();
  
  pageHeight = $("body").height()*.25;
  player.oncanplaythrough=showLoaded;
  player.src="https://archive.org/download/WashingtonPostMarch/washington_post_64kb.mp3";
  //player.src='https://thebeautybrains.com/wp-content/uploads/podcast/soundfx/m80.wav';
  player.volume = volume.music;
  //console.log('done start load');
  $("button").click(startTheShow);
}

function showLoaded(){
  $("#loading").hide();
  $("#startButton").show();

}
function startTheShow(){
  $("#startButton").hide();
  player.play();
  fireRandomFirework();
}

function fireRandomFirework(){
  if(--fireworksToFire>0){
    var randomX = (Math.random() * pageWidth)*0.5 + pageWidth*.25;
    var randomY = Math.random() * pageHeight;
    var launchPlayer = new Audio('http://dight310.byu.edu/media/audio/FreeLoops.com/5/5/Pinball%20Game%20Sounds-14358-Free-Loops.com.mp3');
    launchPlayer.volume= volume.launch;
    launchPlayer.play();
    shootFirework(randomX,randomY);
  } else {
    $("#loading").text('Happy 4th of July!').show(200);
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
  var colors = ['red', 'pink','white','white','blue','lightblue']
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
    var explodePlayer = new Audio('http://s1download-universal-soundbank.com/wav/2773.wav');
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
