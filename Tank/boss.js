
class Boss extends Zombie {
	constructor(x, y, xSpeed, ySpeed, size, hp, damage, color, split){
		super(x, y, xSpeed, ySpeed, size, hp, damage, color);
		this.split = split;
	}
	
	dod(){
		super.dod();
		if(this.split <= 0) return;
		
		var vinkel = this.spillerVinkel();
		
		var xpos1 = this.centerX + Math.cos(Math.random() * Math.PI/2 + vinkel + Math.PI - Math.PI/4) * this.size * 2;
		var ypos1 = this.centerY + Math.sin(Math.random() * Math.PI/2 + vinkel + Math.PI - Math.PI/4) * this.size * 2;
		var xpos2 = this.centerX + Math.cos(Math.random() * Math.PI/2 + vinkel + Math.PI - Math.PI/4) * this.size * 2;
		var ypos2 = this.centerY + Math.sin(Math.random() * Math.PI/2 + vinkel + Math.PI - Math.PI/4) * this.size * 2;
		
		new Boss(xpos1, ypos1, this.xSpeed * 1.2, this.ySpeed * 1.2, this.size / 2, Math.floor(this.startHP / 5), this.damage / 2, this.color, this.split - 1);
		new Boss(xpos2, ypos2, this.xSpeed * 1.2, this.ySpeed * 1.2, this.size / 2, Math.floor(this.startHP / 5), this.damage / 2, this.color, this.split - 1);
	}
}