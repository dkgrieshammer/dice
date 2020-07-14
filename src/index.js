import * as CANNON from 'cannon';
import * as THREE from 'three';
import {
    DiceManager
} from 'threejs-dice';
import OwnersForumDice from "./OwnersForumDice.js"
import RandomDice from './RandomDice.js';
import Wall from './wall'
window.OrbitControls = require('three-orbit-controls')(THREE)


window.rollingDice = function(elementId, radioFieldName) {
    // standard global variables
    var container, scene, camera, renderer, controls, world, dice, dice10;
    init();

    function init() {
        // SCENE
        scene = new THREE.Scene();
        
        // for debugging purposes
        window.scene = scene
        window.THREE = THREE

        // CAMERA
        let width = 300;
        var SCREEN_WIDTH = 500,
            SCREEN_HEIGHT = 300;
        var VIEW_ANGLE = 30,
            ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
            NEAR = 0.01,
            FAR = 20000;
        scene.background = new THREE.Color('white');
        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        scene.add(camera);
        camera.position.set(0, 90, 100); // Here u set Cam Pos with x y z
        // RENDERER
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        container = document.getElementById(elementId);
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
        //     color: '#fff',
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
        const wall = new Wall(scene, world, DiceManager.floorBodyMaterial)
        wall.setSize(1,10,80)
        
        const rotateY = (obj, angle) => {
            obj.quaternion.set(Math.cos(angle), 0, Math.sin(angle), 0)
        }

        // const Wall1 = wallFactory(2,50,100)
        // world.add(Wall1)
        // console.log(Wall1)    

        // dice10 = new RandomDice({size: 5});
        // dice10.name = "Dice10"
        // scene.add(dice10.getObject());
        // dice10.getObject().position.x = 1;
        // dice10.getObject().position.y = 1;
        // dice10.getObject().position.z = -20;
        // dice10.getObject().body.velocity.set(0,0,0)
        // dice10.updateBodyFromMesh()
        
        // const testCall = (e) => console.log("Result will be ", e)
        // dice10.emulateThrow(testCall)
        

        dice = new OwnersForumDice({
            size: 6,
            backColor: '#000',
            fontColor: '#fff'
        });
        const diceCopy = new OwnersForumDice({
            size: 6,
            backColor: '#000',
            fontColor: '#fff' 
        })
        
        scene.add(dice.getObject());
        
        const setRandomPosition = (obj) => {
            let yRand = Math.random() * 20
            ob.getObject().position.x = -15 - (i % 3) * ob.size;
            ob.getObject().position.y = 2 + Math.floor(i / 3) * ob.size;
            ob.getObject().position.z = -15 + (i % 3) * ob.size;
            ob.getObject().quaternion.x = (Math.random() * 90 - 45) * Math.PI / 180;
            ob.getObject().quaternion.z = (Math.random() * 90 - 45) * Math.PI / 180;
            ob.updateBodyFromMesh();
            let rand = Math.random() * 5;
            ob.getObject().body.velocity.set(25 + rand, 40 + yRand, 15 + rand);
            ob.getObject().body.angularVelocity.set(20 * Math.random() - 10, 20 * Math.random() - 10, 20 * Math.random() - 10);
            return obj
        }

        function randomDiceThrow(initial = false) {
            console.log("random trow called")
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
            let value = Math.floor((Math.random() * 10) + 1);
            // let diceValues = {
            //     dice: dice,
            //     value: value
            // };
            // DiceManager.prepareValues(diceValues);
            // if(!initial){
            //     console.log('dice-value:'+value);
            //     updateRadioField(value);
            // }
        }
        
        randomDiceThrow(true);

        container.addEventListener('click', () => {
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
        // dice10.updateMeshFromBody()
    }

    function update() {
        controls.update();
        // stats.update();
    }

    function render() {
        renderer.render(scene, camera);
    }

    function updateRadioField(value){
        document.getElementsByName(radioFieldName)[value-1].checked=true;
    }
}