import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import Stats from 'three/examples/jsm/libs/stats.module'

let screenRatio = 2;
let objectScale = 8;
const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(5))

const light = new THREE.SpotLight()
light.position.set(0, 0, 0)
scene.add(light)

// const light2 = new THREE.SpotLight()
// light2.position.set(120, 120, 120)
// scene.add(light2)

// const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth  / window.innerHeight,
//     0.1,
//     10
// )
let viewsize = 1200;
// let aspectratio = window.innerWidth / window.innerHeight;
let aspectratio = 1
const camortho = new THREE.OrthographicCamera(
    -aspectratio*viewsize / 2, aspectratio*viewsize / 2, 
    viewsize /2, -viewsize/2, -1000, 1000
)
// camera.position.z = 30 /0.0002
// camera.position.x = 10 /0.0002
// camera.position.y = 20 /0.0002

camortho.position.z = 80
camortho.position.x = 80
camortho.position.y = 80

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "low-power"})
// renderer.setSize(window.innerWidth/screenRatio, window.innerHeight/screenRatio)
renderer.setSize(window.innerHeight/screenRatio, window.innerHeight/screenRatio)

const container = document.getElementById("app")
document.body.appendChild(container)

container.appendChild(renderer.domElement)
// document.body.appendChild(renderer.domElement)

// const controls = new OrbitControls(camera, renderer.domElement)
const controls = new OrbitControls(camortho, renderer.domElement)
controls.enableDamping = false
controls.enableRotate = false

const material = new THREE.MeshPhysicalMaterial({
    // color: 0xFF8645,
    color: 0xeeeeee,
    // envMap: envTexture,
    metalness: 0,
    roughness: 0.1,
    opacity: 1.0,
    transparent: false,
    transmission: 0.99,
    clearcoat: 1.0,
    clearcoatRoughness: 0.25,
})

const COLOR = {
    g: 0xeeeeee,
    na: 0xF2A86B,
    c: 0xFF6666,
}

const statorRadioInputs = document.querySelectorAll('input[name="stator-color"]');
const rotorRadioInputs = document.querySelectorAll('input[name="rotor-color"]');
const bdeRadioInputs = document.querySelectorAll('input[name="bde-color"]');
const bndeRadioInputs = document.querySelectorAll('input[name="bnde-color"]');

function updateMaterialColor() {
  let selectedColor = 'g'

  selectedColor = [...statorRadioInputs].find(radio => radio.checked).value;
  stator.color.set(COLOR[selectedColor])

  selectedColor = [...rotorRadioInputs].find(radio => radio.checked).value;
  rotor.color.set(COLOR[selectedColor])

  selectedColor = [...bdeRadioInputs].find(radio => radio.checked).value;
  bde.color.set(COLOR[selectedColor])

  selectedColor = [...bndeRadioInputs].find(radio => radio.checked).value;
  bnde.color.set(COLOR[selectedColor])
}

const default_config =  {
    color: 0xeeeeee,
    metalness: 0.25,
    roughness: 0.1,
    opacity: 1.0,
    transparent: false,
    transmission: 0.99,
    clearcoat: 0.7,
    clearcoatRoughness: 0.25,
}

const stator = new THREE.MeshPhysicalMaterial(default_config)
const rotor = new THREE.MeshPhysicalMaterial(default_config)
const bde = new THREE.MeshPhysicalMaterial(default_config)
const bnde = new THREE.MeshPhysicalMaterial(default_config)

const material3 = new THREE.MeshPhysicalMaterial({
    // color: 0xFF8645,
    color: 0xcccccc,
    // envMap: envTexture,
    metalness: 0.25,
    roughness: 0.1,
    opacity: 0.2,
    transparent: true,
    transmission: 0,
    clearcoat: 0.7,
    clearcoatRoughness: 0.25,
})

const loader = new STLLoader()


function scaleobject(geometry, material) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.scale.set(objectScale, objectScale, objectScale)
    scene.add(mesh)
}

function scaleobject2(geometry, material) {
    // Material for the colored object
    const colorMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });

    // Material for the outline (as lines)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    // Create the colored mesh
    const coloredMesh = new THREE.Mesh(geometry, colorMaterial);

    // Get the wireframe geometry from the main geometry
    const lineGeometry = new THREE.WireframeGeometry(geometry);

    // Create the outline line object
    const outline = new THREE.Line(lineGeometry, lineMaterial);
    coloredMesh.scale.set(objectScale, objectScale, objectScale)
    outline.scale.set(objectScale, objectScale, objectScale)

    // Add both objects to the scene
    scene.add(coloredMesh);
    scene.add(outline);
    // scene.add(outlineMesh)
}

loader.load(
    'models/tinkercad-vectary/stator.stl',
    ((geometry) => scaleobject(geometry, stator))
    // ((geometry) => scaleobject2(geometry))
)

loader.load(
    'models/tinkercad-vectary/rotor-bars.stl',
    ((geometry) => scaleobject(geometry, rotor))
)

loader.load(
    'models/tinkercad-vectary/rotor.stl',
    ((geometry) => scaleobject(geometry, material))
)

loader.load(
    'models/tinkercad-vectary/shaft.stl',
    ((geometry) => scaleobject(geometry, material))
)

loader.load(
    'models/tinkercad-vectary/bearing-de.stl',
    ((geometry) => scaleobject(geometry, bde))
)

loader.load(
    'models/tinkercad-vectary/bearing-nde.stl',
    ((geometry) => scaleobject(geometry, bnde))
)

loader.load(
    'models/tinkercad-vectary/motor-base.stl',
    ((geometry) => scaleobject(geometry, material))
)

loader.load(
    'models/tinkercad-vectary/motor-case.stl',
    ((geometry) => scaleobject(geometry, material3))
)

// window.addEventListener('resize', onWindowResize, false)
// function onWindowResize() {
//     // camera.aspect = window.innerWidth / window.innerHeight
//     camera.aspect = 1
//     camera.updateProjectionMatrix()
//     // renderer.setSize(window.innerWidth/screenRatio, window.innerHeight/screenRatio)
//     renderer.setSize(window.innerHeight/screenRatio, window.innerHeight/screenRatio)
//     render()
// }

const stats = new Stats()
// document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    render()
}

function render() {
  renderer.setClearColor("#ffffff")
    renderer.render(scene, camortho)
}

animate()
statorRadioInputs.forEach(radio => radio.addEventListener('change', updateMaterialColor));
rotorRadioInputs.forEach(radio => radio.addEventListener('change', updateMaterialColor));
bdeRadioInputs.forEach(radio => radio.addEventListener('change', updateMaterialColor));
bndeRadioInputs.forEach(radio => radio.addEventListener('change', updateMaterialColor));