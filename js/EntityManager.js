import {CharacterController} from './Controllers/CharacterController.js';
import {BasicAIienController} from './Controllers/BasicAIController.js';
import {CharacterFactory} from './CharacterFactory.js';
import {AlienFactory} from './AlienFactory.js'
export class EntityManager{
	static ENTITY_ALIEN = "SimpleEnemy";
	static ENTITY_PLAYER = "Player";
	
	constructor(params){
        this.entities = [];
        //this.collectables = [];
        this.player = null;

        this.scene = params.scene;
        this.world = params.world;
        this.MANAGER = params.manager;
		this.bulletManager = params.bulletManager;
        this.scoreManager = params.scoreManager;

    }

	addEntity(params) {
		switch(params.name){
            case EntityManager.ENTITY_ALIEN:
				var character = new AlienFactory({manager: this.MANAGER, position: params.position})
                var entity = new alienEntity({
                    manager: this.MANAGER,
					entityManager: this,
					maxDistance: params.maxDistance,
					randomDestination: params.randomDestination,
					pos: this.entities.length,
                    target: character.getMesh(),
                    body: this.buildBody(params),
                    player: this.player,
					character : character, 
					
                });
                this.entities.push(entity);
                break;
            case EntityManager.ENTITY_PLAYER:
				if(!this.MANAGER.getSkin())
					var character = new CharacterFactory({manager: this.MANAGER, position: params.position})
				else
					var character = new AlienFactory({manager: this.MANAGER, position: params.position})
                var entity = new PlayerEntity({
                    manager: this.MANAGER,
					entityManager: this,
					pos: this.entities.length,
                    target: character.getMesh(),
					body: this.buildBody(params),
					character : character,
                });
                this.entities.push(entity);
                break;
        }
		this.scene.add(entity.target);
        if(entity.body != null){
            this.world.add(entity.body);
		}
	}
	addEntityAndReturn(params){
        this.addEntity(params);
        return this.entities[this.entities.length-1];
    }
	
	buildMesh(params){
		var elem = this._models[params.name];
		var mesh = elem.model.clone();

        mesh.name = params.name+(++elem.count);

        mesh.position.set(...params.position);
        if(params.rotation)
            mesh.rotation.set(...params.rotation);

        return mesh;
    }

	buildBody(params){
        switch(params.name){ 
            case EntityManager.ENTITY_ALIEN:
                var body = new CANNON.Body({ mass: 30, shape: new CANNON.Sphere(6), });
                break;
            case EntityManager.ENTITY_PLAYER:
                var body = new CANNON.Body({ mass: 50, shape: new CANNON.Sphere(1), });
                body.linearDamping = 0.9;
                break;
        }
        body.position.set(...params.position);
        if(params.rotation){
            if(params.rotation[0] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), params.rotation[0]);
            if(params.rotation[1] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), params.rotation[1]);
            if(params.rotation[2] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), params.rotation[2]);
        }
        return body;
    }
	
	eliminateThisEntity(elem){
		elem.body.position.y = -100;
		elem.body.sleep();
		elem.target.parent.remove(elem.target);
        var pos = elem.pos;
        this.entities.splice(pos, 1);
        for (var i = pos; i < this.entities.length; i++){
            this.entities[i].pos -= 1;
        }
    }
	
	setPlayer(player){
        this.player = player;
    }
	
	update(timeInSeconds){
        for(var i in this.entities){
            this.entities[i].update(timeInSeconds);
        }
    }
}

class Entity{
    constructor(params){
        this.MANAGER = params.manager;
        this.entityManager = params.entityManager;
        this.target = params.target;
        this.body = params.body;
        this.pos = params.pos;
        this.player = params.player;
        if(this.body){
            this.contactNormal = new CANNON.Vec3();
            this.upAxis = new CANNON.Vec3(0, 1, 0);
            this.body.addEventListener("collide", function (e){
				
                if ( !(e.contact.bi.isBullet || e.contact.bj.isBullet) )
                    return;
				
                if (e.contact.bi.id == this.body.id)
                    e.contact.ni.negate(this.contactNormal);
                else
                    this.contactNormal.copy(e.contact.ni);
                
                var direction = this.contactNormal.dot(this.upAxis)
                if (direction > 0.5){
                    this.hittedDown();
                } else if (direction < -0.5){
                    this.hittedUp();
                } else {
                    this.hitted();
                }
            }.bind(this));
        }
    }

    collected(){}
    hitted(){}
    hittedUp(){this.hitted()}
    hittedDown(){this.hitted()}
    update(timeInSeconds){}
}
	
class alienEntity extends Entity{
	constructor(params){
		super(params);
		this.maxDistance = params.maxDistance;
		this.character = params.character;
		this.randomDestination=params.randomDestination;
		this.controls = new BasicAIienController({
			manager: this.MANAGER,
			character: this.character,
			entity: this,
			target: this.target,
			body: this.body,
			player: this.player,
			maxDistance: this.maxDistance,
			randomDestination:this.randomDestination
		});
		
	}
	update(timeInSeconds){
		this.controls.update(timeInSeconds);

	}
}

class PlayerEntity extends Entity{
	constructor(params){
		super(params);
		this.character = params.character;
	}
	hitted(){
		this.scoreManager.lose1life();
	}
}