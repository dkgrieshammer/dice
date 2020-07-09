import * as CANNON from 'cannon';
import * as THREE from 'three';
import {
    DiceManager,
    DiceD10,
    DiceD6,
} from 'threejs-dice';
window.OrbitControls = require('three-orbit-controls')(THREE)

// standard global variables
var container, scene, camera, renderer, controls, stats, world, dice;

init();

function init() {
    // SCENE
    scene = new THREE.Scene();
    // CAMERA
    let width = window.innerWidth / 2;
    var SCREEN_WIDTH = width,
        SCREEN_HEIGHT = width;
    var VIEW_ANGLE = 30,
        ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
        NEAR = 0.01,
        FAR = 20000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 90, 30);
    // RENDERER
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container = document.getElementById('ThreeJS');
    container.appendChild(renderer.domElement);
    // EVENTS
    // CONTROLS
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    // STATS
    // stats = new Stats();
    // stats.domElement.style.position = 'absolute';
    // stats.domElement.style.bottom = '0px';
    // stats.domElement.style.zIndex = 100;
    // container.appendChild(stats.domElement);

    let ambient = new THREE.AmbientLight('#ffffff', 0.3);
    scene.add(ambient);

    let directionalLight = new THREE.DirectionalLight('#ffffff', 0.5);
    directionalLight.position.x = -1000;
    directionalLight.position.y = 1000;
    directionalLight.position.z = 1000;
    scene.add(directionalLight);

    let light = new THREE.SpotLight(0xefdfd5, 1.3);
    light.position.y = 100;
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.camera.near = 50;
    light.shadow.camera.far = 110;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);


    // FLOOR
    // var floorMaterial = new THREE.MeshPhongMaterial({
    //     color: '#000',
    //     side: THREE.BackSide
    // });
    // var floorGeometry = new THREE.PlaneGeometry(30, 30, 10, 10);
    // var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    // floor.receiveShadow = false;
    // floor.rotation.x = Math.PI / 2;
    // scene.add(floor);

    scene.fog = new THREE.FogExp2(0x9999ff, 0);

    ////////////
    // CUSTOM //
    ////////////
    world = new CANNON.World();

    world.gravity.set(0, -9.82 * 20, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 16;

    DiceManager.setWorld(world);

    //Floor
    let floorBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Plane(),
        material: DiceManager.floorBodyMaterial
    });
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.add(floorBody);

    //Walls


    dice = new DiceD10({
        size: 4.5,
        backColor: '#ffff'
    });
    scene.add(dice.getObject());

    function randomDiceThrow() {
            let yRand = Math.random() * 20
            let i = 0;
            dice.getObject().position.x = -15 - (i % 3) * dice.size;
            dice.getObject().position.y = 2 + Math.floor(i / 3) * dice.size;
            dice.getObject().position.z = -15 + (i % 3) * dice.size;
            dice.getObject().quaternion.x = (Math.random() * 90 - 45) * Math.PI / 180;
            dice.getObject().quaternion.z = (Math.random() * 90 - 45) * Math.PI / 180;
            dice.updateBodyFromMesh();
            let rand = Math.random() * 5;
            dice.getObject().body.velocity.set(25 + rand, 40 + yRand, 15 + rand);
            dice.getObject().body.angularVelocity.set(20 * Math.random() - 10, 20 * Math.random() - 10, 20 *
                Math.random() - 10);

            let diceValues = {
                dice: dice,
                value: i + 1
            };

        DiceManager.prepareValues(diceValues);
    }

    
    randomDiceThrow();

    container.addEventListener('click',()=>{
        randomDiceThrow();
    });

    requestAnimationFrame(animate);
}

function animate() {
    updatePhysics();
    render();
    update();

    requestAnimationFrame(animate);

}

function updatePhysics() {
    world.step(1.0 / 60.0);
    dice.updateMeshFromBody();
}

function update() {

    controls.update();
    // stats.update();
}

function render() {
    renderer.render(scene, camera);
}