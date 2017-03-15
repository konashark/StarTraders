var COMPUTER = {};

(function() {

    this.active = false;
    var elem;
    var renderer;
    var ctx;
    var planet;
    var planetMaterial;
    var planetMesh;

    var canvas;
    var camera;
    var scene;
    var zoom = 1200, targetZoom = 800;

    var currentPlanet = 0;

    //*******************************************
    this.create = function () {
        console.log("Creating Computer...");

        $('#screen').append(
            '<div id="computer" style="display: none">' +
            '   <div id="computerConsole">' +
            '       <img id="computerLeft" class="conNavButton" src="./images/left.png">' +
            '       <img id="computerRight" class="conNavButton" src="./images/right.png">' +
            '   </div>' +
            '</div>'
        );

        elem = $('#computer')[0];

        $('#computerConsole').on('click', '#computerLeft', onLeft);
        $('#computerConsole').on('click', '#computerRight', onRight);

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

        $('#computerZoomGauge').css('height', 241 - (~~(((targetZoom - 300) / 1000) * 240)));

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

        return {
        };
    };

    //*******************************************
    this.update = function () {
        if ((planet.rotY += planet.rotYv) >= st.TWOPI) {
            planet.rotY -= st.TWOPI;
        }
        planetMesh.rotation.y = planet.rotY;

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
        $('#computer').css('opacity', 0);
        setTimeout(function() { $('#computer').css('display', 'none'); }, 250);

        elem.removeEventListener('wheel', onMouseWheel);
    };

    //*******************************************
    this.show = function () {
        this.active = true;

        zoom = 1200;
        targetZoom = 800;

        $('#computer').css('display', 'block');

        displayPlanet(currentPlanet);
        setTimeout(function() { renderer.render(scene, camera); }, 0);

        setTimeout(function() { $('#computer').css('opacity', 1); }, 50);
        elem.addEventListener('wheel', onMouseWheel);
    };

    //*******************************************
    var onMouseWheel = function (event) {
        console.log("wheel");
        targetZoom += (event.deltaY / 2);
        if (targetZoom < 300) { targetZoom = 300; }
        if (targetZoom > 1300) { targetZoom = 1300; }

        $('#computerZoomGauge').css('height', 241 - (~~(((targetZoom - 300) / 1000) * 240)));
    };

    //*******************************************
    var onLeft = function (event) {
        console.log("left");
        if (--currentPlanet < 0) { currentPlanet = PLANETS.getNumberOfPlanets() - 1; }
        displayPlanet(currentPlanet);
    };

    //*******************************************
    var onRight = function (event) {
        console.log("right");
        if (++currentPlanet >= PLANETS.getNumberOfPlanets()) { currentPlanet = 0; }
        displayPlanet(currentPlanet);
    };

    //*******************************************
    var displayPlanet = function (currentPlanet) {
        if (planetMesh && planetMesh.parent) {
            planetMesh.parent.remove(planetMesh);
        }
        planet = PLANETS.getPlanet(currentPlanet);
        planetMaterial = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('./images/planetmaps/' + planet.materialName) });
        planetMesh = new THREE.Mesh(new THREE.SphereGeometry(planet.size, 32, 32), planetMaterial);
        scene.add(planetMesh);

        $('#planetInfo').css('opacity', 0);
        setTimeout(function() {
            $('#computerOverlay #name').text(planet.name);
            $('#planetStats #economy').text(planet.economy);
            $('#planetStats #pop').text(planet.population);
            $('#planetStats #wealth').text(planet.wealth);
            $('#planetStats #hostile').text(planet.aggression);
            $('#planetInfo').css('opacity', 1);
        }, 200);
    };
}).apply(COMPUTER);
