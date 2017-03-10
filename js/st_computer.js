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

    //*******************************************
    this.create = function () {
        console.log("Creating Computer...");

        $('#screen').append(
            '<div id="computer" style="display: none">' +
            '   <div id="left" class="button"><</div>' +
            '   <div id="right" class="button">></div>' +
            '</div>'
        );

        elem = $('#computer')[0];

        canvas = document.createElement('canvas');
        canvas.id = 'computerCanvas';
        canvas.width = 480;
        canvas.height = 320;
        renderer = new THREE.WebGLRenderer({ canvas: canvas });
        renderer.setSize(480, 320);
        $(elem).append(canvas);

        $(elem).append(
            '<div id="computerOverlay">' +
            '   <p>' +
            '   <div>Name: Earth</div>' +
            '   <div>Class: M</div>' +
            '   <div>Economy: Technology</div>' +
            '   <div>Population: 10,000,000,000</div>' +
            '   <div>Wealth: Moderate</div>' +
            '   <div>Hostility: Low</div>' +
            '   <div id="computerZoom">' +
            '       <div id="computerZoomGauge"></div>' +
            '   </div>' +
            '</div>'
        );

        $('#computerZoomGauge').css('height', 241 - (~~(((targetZoom - 200) / 1000) * 240)));

        //var ctx = canvas.getContext('2d');
        //ctx.font = "12px arial";

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
            //    ctx: ctx
        };
    };

    //*******************************************
    this.update = function () {
        if ((planet.rotY += planet.rotYv) >= st.TWOPI) {
            planet.rotY -= st.TWOPI;
        }
        planet.mesh.rotation.y = planet.rotY;

        var tween = ((targetZoom - zoom) / 10);
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

        // planet.mesh.parent.remove(planet.mesh);
    }
}).apply(COMPUTER);
