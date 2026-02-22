/* ============== 3D ANIMATIONS WITH THREE.JS ============== */

import * as THREE from 'three';

class ThreeJSManager {
    constructor(container) {
        this.container = container || document.body;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.geometries = [];
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        
        this.init();
        this.addEventListeners();
        this.animate();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Style the canvas
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.pointerEvents = 'none';
        this.renderer.domElement.style.zIndex = '1';
        
        this.container.appendChild(this.renderer.domElement);

        this.createGeometries();
    }

    createGeometries() {
        // Aurora Dorada color palette
        const colors = [
            0xFFC777, // Gold
            0x58A6FF, // Blue
            0xA855F7, // Violet
            0xE879F9  // Magenta
        ];

        // Create floating geometric shapes
        for (let i = 0; i < 6; i++) {
            const geometry = this.createRandomGeometry();
            const material = new THREE.MeshBasicMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                transparent: true,
                opacity: 0.7,
                wireframe: Math.random() > 0.5
            });

            const mesh = new THREE.Mesh(geometry, material);
            
            // Random positioning
            mesh.position.x = (Math.random() - 0.5) * 10;
            mesh.position.y = (Math.random() - 0.5) * 10;
            mesh.position.z = (Math.random() - 0.5) * 10;
            
            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI * 2;
            mesh.rotation.y = Math.random() * Math.PI * 2;
            mesh.rotation.z = Math.random() * Math.PI * 2;

            // Store original position for animation
            mesh.userData = {
                originalX: mesh.position.x,
                originalY: mesh.position.y,
                originalZ: mesh.position.z,
                speed: 0.005 + Math.random() * 0.01,
                amplitude: 0.5 + Math.random() * 1
            };

            this.scene.add(mesh);
            this.geometries.push(mesh);
        }
    }

    createRandomGeometry() {
        const geometries = [
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.ConeGeometry(0.5, 1, 8),
            new THREE.OctahedronGeometry(0.7),
            new THREE.TetrahedronGeometry(0.8),
            new THREE.TorusGeometry(0.5, 0.2, 8, 16)
        ];

        return geometries[Math.floor(Math.random() * geometries.length)];
    }

    addEventListeners() {
        window.addEventListener('mousemove', (event) => {
            this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth mouse tracking
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // Animate geometries
        this.geometries.forEach((mesh, index) => {
            const time = Date.now() * mesh.userData.speed;
            
            // Floating animation
            mesh.position.y = mesh.userData.originalY + 
                Math.sin(time) * mesh.userData.amplitude;
            mesh.position.x = mesh.userData.originalX + 
                Math.cos(time * 0.7) * mesh.userData.amplitude * 0.5;
            
            // Mouse interaction
            mesh.position.x += this.mouse.x * 0.2;
            mesh.position.y += this.mouse.y * 0.2;
            
            // Rotation
            mesh.rotation.x += 0.005;
            mesh.rotation.y += 0.007;
            mesh.rotation.z += 0.003;

            // Scale pulsing
            const scale = 1 + Math.sin(time * 2) * 0.1;
            mesh.scale.setScalar(scale);
        });

        // Camera subtle movement based on mouse
        this.camera.position.x += this.mouse.x * 0.1;
        this.camera.position.y += this.mouse.y * 0.1;

        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        if (this.renderer && this.renderer.domElement) {
            this.container.removeChild(this.renderer.domElement);
        }
        
        // Clean up geometries
        this.geometries.forEach(mesh => {
            mesh.geometry.dispose();
            mesh.material.dispose();
            this.scene.remove(mesh);
        });
    }
}

export default ThreeJSManager;