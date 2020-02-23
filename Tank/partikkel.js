
class Partikkel extends Enhet {
	constructor(x, y, xSpeed, ySpeed, size, tid, color){
		super(x, y, xSpeed, ySpeed, size);
		this.tid = tid;
		this.tidTeller = 0;
		this.xa = -xSpeed / tid;
		this.ya = -ySpeed / tid;
		
		this.color = color;
		this.kolliderbar = false;
	}
	
	bevegelse(){
		this.x += this.xSpeed;
		this.y += this.ySpeed;
		
		this.xSpeed += this.xa;
		this.ySpeed += this.ya;
		
		this.tidTeller++;
		
		super.bevegelse();
	}
	
	sjekkSkadet(){
		if(this.tidTeller >= this.tid){
			this.dod();
		}
	}
	
	vis(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size/2, 0, 2 * Math.PI);
		this.color.a = (this.tid - this.tidTeller) / this.tid;
		ctx.fillStyle = 'rgba(' + this.color.r + ', ' + this.color.g + ', ' + this.color.b + ', ' + this.color.a + ')';
		ctx.fill();
	}
}