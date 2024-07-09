AFRAME.registerComponent('bullets', {
    schema:{
        valY : {default: 0, type: 'number'},
        valX : {default: 0, type: 'number'},
    },
    tick:function(){
        //this.cameraMouse()
    },
    cameraMouse: function(){
        const constanteY = 1.5707963267948966
        const constanteX = 6.284
        var camera3D = document.querySelector("#camera").object3D

        var calculoY = constanteY / 400
        
        window.addEventListener('mousemove', (e)=>{      
            this.data.valY = (constanteY) - (e.pageY * calculoY)          
            this.data.valX = (constanteX) * e.pageX * -6
        })
        camera3D.rotation.x = this.data.valY
        camera3D.rotation.y = this.data.valX
       
    },
    init: function(){
        this.shootBullet()
        
    },
    shootBullet: function(){
        window.addEventListener("keydown", (e)=>{
            if(e.key === "z"){
                var bullet = document.createElement('a-entity')
                bullet.setAttribute("geometry", {
                    primitive: 'sphere',
                    radius: 0.1
                })
                bullet.setAttribute('material', {
                    color: "black"
                })
                var cameraInfo = document.querySelector('#camera')

                var pos = cameraInfo.getAttribute('position')
                bullet.setAttribute('position', {x: pos.x, y: pos.y, z: pos.z})

                var camera3D = document.querySelector("#camera").object3D
                var direction = new THREE.Vector3()


                camera3D.getWorldDirection(direction)

                
                bullet.setAttribute('velocity', direction.multiplyScalar(-10))

                var sceneInfo = document.querySelector('#scene')

                bullet.setAttribute("dynamic-body", {
                    shape: 'sphere',
                    mass: 0
                })

                bullet.addEventListener("collide", this.removeBullet)

                sceneInfo.appendChild(bullet)
            }
        })
    },
    removeBullet: function(e){

        var element = e.detail.target.el

        var elementHit = e.detail.body.el

        if(elementHit.id.includes("caja")){
            elementHit.setAttribute("material",{
                opacity: 0.6,
                transparent: true
            })

        var impulso = new CANNON.Vec3(-2,2,1)
        var worldPoint = new CANNON.Vec3().copy(
            elementHit.getAttribute("position")
        )
        elementHit.body.applyImpulse(impulso, worldPoint)



        element.removeEventListener("collide", this.shoot)
        var scene = document.querySelector("#scene")
        scene.removeChild(element)
        }
    }

})