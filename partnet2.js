var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
camera.position.x = 0;
camera.position.y = 5;
camera.lookAt(new THREE.Vector3(0, 0, 0));

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.setClearColor(0x333333, 1);
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
keyLight.position.set(-100, 0, 100);

var fillLight = new THREE.DirectionalLight(0xffffff, 0.75);
fillLight.position.set(100, 0, 100);

var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

// Lights

const lights = [];
lights[0] = new THREE.PointLight(0xffffff, 1, 0);
lights[1] = new THREE.PointLight(0xffffff, 1, 0);
lights[2] = new THREE.PointLight(0xffffff, 1, 0);

lights[0].position.set(0, 2000, 0);
lights[1].position.set(1000, 2000, 1000);
lights[2].position.set(-1000, -2000, -1000);

scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

// scene.add(keyLight);
// scene.add(fillLight);
// scene.add(backLight);
let mesh;
let sprite;

let spriteBehindObject;
const annotation = document.querySelector(".annotation");

var index = 0;
var files = ['new-0.obj','new-1.obj', 'new-2.obj','new-3.obj', 'new-4.obj','new-6.obj', 'new-7.obj'];

var objLoader = new THREE.OBJLoader();
objLoader.setPath('./assets/models/partnet/182/objs/');

function loadNextFile() {
    if (index > files.length - 1) return;
    objLoader.load(files[index], function(object) {
        scene.add(object);
        index++;
        loadNextFile();
        if (index == files.length - 1) {
            mesh = object.children[0];
            animate();
        }
    });
}
loadNextFile();



// Number

const canvas = document.getElementById("number");
const ctx = canvas.getContext("2d");
const x = 32;
const y = 32;
const radius = 30;
const startAngle = 0;
const endAngle = Math.PI * 2;

ctx.fillStyle = "rgb(0, 0, 0)";
ctx.beginPath();
ctx.arc(x, y, radius, startAngle, endAngle);
ctx.fill();

ctx.strokeStyle = "rgb(255, 255, 255)";
ctx.lineWidth = 3;
ctx.beginPath();
ctx.arc(x, y, radius, startAngle, endAngle);
ctx.stroke();

ctx.fillStyle = "rgb(255, 255, 255)";
ctx.font = "32px sans-serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("1", x, y);

// Sprite

const numberTexture = new THREE.CanvasTexture(
    document.querySelector("#number")
);

const spriteMaterial = new THREE.SpriteMaterial({
    map: numberTexture,
    alphaTest: 0.5,
    transparent: true,
    depthTest: false,
    depthWrite: false
});

sprite = new THREE.Sprite(spriteMaterial);
sprite.position.set(0, 1, 0);
sprite.scale.set(60, 60, 1);

scene.add(sprite);

function updateAnnotationOpacity() {
    const meshDistance = camera.position.distanceTo(mesh.position);
    const spriteDistance = camera.position.distanceTo(sprite.position);
    spriteBehindObject = spriteDistance > meshDistance;
    sprite.material.opacity = spriteBehindObject ? 0.25 : 1;

    // Do you want a number that changes size according to its position?
    // Comment out the following line and the `::before` pseudo-element.
    sprite.material.opacity = 0;
}



function updateScreenPosition() {
    const vector = new THREE.Vector3(0.3, 0.7, 0);
    const canvas = renderer.domElement;

    vector.project(camera);

    vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
    vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));

    annotation.style.top = `${vector.y}px`;
    annotation.style.left = `${vector.x}px`;
    annotation.style.opacity = spriteBehindObject ? 0.25 : 1;
}



// Render loop
var animate = function () {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render(scene, camera);
    updateAnnotationOpacity();
    updateScreenPosition();
};
