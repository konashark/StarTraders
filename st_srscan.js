//*********************************************************
function createShortRangeScanner()
{
	console.log("Creating Short Range Scanner...");
	var canvas = document.createElement('canvas');
	canvas.id = "srscanner";
	canvas.width = st.SRS_WIDTH;
	canvas.height = st.SRS_HEIGHT;
	canvas.style.position = "absolute";
	canvas.style.left = "10px";
	canvas.style.top = "10px";
	canvas.style.opacity = 0.7;
	ctx = canvas.getContext('2d');
	ctx.font = "12px arial";

	document.body.appendChild(canvas)

	// Load Scanner Icons
	planet = new Image();
	planet.src = "./images/srs_planet.png";

	enemy = new Image();
	enemy.src = "./images/srs_enemy.png";

	starbase = new Image();
	starbase.src = "./images/srs_starbase.png";

	scangrid = new Image();
	scangrid.src = "./images/srs_scangrid.png";

//	var texture = new THREE.Texture(canvas);
//	texture.needsUpdate = true;
//	
//	sprite = new THREE.Sprite( { map: texture, alignment: THREE.SpriteAlignment.topLeft } );
//	sprite.position.set( 10, 10, 3 );
//	sprite.scale.set( 180, 200, 1 );
//	sprite.opacity = .70;
//	scene.add( sprite );
	
	return {
		gridImg: scangrid,
		planetImg: planet,
		enemyImg: enemy,
		starbaseImg: starbase,
		canvas: canvas,
		ctx: ctx,
	}
}

//*********************************************************
function updateShortRangeScanner(srScanner)
{
	var ctx = flight.srScanner.ctx;
	ctx.fillStyle = "#880000";
	ctx.fillRect(0, 0, st.SRS_WIDTH, st.SRS_HEIGHT);
	ctx.fillStyle = "#ddbb00";
	ctx.fillText("SHORT RANGE SCAN", 10,20);
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
				
			if (vect.distance < 1800)
			{
				var ox = 90 + ((Math.sin(vect.angle * st.RADUNIT) * vect.distance) / 25);
				var oy = 110 - ((Math.cos(vect.angle * st.RADUNIT) * vect.distance) / 25);
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
	
//ctx.beginPath();
//ctx.rect(88,108,4,4);	
//ctx.fillRect(88,108,4,4);	
//ctx.stroke();			

//	ctx.fillText("rot: "+camRotation, 15,170);
//	ctx.fillText("rot: "+zVec.x+" "+zVec.y+" "+zVec.z, 15,170);

//	flight.srScanner.texture.needsUpdate = true;
}

//*********************************************************
function createLongRangeScanner()
{
	console.log("Creating Long Range Scanner...");
	var canvas = document.createElement('canvas');
	canvas.id = "lrscanner";
	canvas.width = st.LRS_WIDTH;
	canvas.height = st.LRS_WIDTH;
	canvas.style.position = "absolute";
	canvas.style.left = "324px";
	canvas.style.top = "100px";
	canvas.style.opacity = 0.7;
	ctx = canvas.getContext('2d');
	ctx.font = "16px arial";

	document.body.appendChild(canvas)

	// Load Scanner Icons
	ship = new Image();
	ship.src = "./images/lrs_ship.png";

	return {
		active: true,
		shipImg: ship,
		canvas: canvas,
		ctx: ctx,
	}
}

//*********************************************************
function updateLongRangeScanner(lrscanner)
{	
	if (lrscanner.active == false) return;
	
	var ctx = lrscanner.ctx;
	ctx.fillStyle = "#006600";
	ctx.fillRect(0, 0, st.LRS_WIDTH, st.LRS_WIDTH);
	ctx.fillStyle = "#ddbb00";
	ctx.font = "16px arial";
	ctx.fillText("LONG RANGE SCAN", 10,20);
	ctx.font = "12px arial";
	ctx.strokeStyle = "#eeeeee";
	ctx.fillStyle = "#ffffff";
//	ctx.drawImage(flight.srScanner.gridImg, 0, 0, 160, 160, 10, 30, 160, 160);
	
	var scaler = (st.SYS_WIDTH / st.LRS_WIDTH);
	// Draw any objects floating around our current star system
	for (i = 0; i < st.curSystem.obj.length; i++)
	{
		var obj = st.curSystem.obj[i];
		if (obj.mesh)
		{
			var scaleX = (st.LRS_WIDTH / 2)+10 + (obj.mesh.position.x / scaler);
			var scaleY = (st.LRS_WIDTH / 2)+10 + (obj.mesh.position.z / scaler);
	
			if (obj === tShip)
				{ 
					ctx.drawImage(flight.srScanner.enemyImg, 0, 0, 10, 8, scaleX-7, scaleY-5, 15, 12) 
					ctx.beginPath();
					ctx.moveTo(scaleX-7, scaleY-7);	
					ctx.lineTo(scaleX-20, scaleY-20);	
					ctx.lineTo(scaleX-25, scaleY-20);	
					ctx.stroke();			
					ctx.fillText("Ship", scaleX-52, scaleY-17);
				}
			else 
			if (obj === tPlanet)
				{ 
					ctx.drawImage(flight.srScanner.planetImg, 0, 0, 16, 16, scaleX-7, scaleY-7, 16, 16);
					ctx.beginPath();
					ctx.moveTo(scaleX+7, scaleY-7);	
					ctx.lineTo(scaleX+20, scaleY-20);	
					ctx.lineTo(scaleX+25, scaleY-20);	
					ctx.stroke();			
					ctx.fillText("Earth", scaleX+28, scaleY-17);
				}
			else
			if (obj === tStarbase)
				{ 
					ctx.drawImage(flight.srScanner.starbaseImg, 0, 0, 10, 10, scaleX-7, scaleY-7, 16, 16) 
					ctx.beginPath();
					ctx.moveTo(scaleX+7, scaleY-7);	
					ctx.lineTo(scaleX+20, scaleY-20);	
					ctx.lineTo(scaleX+25, scaleY-20);	
					ctx.stroke();			
					ctx.fillText("Starbase 12", scaleX+28, scaleY-17);
				}
			else
				{ 	
					ctx.fillRect(scaleX-3,scaleY-3,6,6); 
				}
		}
	}

	var scaleX = (st.LRS_WIDTH / 2)+10 + (flight.camera.position.x / scaler);
	var scaleY = (st.LRS_WIDTH / 2)+10 + (flight.camera.position.z / scaler);

	ctx.drawImage(flight.lrScanner.shipImg, 0, 0, 16, 16, scaleX-7, scaleY-7, 16, 16);
	ctx.beginPath();
	ctx.moveTo(scaleX+7, scaleY+7);	
	ctx.lineTo(scaleX+20, scaleY+20);	
	ctx.lineTo(scaleX+25, scaleY+20);	
	ctx.stroke();			
	ctx.fillText("Firefly", scaleX+28, scaleY+24);
}

