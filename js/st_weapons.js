var WEAPONS = {};

(function() {

    //**********************************
    this.initializePulseWeapon = function ()
    {
        flight.pulseMaterial = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("./images/pulse.png"), transparent: true });
        for (i = 0; i < 10; i++)
        {
            var pulse = tPulse;
            pulse.mesh = new THREE.Mesh(new THREE.PlaneGeometry(64,64), flight.pulseMaterial);
            pulse.distance = 0;
            pulse.active = false;

            flight.pulses.pulse.push(pulse);
        }
    };

    //**********************************
    this.createPulse = function (originObj)
    {
        for (i = 0; i < 10; i++)
        {
            var pulse = flight.pulses.pulse[i];
            if (pulse.active == false)
            {
                pulse.active = true;
                pulse.distance = 0;
                pulse.mesh.position = originObj.position.clone();
                pulse.mesh.position.y -= 80;
                //pulse.mesh.rotation = ship.rotation.clone();
                var vec = quatToEuler(originObj.quaternion);
                pulse.mesh.rotation.x = vec.x;
                pulse.mesh.rotation.y = vec.y;
                pulse.mesh.rotation.z = vec.z;
                pulse.mesh.translateZ(20);
                //pulse.mesh.translateY(80);
                flight.scene.add(pulse.mesh);
                flight.numPulses++;
            }
        }
    };

    //**********************************
    var updatePulse = function ()
    {
        for (i = 0; i < 10; i++)
        {
            var pulse = flight.pulses.pulse[i];
            if (pulse.active)
            {
                if (++pulse.distance < 100)
                {
                    pulse.mesh.translateZ(-10);
                    pulse.mesh.position.y += 1;
                    pulse.mesh.rotation.z = Math.random();
                }
                else
                {
                    EXPLOSION.createExplosion( pulse.mesh.position.x, pulse.mesh.position.y, pulse.mesh.position.z);
                    flight.scene.remove(pulse.mesh);
                    pulse.active = false;
                }
            }
        }
    }

    //**********************************
    this.updatePulseWeapon = function ()
    {
        if (st.controls.mouseLeftBtnState || st.controls.keyState[0])
        {
            if((flight.pulses.throttle % 10) == 0)
            {
                this.createPulse(flight.camera);
            }
            flight.pulses.throttle = (++flight.pulses.throttle) % 120;
        }
        else {flight.pulses.throttle = 0;}

        updatePulse();
    }

}).apply(WEAPONS);
