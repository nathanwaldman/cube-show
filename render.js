const size = 10

const solution = '0,0,0;+X;1,1,0, 4,0,0;+Y;3,1,0, 0,1,0;+Z;0,0,2, 2,1,0;+Z;3,1,1, 0,2,0;+Z;0,3,1, 1,2,0;+Z;1,1,2, 2,2,0;+Z;2,3,2, 3,2,0;+Z;4,2,2, 0,3,0;+X;2,3,1, 0,4,0;+X;2,4,1, 4,4,0;+Z;4,3,2, 0,0,1;+X;1,1,1, 4,0,1;+Y;4,1,2, 1,3,1;+Z;0,3,2, 3,3,1;+Z;2,3,3, 0,4,1;+Z;0,3,3, 1,4,1;+Z;2,4,2, 3,4,1;+Z;2,4,3, 1,0,2;+X;3,1,2, 0,0,3;+X;1,1,3, 4,0,3;+Y;3,1,3, 0,0,4;+Y;1,1,4, 1,0,4;+X;3,1,4, 2,1,4;+Y;1,2,4, 4,1,4;+Y;3,2,4'

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