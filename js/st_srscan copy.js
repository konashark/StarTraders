//*********************************************************
function createShortRangeScanner()
{
	var canvas = document.createElement('canvas');
	canvas.width = 180;
	canvas.height = 200;
	ctx = canvas.getContext('2d');
	ctx.font = "16px";
	ctx.fillStyle = "#880000";
//	ctx.fillRect(0, 0, 180, 200);
	ctx.fillStyle = "#ddbb00";
	ctx.fillText("SHORT RANGE SCAN", 10,16);

	planet = new Image();
	planet.src = "./images/srs_planet.png";

	enemy = new Image();
	enemy.src = "./images/srs_enemy.png";

	starbase = new Image();
	starbase.src = "./images/srs_starbase.png";

	scangrid = new Image();
	scangrid.src = "./images/srs_scangrid.png";

	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	
	sprite = new THREE.Sprite( { map: texture, alignment: THREE.SpriteAlignment.topLeft } );
	sprite.position.set( 10, 10, 3 );
	sprite.scale.set( 180, 200, 1 );
	sprite.opacity = .70;
	scene.add( sprite );
	
	return {
		gridImg: scangrid,
		planetImg: planet,
		enemyImg: enemy,
		starbaseImg: starbase,
		canvas: canvas,
		ctx: ctx,
		texture: texture,
		sprite: sprite,
	}
}

//*********************************************************
function updateShortRangeScanner(srScanner)
{
	var ctx = flight.srScanner.ctx;
	ctx.fillStyle = "#880000";
	ctx.fillRect(0, 0, 180, 200);
	ctx.fillStyle = "#ddbb00";
	ctx.fillText("SHORT RANGE SCAN", 10,16);
	ctx.fillStyle = "#eeeeee";
	ctx.drawImage(flight.srScanner.gridImg, 0, 0, 160, 160, 10, 30, 160, 160);

	// Calc camera angle in radians
	var zVec = quatToEuler(flight.camera.quaternion);
	var camRotation = eulerToAngle(zVec.y);

	// Draw any objects floating around our current star system
	for (i = 0; i < st.curSystem.obj.length; i++)
	{
		var obj = st.curSystem.obj[i];
		if (obj.mesh)
		{
			var vect = rect2polar(flight.camera.position.x,
				flight.camera.position.z,
				camRotation,
				obj.mesh.position.x,
				obj.mesh.position.z);
				
			//ctx.beginPath();
			//ctx.rect(88,108,4,4);	
			//ctx.fillRect(88,108,4,4);	
			//ctx.stroke();			
			
			if (vect.distance < 4000)
			{
				//ctx.arc(862,87,64,0,TWOPI);
				var ox = 90 + ((Math.sin(vect.angle * st.RADUNIT) * vect.distance) / 50);
				var oy = 110 - ((Math.cos(vect.angle * st.RADUNIT) * vect.distance) / 50);
				if (obj === tShip)
					{ ctx.drawImage(flight.srScanner.enemyImg, 0, 0, 10, 8, ox-4, oy-3, 10, 8) }
				else 
				if (obj === tPlanet)
					{ ctx.drawImage(flight.srScanner.planetImg, 0, 0, 16, 16, ox-7, oy-7, 16, 16) }
				else
				if (obj === tStarbase)
					{ ctx.drawImage(flight.srScanner.starbaseImg, 0, 0, 10, 10, ox-4, oy-4, 10, 10) }
				else
					{ ctx.fillRect(ox-2,oy-2,4,4) }
			}				
		}
	}
	
//	ctx.fillText("rot: "+camRotation, 15,170);
//	ctx.fillText("rot: "+zVec.x+" "+zVec.y+" "+zVec.z, 15,170);

	flight.srScanner.texture.needsUpdate = true;
}

//*********************************************************
function createLongRangeScanner()
{
	console.log("Creating Long Range Scanner...");
	var canvas = document.createElement('canvas');
	canvas.width = 500;
	canvas.height = 500;
//	var ctx = canvas.getContext('2d');
//	ctx.font = "16px";
//	ctx.fillStyle = "#006600";
//	ctx.fillRect(0, 0, 500, 500);

	var renderer = new THREE.WebGLRenderer({canvas:canvas});
	renderer.setSize(500,500);

	// camera
	var camera = new THREE.PerspectiveCamera(45, 1, 1, 200000);
	camera.position.x = 0;
	camera.position.y = 2500;
	camera.position.z = 0;
	camera.rotation.x = Math.PI;
	camera.rotation.y = 0;
	camera.rotation.z = 0;

	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	
	var sprite = new THREE.Sprite( { map: texture, alignment: THREE.SpriteAlignment.topLeft } );
	sprite.position.set( 360, 100, 4 );
	sprite.scale.set( 500, 500, 1 );
	sprite.opacity = .70;
	scene.add( sprite );
	
	return {
		active: false,
		renderer: renderer,
		camera: camera,
		canvas: canvas,
		ctx: ctx,
		texture: texture,
		sprite: sprite,
	}
}

//*********************************************************
function updateLongRangeScanner(lrscanner)
{	
	if (lrscanner.active == false) return;
	
	lrscanner.renderer.render(flight.scene, lrscanner.camera);

	var ctx = lrscanner.ctx;
	ctx.fillStyle = "#880000";
//	ctx.fillRect(0, 0, 180, 200);
	ctx.fillStyle = "#ddbb00";
	ctx.fillText("LONG RANGE SCAN", 10,16);
//	ctx.fillStyle = "#eeeeee";
//	ctx.drawImage(flight.srScanner.gridImg, 0, 0, 160, 160, 10, 30, 160, 160);

	lrscanner.texture.needsUpdate = true;
}

