export class  AlienFactory{
	constructor(params){
		this.MANAGER = params.manager;
		this.buildAlien();
		if(params.rotation){
            if(params.rotation[0] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), params.rotation[0]);
            if(params.rotation[1] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), params.rotation[1]);
            if(params.rotation[2] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), params.rotation[2]);
        }
		this.character.position.set(...params.position);
        if(params.rotation)
            this.character.rotation.set(...params.rotation);
		this.character.scale.multiplyScalar(2);
		this.initializeAnimation();
	}
	
	buildAlien(){
		//Generate alien
		this.headMesh = this.generateHeadMesh(0.5,2.0,0.2, 0, 0, 0);
		this.headMesh.name = "skull"

		this.headGroup = new THREE.Group();
		this.headGroup.name = "head"
		this.headGroup.add(this.headMesh);
		
		// Body mesh models and groups
		this.bodyMesh = this.generateBoxMesh(0.6, 1.5, 0.45, 0, -0.9, 0);
		this.bodyMesh.name = "abdomen"
		
		//Legs
		this.leftLeg = new THREE.Object3D;
		this.leftLeg.position.y = -1.5
		this.leftLeg.position.x = -0.155
		this.leftLeg.name = "Left Leg"
		this.leftLegMesh = this.generateBoxMesh(0.28, 2.0, 0.3, 0, -0.45, 0);
		this.leftLeg.add(this.leftLegMesh)
		this.rightLeg = new THREE.Object3D;
		this.rightLeg.position.y = -1.5
		this.rightLeg.position.x = 0.155
		this.rightLeg.name = "Right Leg"
		this.rightLegMesh = this.generateBoxMesh(0.28, 2.0, 0.3, 0, -0.45, 0);
		this.rightLeg.add(this.rightLegMesh)
		this.legGroup = new THREE.Group();
		this.legGroup.name = "leg"
		this.legGroup.add(this.leftLeg, this.rightLeg);
		
		//Arms
		this.leftArm = new THREE.Object3D;
		this.leftArm.position.x = -0.45
		this.leftArm.position.y = -0.45
		this.leftArm.name = "Left Arm"
		this.leftArmMesh = this.generateBoxMesh(0.2775, 1.5, 0.3, 0, -0.3, 0);
		this.leftArm.add(this.leftArmMesh)
		this.rightArm = new THREE.Object3D;
		this.rightArm.position.x = 0.45
		this.rightArm.position.y = -0.45
		this.rightArm.name = "Right Arm"
		this.rightArmMesh = this.generateBoxMesh(0.2775, 1.5, 0.3,0, -0.3, 0);
		this.rightArm.add(this.rightArmMesh)
		//this.rightArm.rotation.x = Math.PI / 2;
		
		this.armGroup = new THREE.Group();
		this.armGroup.name = "arm"
		this.armGroup.add(this.leftArm, this.rightArm);
		
		this.bodyGroup = new THREE.Group();
		this.bodyGroup.name = "body"
		this.bodyGroup.add(this.bodyMesh, this.legGroup, this.armGroup);
		
		// Character Group
		this.character = new THREE.Group();
		this.character.name = "robot";
		this.character.add(this.headGroup, this.bodyGroup);
	}
	initializeAnimation() {
		//Generate Animations
		this.legTween1 = new TWEEN.Tween({x: 0, y: 0, z: 0}).to( {x: Math.PI/6, y: 0, z: 0}, 50/this.MANAGER.getVelocityFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.legTween2 = new TWEEN.Tween({x: Math.PI/6, y: 0, z: 0}).to( {x:-Math.PI/6, y: 0, z: 0}, 100/this.MANAGER.getVelocityFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.legTween3 = new TWEEN.Tween({x:-Math.PI/6, y: 0, z: 0}).to( {x: Math.PI/6, y: 0, z: 0}, 100/this.MANAGER.getVelocityFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.legTween1.chain(this.legTween2)
		this.legTween2.chain(this.legTween3)
		this.legTween3.chain(this.legTween2)
		
		this.updateLeg1 = function(object){
			this.leftLeg.rotation.x = object.x;
			this.rightLeg.rotation.x = -object.x;
			this.leftArm.rotation.x = object.x *0.5;
			this.rightArm.rotation.x=-object.x*0.5;
		}
		this.legTween1.onUpdate(this.updateLeg1.bind(this));
		this.legTween2.onUpdate(this.updateLeg1.bind(this));
		this.legTween3.onUpdate(this.updateLeg1.bind(this))	;	
	}
	startMove() {
		this.legTween1.start();
	}
	
	stopMove() {
		this.legTween1.stop();
		const legTween4 = new TWEEN.Tween(this.leftLeg.rotation.clone()).to({x: 0, y: 0, z: 0}, 50/this.MANAGER.getVelocityFactor());
		legTween4.onUpdate(this.updateLeg1.bind(this));
		legTween4.start();
	}
	
	generateBoxMesh(width, height, depth, x, y, z) {
		var boxGeometry = new THREE.BoxGeometry(width, height, depth);
		var boxMaterial = new THREE.MeshPhongMaterial( { color: 0x008000 } );
		var mesh = new THREE.Mesh(boxGeometry, boxMaterial);
		mesh.castShadow = true;
		mesh.position.set(x,y,z);
		return mesh;
	}
	
	generateHeadMesh(width, height, depth, x, y, z) {
		var boxGeometry = new THREE.BoxGeometry(width, height, depth);
		var cubeMaterials=
		[new THREE.MeshPhongMaterial({color: 0x008000}),
		new THREE.MeshPhongMaterial({color: 0x008000}),
		new THREE.MeshPhongMaterial({color: 0x008000}),
		new THREE.MeshPhongMaterial({color: 0x008000}),
		new THREE.MeshPhongMaterial({color: 0x008000}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('resources/images/alieno.png')})]
		var mesh = new THREE.Mesh(boxGeometry, cubeMaterials);
		mesh.castShadow = true;
		mesh.position.set(x,y+1.0,z);
		return mesh;
	}
	getMesh() {
			return this.character;
		}
	
}