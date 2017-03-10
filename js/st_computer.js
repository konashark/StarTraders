var COMPUTER = {};

(function() {

    this.active = false;
    var elem;
    var renderer;
    var ctx;
    var planet;
    var canvas;
    var camera;
    var scene;
    var zoom = 1200, targetZoom = 600;

    var planets = [
        {
            name:       'Earth',
            type:       'M',
            economy:    'Technology',
            population: '10,000,000,000',
            wealth:     'Moderate',
            hostility:  'Low',
            mesh:       './images/earth_flat_map_1024.jpg'
        },
        {
            name:       "Charlie's Expulsion",
            type:       'X',
            economy:    'Mining',
            population: '500',
            wealth:     'Low',
            hostility:  'Medium',
            mesh:       './images/extras/saturnmap.jpg'
        },
        {
            name:       "Copernicus",
            type:       'O',
            economy:    'Mining',
            population: '50,000',
            wealth:     'Medium',
            hostility:  'Medium',
            mesh:       './images/extras/freebitmaps.blogspot/planet_Miners_Moon_1600.jpg'
        },

    ];
    var currentPlanet = 0;

    //*******************************************
    this.create = function () {
        console.log("Creating Computer...");

        $('#screen').append(
            '<div id="computer" style="display: none">' +
            '   <div id="computerConsole">' +
            '       <div id="left" class="button"><</div>' +
            '       <div id="right" class="button">></div>' +
            '   </div>' +
            '</div>'
        );

        elem = $('#computer')[0];

        $('#computerConsole').on('click', '#left', onLeft);
        $('#computerConsole').on('click', '#right', onRight);

        canvas = document.createElement('canvas');
        canvas.id = 'computerCanvas';
        canvas.width = 480;
        canvas.height = 320;
        renderer = new THREE.WebGLRenderer({ canvas: canvas });
        renderer.setSize(480, 320);
        $(elem).append(canvas);

        $(elem).append(
            '<div id="computerOverlay">' +
            '   <div id="planetInfo">' +
            '       <div id="name" class="computerOutput" style="font-size: 24px">Earth</div>' +
            '       <p>' +
            '       <table id="planetStats">' +
            '           <tr><td>Class:</td> <td id="class" class="computerOutput">M</td></td></tr>' +
            '           <tr><td>Economy:</td> <td id="economy" class="computerOutput">Technology</td></td></tr>' +
            '           <tr><td>Population:</td> <td id="pop" class="computerOutput">10,000,000,000</td></td></tr>' +
            '           <tr><td>Wealth:</td> <td id="wealth" class="computerOutput">Moderate</td></td></tr>' +
            '           <tr><td>Hostility:</td> <td id="hostile" class="computerOutput">Low</td></td></tr>' +
            '       </table>' +
            '   </div>' +
            '   <div id="computerZoom">' +
            '       <div id="computerZoomGauge"></div>' +
            '   </div>' +
            '</div>'
        );

        $('#computerZoomGauge').css('height', 241 - (~~(((targetZoom - 200) / 1000) * 240)));

        // camera
        camera = new THREE.PerspectiveCamera(30, (3/2), 1, 2000);
        camera.position.z = zoom;

        // scene
        scene = new THREE.Scene();

        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);

        // add directional light source
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);

        planet = createPlanetModel(scene);
        setTimeout(function() { renderer.render(scene, camera); }, 0);

        return {
        };
    };

    //*******************************************
    this.update = function () {
        if ((planet.rotY += planet.rotYv) >= st.TWOPI) {
            planet.rotY -= st.TWOPI;
        }
        planet.mesh.rotation.y = planet.rotY;

        var tween = ((targetZoom - zoom) / 12);
        if (tween > -.5 && tween < .5) { tween = 0; }
        if (tween) {
            zoom += tween;
            camera.position.z = zoom;
        }

        renderer.render(scene, camera);

        return;
        ctx.fillStyle = "#111111";
        ctx.fillRect(0, 0, 480, 320);
        ctx.fillStyle = "#00BB00";

        return;
    };

    //*******************************************
    this.hide = function () {
        this.active = false;
        $('#computer').css('display', 'none');
        elem.removeEventListener('wheel', onMouseWheel);
    };

    //*******************************************
    this.show = function () {
        this.active = true;
        $('#computer').css('display', 'block');
        elem.addEventListener('wheel', onMouseWheel);
    };

    //*******************************************
    var onMouseWheel = function (event) {
        console.log("wheel");
        targetZoom += (event.deltaY / 2);
        if (targetZoom < 200) { targetZoom = 200; }
        if (targetZoom > 1200) { targetZoom = 1200; }

        $('#computerZoomGauge').css('height', 241 - (~~(((targetZoom - 200) / 1000) * 240)));
    };

    //*******************************************
    var onLeft = function (event) {
        console.log("left");
        if (--currentPlanet < 0) { currentPlanet = 2; }
        resetPlanet(currentPlanet);
    };



    //*******************************************
    var onRight = function (event) {
        console.log("right");
        if (++currentPlanet > 2) { currentPlanet = 0; }
        resetPlanet(currentPlanet);
    };

    //*******************************************
    var resetPlanet = function () {
        planet.mesh.parent.remove(planet.mesh);
        planet.material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture(planets[currentPlanet].mesh) });
        planet.mesh = new THREE.Mesh(new THREE.SphereGeometry(128, 32, 32), planet.material);
        scene.add(planet.mesh);

        $('#planetInfo').css('opacity', 0);
        setTimeout(function() {
            $('#computerOverlay #name').text(planets[currentPlanet].name);
            $('#planetStats #class').text(planets[currentPlanet].class);
            $('#planetStats #economy').text(planets[currentPlanet].economy);
            $('#planetStats #pop').text(planets[currentPlanet].population);
            $('#planetStats #wealth').text(planets[currentPlanet].wealth);
            $('#planetStats #hostile').text(planets[currentPlanet].hostility);
            $('#planetInfo').css('opacity', 1);
        }, 200);
    };

    //*******************************************
    function createPlanetModel(scene)
    {
        // planet
        var planet = JSON.parse(JSON.stringify( tPlanet ));
	    planet.material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("./images/earth_flat_map_1024.jpg") });
        //planet.material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("./images/extras/freebitmaps.blogspot/planet_Miners_Moon_1600.jpg") });
        //planet.material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("./images/extras/saturnmap.jpg") });
        planet.mesh = new THREE.Mesh(new THREE.SphereGeometry(128, 32, 32), planet.material);
        planet.rotYv = 0.001;
        scene.add(planet.mesh);

        return planet;
    }
}).apply(COMPUTER);
