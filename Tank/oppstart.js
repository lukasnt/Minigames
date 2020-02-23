window.onload = oppstart;

var cnv = document.getElementById("cnv");
var ctx = cnv.getContext("2d");
var width = ctx.canvas.width;
var height = ctx.canvas.height;

setInterval(draw, 1000/60);
document.addEventListener("keydown", tastetrykk);
document.addEventListener("keyup", tasteslipp);
document.addEventListener("mousedown", mustrykk);
document.addEventListener("mouseup", musslipp);
cnv.addEventListener("mousemove", musebevegelse);

var keyMap = [];
var musX = 0;
var musY = 0;
var musKlikk = false;

var enheter = [];

var spiller = new Spiller(200, 200, 2, 2, 30, 100);
var zombie = new Zombie(300, 300, 2, 2, 20, 50, 5, {r: 100, g: 200, b: 50, a: 1});

var score = 0;
var level = 0;
var zombiePerLevel = 0;
var zombieTeller = 1;
var bossLevel = 0;
var erBossLevel = false;


var fart = 0.25;
var stor = asymptoteFunksjon(level, 10, 150, 25);
var hp = asymptoteFunksjon(level, 10, 500, 100);
var frekvens = asymptoteFunksjon(level, 0.01, 0.2, 1000);
var gFarge = Math.floor((10 - (level % 10)) / 10 *  255);
//var bossSplit = Math.floor(asymptoteFunksjon(bossLevel, 1, 10, 1));
var bossSplit = 4;

var gameOver = false;

function oppstart() {
	
}

function draw(){
	ctx.beginPath();
	ctx.fillStyle = "#000000";
	ctx.rect(0, 0, width, height);
	ctx.fill();
	
	oppdaterLevel();
	genererZombie();
	
	for(var i = 0; i < enheter.length; i++){
		enheter[i].oppdater();
	}
	
	visTekst();
	visHp();
	
	if(gameOver){
		gameOverTekst();
	}
}

function genererZombie(){
	if(zombieTeller >= zombiePerLevel){
		return;
	}
	
	if(erBossLevel){
		new Boss(width, Math.random() * height, fart, fart, 150, hp, 25, {r: 100, g: gFarge, b: 50, a: 1}, bossSplit);
		zombieTeller++;
		return;
	}
	
	var random = Math.random();
	var randomSide = Math.floor(Math.random() * 4);
	
	if(randomSide === 0){
		if(random < frekvens){
			new Zombie(Math.random() * width, 0, fart, fart, stor, hp, 5, {r: 100, g: gFarge, b: 50, a: 1});
			zombieTeller++;
		}
	}
	else if(randomSide === 1){
		if(random < frekvens){
			new Zombie(Math.random() * width, height, fart, fart, stor, hp, 5, {r: 100, g: gFarge, b: 50, a: 1});
			zombieTeller++;
		}
	}
	else if(randomSide === 2){
		if(random < frekvens){
			new Zombie(0, Math.random() * height, fart, fart, stor, hp, 5, {r: 100, g: gFarge, b: 50, a: 1});
			zombieTeller++;
		}
	}
	else if(randomSide === 3){
		if(random < frekvens){
			new Zombie(width, Math.random() * height, fart, fart, stor, hp, 5, {r: 100, g: gFarge, b: 50, a: 1});
			zombieTeller++;
		}
	}
}

function oppdaterLevel(){
	var ingenZombie = true;
	for(var i = 0; i < enheter.length; i++){
		if(enheter[i] instanceof Zombie) ingenZombie = false;
	}
	
	if(ingenZombie && zombieTeller >= zombiePerLevel){
		nyttLevel();
	}
}

function nyttLevel(){
	level++;
	zombieTeller = 0;
	
	if(level % 10 === 0){
		erBossLevel = true;
		zombiePerLevel = 1;
		bossLevel.n++;
		
		spiller.xSpeed++;
		spiller.ySpeed++;
		
		fart = 0.25 * spiller.xSpeed;
		stor = asymptoteFunksjon(bossLevel, 0, 250, 1);
		hp = asymptoteFunksjon(bossLevel, 1000, 10000, 1);
		gFarge = 100;
	}else {
		erBossLevel = false;
		zombiePerLevel = Math.floor(asymptoteFunksjon(level, 2, 100, 20));
		
		fart = asymptoteFunksjon(level, 0.25, 3, 30);
		stor = asymptoteFunksjon(level, 10, 200, 50);
		hp = asymptoteFunksjon(level, 10, 500, 100);
		frekvens = asymptoteFunksjon(level, 0.01, 0.2, 1000);
		gFarge = Math.floor((10 - (level % 10)) / 10 *  255);
	}
}

function asymptoteFunksjon(x, start, asymptote, stigning){
	return ((asymptote - start) * x)/(x + stigning) + start;
}

function eksplosjon(x, y, antall, tid, fart, stor, farge){
	for(var i = 0; i < antall; i++){
		var xFart = (Math.random() * 2 - 1) * fart;
		var yFart = (Math.random() * 2 - 1) * fart;
		new Partikkel(x, y, xFart, yFart, stor, tid * 60, farge);
	}
}

function visTekst(){
	ctx.beginPath();
	ctx.font = "30px Arial";
	ctx.textAlign = "center";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("Score: " + score, width - 100, 30);
	ctx.fillText("Level: " + level, 100, 30);
}

function visHp(){
	ctx.beginPath();
	ctx.rect(160, 10, (spiller.hp / 100) * 250, 25);
	var r = Math.floor((100 - spiller.hp) / 50 * 255);
	var g = Math.floor((spiller.hp + 50) / 100 * 255);
	ctx.fillStyle = 'rgba(' + r + ', ' + g + ', ' + 0 + ', ' + 1 + ')';
	ctx.fill();
	ctx.beginPath();
	ctx.rect(160, 10, 250, 25);
	ctx.strokeStyle = "#ffffff";
	ctx.stroke();
}

function gameOverTekst(){
	ctx.beginPath();
	ctx.font = "50px Arial";
	ctx.textAlign = "center";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("Game Over!", width/2, height /2 -25);
	ctx.font = "30px Arial";
	ctx.fillText("Press \'F5\' for å starte på nytt.", width/2, height/2 + 25);
}

function tastetrykk(evt){
	keyMap[evt.keyCode] = true;
}

function tasteslipp(evt){
	keyMap[evt.keyCode] = false;
}

function musebevegelse(evt){
	musX = evt.layerX;
	musY = evt.layerY;
}

function mustrykk(evt){
	musKlikk = true;
}

function musslipp(evt){
	musKlikk = false;
}