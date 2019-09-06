var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 10;
camera.position.x = 0;
camera.position.y = 10;
camera.lookAt(new THREE.Vector3(0, 0, 0));

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
keyLight.position.set(-100, 0, 100);

var fillLight = new THREE.DirectionalLight(0xffffff, 0.75);
fillLight.position.set(100, 0, 100);

var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);

var objLoader = new THREE.OBJLoader();
objLoader.setPath('./assets/models/');
objLoader.load('915540c9c81ddc63a5901d93c937a07e.obj', function (object) {
    scene.add(object);
});


// Render loop
var animate = function () {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render(scene, camera);
};

animate();
