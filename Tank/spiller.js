
class Spiller extends Enhet{
	constructor(x, y, xSpeed, ySpeed, size){
		super(x, y, xSpeed, ySpeed, size);
		
		this.hp = 100;
		this.startHP = 100;
		this.color = {r: 255, g:0, b:255, a:1};
		
		this.vapenLengde = 40;
		
		this.frekvens = 20;
		this.frekvensTeller = 0;
	}
	
	oppdater(){
		super.oppdater();
		this.angrep();
	}
	
	bevegelse(){
		if(keyMap[37] || keyMap['A'.charCodeAt(0)]){
			this.x -= this.xSpeed;
		}
		if(keyMap[38] || keyMap['W'.charCodeAt(0)]){
			this.y -= this.ySpeed;
		}
		if(keyMap[39] || keyMap['D'.charCodeAt(0)]){
			this.x += this.xSpeed;
		}
		if(keyMap[40] || keyMap['S'.charCodeAt(0)]){
			this.y += this.ySpeed;
		}
		
		super.bevegelse();
	}
	
	angrep(){
		if(this.frekvensTeller <= this.frekvens){
			this.frekvensTeller++;
			return;
		}
		
		if(musKlikk){
			this.frekvensTeller = 0;	
			
			var vinkel = this.musVinkel();
			var xSpeed = Math.cos(vinkel) * 5;
			var ySpeed = Math.sin(vinkel) * 5;
			var xStart = this.x + this.size/2 + Math.cos(vinkel) * this.vapenLengde;
			var yStart = this.y + this.size/2 + Math.sin(vinkel) * this.vapenLengde;
			new Kule(xStart, yStart, xSpeed, ySpeed, 10, 20);
			eksplosjon(xStart, yStart, 3, 0.25, 5, 5, {r: 200, g: 150, b: 50, a:1});
		}
	}
	
	musVinkel(){
		var dx = musX - this.centerX;
		var dy = musY - this.centerY;
		var vinkel = Math.atan(dy/dx);
		
		if(dx < 0) return vinkel + Math.PI;
		return vinkel;
	}
	
	tarLiv(hp){
		super.tarLiv(hp);
		eksplosjon(this.x + this.size / 2, this.y + this.size / 2, 5, 0.5, 5, 20, {r: 255, g:100, b:100, a:1});
	}
	
	visVapen(){
		ctx.save();
		ctx.beginPath();
		ctx.translate(spiller.x + spiller.size / 2, spiller.y + spiller.size / 2);
		ctx.rotate(this.musVinkel());
		ctx.translate(-5, -5);
		ctx.rect(0, 0, 40, 10);
		ctx.fillStyle = 'rgba(' + spiller.color.r + ', ' + spiller.color.g + ', ' + spiller.color.b + ', ' + spiller.color.a + ')';
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}
	
	vis(){
		
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.size, this.size);
		ctx.fillStyle = 'rgba(' + this.color.r + ', ' + this.color.g + ', ' + this.color.b + ', ' + this.color.a + ')';
		ctx.fill();
		ctx.stroke();
		
		this.visVapen();
	}
	
	dod(){
		super.dod();
		gameOver = true;
	}
}