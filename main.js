import {CharacterController} from './js/Controllers/CharacterController.js';
import {CharacterFactory} from './js/CharacterFactory.js';
import {EntityManager} from './js/EntityManager.js';



class gameManager {
	constructor(){
		
		this.gameStarted = false;
		
		this.gameEnable = false;
		
		this.APP = null;
		
		this.setOptionsDefault = function() {
			this.options = {
				mouseSensibility : 1,
				gravity: -8,
				nrAlien:10,
				velocityFactorDefault : 0.2,
			}
		}
		this.setOptionsDefault();
		this.velocityFactor = this.options.velocityFactorDefault;
		this.nightOn=false;
		this.planet1=true;
		this.changeSkin=false;
	}
	
	getOptions() {return this.options;}
	getMouseSensibility() {return this.options.mouseSensibility;}
	getGravity() {return this.options.gravity;}
	getNight() {return this.nightOn;}
	setNight(flag) {return this.nightOn=flag}
	getPlanet1(){return this.planet1;}
	setPlanet1(flag){return this.planet1=flag;}
	getVelocityFactor() {return this.velocityFactor;}
	getNrAlien(){return this.options.nrAlien}
	setOptions(options) {this.options = options;}
	getSkin(){return this.changeSkin}
	setSkin(flag){this.changeSkin=flag}
	resetVelocityFactor(){this.velocityFactor = this.options.velocityFactorDefault;}
	multiplyVelocityFactor(val = 2) {this.velocityFactor = this.options.velocityFactorDefault*val;}
	
	startGame() {
		this.gameStarted = true;
		this.APP = new gameEnvironment();
	}
	
	
}

class MenuEnvironment {
	constructor() {
		this.game = document.getElementById("game");
		
		this.playGameButton = document.getElementById("playGameButton");
		this.settingButton = document.getElementById("settingsButton");
		
		this.setting = document.getElementById("settings");
		this.exitSettings = document.getElementById("exitSettings");
		this.confirmSettings = document.getElementById("confirmSettings");
		this.resetSettings = document.getElementById("resetSettings");
		
		this.sliderMouseSens = document.getElementById("sliderMouseSens");
		this.sliderGravity = document.getElementById("sliderGravity");
		this.sliderAlien=document.getElementById("sliderAlien");
		this.night=document.getElementById("nightON");
		this.changePlanet=document.getElementById("changePlanet");
		this.changeSkin=document.getElementById("changeSkin");
		this.setUpMainButtons();
		this.setUpSettingButton();
		this.giveValueFromCookie();	
	}
	
	setUpMainButtons() {
		this.game.style.display = "none";
		this.playGameButton.addEventListener("click", () => {
			this.game.style.display = "block"
            this.game.style.bottom = "0px";
            this.game.style.animation = "1s newPage normal";
            document.activeElement.blur();
            MANAGER.startGame();
        }, false);
		this.setting.style.display = "none";
		this.settingButton.addEventListener("click", () => {
			this.updateAllSlider();
			this.setting.style.display = "block"
            this.setting.style.bottom = "0px";
            this.setting.style.animation = "1s newPage normal";
            document.activeElement.blur();		
        }, false);
	}
	setUpSettingButton() {
		
		this.exitSettings.addEventListener("click", this.exitSetting.bind(this), false);
		this.confirmSettings.addEventListener("click", () => {
			this.updateAllOptions();
            var currentOptions = MANAGER.getOptions();
            document.cookie = "options={mouseSensibility:"+currentOptions.mouseSensibility+
                ", gravity:"+currentOptions.gravity+
				", nrAlien:"+currentOptions.nrAlien+
				", nightOn:"+MANAGER.getNight()+
				", planet1:"+MANAGER.getPlanet1()+
				", changeSkin:"+MANAGER.getSkin()+
				"};";
			this.exitSetting();
        }, false);
		this.night.addEventListener("click", () => {
			if(MANAGER.getNight()==true)
				MANAGER.setNight(false);
			else
				MANAGER.setNight(true);
		}, false);
		this.changePlanet.addEventListener("click", () => {
			if(MANAGER.getPlanet1()==true){
				MANAGER.setPlanet1(false);
			}
			else{
				MANAGER.setPlanet1(true);}
		}, false);
		this.changeSkin.addEventListener("click", () => {
			if(MANAGER.getSkin()){
				MANAGER.setSkin(false);
			}
			else
				MANAGER.setSkin(true);
		}, false);
		this.resetSettings.addEventListener("click", () => {
			MANAGER.setOptionsDefault();
			MANAGER.setNight(false);
			MANAGER.setPlanet1(true);
			MANAGER.setSkin(false);
			this.updateAllSlider();
        }, false);
	}
	giveValueFromCookie() {
		var cookieSettings = this.getCookie("options");
        if(cookieSettings != null){
            var data = cookieSettings.slice(1, cookieSettings.length-1).split(", ");
            MANAGER.setOptions({
                mouseSensibility: parseFloat(data[0].split(":")[1]),
                gravity: parseFloat(data[1].split(":")[1]),
				nrAlien:parseFloat(data[2].split(":")[1]),
				velocityFactorDefault: 0.2,
            });
			MANAGER.setNight( (data[3].split(":")[1] === 'true'));
			MANAGER.setPlanet1((data[4].split(":")[1] === 'true'));
			MANAGER.setSkin((data[5].split(":")[1] === 'true'));
        }
	}
	
	getCookie(name){
        var elem = document.cookie.split("; ").find(row => row.startsWith(name))
        if(elem == null)
            return null;
        return elem.split('=')[1];
    }
	exitSetting() {
		this.setting.style.display = "none";
		document.activeElement.blur();
	}
	updateAllSlider() {
		var curOptions = MANAGER.getOptions();
		this.sliderMouseSens.value = curOptions.mouseSensibility;
		this.sliderGravity.value = curOptions.gravity;
		this.sliderAlien.value= curOptions.nrAlien;
	}
	updateAllOptions() {
		MANAGER.setOptions({
			mouseSensibility: parseFloat(this.sliderMouseSens.value),
			gravity: parseFloat(this.sliderGravity.value),
			nrAlien:parseFloat(this.sliderAlien.value),
		velocityFactorDefault: 0.2
		});
	}
}

class gameEnvironment {
	constructor() {
		this.load();
	}
	load() {	
		setTimeout(this.init(), 3000);
	}
	
	changeVisual() {
		if(this.activeCamera==2)
			this.activeCamera=0;
		else
			this.activeCamera +=1;
	}
	
	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera2.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.camera2.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
	
	locker() {
		document.getElementById("loading").style.display = "none";	
		var blocker = document.getElementById( 'blocker' );
		var pauseCanvas = document.getElementById( 'PauseCanvas' );
		var resumeButton = document.getElementById( 'resumeButton' );
		var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
		if ( havePointerLock ) {
			var element = document.body;
			var pointerlockchange = function ( event ) {
				if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
					MANAGER.gameEnable = true;
					if(this.pauseTime){
						this.pausePassedTime = Date.now()-this.pauseTime;
						}
					blocker.style.display = 'none';
					pauseCanvas.style.display = 'none';
				} else {
					this.pauseTime = Date.now();
					MANAGER.gameEnable = false;
					pauseCanvas.style.display = '-webkit-flex';
					pauseCanvas.style.display = '-moz-flex';
					pauseCanvas.style.display = 'flex';
				}
			}
			var pointerlockerror = function ( event ) {
				pauseCanvas.style.display = '-webkit-flex';
				pauseCanvas.style.display = '-moz-flex';
				pauseCanvas.style.display = 'flex';
			}
			// Hook pointer lock state change events
			document.addEventListener( 'pointerlockchange', pointerlockchange.bind(this), false );
			document.addEventListener( 'mozpointerlockchange', pointerlockchange.bind(this), false );
			document.addEventListener( 'webkitpointerlockchange', pointerlockchange.bind(this), false );
			document.addEventListener( 'pointerlockerror', pointerlockerror, false );
			document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
			document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
				instructions.style.display = 'none';
				// Ask the browser to lock the pointer
				element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
				if ( /Firefox/i.test( navigator.userAgent ) ) {
					var fullscreenchange = function ( event ) {
						if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
							document.removeEventListener( 'fullscreenchange', fullscreenchange );
							document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
							element.requestPointerLock();
						}
					}
					document.addEventListener( 'fullscreenchange', fullscreenchange, false );
					document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
					element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
					element.requestFullscreen();
				} else {
					element.requestPointerLock();
				}				
		} else {
			instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
		}		
		resumeButton.addEventListener('click', () => {
            element.requestPointerLock();
        }, false)
	}
		
	update() {
		var dt = 1/60;
		this.world.step(dt);
		var time = Date.now() - this.time - this.addedTime;
		this.entityManager.update(time);
		this.controls.update(time );		
		
		for(var i=0; i<this.modelli.length; i++){
			this.modelli[i].position.copy(this.modelliCannon[i].position);
			//to adjust some colliders
			if(i==0){
			this.modelli[i].position.x-=5;
			this.modelli[i].position.z-=8;
			}
			if(i>=1){
				this.modelli[i].position.y-=15;
			}
			this.modelli[i].quaternion.copy(this.modelliCannon[i].quaternion);
		}
		//rotate planetBackground
		for(var i=0; i<this.planetesBackground.length; i++){
			this.planetesBackground[i].rotation.y+=0.01;
		}
		TWEEN.update()
	}

	//Draw Scene
	render() {
		if(this.activeCamera==0)
			this.renderer.render( this.scene, this.camera );
		else if(this.activeCamera==1)
			this.renderer.render( this.scene, this.camera2 );
		else
			this.renderer.render( this.scene, this.cameraShip );
		this.time = Date.now();
	}

	//Run game loop (update, render, repet)
	GameLoop() {
		this.animationFrameID = requestAnimationFrame(this.GameLoop.bind(this));
		if(MANAGER.gameEnable){
			this.addedTime = this.pausePassedTime ? this.pausePassedTime : 0;
			this.pausePassedTime = 0;
			this.update();
			this.render();
			
        }
	}	
	init() {
		//fps camera
		this.camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.15, 1000 );
		//tps camera
		this.camera2 = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.camera2.translateY(4);
		this.camera2.translateZ(5);
		this.camera2.rotation.x = -Math.PI/10;	
		//Space ship camera
		this.cameraShip= new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.cameraShip.position.set(25, 10, -5);
		this.activeCamera = 0;
		this.scene = new THREE.Scene();
		this.world = this.initCannon();
		this.entityManager = new EntityManager({scene: this.scene, world: this.world, manager: MANAGER});
		//load scene stuff
		this.modelli=[];
		this.modelliCannon=[];
		this.planetesBackground=[];
		this.addModel('resources/models/bigShip/scene.gltf', 400, 300, 100, 0.8,  false);
		this.addModel('resources/models/spaceship/scene.gltf', 15, 10, 0, 5, 0.6, true);
		//add three and lights
		this.addModel('resources/models/tree/scene.gltf', -70, 15, 0, 0.03,  false);
		this.addModel('resources/models/tree/scene.gltf', -260, 15, -100, 0.03,  false);
		this.addModel('resources/models/tree/scene.gltf', 150, 15, 68, 0.03,  false);
		this.addModel('resources/models/tree/scene.gltf', 45, 15, -45, 0.03,  false);
		this.addModel('resources/models/tree/scene.gltf', -45, 15, -180, 0.03,  false);
		this.addModel('resources/models/tree/scene.gltf', -45, 15, -90, 0.03,  false);
		if(MANAGER.getNight()==false){
			var light1 = new THREE.PointLight(0xFF0040, 4, 500);
			light1.position.set(15, 10, 7);
			this.scene.add(light1);
			if(MANAGER.getPlanet1()==false){
					const dayLight = new THREE.HemisphereLight( 0xFF8033 , 0xFF8033, 1 );this.scene.add( dayLight );				}
			else {const dayLight = new THREE.HemisphereLight( 0xAC33FF , 0xAC33FF, 1 );this.scene.add( dayLight );}}
		
		var ambient = new THREE.AmbientLight( 0xFFFFFF, 0.8 );
		this.scene.add( ambient );
		
		this.renderer = new THREE.WebGLRenderer({canvas: document.getElementById( 'canvas' ), antialias: true});
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMapSoft = true;
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.setClearColor( 0xffffff, 0);
		window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
		// floor
		var geometry = new THREE.PlaneGeometry( 1000, 1000, 50, 50 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
		if(MANAGER.getPlanet1()==false)
		var material = new THREE.MeshPhongMaterial( {map: new THREE.TextureLoader().load('resources/models/planet/penguins (42)/wasteland_bk.jpg'), side:THREE.DoubleSide, dithering: true } );
		else
			var material = new THREE.MeshPhongMaterial( {map: new THREE.TextureLoader().load('resources/models/planet/penguins (40)/violence_bk.jpg'), side:THREE.DoubleSide, dithering: true } );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		this.scene.add( mesh );
		
		//skybox
		if(MANAGER.getPlanet1()==true){
		var skybox1= this.createSkybox('40', 'violence');
		this.scene.add(skybox1);
		skybox1.position.copy(mesh.position);
		}
		else {
		var skybox2=this.createSkybox('42', 'wasteland');
		this.scene.add(skybox2);
		skybox2.position.copy(mesh.position);
		}
		this.boxes = [];
		this.boxMeshes = [];
		this.balls = [];
		this.ballMeshes=[];
			
	
		//Add character
		var playerStartPosition = [0, 2.0, 0];
		this.playerEntity = this.entityManager.addEntityAndReturn({name: EntityManager.ENTITY_PLAYER, position: playerStartPosition})
		this.entityManager.setPlayer(this.playerEntity);
		this.controls = new CharacterController({manager: MANAGER, entity: this.playerEntity, camera: this.camera, camera2:this.camera2});	
		this.scene.add(this.controls.getObject());
	
		//add aliens
		this.generateAliens();
	
		
		
		if(MANAGER.getPlanet1()==true){
			this.addBackgroudPlanet('venus', -400, 400, -400);
			this.addBackgroudPlanet('mars', 200, 400, -500);
		}
		else{
			this.addBackgroudPlanet('pluto', -400, 400, -400);
			this.addBackgroudPlanet('mercury', 200, 400, -500);
		}
		this.treelight=[];
		this.locker();
		this.cont=0;
		this.GameLoop();
		
	}
	
	
	generateAliens() {
		for(let i=0;i<MANAGER.getNrAlien();i++) {
			var minDistanceSquared = 500;
			var alienposition = [20,15,0];
			alienposition[0] = Math.random()*2-1;
			alienposition[2] = Math.random()*2-1;
			var distanceSquared = alienposition[0]*alienposition[0]+alienposition[2]*alienposition[2];
			var factor = Math.sqrt(minDistanceSquared/distanceSquared);
			alienposition[0] *= (factor+Math.random()*100);
			alienposition[2] *= (factor+Math.random()*100);
			var randomPoint = Math.random();
			if(randomPoint>0.5)
				randomPoint=randomPoint/2;
			if(i%2==0)
				randomPoint=-randomPoint;
			
			this.entityManager.addEntity({name: EntityManager.ENTITY_ALIEN, position: alienposition, maxDistance: 20, randomDestination: randomPoint});
		}
	}
	
	addBackgroudPlanet(name, xp, yp, zp){
		let pos = {x: xp, y: yp, z: zp};
		var geometry   = new THREE.SphereGeometry(32, 32, 32);
		var material  = new THREE.MeshPhongMaterial();
		material.map    = THREE.ImageUtils.loadTexture('resources/images/'+name+'map.jpg');
		material.bumpMap    = THREE.ImageUtils.loadTexture('resources/images/'+name+'bump.jpg');
		material.bumpScale = 0.05
		var planetMesh = new THREE.Mesh(geometry, material);
		planetMesh.castShadow=true;
		planetMesh.position.set(pos.x, pos.y, pos.z);	
		this.scene.add(planetMesh);
		this.planetesBackground.push(planetMesh);
	}
	
	createSkybox(dirNumber, dirName){
		var cube =new THREE.BoxGeometry(1000, 1000, 1000);
		var cubeMaterials=
		[new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('resources/models/planet/penguins ('+dirNumber+')/'+dirName+'_rt.jpg'), side:THREE.DoubleSide}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('resources/models/planet/penguins ('+dirNumber+')/'+dirName+'_lf.jpg'), side:THREE.DoubleSide}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('resources/models/planet/penguins ('+dirNumber+')/'+dirName+'_up.jpg'), side:THREE.DoubleSide}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('resources/models/planet/penguins ('+dirNumber+')/'+dirName+'_dn.jpg'), side:THREE.DoubleSide}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('resources/models/planet/penguins ('+dirNumber+')/'+dirName+'_bk.jpg'), side:THREE.DoubleSide}),
		new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('resources/models/planet/penguins ('+dirNumber+')/'+dirName+'_ft.jpg'), side:THREE.DoubleSide})]
		var material = new THREE.MeshFaceMaterial(cubeMaterials);
		var skybox=new THREE.Mesh(cube, material);
		return skybox;
	}
	
	addModel(path, xp, yp, zp, resize, bool){
		let pos = {x: xp, y: yp, z: zp};
		const gltfLoader = new THREE.GLTFLoader();
            gltfLoader.load(path, (gltf) => {	
			var model=gltf.scene;
			model.traverse(c => {
				c.castShadow = true;
			});
			model.receiveShadow = true;
			model.scale.multiplyScalar(resize); // scale here
			model.position.set(pos.x, pos.y, pos.z);
			if(bool){
			var modelBody=new CANNON.Body({
			mass: 1000 });
			var boxCollider= new CANNON.Box(new CANNON.Vec3(8, 8, 12));
			modelBody.addShape(boxCollider);
			modelBody.position.set(pos.x, pos.y, pos.z+6);
            this.world.addBody(modelBody);		
			this.modelliCannon.push(modelBody);
			this.modelli.push(model);
			
			}
			if(path=="resources/models/tree/scene.gltf"){
				var modelBody=new CANNON.Body({
				mass: 1000000 });
				var boxCollider= new CANNON.Box(new CANNON.Vec3(5.5, 15, 5.5));
				modelBody.position.set(pos.x, pos.y, pos.z);
				modelBody.addShape(boxCollider);
				this.world.addBody(modelBody);	
				this.modelliCannon.push(modelBody);
				this.modelli.push(model);			
			}
			model.material = new THREE.MeshPhongMaterial();   
			model.mesh=new THREE.Mesh(model, model.material);
			this.scene.add( model );
			this.cont+=1;		
		},
		// called while loading is progressing
		function ( xhr ) {
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		},
		// called when loading has errors
		function ( error ) {
		console.log( 'An error happened' );
		reject(error);});
	}
	
	
	initCannon() {
		var world = new CANNON.World();
		world.quatNormalizeSkip = 0;
		world.quatNormalizeFast = false;
		var solver = new CANNON.GSSolver();
		world.defaultContactMaterial.contactEquationStiffness = 1e9;
		world.defaultContactMaterial.contactEquationRelaxation = 4;

		solver.iterations = 7;
		solver.tolerance = 0.1;
		var split = true;
		if(split)
			world.solver = new CANNON.SplitSolver(solver);
		else
			world.solver = solver;
		world.gravity.set(0, MANAGER.getGravity(),0);
		world.broadphase = new CANNON.NaiveBroadphase();

		// Create a slippery material (friction coefficient = 0.0)
		var physicsMaterial = new CANNON.Material();
		var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
																physicsMaterial,
																0.0, // friction coefficient
																0.3  // restitution
																);
		// Create other non slippery Material
		var groundMaterial = new CANNON.Material({map: new THREE.TextureLoader().load('resources/models/planet/penguins (35)/torture_bk.jpg'), side:CANNON.DoubleSide});		
		groundMaterial.friction = 200.0;

		// We must add the contact materials to the world
		world.addContactMaterial(physicsContactMaterial);
		
		// Create a plane
		var groundShape = new CANNON.Plane();
		var groundBody = new CANNON.Body({ mass: 0 });
		groundBody.addShape(groundShape);
		groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
		groundBody.isGround = true;
		world.add(groundBody);	
		return world
	}



	setUpButtons() {
		 this.playGameButton.addEventListener("click", () => {
            this.game.style.bottom = "0px";
            this.game.style.animation = "1s newPage normal";
            document.activeElement.blur();
            MANAGER.StartGame();
        }, false);
	}
}

var MANAGER = new gameManager();


window.addEventListener('DOMContentLoaded', () => {
    MANAGER.APP = new MenuEnvironment();
});
