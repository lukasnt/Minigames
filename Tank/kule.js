
class Kule extends Enhet {
	constructor(x, y, xSpeed, ySpeed, size, damage){
		super(x, y, xSpeed, ySpeed, size);
		
		this.color = {r: 120, g: 120, b: 120, a:1};
		this.damage = damage;
	}
	
	bevegelse(){
		this.x += this.xSpeed;
		this.y += this.ySpeed;
		
		super.bevegelse();
	}
	
	angrep(){
		var kollisjon = this.sjekkKollisjon();
		if(kollisjon.skjedd){
			if(enheter[kollisjon.indeks] instanceof Zombie){
				enheter[kollisjon.indeks].tarLiv(this.damage);
				this.dod();
			}
		}
	}
	
	sjekkRamme(){
		if(this.x < 0) this.dod();
		if(this.x > width - this.size) this.dod();
		if(this.y < 0) this.dod();
		if(this.y > height - this.size) this.dod();
	}
	
	vis(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, Math.floor(this.size / 2), 0, 2 * Math.PI);
		ctx.fillStyle = 'rgba(' + this.color.r + ', ' + this.color.g + ', ' + this.color.b + ', ' + this.color.a + ')';
		ctx.fill();
		ctx.stroke();
	}
	
	dod(){
		super.dod();
		eksplosjon(this.x + this.size / 2, this.y + this.size / 2, 20, 0.25, 5, 5, {r: 255, g:255, b:100, a:1});
	}
}