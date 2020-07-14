import * as THREE from 'three'
import * as CANNON from 'cannon'

class Wall {

  constructor(scene, world, cMat) {
    this.scene = scene // THREE SCENE (visual)
    this.world = world // CANNON WORLD (physic simulation)
    this.cMat = cMat
    this.pos = new THREE.Vector3(0,0,0)
    this.size = new THREE.Vector3(1,1,1)
    this.init()
  }

  init() {
    //THREE PART
    const geo = new THREE.BoxGeometry(1,1,1)
    const mat = new THREE.MeshBasicMaterial({color:0xFF0000})
    this.box = new THREE.Mesh(geo, mat)
    //CANNON PART
    this.cShape = new CANNON.Box(new CANNON.Vec3(.5,.5,.5))
    this.cBox = new CANNON.Body({
      mass:0,
      shape:this.cShape,
      position: new CANNON.Vec3(0,0,0)
    })
    this.world.add(this.cBox)
    this.scene.add(this.box)
  }

  setSize(x,y,z) {
    this.size.set(x,y,z)
    this.box.geometry.scale(x,y,z)
    this.cShape.halfExtents.set(x,y,z)
    this.cShape.updateConvexPolyhedronRepresentation()
    this.cShape.updateBoundingSphereRadius()
    // this.cBox.computeAABB()
    this.cBox.updateMassProperties()
    this.cBox.updateBoundingRadius()
  }

  setPos(x,y,z) {
    this.pos.set(x,y,z)
    this.box.position.set(x,y,z)
    this.cBox.position.set(x,y,z)
  }

}

export default Wall