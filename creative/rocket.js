import * as THREE from 'three';

// Everything should be 1:6 ratio !!

function makeRocket (coreColor, engSecColor, engColor, oldRocket = NULL, scene){

    if (oldRocket) scene.remove(oldRocket);

    // materials
    const corestageColor =  new THREE.MeshPhongMaterial({color: coreColor, specular: "#808080"});
    const enginesectionColor = new THREE.MeshPhongMaterial({color: engSecColor, specular: "#808080"});
    const engineColor =  new THREE.MeshPhongMaterial({color: engColor, specular: "#808080"});

    // Whole Rocket
    const sls = new THREE.Group();

    // Parts of Rocket
    const las = new THREE.Group();
    const esmStage = new THREE.Group();
    const upperStage = new THREE.Group();
    const icps = new THREE.Group();
    const coreStage = new THREE.Group();
    const srbL = new THREE.Group();
    const srbR = new THREE.Group();
    const srb = new THREE.Group();


    upperStage.position.y = 0;
    las.position.y = 0
    srbR.position.x = 0
    srbL.position.x = 0

    // Launch abort system

    const lastipGeom = new THREE.ConeGeometry(0.25, 0.5);
    const lastipMesh = new THREE.Mesh(lastipGeom, enginesectionColor);
    const lasrocketGeom = new THREE.CylinderGeometry(0.25, 0.25, 3.5);
    const lasrocketMesh = new THREE.Mesh(lasrocketGeom, enginesectionColor);
    const lasadapterGeom = new THREE.CylinderGeometry(0.25, 0.5, 2.3);
    const lasadapterMesh = new THREE.Mesh(lasadapterGeom, enginesectionColor);

    lastipMesh.position.set(0,38,0);
    lasrocketMesh.position.set(0,36,0);
    lasadapterMesh.position.set(0,33.3,0);

    las.add(lastipMesh);
    las.add(lasrocketMesh);
    las.add(lasadapterMesh);

    // Crew Module panel

    const crewpGeom = new THREE.CylinderGeometry(0.5, 1.9, 2.5);
    const crewpMesh = new THREE.Mesh(crewpGeom, enginesectionColor);

    crewpMesh.position.set(0,30.9,0);
    las.add(crewpMesh);

    las.name = "launch_abort_system"

    upperStage.add(las);

    // Orion capsule

    const orionGeom = new THREE.CylinderGeometry(0.43, 1.8, 2);
    const orionMesh = new THREE.Mesh(orionGeom, engineColor);
    orionMesh.position.set(0,30.7, 0);
    esmStage.add(orionMesh);

    // Crew module adapter

    const crewaGeom = new THREE.CylinderGeometry(1.9, 1.9, 0.75);
    const crewaMesh = new THREE.Mesh(crewaGeom, enginesectionColor);
    crewaMesh.position.set(0,29.3, 0);
    esmStage.add(crewaMesh);

    // European service module

    const esmGeom = new THREE.CylinderGeometry(1.3, 1.3, 1.8);
    const esmMesh = new THREE.Mesh(esmGeom, engineColor);
    esmMesh.position.set(0,28.1, 0);
    esmStage.add(esmMesh);

    // European service module engine

    const esmeGeom = new THREE.ConeGeometry(0.20, 0.83);
    const esmeMesh = new THREE.Mesh(esmeGeom, engineColor);
    esmeMesh.position.set(0, 26.9, 0);
    esmStage.add(esmeMesh);

    esmStage.name = "euro_service_module";

    upperStage.add(esmStage);

    // Encapsulated service module panels

    const panelColor = new THREE.MeshPhongMaterial({color: enginesectionColor, specular: "#808080", side: THREE.DoubleSide});
    var esmpRGeom = new THREE.CylinderGeometry(1.9, 1.9, 3.1, 32, 1, true, 0, Math.PI);
    var esmpLGeom = new THREE.CylinderGeometry(1.9, 1.9, 3.1, 32, 1, true, 0, Math.PI);
    var esmpRMesh = new THREE.Mesh(esmpRGeom, panelColor);
    var esmpLMesh = new THREE.Mesh(esmpLGeom, panelColor);
    esmpRMesh.position.set(0,28,0);
    esmpLMesh.position.set(0,28,0);
    esmpLMesh.rotation.set(0,Math.PI,0);
    esmpRMesh.name = "esmR_panel";
    esmpLMesh.name = "esmL_panel";

    upperStage.add(esmpRMesh);
    upperStage.add(esmpLMesh);

    // Spacecraft Adapter
    
    const saGeom = new THREE.CylinderGeometry(1.3, 1.9, .77);
    const saMesh = new THREE.Mesh(saGeom, enginesectionColor);
    saMesh.position.set(0,26.85,0);
    icps.add(saMesh);

    // Orion stage adapter

    const osaGeom = new THREE.CylinderGeometry(1.9, 1.65, 1);
    const osaMesh = new THREE.Mesh(osaGeom, enginesectionColor);

    osaMesh.position.set(0,26,0);

    icps.add(osaMesh);

    // Interim cryogenic propulsion stage

    const lh2TankGeom = new THREE.CylinderGeometry(1.65, 1.65, 2.343);
    const lh2TankMesh = new THREE.Mesh(lh2TankGeom, enginesectionColor);

    lh2TankMesh.position.set(0,24.4,0);

    icps.add(lh2TankMesh);

    const icpsStrucGeom = new THREE.CylinderGeometry(1.65, 1.32, 1.406);
    const icpsStrucMesh = new THREE.Mesh(icpsStrucGeom, new THREE.MeshPhongMaterial({color: 0x4d4d4d, specular: "#808080"}));

    icpsStrucMesh.position.set(0,22.6,0);
    icps.add(icpsStrucMesh);

    const loxTankGeom = new THREE.CapsuleGeometry(1.32, .5);
    const loxTankMesh = new THREE.Mesh(loxTankGeom, new THREE.MeshPhongMaterial({color: 0xa1a1a1, specular: "#808080"}));

    loxTankMesh.position.set(0,21.7,0); 
    icps.add(loxTankMesh);

    const icpsEngineGeom = new THREE.CylinderGeometry(0.5, 0.8, 2.8);
    const icpsEngineMesh = new THREE.Mesh(icpsEngineGeom, engineColor);

    icpsEngineMesh.position.set(0,19.5,0);
    icpsEngineMesh.name = "icps_engine";
    icps.add(icpsEngineMesh);
    icps.name = "icps";

    upperStage.add(icps);

    // Launch vehicle stage adapter

    const lvsaGeom = new THREE.CylinderGeometry(1.65, 2.76, 5.5);
    const lvsaMesh = new THREE.Mesh(lvsaGeom, corestageColor);
    lvsaMesh.position.set(0,20.5,0);
    coreStage.add(lvsaMesh);

    // Core stage

    const corestageGeom = new THREE.CylinderGeometry(2.76, 2.76, 35.6);
    const corestageMesh = new THREE.Mesh(corestageGeom, corestageColor);
    coreStage.add(corestageMesh);

    const enginesectionGeom = new THREE.CylinderGeometry(2.76, 2.5, 4);
    const enginesectionMesh = new THREE.Mesh(enginesectionGeom, enginesectionColor);
    enginesectionMesh.position.set(0,-19.8,0)
    coreStage.add(enginesectionMesh);

    // Rocket engines

    const rs25Engines = new THREE.Group();

    const engineGeom = new THREE.CylinderGeometry(0.5, 0.8, 2.8);
    const engineMesh0 = new THREE.Mesh(engineGeom, engineColor);
    const engineMesh1 = new THREE.Mesh(engineGeom, engineColor);
    const engineMesh2 = new THREE.Mesh(engineGeom, engineColor);
    const engineMesh3 = new THREE.Mesh(engineGeom, engineColor);

    engineMesh0.position.set(1.6,-23,0);
    engineMesh1.position.set(0,-23,1.6);
    engineMesh2.position.set(-1.6,-23,0);
    engineMesh3.position.set(0,-23,-1.6);


    rs25Engines.add(engineMesh0);
    rs25Engines.add(engineMesh1);
    rs25Engines.add(engineMesh2);
    rs25Engines.add(engineMesh3);

    rs25Engines.rotation.y = (Math.PI /2) /2;
    coreStage.add(rs25Engines);

    // Solid rocket boosters

    const srbtipGeom = new THREE.ConeGeometry(1.2, 5.2);
    const srbtip0Mesh = new THREE.Mesh(srbtipGeom, enginesectionColor);
    const srbtip1Mesh = new THREE.Mesh(srbtipGeom, enginesectionColor);
    const srbGeom = new THREE.CylinderGeometry(1.2, 1.2, 27.2);
    const srb0Mesh = new THREE.Mesh(srbGeom, enginesectionColor);
    const srb1Mesh = new THREE.Mesh(srbGeom, enginesectionColor);
    const srbskirtGeom = new THREE.CylinderGeometry(1.2, 2, 2.8);
    const srbskirt0Mesh = new THREE.Mesh(srbskirtGeom, enginesectionColor);
    const srbskirt1Mesh = new THREE.Mesh(srbskirtGeom, enginesectionColor);
    const srbnozzleGeom = new THREE.CylinderGeometry(0.5, 1.2, 2.8);
    const srbnozzle0Mesh = new THREE.Mesh(srbnozzleGeom, engineColor);
    const srbnozzle1Mesh = new THREE.Mesh(srbnozzleGeom, engineColor);

    srbtip0Mesh.position.set(4,8.2,0);
    srbtip1Mesh.position.set(-4,8.2,0);
    srb0Mesh.position.set(4,-8,0);
    srb1Mesh.position.set(-4,-8,0);
    srbskirt0Mesh.position.set(4,-21.5,0);
    srbskirt1Mesh.position.set(-4,-21.5,0);
    srbnozzle0Mesh.position.set(4,-23.1,0);
    srbnozzle1Mesh.position.set(-4,-23.1,0);

    srbnozzle1Mesh.name = "left_nozzel";
    srbnozzle0Mesh.name = "right_nozzel";

    srbR.add(srb0Mesh);
    srbR.add(srbtip0Mesh);
    srbR.add(srbskirt0Mesh);
    srbR.add(srbnozzle0Mesh);

    srbL.add(srb1Mesh);
    srbL.add(srbtip1Mesh);
    srbL.add(srbskirt1Mesh);
    srbL.add(srbnozzle1Mesh);

    srb.add(srbR);
    srb.add(srbL);


    sls.add(las);
    sls.add(upperStage);
    sls.add(coreStage);
    sls.add(srb);

    scene.add(sls);


    return {
        sls,
        las,
        esmStage,
        esmpLMesh,
        esmpRMesh,
        icps,
        upperStage,
        coreStage,
        srbL,
        srbR,
        srb
    };
}

function makeLaunchMount(mlColor, scene){

    // Parts of launch mount
    const ml1 = new THREE.Group();
    const launchTower = new THREE.Group();
    const launchMount = new THREE.Group();

    // Materials
    const launchMat = new THREE.MeshPhongMaterial({ color:  mlColor, specular: "#808080" });

    // Launch mount
    const mount = new THREE.Mesh(new THREE.BoxGeometry(22.5,27.5,4.16), launchMat);
    mount.rotation.set(Math.PI/2,0,0);
    mount.position.set(0,-27,-4.5);

    // Quick disconnect
    const qdPivot = new THREE.Group();

    qdPivot.position.set(0, -23.5, 0);

    // Lox quick disconnect
    const loxqd  = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 5.5), launchMat);
    loxqd.position.set(-2, 0, 6.5);
    loxqd.rotation.set(Math.PI/2,0,.25);
    qdPivot.add(loxqd);

    // Lh2 quick disconnect
    const lh2qd  = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 5.5), launchMat);
    lh2qd.position.set(2, 0, 6.5);
    lh2qd.rotation.set(Math.PI/2,0,-.25);
    qdPivot.add(lh2qd);

    qdPivot.rotation.x = -Math.PI / 25;
    
    const tower  = new THREE.Mesh(new THREE.BoxGeometry(6.66, 6.66, 62.5), launchMat);
    
    // Launch tower
    tower.rotation.set(Math.PI/2,0,0);
    tower.position.set(0, 5, -13.5);
    
    const armPivot = new THREE.Group();
    armPivot.position.set(4, 29, -11);
    
    // Launch tower crew arm
    const crewArm = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 15), launchMat);
    
    crewArm.position.set(0, 0, 6);
    
    armPivot.add(crewArm);
    armPivot.rotation.y = -Math.PI / 25;


    launchMount.add(mount);
    launchMount.add(qdPivot);

    launchTower.add(tower);
    launchTower.add(armPivot);


    ml1.add(launchMount);
    ml1.add(launchTower);

    scene.add(ml1);


    return {
        ml1,
        mount,
        qdPivot,
        lh2qd,
        loxqd,
        tower,
        armPivot,
        crewArm
    };
}

function RampGeometry(width, height, depth) {
    const geom = new THREE.BufferGeometry();
    const w = width / 2;

    const vertices = new Float32Array([
        // bottom of ramp
        -w, 0, depth/2,
        w, 0, depth/2,
        w, 0, -depth/2,
        -w, 0, -depth/2,

        // back of ramp
        -w, 0, -depth/2,
        w, 0, -depth/2,
        w, height, -depth/2,
        -w, height, -depth/2,

        // left side
        -w, 0, depth/2,
        -w, 0, -depth/2,
        -w, height, -depth/2,

        // right side
        w, 0, depth/2,
        w, height, -depth/2,
        w, 0, -depth/2,

        // top of ramp
        -w, 0, depth/2,
        w, 0, depth/2,
        w, height, -depth/2,
        -w, height, -depth/2,
    ]);

    const indices = [
        0, 2, 1, 0, 3, 2, // bottom
        4, 6, 5, 4, 7, 6, // back
        9, 8, 10, // left
        12, 11, 13, // right
        14, 15, 16, 14, 16, 17, // ramp
    ];

    geom.setIndex(indices);
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();
    return geom;
}

function makeLaunchComplex(padColor, tankColor, pipeColor, scene){

    // Parts of launch pad
    const launchPad = new THREE.Group();

    // Material
    const padMat = new THREE.MeshPhongMaterial({ color: padColor});
    const tankMat = new THREE.MeshPhongMaterial({ color: tankColor, specular: "#808080" });
    const pipeMat = new THREE.MeshPhongMaterial({ color:  pipeColor, specular: "#808080" });

    // Ground plane
    const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 600),
    new THREE.MeshPhongMaterial({ color: 0x228B22,  side: THREE.DoubleSide} )
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -38;
    scene.add(ground);

    // Lox tank
    const loxTank = new THREE.Mesh(new THREE.SphereGeometry( 6.5 ), tankMat);
    loxTank.position.set(-105,-32,-108),
    scene.add(loxTank);

    // Lox line
    const loxLine = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 130), pipeMat);
    loxLine.rotation.y = Math.PI / 4;
    loxLine.position.set(-55, -38, -58);
    scene.add(loxLine);

    // Lh2 tank
    const lh2Tank = new THREE.Mesh(new THREE.SphereGeometry( 6.5 ), tankMat);
    lh2Tank.position.set(105,-32,-108),
    scene.add(lh2Tank);

    // Lh2 line
    const lh2Line = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 130), pipeMat);
    lh2Line.rotation.y = -Math.PI / 4;
    lh2Line.position.set(55, -38, -58);
    scene.add(lh2Line);

    // Launch pad
    const pad = new THREE.Mesh(new THREE.BoxGeometry(40,65.61,9.16), padMat);
    pad.rotation.set(Math.PI/2,0,0);
    pad.position.set(-4,-33.66,-23);
    launchPad.add(pad);

    // Launch pad ramp
    const padRamp = RampGeometry(25, 9.16, 181.27); 
    const padRampMesh = new THREE.Mesh(padRamp, padMat);
    padRampMesh.position.set(0, -38.16, 100);
    launchPad.add(padRampMesh);

    launchPad.position.set(0, 0, 25);
    scene.add(launchPad);

    return {
        ground,
        loxTank,
        loxLine,
        lh2Tank,
        lh2Line,
        launchPad
    };
}

export {makeRocket};
export {makeLaunchMount};
export {makeLaunchComplex};