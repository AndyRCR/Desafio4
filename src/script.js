import './style.css'
import * as THREE from 'three'
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MeshNormalMaterial } from 'three'

let select = document.querySelector('.select')
let p = document.querySelector('.p')
let controls

/**
 * Texturas
 */
const manager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(manager)
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Base
 */
// Canvas
const canvasContainer = document.querySelector('.canvasContainer') 
const canvas = document.querySelector('canvas.webgl')

select.addEventListener('change', (evt)=>{

    if(!isNaN(parseInt(evt.target.value))){
        canvasContainer.style.position = 'relative'
        canvasContainer.style.visibility = 'visible'

        let materialArray = [];
        let texture_ft = new THREE.TextureLoader().load( `textures/environmentMaps/${evt.target.value}/px.png`);
        let texture_bk = new THREE.TextureLoader().load( `textures/environmentMaps/${evt.target.value}/nx.png`);
        let texture_up = new THREE.TextureLoader().load( `textures/environmentMaps/${evt.target.value}/py.png`);
        let texture_dn = new THREE.TextureLoader().load( `textures/environmentMaps/${evt.target.value}/ny.png`);
        let texture_rt = new THREE.TextureLoader().load( `textures/environmentMaps/${evt.target.value}/pz.png`);
        let texture_lf = new THREE.TextureLoader().load( `textures/environmentMaps/${evt.target.value}/nz.png`);
          
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
           
        for (let i = 0; i < 6; i++)
          materialArray[i].side = THREE.BackSide;
           
        let skyboxGeo = new THREE.BoxGeometry( 10, 10, 10);
        let skybox = new THREE.Mesh( skyboxGeo, materialArray );
        scene.add( skybox );

        
        p.innerText = 'Desplazece con el mouse en la imagen o mueva su celular'
    }else{
        p.innerText = ''
        scene.clear()
        canvasContainer.style.position = 'absolute'
        canvasContainer.style.visibility = 'hidden'
    }
})

// Escena principal
const scene = new THREE.Scene()

/**
 * Luces
 */

const ambientLight = new THREE.AmbientLight('#fff', 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight('#fff', 0.5)
pointLight.position.set(0,0,5)
scene.add(pointLight)

/**
 * Medidas
 */
const sizes = {
    width: canvasContainer.clientWidth,
    height: canvasContainer.clientHeight
}

window.addEventListener('resize', () =>{
    if(window.innerWidth > 450) controls = new OrbitControls(camera, canvas)
    else if(window.innerWidth <= 450) controls = new DeviceOrientationControls(camera)

    sizes.width = canvasContainer.clientWidth
    sizes.height = canvasContainer.clientHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camara
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0,1,0)
camera.lookAt(0,0,2)
scene.add(camera)

if(window.innerWidth > 450){
    controls = new OrbitControls(camera, canvas)
    controls.enableZoom = false
}
else if(window.innerWidth <= 450) controls = new DeviceOrientationControls(camera)

/**
 * Render
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const tick = () =>{
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()