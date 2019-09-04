function init() {
	var scene = new THREE.Scene();
	var gui = new dat.GUI();

	// load the environment map
	var path = './assets/cubemap/';
	var format = '.jpg';
	var fileNames = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];

	var ambientLight = getAmbientLight(10);
	var directionalLight = getDirectionalLight();
	directionalLight.position.x = 26;
	directionalLight.position.y = 20;
	directionalLight.position.z = 20;

	var plane = getPlane(20);
	plane.rotation.x = Math.PI/2;


	/*
	var reflectionCube = new THREE.CubeTextureLoader().load(fileNames.map(function(fileName) {
		return path + fileName + format;
	}));
	*/
	// scene.background = reflectionCube;
	scene.add(plane);
	scene.add(directionalLight);



	// camera
	var camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
	);
	camera.position.z = 10;
	camera.position.x = 5;
	camera.position.y = 5;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	// load external geometry
	var loader = new THREE.OBJLoader();
	var textureLoader = new THREE.TextureLoader();

	// loader.load('./assets/models/head/lee-perry-smith-head-scan.obj', function (object) {
	loader.load('./assets/models/915540c9c81ddc63a5901d93c937a07e.obj', function (object) {
		var colorMap = textureLoader.load('./assets/models/head/Face_Color.jpg');
		var bumpMap = textureLoader.load('./assets/models/head/Face_Disp.jpg');
		var faceMaterial = getMaterial('standard', 'rgb(255, 255, 255)');

		object.traverse(function(child) {
			if (child.name == 'Plane') {
				child.visible = false;
			}
			if (child.name == 'Infinite') {
				child.material = faceMaterial;
				faceMaterial.roughness = 0.875;
				faceMaterial.map = colorMap;
				faceMaterial.bumpMap = bumpMap;
				faceMaterial.roughnessMap = bumpMap;
				faceMaterial.metalness = 0;
				faceMaterial.bumpScale = 0.175;
			}
		} );

		object.position.z = 0;
		object.position.y = 2;
		scene.add(object);
		var helper = new THREE.FaceNormalsHelper( object, 20, 0x008000, 10 );
		scene.add(helper);

	});

	// renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;

	var controls = new THREE.OrbitControls( camera, renderer.domElement );

	document.getElementById('webgl').appendChild(renderer.domElement);

	update(renderer, scene, camera, controls);

	return scene;
}

function getMaterial(type, color) {
	var selectedMaterial;
	var materialOptions = {
		color: color === undefined ? 'rgb(255, 255, 255)' : color,
	};

	switch (type) {
		case 'basic':
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
		case 'lambert':
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		case 'phong':
			selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
			break;
		case 'standard':
			selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
			break;
		default:
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
	}

	return selectedMaterial;
}

function getSpotLight(intensity, color) {
	color = color === undefined ? 'rgb(255, 255, 255)' : color;
	var light = new THREE.SpotLight(color, intensity);
	light.castShadow = true;
	light.penumbra = 0.5;

	//Set up shadow properties for the light
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	light.shadow.bias = 0.001;

	return light;
}

function getAmbientLight(intensity) {
	var light = new THREE.AmbientLight('rgb(10, 30, 50)', intensity);
	return light;
}

function update(renderer, scene, camera, controls) {
	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls);
	});
}

function getDirectionalLight(intensity) {
	var light = new THREE.DirectionalLight(0xffffff, intensity);
	light.castShadow = true;

	light.shadow.camera.left = -10;
	light.shadow.camera.bottom = -10;
	light.shadow.camera.right = 10;
	light.shadow.camera.top = 10;

	return light;
}

function getPlane(size) {
	var geometry = new THREE.PlaneGeometry(size, size);
	var material = new THREE.MeshPhongMaterial({
		color: 'rgb(120, 120, 120)',
		side: THREE.DoubleSide
	});
	var obj = new THREE.Mesh(geometry, material);
	obj.receiveShadow = true;

	return obj;
}

var scene = init();
