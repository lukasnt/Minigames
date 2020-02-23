
class Enhet{
	constructor(x, y, xSpeed, ySpeed, size){
		this.x = x;
		this.y = y;
		this.centerX = x + size/2;
		this.centerY = y + size/2;
		this.xSpeed = xSpeed;
		this.ySpeed = ySpeed;
		this.size = size;
		this.hp = 1;
		
		this.kolliderbar = true;
		this.indeks = enheter.length;
		
		enheter.push(this);
	}
	
	oppdater(){
		this.bevegelse();
		this.angrep();
		this.sjekkRamme();
		this.sjekkSkadet();
		this.vis();
	}
	
	bevegelse(){
		this.centerX = this.x + this.size/2;
		this.centerY = this.y + this.size/2;
	}
	
	angrep(){
		
	}
	
	sjekkRamme(){
		if(this.x < 0) this.x = 0;
		if(this.x > width - this.size) this.x = width - this.size;
		if(this.y < 0) this.y = 0;
		if(this.y > height - this.size) this.y = height - this.size;
	}
	
	sjekkKollisjon(){
		for(var i = 0; i < enheter.length; i++){
			if(enheter[i].indeks === this.indeks) continue;
			if(enheter[i].kolliderbar === false) continue;
			
			var xa = enheter[i].x;
			var ya = enheter[i].y;
			var size = enheter[i].size;
			
			var yKollisjon = false;
			var xKollisjon = false;
			
			if((this.x >= xa && this.x < xa + size) || (this.x + this.size >= xa && this.x + this.size < xa + size)) xKollisjon = true;
			if((this.y >= ya && this.y < ya + size) || (this.y + this.size >= ya && this.y + this.size < ya + size)) yKollisjon = true;
			
			if((xa >= this.x && xa < this.x + this.size) || (xa + size >= this.x && xa + size < this.x + this.size)) xKollisjon = true;
			if((ya >= this.y && ya < this.y + this.size) || (ya + size >= this.y && ya + size < this.y + this.size)) yKollisjon = true;
			
			if(xKollisjon && yKollisjon){
				return {
					skjedd: true,
					indeks: i
				};
			}
		}
		return{skjedd: false};
	}
	
	tarLiv(hp){
		this.hp -= hp;
	}
	
	sjekkSkadet(){
		if(this.hp <= 0){
			this.dod();
		}
	}
	
	dod(){
		enheter.splice(this.indeks, 1);
		for(var i = this.indeks; i < enheter.length; i++){
			enheter[i].indeks--;
		}
	}
}