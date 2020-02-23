
class Zombie extends Enhet{
	constructor(x, y, xSpeed, ySpeed, size, hp, damage, color){
		super(x, y, xSpeed, ySpeed, size);
		this.hp = hp;
		this.startHP = hp;
		this.damage = damage;
		this.color = color;
	}
	
	bevegelse(){
		var vinkel = this.spillerVinkel();
		
		this.x += Math.cos(vinkel) * this.xSpeed;
		this.y += Math.sin(vinkel) * this.ySpeed;
		
		super.bevegelse();
	}
	
	angrep(){
		var kollisjon = this.sjekkKollisjon();
		if(kollisjon.skjedd){
			if(enheter[kollisjon.indeks] instanceof Spiller){
				enheter[kollisjon.indeks].tarLiv(this.damage);
				this.dod();
			}
		}
	}
	
	spillerVinkel(){
		var dx = spiller.centerX - this.centerX;
		var dy = spiller.centerY - this.centerY;
		var vinkel = Math.atan(dy/dx);
		
		if(dx < 0) return vinkel + Math.PI;
		return vinkel;
	}
	
	tarLiv(hp){
		super.tarLiv(hp);
		eksplosjon(this.x + this.size / 2, this.y + this.size / 2, 3, 0.5, 5, 20, {r: 255, g:100, b:100, a:1});
	}
	
	vis(){
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.size, this.size);
		ctx.fillStyle = 'rgba(' + this.color.r + ', ' + this.color.g + ', ' + this.color.b + ', ' + this.color.a + ')';
		ctx.fill();
		ctx.stroke();
	}
	
	dod(){
		super.dod();
		eksplosjon(this.x + this.size / 2, this.y + this.size / 2, 50, 0.3, 5, 30, this.color);
		score += level;
	}
}