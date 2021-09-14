var PI_2 = Math.PI / 2;

export class InputController {
    constructor(params) {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false,
        };

        this.MANAGER = params.manager;
        this.mouseVelocity = 0.002 * this.MANAGER.getMouseSensibility();
        this.rotationX = 0;
        this.rotationY = 0;

        this.scopeEnabled = true;

        document.addEventListener( 'mousemove', (e) => this.onMouseMove(e), false );
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    }

    onMouseMove(event) {
		if ( this.MANAGER.gameEnable === false ) return;
        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        this.rotationY -= movementX * this.MANAGER.getMouseSensibility() * 0.002;
        this.rotationX -= movementY * this.MANAGER.getMouseSensibility()* 0.002;
		
        this.rotationX = Math.max( - PI_2, Math.min( PI_2, this.rotationX ) );
    }
	
    onKeyDown(event) {
        switch (event.keyCode) {
			case 38: // up
            case 87: // w
                this.keys.forward = true;
                break;
			
            case 37: // left
            case 65: // a
                this.keys.left = true;
                break;
			
            case 40: // down
            case 83: // s
                this.keys.backward = true;
                break;
				
            case 39: // right
            case 68: // d
                this.keys.right = true;
                break;
			
            case 32: // SPACE
                this.keys.space = true;
                break;
			
            case 16: // SHIFT
                this.keys.shift = true;
                break;
			
			case 86: //v
				this.MANAGER.APP.changeVisual();
				break;
				
			case 9:		//Tab
				event.preventDefault();
				this.keys.tab = true;
				break;
        }
    }
    onKeyUp(event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                this.keys.forward = false;
                break;
				
            case 37: // left
            case 65: // a
                this.keys.left = false;
                break;
				
            case 40: // down
            case 83: // s
                this.keys.backward = false;
                break;
				
            case 39: // right
            case 68: // d
                this.keys.right = false;
                break;
				
            case 32: // SPACE
                this.keys.space = false;
                break;
				
            case 16: // SHIFT
                this.keys.shift = false;
                break;
			
			case 9:		//Tab
				this.keys.tab = false;
				break;
        }
    }
}