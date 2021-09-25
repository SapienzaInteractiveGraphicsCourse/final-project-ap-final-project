import {CharacterFactory} from './../CharacterFactory.js';

export class BasicAIienController {
	constructor(params) {
		this.MANAGER = params.manager
		this.target = params.target;
		this.body = params.body;
		this.player = params.player;
		this.maxDistance = params.maxDistance;
		this.entity = params.entity;
		this.move = false;
		this.directionSet=false;
		this.randomDestination=params.randomDestination;
		
	}
	
	update(time) {
		this.target.position.copy(this.body.position);
		this.target.position.y += 0.3;
		this.body.velocity.x *= 0.95;
		this.body.velocity.z *= 0.95;
		
		var distance = this.player.body.position.distanceTo(this.body.position);
		if(distance<this.maxDistance*1.2){				
			var direction = this.computeDirection();
			this.target.rotation.y = Math.atan2(-direction.x,-direction.z);
			
			if(distance>this.maxDistance*0.8) {			
				this.timeToMove = 0;
				this.directionMove = new THREE.Vector3(0,0,-1);
				if(!this.move) {
					this.entity.character.startMove();
					this.move = true;
				}
			}
			else {
				if(this.timeToMove<=0) {
					this.move = !this.move;
					this.timeToMove = this.computeNewTimeToMove(0.5);
					var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
					this.directionMove = new THREE.Vector3(plusOrMinus,0,0);
					if(this.move)
						this.entity.character.startMove();
					else
						this.entity.character.stopMove();
				}
				else
					this.timeToMove -= time;
			}
			if(this.move) {
				var move = new THREE.Vector3();
				move.x = this.directionMove.x*time*0.02;
				move.z = this.directionMove.z*time*0.03;
				move.applyAxisAngle(new THREE.Vector3(0,1,0),this.target.rotation.y);
				this.body.velocity.x += move.x;
				this.body.velocity.z += move.z;
			}
		}
		else {
			if(this.target.position.y<7){
			if(!this.directionSet){
			//this.directionRandom = this.computeRandomDirection(this.randomDestination*15);
			this.pointRandom=new THREE.Vector3((Math.random()-0.5)*200, 0, (Math.random()-0.5)*200)
			this.directionRandom = this.computeRandomDirection(this.pointRandom.x, this.pointRandom.z);
			this.directionMoveRandom=new THREE.Vector3(0,0,-1);
			this.target.rotation.y = Math.atan2(-this.directionRandom.x, -this.directionRandom.z);
			this.directionSet=true;
			this.entity.character.startMove();
			console.log("d");
			}
			else{
			this.target.rotation.y = Math.atan2(-this.directionRandom.x, -this.directionRandom.z);
			var move = new THREE.Vector3();
			move.x = this.directionMoveRandom.x*0.02*time;
			move.z = this.directionMoveRandom.z*0.03*time;
			move.applyAxisAngle(new THREE.Vector3(0,1,0), this.target.rotation.y);
			this.body.velocity.x+=move.x;
			this.body.velocity.z+=move.z;
			}
			if(this.body.position.x==this.directionMoveRandom.x)
				this.entity.character.stopMove();
			if((this.pointRandom.x-this.body.position.x<3) && (this.pointRandom.z-this.body.position.z<3)){
				this.entity.character.stopMove();
				this.directionSet=false;
			}
		}
		}
	}
	

	computeNewTimeToMove(factor=1) {
		return (factor+Math.random()*factor)*1000
	}
	

	computeDirection() {
		var objective = (new THREE.Vector3()).copy(this.player.body.position);
		var from = this.target.position.clone();
		var direction = objective.sub(from).normalize();
		return (new THREE.Ray(this.body.position, direction)).direction;
	}
	
	computeRandomDirection(randomPoint, randomPointY){
		var objective=this.computeTargetPosition(randomPoint, randomPointY);
		var direction = objective.sub(this.body.position).normalize();
		return (new THREE.Ray(this.body.position, direction)).direction;
	}
	
	computeTargetPosition(randomPoint, y){
		var objective = new THREE.Vector3(randomPoint, 0, y);
		return objective;
	}

}