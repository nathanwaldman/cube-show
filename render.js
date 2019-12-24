const size = 10

let camera, scene, renderer, controls;
let pieces = []
let currentPiece = 0

let texture = new THREE.TextureLoader().load('crate.gif')
let material = new THREE.MeshBasicMaterial({ map: texture })

init()
animate()

function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.z = 100

  scene = new THREE.Scene()

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
      if (e === "+X") {
        boxes.push(createBox(rx + i, ry, rz))
      }
      else if (e === "+Y") {
        boxes.push(createBox(rx, ry + i, rz))
      }
      else if (e === "+Z") {
        boxes.push(createBox(rx, ry, rz + i))
      }
      else {
        console.error("Unrecognized extent:", e)
      }
    }
    boxes.push(createBox(bx, by, bz))
    let geometry = new THREE.Geometry()
    boxes.forEach(box => {
      geometry.merge(box.geometry, box.matrix)
    })
    return geometry
  }

  const readCoordinate = (string) => {
    values = string.split(',')
    return values.map(Number)
  }

  const pieceLocations = solution.split(' ')
  pieces = pieceLocations.map(pieceLocation => {
    const [root, extent, bump] = pieceLocation.split(';')
    const [rootX, rootY, rootZ] = readCoordinate(root)
    const [bumpX, bumpY, bumpZ] = readCoordinate(bump)
    return createPiece(rootX, rootY, rootZ, bumpX, bumpY, bumpZ, extent)
  })

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  controls = new THREE.OrbitControls(camera, renderer.domElement)
  controls.update();

  window.addEventListener('resize', onWindowResize, false)
  onDocumentKeyDown()
  window.addEventListener('keydown', onDocumentKeyDown, false)
}

function onDocumentKeyDown(event) {
  if (currentPiece < pieces.length) {
    scene.add(new THREE.Mesh(pieces[currentPiece], material))
    currentPiece++
  }
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}


function animate() {
  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)
}