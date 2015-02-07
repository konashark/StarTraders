window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 60);
    };
})();

var clock = new THREE.Clock();
var three = {};
three.WIDTH = 1024;
three.HEIGHT = 600;

var planet_yr = 0;
var TWOPI = Math.PI*2;

function animate(){
    // request new frame
    requestAnimFrame(function(){
        animate();
    });

   three.renderer.render(three.scene, three.camera);
}

window.onload = function(){

if (1) { // Does NOT show sprite
	console.log("Creating WebGL renderer from canvas...");
    var canvas = document.createElement('canvas');
    canvas.width = three.WIDTH;
    canvas.height = three.HEIGHT;
    renderer = new THREE.WebGLRenderer({canvas:canvas});
    renderer.setSize(three.WIDTH, three.HEIGHT);
}
else { // DOES show sprite
	console.log("Using default renderer canvas...");
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(three.WIDTH, three.HEIGHT);
}
    document.body.appendChild(renderer.domElement);
    three.renderer = renderer;
    
    // camera
    three.camera = camera = new THREE.PerspectiveCamera(45, three.WIDTH/three.HEIGHT, 1, 200000);
    camera.position.z = 1000;
    
    // scene
    three.scene = scene = new THREE.Scene();

      var mapA = THREE.ImageUtils.loadTexture( "./images/fighter.png", undefined, function() { 
        var scaleX = mapA.image.width;
        var scaleY = mapA.image.height;

        sprite = new THREE.Sprite( { map: mapA, alignment: THREE.SpriteAlignment.topLeft } );
        sprite.position.set( 50, 50, 3 );
        sprite.scale.set( scaleX, scaleY, 1 );
        sprite.opacity = 1;
        scene.add( sprite );
    } );
                
    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x666666);
    scene.add(ambientLight);

    // add directional light source
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // wait for texture image to load before
    var textureImg = new Image();
    textureImg.onload = function(){        
         animate(); // Kick off first animation frame
    };
    textureImg.src = "./images/fighter.png";
}
