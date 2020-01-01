const size = 10

let camera, scene, renderer, controls
let pieces = []
let currentPiece = 0

const texture = new THREE.TextureLoader().load('texture/wood.gif')
const material = new THREE.MeshPhongMaterial({ map: texture })

window.onload = init

function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.z = 100

  scene = new THREE.Scene()

  function letThereBeLight(x, y, z) {
    const color = 0xFFFFFF
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(x * size, y * size, z * size)
    scene.add(light)
  }

  letThereBeLight(-1,  2,  4)
  letThereBeLight( 1, -1, -2)

  function createPiece(rx, ry, rz, bx, by, bz, e) {
    function createBox(x, y, z) {
      let geometry = new THREE.BoxGeometry(size, size, size)
      let mesh = new THREE.Mesh(geometry, material)
      mesh.position.x = x * size
      mesh.position.y = y * size
      mesh.position.z = z * size
      mesh.updateMatrix()
      return mesh
    }

    

    const boxes = []
    boxes.push(createBox(rx, ry, rz))
    for (let i = 1; i < 4; i++) {
      const argumentsByExtent = {
        "+X": [rx + i, ry, rz],
        "+Y": [rx, ry + i, rz],
        "+Z": [rx, ry, rz + i],
      }
      boxes.push(createBox(...argumentsByExtent[e]))
    }

    boxes.push(createBox(bx, by, bz))
    let geometry = new THREE.Geometry()
    boxes.forEach(box => {
      geometry.merge(box.geometry, box.matrix)
    })
    return geometry
  }

  function readCoordinate(string) {
    values = string.split(',')
    return values.map(Number)
  }

  const pieceLocations = solution.split(' ')
  pieces = pieceLocations.map(pieceLocation => {
    const [root, extent, bump] = pieceLocation.split(';')
    const [rootX, rootY, rootZ] = readCoordinate(root)
    const [bumpX, bumpY, bumpZ] = readCoordinate(bump)
    return new THREE.Mesh(createPiece(rootX, rootY, rootZ, bumpX, bumpY, bumpZ, extent), material)
  })

  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.querySelector('#c') })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  controls = new THREE.OrbitControls(camera, renderer.domElement)
  controls.update();

  window.addEventListener('resize', onWindowResize, false)
  window.addEventListener('keydown', onKey, false)
  addPiece()
  animate()
}

function onKey(keyboardEvent) {
  if(keyboardEvent.key === "ArrowLeft") {
    removePiece()
  }
  else if(keyboardEvent.key === "ArrowRight") {
    addPiece()
  }
  return false
}

function addPiece() {
  if (currentPiece < pieces.length) {
    scene.add(pieces[currentPiece])
    currentPiece++
  }
}

function removePiece() {
  if(currentPiece > 0) {
    currentPiece--
    scene.remove(pieces[currentPiece])
  }
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}


function animate() {
  controls.update()

  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}