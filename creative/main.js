//import three js and all the addons that are used in this script 
import * as THREE from 'three';
import { TW } from 'tw';
import GUI from 'gui';
import { makeRocket, makeLaunchMount } from './rocket.js';

console.log(`Loaded Three.js version ${THREE.REVISION}`);

// for debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

// Create an initial empty Scene
var scene = new THREE.Scene();
globalThis.scene = scene;

// ================================================================
// Build your scene here
// params for the rocket
const params = {
    corestageColor: "#f17022",
    enginesectionColor: "#ffffff",
    engineColor: "#808080",
    mlColor: 0x696563,
    upperstageElevation: 0,
    lasElevation: 0,
    srbSep: 0,
    launch: false,
    velocity: 0,
    rollSpeed: 0,
    pitchSpeed: 0,
    rollProgram: false,
    pitchProgram: false,
    cameraSpeed: 1.5,
};

const smokeTex = new THREE.TextureLoader().load('images/smoke.png');

const smokeMat = new THREE.MeshStandardMaterial({
    map: smokeTex,
    transparent: true,
    opacity: .1,
    depthWrite: false,
    roughness: 1,
    metalness: 0,
    color: 0xffffff
}); 

const smokeGeom = new THREE.PlaneGeometry(1,1);
const smokeTrail = [];


// loading the rocekt and ml into the scene
let rocketParts = makeRocket(params.corestageColor, params.enginesectionColor, params.engineColor, null, scene);
let launchMount = makeLaunchMount(params.mlColor, params.enginesectionColor, scene);

// Making the accessible for the gui
let sls = rocketParts.sls;
let las = rocketParts.las;
let upperStage = rocketParts.upperStage;
let srbL = rocketParts.srbL;
let srbR = rocketParts.srbR;

const rocketPivot = new THREE.Group();
scene.add(rocketPivot);

rocketPivot.add(sls);

rocketPivot.position.y = 0;
sls.position.set(0, 0, 0);

function createSmoke(){
    const lSRBsmoke = new THREE.Mesh(smokeGeom, smokeMat.clone());
    const rSRBsmoke = new THREE.Mesh(smokeGeom, smokeMat.clone());

    const lNozzel = srbL.getObjectByName("left_nozzel");
    const rNozzel = srbR.getObjectByName("right_nozzel");

    const lNozzelPos = new THREE.Vector3();
    const rNozzelPos = new THREE.Vector3();
    lNozzel.getWorldPosition(lNozzelPos);
    rNozzel.getWorldPosition(rNozzelPos);

    lSRBsmoke.position.copy(lNozzelPos);
    rSRBsmoke.position.copy(rNozzelPos);

    const scale = 1 + Math.random();
    lSRBsmoke.scale.set(scale, scale, scale);
    rSRBsmoke.scale.set(scale, scale, scale);

    lSRBsmoke.rotation.z = Math.random() * Math.PI;
    rSRBsmoke.rotation.z = Math.random() * Math.PI;

    scene.add(lSRBsmoke);
    scene.add(rSRBsmoke);
    smokeTrail.push(lSRBsmoke);
    smokeTrail.push(rSRBsmoke);
}

function updateSmoke() {
    for (let i = smokeTrail.length - 1; i >= 0; i--) {
        const p = smokeTrail[i];

        // moves smoke down
        p.position.y -= 0.1;

        // Slight drift
        p.position.x += (Math.random() - 1) * 0.02;
        p.position.z += (Math.random() - 1) * 0.02;

        // Expand
        p.scale.multiplyScalar(1.04);

        // Fade out
        p.material.opacity *= .97;

        p.lookAt(camera.position);

        // remove dead particles
        if (p.material.opacity < 0.02) {
            scene.remove(p);
            smokeTrail.splice(i, 1);
        }
    }
}

// ground plane
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 600),
    new THREE.MeshPhongMaterial({ color: 0x228B22,  side: THREE.DoubleSide} )
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -29;
scene.add(ground);

// ambient lighting
const amb = new THREE.AmbientLight(0xffffff, 1);
scene.add(amb)

// directional lighting
const light = new THREE.DirectionalLight( 0xffffff , 5);
light.position.set(50,100,60);
scene.add(light);

const helper = new THREE.DirectionalLightHelper( light, 5 );
//scene.add( helper );

scene.fog = new THREE.Fog(0x87CEEB, 50,400);

// loading in the texture for the sky
const loader = new THREE.TextureLoader();
loader.load('images/sky.jpg', function(texture) {
    scene.background = texture;
});

// ================================================================

// Create a renderer to render the scene
var renderer = new THREE.WebGLRenderer();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,  1, 1000);
globalThis.camera = camera;
scene.add(camera);
camera.position.set(0,0, 100);

// TW.mainInit() initializes TW, adds the canvas to the document,
// enables display of 3D coordinate axes, sets up keyboard controls
TW.mainInit(renderer, scene);

function render() {
    renderer.render(scene, camera);
}
render();

const gui = new GUI();
gui.add(params, 'launch');
gui.add(sls.position, "y").listen();
gui.add(params, 'upperstageElevation', 0, 10).step(1).onChange(val => {
    if (upperStage) upperStage.position.y = val, las.position.y = val
});
gui.add(params, 'srbSep', 0, 10).step(1).onChange(val => {
    if(srbR && srbL) {
        srbR.position.x =  val;
        srbL.position.x = -(val);
    }
});


function animate() {
    requestAnimationFrame(animate);

    if (params.launch && sls) {
        launchMount.armPivot.rotation.y += 0.008;

        // Wont launch rocket until crew arm in stored
        if(launchMount.armPivot.rotation.y >= Math.PI ){
            launchMount.armPivot.rotation.y = Math.PI;
            for (let i = 0; i < 4; i++) {
                createSmoke();
            }
            params.velocity += 0.002;
            sls.position.y += params.velocity;
            // move the camera along with the rocket at same velocity increase
            camera.position.y += params.velocity/params.cameraSpeed;

            // Wont rotate until the rocket is high enough
            // Change the 20 to a higher value!!
            if(sls.position.y >= 20 && rocketPivot.rotation.y <= Math.PI/2){
                params.rollSpeed += 0.0001;
                rocketPivot.rotation.y += params.rollSpeed;
                params.cameraSpeed = 1;

            }
            // Wont pitch down until it rocket has rotated
            if (rocketPivot.rotation.y >= Math.PI/2){
                params.pitchSpeed += 0.004;
                sls.position.z += params.pitchSpeed;
                camera.position.x += params.pitchSpeed;
                
                const rotateSpeed = 0.002;
                sls.rotation.x = Math.min(sls.rotation.x + rotateSpeed, 0.5);
                // allows rockt to speed up significantly once picthing is complete
                if(sls.rotation.x >= 0.5){
                    // sls.position.z += .09;
                    sls.rotation.x = 0.5;
                } 
                // Allows velocity to increase significantly once high enough
                if(sls.position.y > 100){
                    //sls.position.z += .3;
                }
            }
        }
    } else {
        sls.position.y = -1.5;
        sls.position.z = 0;
        params.velocity = 0;
        params.rollSpeed = 0;
        params.pitchSpeed = 0;
        params.cameraSpeed = 1.5;
        rocketPivot.rotation.y = 0;
        launchMount.armPivot.rotation.y = -Math.PI / 25;
        sls.rotation.x = 0;
        camera.position.set(0,0, 100);
    }

    updateSmoke();

    renderer.render(scene, camera);
}

animate();