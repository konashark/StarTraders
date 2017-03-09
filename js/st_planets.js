//*********************************************************
function createPlanet(system)
{
    var planet = tPlanet;
    createPlanetModels(planet);
    createPlanetAttributes(planet);

    system.obj.push(planet);
    flight.scene.add(planet.mesh);
    return planet;
}

//*********************************************************
function createPlanetModels(planet)
{
	// planet
//	planet.material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("./images/earth_flat_map_1024.jpg") });
    planet.material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("./images/extras/freebitmaps.blogspot/planet_Miners_Moon_1600.jpg") });
    //planet.material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("./images/extras/saturnmap.jpg") });
    planet.mesh = new THREE.Mesh(new THREE.SphereGeometry(128, 32, 32), planet.material);
	planet.rotYv = 0.001;
	planet.animFunc = updatePlanet;
}

//*********************************************************
function createPlanetAttributes(planet)
{
    var numPlanets = planetNames.length;
    var planetIdx = randomRange(0, numPlanets);
    while (planetCreated[planetIdx]) {
        planetIdx = randomRange(0, numPlanets);
    }
    planet.name = planetNames[planetIdx];
    planetCreated[planetIdx] = true;

    // Give planet attributes
    planet.economy = randomRange(0,2);      // 0=ag, 1=tech 2=industry
    planet.wealth = randomRange(0,2);       // 0=poor, 1=avg, 2=rich
    planet.aggression = randomRange(0,2);   // 0=passive, 1=avg, 2=aggressive

    planet.commodities = tCommodities;

    if (planet.economy == ECONOMY.AGRICULTURE){
        // Ag planets produce more food, textiles, livestock, energy
        // Ag planets buy machinery, medicine, robots, computers
        // Stuff we mostly sell
        planet.commodities['Food'].quantity  = randomRange(100, 500);
        planet.commodities['Food'].sellPrice = randomRange(6, 12);
        planet.commodities['Food'].buyPrice  = Math.floor(planet.commodities['Food'].sellPrice *.5);

        planet.commodities['Textiles'].quantity  = randomRange(25, 150);
        planet.commodities['Textiles'].sellPrice = randomRange(12, 20);
        planet.commodities['Textiles'].buyPrice  = Math.floor(planet.commodities['Textiles'].sellPrice *.5);

        planet.commodities['Livestock'].quantity  = randomRange(20, 50);
        planet.commodities['Livestock'].sellPrice = randomRange(200, 350);
        planet.commodities['Livestock'].buyPrice  = Math.floor(planet.commodities['Livestock'].sellPrice *.5);

        planet.commodities['Energy'].quantity  = randomRange(25, 75);
        planet.commodities['Energy'].sellPrice = randomRange(50, 95);
        planet.commodities['Energy'].buyPrice  = Math.floor(planet.commodities['Energy'].sellPrice *.5);

        // Stuff we mostly buy
        planet.commodities['Machinery'].quantity  = 0;
        planet.commodities['Machinery'].buyPrice  = randomRange(60, 90);

        planet.commodities['Luxuries'].quantity  = 0;
        planet.commodities['Luxuries'].buyPrice  = randomRange(75, 100);

        planet.commodities['Medicine'].quantity  = 0;
        planet.commodities['Medicine'].buyPrice  = randomRange(95, 150);

        planet.commodities['Computers'].quantity  = 0;
        planet.commodities['Computers'].buyPrice  = randomRange(160, 250);

        planet.commodities['Robots'].quantity  = 0;
        planet.commodities['Robots'].buyPrice  = randomRange(600, 825);
    }

    if (planet.economy == ECONOMY.TECHNOLOGY){
        // Tech planets produce more computers, robots, medicine
        // Tech planets buy food, energy, textiles, machinery, luxury items
        // Stuff we mostly sell
        planet.commodities['Medicine'].quantity  = randomRange(30, 80)
        planet.commodities['Medicine'].sellPrice = randomRange(75, 125);
        planet.commodities['Medicine'].buyPrice  = Math.floor(planet.commodities['Medicine'].sellPrice *.5);

        planet.commodities['Computers'].quantity  = randomRange(25, 50)
        planet.commodities['Computers'].sellPrice = randomRange(110, 160);
        planet.commodities['Computers'].buyPrice  = Math.floor(planet.commodities['Computers'].sellPrice *.5);

        planet.commodities['Robots'].quantity  = randomRange(15, 40)
        planet.commodities['Robots'].sellPrice = randomRange(450, 650);
        planet.commodities['Robots'].buyPrice  = Math.floor(planet.commodities['Robots'].sellPrice *.5);

        // Stuff we mostly buy
        planet.commodities['Food'].quantity  = 0;
        planet.commodities['Food'].buyPrice  = randomRange(12, 18);

        planet.commodities['Textiles'].quantity  = 0;
        planet.commodities['Textiles'].buyPrice  = randomRange(20, 32);

        planet.commodities['Livestock'].quantity  = 0;
        planet.commodities['Livestock'].buyPrice  = randomRange(275, 425);

        planet.commodities['Energy'].quantity  = 0;
        planet.commodities['Energy'].buyPrice  = randomRange(80, 125);

        planet.commodities['Machinery'].quantity  = 0;
        planet.commodities['Machinery'].buyPrice  = randomRange(75, 110);

        planet.commodities['Luxuries'].quantity  = 0;
        planet.commodities['Luxuries'].buyPrice  = randomRange(100, 150);
    }

    if (planet.economy == ECONOMY.INDUSTRY){
        // Industrial planets produce more machinery, energy, luxury items
        // Industrial planets buy food, medicine, robots, textiles, computers
        // Stuff we mostly sell
        planet.commodities['Energy'].quantity  = 0;
        planet.commodities['Energy'].sellPrice  = randomRange(60, 90);
        planet.commodities['Energy'].buyPrice  = Math.floor(planet.commodities['Energy'].sellPrice *.5);

        planet.commodities['Machinery'].quantity  = 0;
        planet.commodities['Machinery'].sellPrice  = randomRange(50, 85);
        planet.commodities['Machinery'].buyPrice  = Math.floor(planet.commodities['Machinery'].sellPrice *.5);

        planet.commodities['Luxuries'].quantity  = 0;
        planet.commodities['Luxuries'].sellPrice  = randomRange(70, 110);
        planet.commodities['Luxuries'].buyPrice  = Math.floor(planet.commodities['Luxuries'].sellPrice *.5);

        // Stuff we mostly buy
        planet.commodities['Food'].quantity  = 0;
        planet.commodities['Food'].buyPrice  = randomRange(10, 18);

        planet.commodities['Textiles'].quantity  = 0;
        planet.commodities['Textiles'].buyPrice  = randomRange(17, 28);

        planet.commodities['Livestock'].quantity  = 0;
        planet.commodities['Livestock'].buyPrice  = randomRange(260, 400);

        planet.commodities['Medicine'].quantity  = 0;
        planet.commodities['Medicine'].buyPrice  = randomRange(105, 160);

        planet.commodities['Computers'].quantity  = 0;
        planet.commodities['Computers'].buyPrice  = randomRange(90, 200);

        planet.commodities['Robots'].quantity  = 0;
        planet.commodities['Robots'].buyPrice  = randomRange(600, 900);
    }

    // Illegal commodities

    if (planet.aggression == AGGRESSION.NORMAL){
        planet.commodities['Weapons'].quantity  = randomRange(0, 5);
        planet.commodities['Weapons'].sellPrice = randomRange(500, 750);
        planet.commodities['Weapons'].buyPrice  = Math.floor(planet.commodities['Weapons'].sellPrice *.9);

        planet.commodities['Contraband'].quantity  = randomRange(0, 10);
        planet.commodities['Contraband'].sellPrice = randomRange(250, 400);
        planet.commodities['Contraband'].buyPrice  = Math.floor(planet.commodities['Contraband'].sellPrice *.9);

        planet.commodities['Classified Data'].quantity  = randomRange(0, 5);
        planet.commodities['Classified Data'].sellPrice = randomRange(950, 1400);
        planet.commodities['Classified Data'].buyPrice  = Math.floor(planet.commodities['Classified Data'].sellPrice *.9);
    }

    if (planet.aggression == AGGRESSION.AGGRESSIVE){
        planet.commodities['Weapons'].quantity  = randomRange(15, 40);
        planet.commodities['Weapons'].sellPrice = randomRange(350, 600);
        planet.commodities['Weapons'].buyPrice  = Math.floor(planet.commodities['Weapons'].sellPrice *.9);

        planet.commodities['Contraband'].quantity  = randomRange(25, 65);
        planet.commodities['Contraband'].sellPrice = randomRange(190, 300);
        planet.commodities['Contraband'].buyPrice  = Math.floor(planet.commodities['Contraband'].sellPrice *.9);

        planet.commodities['Classified Data'].quantity  = randomRange(5, 10);
        planet.commodities['Classified Data'].sellPrice = randomRange(750, 1100);
        planet.commodities['Classified Data'].buyPrice  = Math.floor(planet.commodities['Classified Data'].sellPrice *.9);
    }

    if (planet.wealth == WEALTH.POOR ){
        for(var i = 0; i < planet.commodities.length; i++){
            planet.commodities[i].quantity = Math.floor(planet.commodities[i].quantity * .50);
            planet.commodities[i].buyPrice = Math.floor(planet.commodities[i].buyPrice * .65);
            planet.commodities[i].sellPrice = Math.floor(planet.commodities[i].sellPrice * .85);
        }
        planet.commodities['Luxuries'].quantity  = 0;
        planet.commodities['Luxuries'].buyPrice  = 0;
        planet.commodities['Contraband'].quantity  = planet.commodities['Contraband'].quantity * 2;
    }

    if (planet.wealth == WEALTH.RICH ){
        for(var i = 0; i < planet.commodities.length; i++){
            planet.commodities[i].quantity = Math.floor(planet.commodities[i].quantity * 1.2);
            planet.commodities[i].buyPrice = Math.floor(planet.commodities[i].buyPrice * 1.2);
            planet.commodities[i].sellPrice = Math.floor(planet.commodities[i].sellPrice * 1.2);
        }
        planet.commodities['Luxuries'].quantity  = planet.commodities['Luxuries'].quantity * 2;
    }
}

//*********************************************************
function updatePlanet(obj)
{
	if ((obj.rotY += obj.rotYv) >= st.TWOPI) { 
		obj.rotY -= st.TWOPI; 
	}
	obj.mesh.rotation.y = obj.rotY;	
}

//*********************************************************
function createMoon(system, planet)
{
	// moon
	var moon = tMoon;
	moon.material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("./images/moon_512.jpg") });
    moon.mesh = new THREE.Mesh(new THREE.SphereGeometry(32, 16, 16), moon.material);
	moon.planet = planet;
	moon.x = planet.mesh.position.x;
	moon.y = planet.mesh.position.y;
	moon.z = planet.mesh.position.z;
	moon.orbitDist = 400 + (Math.random() * 200);
	moon.orbitRad = Math.random() * st.TWOPI;
	moon.orbitVel = 0.001 + (Math.random() * 0.001);
	moon.animFunc = updateMoon;
	system.obj.push(moon);
	flight.scene.add(moon.mesh);
}

//*********************************************************
function updateMoon(obj)
{
	if ((obj.orbitRad += obj.orbitVel) >= st.TWOPI) { 
		obj.orbitRad -= st.TWOPI; 
	}
	obj.mesh.position.x = obj.x + Math.sin(obj.orbitRad) * obj.orbitDist;
	obj.mesh.position.z = obj.z + Math.cos(obj.orbitRad) * obj.orbitDist;
}




