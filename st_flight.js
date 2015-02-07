window.requestAnimFrame = (function(callback){
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback){
		window.setTimeout(callback, 1000 / 60);
	};
})();

//*********************************************************
function animate(){
	// request new frame
	requestAnimFrame(function(){ animate(); });

	// Update any objects floating around our current star system
	for (i = 0; i < st.curSystem.obj.length; i++)
	{
		var obj = st.curSystem.obj[i];
		if (obj.animFunc)
			obj.animFunc(obj);
	}

	// Read controls and update positions of camera
	st.controls.update(st.clock.getDelta());
	
	updateShortRangeScanner(flight.srScanner);
	updateLongRangeScanner(flight.lrScanner);
	updatePulseWeapon();
	updateExplosion();
		
	// render
	flight.renderer.render(flight.scene, flight.camera);
}

//*********************************************************
window.onload = function(){
//console.log("Creating WebGL renderer from canvas...");
//var canvas = document.createElement('canvas');
//canvas.width = 500;
//canvas.height = 500;
//renderer = new THREE.WebGLRenderer({canvas:canvas});
//renderer.setSize(500, 500);
//console.log("DONE Creating WebGL renderer from canvas...");

	createFlightScene();	
	st.controls = new THREE.FlyControls(flight.camera, keyHandlerCallback);	
	
	st.curSystem = tSystem;
	st.systems.push(st.curSystem);
	createSystemObjects(st.curSystem);

	initializePulseWeapon();

	// wait for texture image to load before kicking off animation
	var textureImg = new Image();
	textureImg.onload = function(){	animate(); }; // Kick off first animation frame
	textureImg.src = "./images/pulse.png";
}

//*********************************************************
function keyHandlerCallback(key)
{
	console.log(key);
	
	if (key == 76)	// 'l - long range scanner
	{
		if (flight.lrScanner.active == true)
		{
			console.log("Hiding LRS");
			flight.lrScanner.active = false;
			document.getElementById('lrscanner').hidden = true;
		}
		else {
			console.log("Showing LRS");
			flight.lrScanner.active = true;
			document.getElementById('lrscanner').hidden = false;
		}
	}
}

//*********************************************************
function createFlightScene()
{
	if (1) {
		console.log("Creating WebGL renderer from canvas...");
		st.canvas = document.createElement('canvas');
		st.canvas.width = st.WIDTH;
		st.canvas.height = st.HEIGHT;
		flight.renderer = new THREE.WebGLRenderer({canvas:st.canvas});
		flight.renderer.setSize(st.WIDTH, st.HEIGHT);
	}
	else {
		console.log("Using Three.js created canvas...");
		flight.renderer = new THREE.WebGLRenderer();
		flight.renderer.setSize(st.WIDTH, st.HEIGHT);
	}
	document.body.appendChild(flight.renderer.domElement);
		
	// camera
	flight.camera = new THREE.PerspectiveCamera(45, st.WIDTH/st.HEIGHT, 1, st.SYS_WIDTH * 2);
	flight.camera.position.z = 800;
	
	// scene
	flight.scene = scene = new THREE.Scene();

	var fn = "images/extras/skybox.jpg";
	var e = [fn,fn,fn,fn,fn,fn];
	var f = THREE.ImageUtils.loadTextureCube(e);
    var shader = THREE.ShaderLib[ "cube" ];
    shader.uniforms[ "tCube" ].value = f;
	var c = new THREE.MeshBasicMaterial({color:0xffffff,envMap:f, side: THREE.BackSide});
	var b = new THREE.Mesh(new THREE.CubeGeometry(st.SYS_WIDTH,st.SYS_WIDTH,st.SYS_WIDTH,null,true),c);
	flight.scene.add(b);

	//	var skyBoxMaterial = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("./images/starfield_min.jpg"), side: THREE.BackSide });
//	var skyBoxGeometry = new THREE.CubeGeometry( 100000, 100000, 100000 );
//	flight.skybox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
//	flight.scene.add(flight.skybox);

	// add subtle ambient lighting
	var ambientLight = new THREE.AmbientLight(0x666666);
	flight.scene.add(ambientLight);

	// add directional light source
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 1, 1).normalize();
	flight.scene.add(directionalLight);

//	flight.scene.fog = new THREE.Fog( 0x000000, 1000, 10000);

	flight.srScanner = createShortRangeScanner();
	flight.lrScanner = createLongRangeScanner();
}

//*********************************************************
function createSystemObjects(system)
{
	system.planet = oneIn(2);
	if (system.planet)
	{
		system.moon = oneIn(2);
		system.starbase = oneIn(4);
		system.police = oneIn(3);
        if (system.police == false) {
            system.pirates = oneIn(3);
        }
        system.derelict = false;
    }else{
		system.moon = false;
		system.starbase = oneIn(20);
        system.police = oneIn(10);
        if (system.police == false) {
            system.pirates = oneIn(3);
        }
        system.derelict = oneIn(3);
	}

	if (oneIn(2)) {
        system.asteroids = randomRange(1,8);
    }

	var planet = createPlanet(system);
	createMoon(system, planet);
	createDerelict(system);
}


