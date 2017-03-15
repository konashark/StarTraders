var PLANETS = {};

(function() {

    var planets = [];

    var planetMaterials = [
        'earth_1024.jpg',
        'jupiter1k.jpg',
        'mars_475.jpg',
        'mars_1200.jpg',
        'marsmap1k.jpg',
        'mercurymap.jpg',
        'neptunemap.jpg',
        'saturnmap.jpg',
        'uranusmap.jpg',
        'venusmap.jpg',
        'planet_D1_1200.png',
        'planet_D2_1600.jpg',
        'planet_D3_1200.jpg',
        'planet_D4_1200.png',
        'planet_D5_1200.png',
        'planet_D6_1600.jpg',
        'planet_D7_1200.png',
        'planet_D8_1200.png',
        'planet_D9.png',
        'planet_G1_1200.png',
        'planet_I1_1600.jpg',
        'planet_I2_1200.png',
        'planet_I3_1200.png',
        'planet_I4_1600.jpg',
        'planet_M1_1200.png',
        'planet_M2_1200.png',
        'planet_M3_1200.png',
        'planet_M4_1200.png',
        'planet_M5_1200.png',
        'planet_M6_1200.png',
        'planet_M7_1200.png',
        'planet_M8.jpg',
        'planet_M9.jpg',
        'planet_M10.jpg',
        'planet_M11_1200.png',
        'planet_M12_1200.png',
        'planet_M13_1600.jpg',
        'planet_M14.png',
        'planet_M15.png'
    ];

    //*******************************************
    this.initialize = function () {
        planetNames.forEach(function(name) {
            var planet = {
                animFunc: updatePlanet,
                materialName: planetMaterials[Math.floor(Math.random() * planetMaterials.length)],
                material: null,
                mesh: null,
                size: randomRange(80, 255),
                rotY: 0,
                rotYv: 0.001 + Math.random() / 666,
                sector: { x: 0, y:0 },
                name: name,
                population: randomRange(1,9) * Math.pow(10, (randomRange(4, 9))),
                wealth: 0,
                economy: 0,
                aggression: 0,
                commodities: []
            };

            createPlanetAttributes(planet);

            planets.push(planet);
        });
    };

    //*******************************************
    this.getNumberOfPlanets = function () {
        return planets.length;
    };

    //*******************************************
    dumpPlanets = function () {
        console.log("PLANETS: ", planets);
        planets.forEach(function(planet, index) {
            console.log(index + ': ' + planet.name );
        });
    };

    //*******************************************
    this.getPlanet = function (index) {
        if (index == undefined || index > planets.length) {
            index = randomRange(0, planets.length - 1);
        }

        var planet = planets[index];

        if (!planet.material) {
            planet.material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('./images/planetmaps/' + planet.materialName) });
            planet.mesh = new THREE.Mesh(new THREE.SphereGeometry(planet.size, 32, 32), planet.material);
        }

        return planet;
    };


    //*******************************************
    var createPlanetAttributes = function (planet)
    {
        var i;

        // Give planet attributes
        planet.economy = randomRange(0,3);      // 0=ag 1=tech 2=industry 3=mining
        planet.wealth = randomRange(0,2);       // 0=poor 1=avg 2=rich
        planet.aggression = randomRange(0,2);   // 0=passive 1=avg 2=aggressive

        planet.commodities = {};
        Object.assign(planet.commodities, tCommodities);

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

            planet.commodities['Gems'].quantity  = 0;
            planet.commodities['Gems'].buyPrice = randomRange(80, 175);

            planet.commodities['Metals'].quantity  = 0;
            planet.commodities['Metals'].buyPrice = randomRange(150, 250);
        }

        if (planet.economy == ECONOMY.TECHNOLOGY){
            // Tech planets produce more computers, robots, medicine
            // Tech planets buy food, energy, textiles, machinery, luxury items
            // Stuff we mostly sell
            planet.commodities['Medicine'].quantity  = randomRange(30, 80);
            planet.commodities['Medicine'].sellPrice = randomRange(75, 125);
            planet.commodities['Medicine'].buyPrice  = Math.floor(planet.commodities['Medicine'].sellPrice *.5);

            planet.commodities['Computers'].quantity  = randomRange(25, 50);
            planet.commodities['Computers'].sellPrice = randomRange(110, 160);
            planet.commodities['Computers'].buyPrice  = Math.floor(planet.commodities['Computers'].sellPrice *.5);

            planet.commodities['Robots'].quantity  = randomRange(15, 40);
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

            planet.commodities['Gems'].quantity  = 0;
            planet.commodities['Gems'].buyPrice = randomRange(100, 250);

            planet.commodities['Metals'].quantity  = 0;
            planet.commodities['Metals'].buyPrice = randomRange(150, 275);
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

            planet.commodities['Gems'].quantity  = 0;
            planet.commodities['Gems'].buyPrice = randomRange(80, 175);

            planet.commodities['Metals'].quantity  = 0;
            planet.commodities['Metals'].buyPrice = randomRange(150, 250);
        }

        if (planet.economy == ECONOMY.MINING){
            // Mining planets produce more metals, gems, energy
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

            planet.commodities['Gems'].quantity  = randomRange(50, 500);
            planet.commodities['Gems'].sellPrice = randomRange(40, 125);
            planet.commodities['Gems'].buyPrice  = Math.floor(planet.commodities['Energy'].sellPrice *.5);

            planet.commodities['Metals'].quantity  = randomRange(50, 500);
            planet.commodities['Metals'].sellPrice = randomRange(40, 125);
            planet.commodities['Metals'].buyPrice  = Math.floor(planet.commodities['Energy'].sellPrice *.5);

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
            for( i = 0; i < planet.commodities.length; i++){
                planet.commodities[i].quantity = Math.floor(planet.commodities[i].quantity * .50);
                planet.commodities[i].buyPrice = Math.floor(planet.commodities[i].buyPrice * .65);
                planet.commodities[i].sellPrice = Math.floor(planet.commodities[i].sellPrice * .85);
            }
            planet.commodities['Luxuries'].quantity  = 0;
            planet.commodities['Luxuries'].buyPrice  = 0;
            planet.commodities['Contraband'].quantity  = planet.commodities['Contraband'].quantity * 2;
        }

        if (planet.wealth == WEALTH.RICH ){
            for( i = 0; i < planet.commodities.length; i++){
                planet.commodities[i].quantity = Math.floor(planet.commodities[i].quantity * 1.2);
                planet.commodities[i].buyPrice = Math.floor(planet.commodities[i].buyPrice * 1.2);
                planet.commodities[i].sellPrice = Math.floor(planet.commodities[i].sellPrice * 1.2);
            }
            planet.commodities['Luxuries'].quantity  = planet.commodities['Luxuries'].quantity * 2;
        }
    };

    //*******************************************
    var updatePlanet = function (obj)
    {
        if ((obj.rotY += obj.rotYv) >= st.TWOPI) {
            obj.rotY -= st.TWOPI;
        }
        obj.mesh.rotation.y = obj.rotY;
    };

    //*******************************************
    this.createMoon = function (planet)
    {
        // moon
        var moon = {};
        moon.size = randomRange(12, 32);
        moon.material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("./images/moonmaps/moon_512.jpg") });
        moon.mesh = new THREE.Mesh(new THREE.SphereGeometry(moon.size, 16, 16), moon.material);
        moon.planet = planet;
        moon.x = planet.mesh.position.x;
        moon.y = planet.mesh.position.y;
        moon.z = planet.mesh.position.z;
        moon.orbitDist = 400 + (Math.random() * 200);
        moon.orbitRad = Math.random() * st.TWOPI;
        moon.orbitVel = 0.001 + (Math.random() * 0.001);
        moon.animFunc = this.updateMoon;
        moon.rotY = 0;
        moon.rotYv = 0.005;

        return moon;
    };

    //*******************************************
    this.updateMoon = function (obj)
    {
        if ((obj.orbitRad += obj.orbitVel) >= st.TWOPI) {
            obj.orbitRad -= st.TWOPI;
        }
        obj.mesh.position.x = obj.x + Math.sin(obj.orbitRad) * obj.orbitDist;
        obj.mesh.position.z = obj.z + Math.cos(obj.orbitRad) * obj.orbitDist;

        obj.rotY += obj.rotYv;
        obj.mesh.rotation.y = obj.rotY;
    };

}).apply(PLANETS);



