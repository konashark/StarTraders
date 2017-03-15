var EXPLOSION = {};

(function() {

    var stExplosion = {
        meshArray: [],
        NUM_PARTICLES: 100,
        EXPL_LOOPS: 66,
        explosionCounter: 0
    };

    //**********************************
    this.createExplosion = function (x,y,z) {
        if (stExplosion.explosionCounter)	// already exploding
            return;

        var geometry, material, mesh;

        for (i = 0; i < stExplosion.NUM_PARTICLES; i++) {
            geometry = new THREE.Geometry();
            geometry.vertices.push( new THREE.Vector3(-1 - (Math.random()*10), 1 + (Math.random()*6), 0) );
            geometry.vertices.push( new THREE.Vector3(1 + (Math.random()*5), 1 + (Math.random()*6), 0) );
            geometry.vertices.push( new THREE.Vector3(1 + (Math.random()*10), -1 - (Math.random()*6), 0) );
            geometry.vertices.push( new THREE.Vector3(-1 - (Math.random()*5), -1 - (Math.random()*6), 0) );

            geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

            var color;	// shades of gray and red
            if (Math.random() > .5)
                color =  0x111111 + ~~(Math.random() * 14)*0x111111;
            else
                color =  ~~(Math.random() * 12)*0x110500;

            material = new THREE.MeshBasicMaterial( { color: color, wireframe: false, side: THREE.DoubleSide, transparent: true } );
            mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = x + Math.random()*10 - 5;
            mesh.position.y = y + Math.random()*10 - 5;
            mesh.position.z = z + Math.random()*10 - 5;
            mesh.rotation.x = Math.random()*6.25;
            mesh.rotation.y = Math.random()*6.25;
            mesh.rotation.z = Math.random()*6.25;
            mesh.speed = Math.random()+5;
            flight.scene.add( mesh );
            stExplosion.meshArray[i] = mesh;
        }

        stExplosion.explosionCounter = stExplosion.EXPL_LOOPS;
    };

    //**********************************
    this.updateExplosion = function () {
        if (stExplosion.explosionCounter) {
            for (i = 0; i < stExplosion.NUM_PARTICLES; i++) {
                stExplosion.meshArray[i].rotation.z += 0.05;
                stExplosion.meshArray[i].translateZ(stExplosion.meshArray[i].speed);
                stExplosion.meshArray[i].material.opacity = .1 + (stExplosion.explosionCounter / stExplosion.EXPL_LOOPS);
            }

            if (--stExplosion.explosionCounter == 0) {
                for (i = 0; i < stExplosion.NUM_PARTICLES; i++) { scene.remove(stExplosion.meshArray[i]); }
                stExplosion.meshArray = [];
            }
        }
    }

}).apply(EXPLOSION);
