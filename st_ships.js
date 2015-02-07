
//*********************************************************
function createDerelict(system)
{
	// ship
	var ship = tShip;
	ship.material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("./images/fighter.png"), side: THREE.DoubleSide, transparent: true });
    ship.mesh = new THREE.Mesh(new THREE.PlaneGeometry(64,48), ship.material);
	ship.mesh.position.x = -200;
	ship.mesh.position.y = 85;
	ship.mesh.position.z = 600;
//	var shipgyro = new THREE.Gyroscope();
//	shipgyro.position = flight.ship.position.clone();
//	flight.ship.add(shipgyro);
	system.obj.push(ship);
	flight.scene.add(ship.mesh);
}	

