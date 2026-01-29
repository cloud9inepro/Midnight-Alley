import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'

/**
 * Debug
 */
// const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// load manager
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
    console.log('loading started')
}
loadingManager.onLoad = () => {
    console.log('loading complete')
}
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log(`loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files`)
}
loadingManager.onError = (url) => {
    console.log(`there was an error loading ${url}`)
}   
 const loaderEl = document.getElementById('loader')
 loadingManager.onLoad = () => {
            loaderEl.style.display = 'none'
            introAnimation()
        }
    

//texture loader
const textureLoader = new THREE.TextureLoader()

// sky texture
const skyTexture = textureLoader.load('/textures/environmentMaps/sky.jpg', )

// Scene
const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x020406,  0.01)
scene.background = skyTexture


/**
 * GSAP animation
 */
const introAnimation = () => {
    if (!car) return
    const tl = gsap.timeline({
        defaults: {ease:'power3.inout'},
        onComplete: ()=>{
            controls.enabled = true
        }
    })
    
    // car falling
    tl.to(car.position, {
        y: -0.5,
        duration: 1.5,
        ease: 'power3.in'
    })

    // bounce
    tl.to(car.position,{
        y: 1.89,
        duration: 0.2,
        ease: 'power1.out'
    })

    tl.to(car.position,{
        y: -1,
        duration: 0.15,
        ease: 'power2.in'
    })

    // subtle squash
    tl.to(car.scale,{
        y: 10,
        duration: 0.1
    }, '<')

    tl.add(car.scale,{
        y: 7,
        duration: 0.15
    })
}

const  focusOn = (point, cameraOffset = new THREE.Vector3(0, 1, 4)) => {
        if (!point) return
   controls.enabled = false
    const worldPos = new THREE.Vector3()
    point.getWorldPosition(worldPos)

    gsap.to(camera.position, {
        duration: 1.2,
        x: worldPos.x +cameraOffset.x,
        y: worldPos.y +cameraOffset.y,
        z: worldPos.z +cameraOffset.z,
        ease: 'power2.out'
    })

    gsap.to(controls.target, {
        duration: 1.2,
        x: worldPos.x,
        y: worldPos.y,
        z: worldPos.z,
        onUpdate: ()=> controls.update(),
        onComplete:() => {
            controls.enabled = true
        }
    })
}


/**
 * Textures
 */

// const cubeTextureLoader = new THREE.CubeTextureLoader()
// rusted wall
const rustedWallTexture = textureLoader.load(
    '/textures/walls/rusted.jpg'
)
const rustedWallDisp = textureLoader.load(
    '/textures/walls/rustedDisp.png'
)
rustedWallTexture.repeat.set(0.8, 0.8)

// brick1 dark wall
const brickWallTexture = textureLoader.load(
    '/textures/walls/brick1.jpg'
)
// brick2 wall
const brick2WallTexture = textureLoader.load(
    '/textures/walls/brick2.jpg'
)

// floor
const metalTexture = textureLoader.load(
    '/textures/floor/concrete.jpg'
)

metalTexture.repeat.set(1, 1)
metalTexture.wrapS = THREE.RepeatWrapping
metalTexture.wrapT = THREE.RepeatWrapping




/**
 *  Models
 */

const inspectPoints = {
    front: new THREE.Object3D(),
    tireFL: new THREE.Object3D(),
    tireFR: new THREE.Object3D(),
    back: new THREE.Object3D()
}
// declare
let car;
let pipe;
let pipe2;
let ac;
let trash;
let wire;
let cctv;
let sign;

const GLTFloader = new GLTFLoader(loadingManager)

// car model
 GLTFloader.load('/models/porche.glb', (gltf)=>{
    car = gltf.scene;
    car.position.set(0, 15, 0)
    car.scale.set(10, 10, 10)
    car.castShadow = true
    scene.add(car)
    // helper
const helper = new THREE.AxesHelper(2)
// car.add(helper)

car.traverse((node)=>{
    if(node.isMesh){
        node.receiveShadow = true,
        node.castShadow = true,
        // node.material.envMapIntensity = 1.5
        node.material.needsUpdate = true
        
    }
})
// const bonnet = car.getObjectByName('object_80')
//     console.log(bonnet)

introAnimation()

/**
 * object marker
 */

inspectPoints.front.position.set(0, 1.2, 3)
inspectPoints.tireFL.position.set(-1.5, 0.6, 1.8)
inspectPoints.tireFR.position.set(1.5, 0.6, 1.8)
inspectPoints.back.position.set(0, 1.2, -3)

Object.values(inspectPoints).forEach(p => car.add(p))
 })

//  pipes big
GLTFloader.load('/models/modularpipes.glb', (gltf)=>{
    pipe = gltf.scene;
    pipe.position.set(0, 30, -48)
    pipe.rotation.z = Math.PI * 0.5
    pipe.rotation.y = Math.PI * 0.5
    pipe.scale.set(0.01, 0.01, 0.01)
    // scene.add(pipe)
})

// pipe2
GLTFloader.load('/models/pipe2.glb', (gltf)=>{
    pipe2 = gltf.scene;
    pipe2.position.set(-48.5, 5, -28)
    pipe2.rotation.y = Math.PI * 0.5
    pipe2.scale.set(5, 5, 5)
    scene.add(pipe2)
})
// ac unit
GLTFloader.load('/models/ac.glb', (gltf)=>{
    ac = gltf.scene;
    ac.position.set(-25, 26, -47)
    ac.scale.set(15, 15, 15)
    scene.add(ac)

    ac.traverse((node)=>{
    if(node.isMesh){
        node.receiveShadow = true,
        node.castShadow = true,
        // node.material = node.material.clone()
        // node.material.wireframe = true
        node.material.metalness = 1.3
        node.material.roughness = 3
        node.material.color.set(0xffffff)
        node.material.needsUpdate = true
        
    }
})

})

// trash can
GLTFloader.load('/models/trashCan.glb', (gltf)=>{
    trash = gltf.scene;
    trash.position.set(0, 11, -42)
    trash.scale.set(15, 15, 15)
    scene.add(trash)

    trash.traverse((node)=>{
        if (node.isMesh){
            node.castShadow = true
            node.receiveShadow = true
        }
    })
})
// wires
GLTFloader.load('/models/wires.glb', (gltf)=>{
    wire = gltf.scene;
    wire.position.set(45, 40, 0)
    wire.rotation.y = 2
    wire.scale.set(0.5, 0.5, 0.5)
    scene.add(wire)
})
// cctv
GLTFloader.load('/models/cctv.glb', (gltf)=>{
    cctv = gltf.scene;
    cctv.position.set(45, 48, 48)
    cctv.scale.set(5, 5, 5)
    scene.add(cctv)
})
// sign
GLTFloader.load('/models/sign.glb', (gltf)=>{
    sign = gltf.scene;
    sign.position.set(-49, 40, 46)
    sign.scale.set(7, 7, 7)
    scene.add(sign)
})

/**
 * buttons
 */
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('front').onclick = () => {
        focusOn(inspectPoints.front, new THREE.Vector3(0, 1, 4))
        showInfo('front')
    } 
})
document.getElementById('back').onclick = () => {
        focusOn(inspectPoints.back, new THREE.Vector3(0, 1, -4))
        showInfo('back')
    }

    document.getElementById('tireFL').onclick = () => {
        focusOn(inspectPoints.tireFL, new THREE.Vector3(-1, 0.5, 2))
        showInfo('tireFL')
    }

     document.getElementById('tireFR').onclick = () => {
        focusOn(inspectPoints.tireFR, new THREE.Vector3(1, 0.5, 2))
        showInfo('tireFR')
    }
    document.getElementById('exit').onclick = () =>{
        exitFocus()
        hideInfo()
    }
    window.addEventListener('keydown', (e)=>{
        if(e.key === 'Escape'){
            exitFocus()
            hideInfo()
        }
    })
// projection

const infoPoints = {
    tireFL:{
        object: inspectPoints.tireFL,
        title: 'Front Left Tire',
        description: 'Michelin Pilot Sport 4S • 19" Alloy Rim • Carbon Ceramic Brake'
    },

    front:{
        object: inspectPoints.front,
        title: 'Frunk',
        description: 'Front Mounted Trunk, Offering Approximately 4.8 Cubic Feet Of Space'
    },
    back:{
        object: inspectPoints.back,
        title: 'Engine Bay',
        description: '3.0-Liter Air-Cooled Flat-Six Engine With A Single KKK TurboCharger • 260hp • 253 lb-ft Of Torque'
    },
    tireFR:{
        object: inspectPoints.tireFR,
        title: 'Front Right Tire',
        description: 'Michelin Pilot Sport 4S • 19" Alloy Rim • Carbon Ceramic Brake'
    }
}

const infoPanel = document.getElementById('infoPanel')
const infoTitle = document.getElementById('infoTitle')
const infoDesc = document.getElementById('infoDesc')

const showInfo = (key) => {
    const data = infoPoints[key]
    if (!data) return
    infoTitle.textContent = data.title
    infoDesc.textContent = data.description
    infoPanel.classList.remove('hidden')

    updateInfoPosition(data.object)
}

const hideInfo = () =>{
    infoPanel.classList.add('hidden')
}

// position update
const tempV = new THREE.Vector3()

const updateInfoPosition = (object) => {
    object.getWorldPosition(tempV)
    tempV.project(camera)

    const x = ( tempV.x * 0.5 + 0.5) * sizes.width
    const y = ( -tempV.y * 0.5 + 0.5) * sizes.height

    infoPanel.style.left = `${x}px`
    infoPanel.style.top = `${y}px`
}




/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({
        map: metalTexture,
        color: '#2b2b2b',
        metalness: 0.25,
        roughness: 0.6,
        // envMap: environmentMapTexture,
        // envMapIntensity: 0.5
    })
)
floor.geometry.setAttribute('uv2',new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

// walls
const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 50),
    new THREE.MeshStandardMaterial({
        map: rustedWallTexture,
        displacementMap: rustedWallDisp,
        color: '#2b2b2b',
        metalness: 0.3,
        roughness: 0.3
    })
)
leftWall.receiveShadow = true
leftWall.position.set(-50, 25, 0)
leftWall.rotation.y = Math.PI * 0.5
scene.add(leftWall)

// front wall
const frontWall = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 50),
    new THREE.MeshStandardMaterial({
        // color: 0x1a1a1a,
        map: brickWallTexture,
        metalness: 0.3,
        roughness: 0.3
    })
)
frontWall.receiveShadow = true
frontWall.position.set(0, 25, -50)
scene.add(frontWall)

// wall 3
const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 50),
    new THREE.MeshStandardMaterial({
        map: brick2WallTexture,
        // color: '#2b2b2b',
        metalness: 0.1,
        roughness: 0.1
    })
)
rightWall.position.set(50, 25, 0)
rightWall.rotation.y = Math.PI * (-0.5)
scene.add(rightWall)


// right  blue neon light 
const neon = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 50, 0.5),
    new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2
    })
)
neon.position.set(-49, 25, -25)
scene.add(neon)

// neon 2
const neon2 = new THREE.Mesh(
    new THREE.BoxGeometry(4, 50, 1),
    new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2
    })
)
neon2.position.set(-49, 25, -22)
// neon2.rotation.z = Math.PI * 0.5
scene.add(neon2)

// right group
const rightNeonGroup = new THREE.Group()
rightNeonGroup.add(neon, neon2)
rightNeonGroup.position.z = -12
scene.add(rightNeonGroup)

// left blue neon light
const leftNeon = new THREE.Mesh(
    new THREE.BoxGeometry(4, 50, 1),
    new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2
    })
)
leftNeon.position.set(-49, 25, -25)
scene.add(leftNeon)

//left blue neon 2
const leftNeon2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 50, 0.5),
    new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2
    })
)
leftNeon2.position.set(-49, 25, -22)
// neon2.rotation.z = Math.PI * 0.5
scene.add(leftNeon2)

// left blue group
const leftNeonGroup = new THREE.Group()
leftNeonGroup.add(leftNeon, leftNeon2)
leftNeonGroup.position.z = 62
scene.add(leftNeonGroup)




// pink neon1 light top 
const pinkNeon = new THREE.Mesh(
    new THREE.BoxGeometry(1, 71, 0.2),
    new THREE.MeshStandardMaterial({
        color: 0xff19ff,
        emissive: 0xff19ff,
        emissiveIntensity: 2
    })
)
pinkNeon.position.set(-49, 45, 3)
pinkNeon.rotation.z = Math.PI * 0.5
pinkNeon.rotation.y = Math.PI * 0.5
scene.add(pinkNeon)

// pink neon 2
const pinkNeon2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 71, 0.2),
    new THREE.MeshStandardMaterial({
        color: 0xff3fff,
        emissive: 0xff3fff,
        emissiveIntensity: 2
    })
)
pinkNeon2.position.set(-49, 43, 3)
pinkNeon2.rotation.z = Math.PI * 0.5
pinkNeon2.rotation.y = Math.PI * 0.5
scene.add(pinkNeon2)

// pink neon 3
const pinkNeon3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 71, 0.2),
    new THREE.MeshStandardMaterial({
        color: 0xff3fff,
        emissive: 0xff3fff,
        emissiveIntensity: 2
    })
)
pinkNeon3.position.set(-49, 40, 3)
pinkNeon3.rotation.z = Math.PI * 0.5
pinkNeon3.rotation.y = Math.PI * 0.5
scene.add(pinkNeon3)

// pink neon 4
const pinkNeon4 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 71, 0.2),
    new THREE.MeshStandardMaterial({
        color: 0xff19ff,
        emissive: 0xff19ff,
        emissiveIntensity: 1
    })
)
pinkNeon4.position.set(-49, 38, 3)
pinkNeon4.rotation.z = Math.PI * 0.5
pinkNeon4.rotation.y = Math.PI * 0.5
scene.add(pinkNeon4)

// pink neon group
const pinkNeonGroup = new THREE.Group()
pinkNeonGroup.add(pinkNeon, pinkNeon2, pinkNeon3, pinkNeon4)
pinkNeonGroup.position.z = -2
scene.add(pinkNeonGroup)



/**
 * Lights
 */
// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

// dirlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5)
directionalLight.position.set(5, 10 , 5)
directionalLight.castShadow = true
scene.add(directionalLight)

// rim light
const rim = new THREE.DirectionalLight(0x00ffff, 1.2)
rim.position.set(-5, 6, -5)
scene.add(rim)

// magenta
const magenta = new THREE.PointLight(0xff00ff, 1.5, 20)
magenta.position.set(-5, 3, -5)
scene.add(magenta)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.compile(scene, camera)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(85, sizes.width / sizes.height, 0.1, 1000)
camera.position.set( 16, 16, 35)
camera.lookAt(0, 2, 0)
scene.add(camera)



// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enabled = false
controls.enableZoom = false
controls.target.set(0, 15, 0)
controls.enableRotate = false
setTimeout(()=>{ controls.enableRotate = true, 1200})

// default camera
const defaultCamera = {
    position: camera.position.clone(),
    target: controls.target.clone()
}
// exit focus
const exitFocus = () =>{
    gsap.to(camera.position, {
        duration: 1.2,
        x: defaultCamera.position.x,
        y: defaultCamera.position.y,
        z: defaultCamera.position.z,
        ease: 'power2.out'
    })

    gsap.to(controls.target, {
        duration: 1.2,
        x: defaultCamera.target.x,
        y: defaultCamera.target.y,
        z: defaultCamera.target.z,
        onUpdate: () => controls.update(),
        onComplete: () =>{
            controls.enabled = true
        }
    })
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))





/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    if (!infoPanel.classList.contains('hidden')){
        updateInfoPosition(inspectPoints.tireFL),
        updateInfoPosition(inspectPoints.tireFR),
        updateInfoPosition(inspectPoints.front),
        updateInfoPosition(inspectPoints.back)
    }

    

    // Update controls
    controls.update()



    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()