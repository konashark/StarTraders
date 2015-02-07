/**
 * @author James Baicoianu / http://www.baicoianu.com/
 * modified to use rotation and movement easing by Jeff Sprague
 */

THREE.FlyControls = function ( object, keyHandler ) {
	this.object = object;
	this.config = {
		ALLOW_YAW: true,
		ALLOW_PITCH: false,
		ALLOW_ROLL: false,
		ALLOW_FORWARD: true,
	}

	this.keyHandler = ( keyHandler !== undefined ) ? keyHandler : null;
	
	//this.domElement = ( domElement !== undefined ) ? domElement : document;
		this.domElement = document;
	//if ( this.domElement ) this.domElement.setAttribute( 'tabindex', -1 );

	// API
	// Keep track of key state for most keyboard keys
	this.keyState = [];
	for(i = 0; i < 64; i++) { this.keyState.push(false); }

	this.mouseLeftBtnState = false;
	this.mouseRightBtnState = false;

	this.movementSpeed = 10.0;
	this.rollSpeed = Math.PI/180;

	// disable default target object behavior
	this.object.useQuaternion = true;
	this.tmpQuaternion = new THREE.Quaternion();

	this.moveState = {forward: 0, back: 0, pitch:0, yaw:0, roll:0 };
	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.rotationVector = new THREE.Vector3( 0, 0, 0 );

	// **************************************************
	this.handleEvent = function ( event ) {
		if ( typeof this[ event.type ] == 'function' ) {
			this[ event.type ]( event );
		}
	};

	// **************************************************
	this.keydown = function( event ) {

		if ( event.altKey ) {
			return;
		}

		if (event.keyCode >= 32 && event.keyCode <= 96)
		{
			this.keyState[event.keyCode - 32] = true;

//			if (event.keyCode == 32)
//			{
//				this.tmpQuaternion.set( Math.PI, Math.PI, Math.PI , 1 ).normalize();
//				this.object.quaternion.multiplySelf( this.tmpQuaternion );
//			}
		}
		
		if (this.keyHandler)
		{ this.keyHandler(event.keyCode); }
	};

	// **************************************************
	this.keyup = function( event ) {
		if (event.keyCode >= 32 && event.keyCode <= 96)
		{
			this.keyState[event.keyCode - 32] = false;
		}
	};

	// **************************************************
	this.checkUserInput = function()
	{
		var KEYSP = 32-32, KEYW = 87-32, KEYS = 83-32, KEYUP = 38-32, KEYDOWN = 40-32, KEYLEFT = 37-32, KEYRIGHT = 39-32, KEYQ = 81-32, KEYE = 69-32;
		
		if (this.config.ALLOW_FORWARD)
		{
			if ((this.keyState[KEYW]) && this.moveState.forward > -50) { this.moveState.forward -= 1; }
			if ((this.keyState[KEYS] || this.mouseRightBtnState) && this.moveState.forward < 25) { this.moveState.forward += 1; }
			if (Math.abs(this.moveState.forward) < 0.2)
				{ this.moveState.forward = 0;}
			if (this.keyState[KEYW] == false && this.keyState[KEYS] == false)
				{ this.moveState.forward *= 0.95;}
		}
		
		if (this.config.ALLOW_PITCH)
		{
			if (this.keyState[KEYDOWN] && this.moveState.pitch < 33) { this.moveState.pitch += 1;  }
			if (this.keyState[KEYUP] && this.moveState.pitch > -33) { this.moveState.pitch -= 1;  }
			if (Math.abs(this.moveState.pitch) < 0.2)
				{ this.moveState.pitch = 0;}
			if (this.keyState[KEYUP] == false && this.keyState[KEYDOWN] == false)
				{ this.moveState.pitch *= 0.95;}
		}
		
		if (this.config.ALLOW_YAW)
		{
			if (this.keyState[KEYLEFT] && this.moveState.yaw < 33) { this.moveState.yaw += 1;  }
			if (this.keyState[KEYRIGHT] && this.moveState.yaw > -33) { this.moveState.yaw -= 1;  }
			if (Math.abs(this.moveState.yaw) < 0.2)
				{ this.moveState.yaw = 0;}
			if (this.keyState[KEYLEFT] == false && this.keyState[KEYRIGHT] == false)
				{ this.moveState.yaw *= 0.95;}
		}

		if (this.config.ALLOW_ROLL)
		{
			if (this.keyState[KEYQ] && this.moveState.roll < 33) { this.moveState.roll += 1;  }
			if (this.keyState[KEYE] && this.moveState.roll > -33) { this.moveState.roll -= 1;  }
			if (Math.abs(this.moveState.roll) < 0.2)
				{ this.moveState.roll = 0;}
			if (this.keyState[KEYQ] == false && this.keyState[KEYE] == false)
				{ this.moveState.roll *= 0.95;}
		}
	}

	// **************************************************
	this.mousedown = function( event ) {
		if ( this.domElement !== document ) {
			this.domElement.focus();
		}

		event.preventDefault();
		event.stopPropagation();

		switch ( event.button ) {
			case 0: this.mouseLeftBtnState = true; break;
//			case 2: this.mouseRightBtnState = true; break;
		}
	};

	// **************************************************
	this.mousemove = function( event ) {
			var container = this.getContainerDimensions();
			var halfWidth  = container.size[ 0 ] / 2;
			var halfHeight = container.size[ 1 ] / 2;

			this.moveState.yawLeft   = - ( ( event.pageX - container.offset[ 0 ] ) - halfWidth  ) / halfWidth;
			this.moveState.pitchDown =   ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

			this.updateRotationVector();
	};

	// **************************************************
	this.mouseup = function( event ) {

		event.preventDefault();
		event.stopPropagation();

			switch ( event.button ) {
				case 0: this.mouseLeftBtnState = false; break;
//				case 2: this.mouseRightBtnState = false; break;
			}
	};

	// **************************************************
	this.update = function( delta ) {
		var obj = this.object;
		this.checkUserInput();
		this.updateMovementVector();
 		this.updateRotationVector();

		var moveMult = delta * this.movementSpeed;
		var rotMult = delta * this.rollSpeed;

		obj.translateX( this.moveVector.x * moveMult );
		obj.translateY( this.moveVector.y * moveMult );
		obj.translateZ( this.moveVector.z * moveMult );

		this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
        obj.quaternion.multiply( this.tmpQuaternion );
        // expose the rotation vector for convenience
        obj.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );

		//if (obj.position.y > 100) { obj.position.y = 100 }
		//if (obj.position.y < -100) { obj.position.y = -100 }
		obj.matrixWorldNeedsUpdate = true;
//obj.rotation.setEulerFromRotationMatrix( obj.matrix ); // GitHub change 2992
//obj.rotation.setEulerFromQuaternion( obj.quaternion, obj.eulerOrder );
	};

	// **************************************************
	this.updateMovementVector = function() {
		this.moveVector.x = 0;
		this.moveVector.y = 0;
		this.moveVector.z = this.moveState.forward;
	};

	// **************************************************
	this.updateRotationVector = function() {
		this.rotationVector.x = this.moveState.pitch;
		this.rotationVector.y = this.moveState.yaw;
		this.rotationVector.z = this.moveState.roll;
	};

	// **************************************************
	this.getContainerDimensions = function() {
	return {size: [1024,768], offset: [0,0]};
		if ( this.domElement != document ) {
			return {
				size	: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
				offset	: [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
			};
		} else {
			return {
				size	: [ window.innerWidth, window.innerHeight ],
				offset	: [ 0, 0 ]
			};
		}
	};

	// **************************************************
	function bind( scope, fn ) {
		return function () {
			fn.apply( scope, arguments );
		};
	};

//	this.domElement.addEventListener( 'mousemove', bind( this, this.mousemove ), false );
	this.domElement.addEventListener( 'mousedown', bind( this, this.mousedown ), false );
	this.domElement.addEventListener( 'mouseup',   bind( this, this.mouseup ), false );

	document.body.addEventListener( 'keydown', bind( this, this.keydown ), false );
	document.body.addEventListener( 'keyup',   bind( this, this.keyup ), false );
//this.domElement.addEventListener( 'keydown', bind( this, this.keydown ), false );
//this.domElement.addEventListener( 'keyup',   bind( this, this.keyup ), false );

	this.updateMovementVector();
	this.updateRotationVector();
};
