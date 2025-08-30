/* ============== 3D ANIMATIONS SYSTEM - LOCOMOTIVE STYLE ============== */
/* Three.js based 3D animation system for La Academia */

class ThreeDAnimations {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.geometries = [];
        this.avatar = null;
        this.mouse = { x: 0, y: 0 };
        this.windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add canvas to DOM
        const canvas = this.renderer.domElement;
        canvas.id = 'three-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '2';
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0.8';
        document.body.appendChild(canvas);
        
        // Create lighting
        this.setupLighting();
        
        // Create 3D elements
        this.createAvatar();
        this.createFloatingGeometry();
        
        // Start animation loop
        this.animate();
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Point lights with Aurora Dorada colors
        const goldLight = new THREE.PointLight(0xFFC777, 1, 100);
        goldLight.position.set(10, 10, 10);
        this.scene.add(goldLight);
        
        const blueLight = new THREE.PointLight(0x58A6FF, 0.8, 100);
        blueLight.position.set(-10, 5, 10);
        this.scene.add(blueLight);
        
        const electricLight = new THREE.PointLight(0x00D4FF, 0.6, 100);
        electricLight.position.set(0, -10, 5);
        this.scene.add(electricLight);
    }
    
    createAvatar() {
        // Create Maia Kode 3D avatar using geometric shapes
        const avatarGroup = new THREE.Group();
        
        // Head (sphere with gradient-like material)
        const headGeometry = new THREE.SphereGeometry(0.8, 32, 16);
        const headMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFC777,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.5;
        head.castShadow = true;
        avatarGroup.add(head);
        
        // Body (cylinder)
        const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.6, 1.5, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0x58A6FF,
            transparent: true,
            opacity: 0.8
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0;
        body.castShadow = true;
        avatarGroup.add(body);
        
        // Floating hands
        const handGeometry = new THREE.SphereGeometry(0.2, 16, 8);
        const handMaterial = new THREE.MeshPhongMaterial({
            color: 0xE879F9,
            transparent: true,
            opacity: 0.9
        });
        
        const leftHand = new THREE.Mesh(handGeometry, handMaterial);
        leftHand.position.set(-1.2, 0.5, 0.5);
        leftHand.castShadow = true;
        avatarGroup.add(leftHand);
        
        const rightHand = new THREE.Mesh(handGeometry, handMaterial);
        rightHand.position.set(1.2, 0.5, 0.5);
        rightHand.castShadow = true;
        avatarGroup.add(rightHand);
        
        // Store references for animation
        this.avatar = {
            group: avatarGroup,
            head: head,
            body: body,
            leftHand: leftHand,
            rightHand: rightHand
        };
        
        // Position avatar
        avatarGroup.position.set(0, 0, 0);
        avatarGroup.scale.set(0.5, 0.5, 0.5);
        this.scene.add(avatarGroup);
    }
    
    createFloatingGeometry() {
        const shapes = [];
        
        // Create various geometric shapes
        const geometries = [
            new THREE.BoxGeometry(0.3, 0.3, 0.3),
            new THREE.SphereGeometry(0.2, 16, 8),
            new THREE.TetrahedronGeometry(0.25),
            new THREE.OctahedronGeometry(0.2),
            new THREE.ConeGeometry(0.15, 0.4, 8),
            new THREE.TorusGeometry(0.2, 0.08, 8, 16)
        ];
        
        const colors = [0xFFC777, 0x58A6FF, 0x00D4FF, 0xA855F7, 0xE879F9];
        
        for (let i = 0; i < 15; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            const material = new THREE.MeshPhongMaterial({
                color: color,
                transparent: true,
                opacity: 0.4,
                shininess: 100
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Random positions
            mesh.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            
            // Random rotation
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            // Store animation properties
            mesh.userData = {
                originalPosition: mesh.position.clone(),
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.01 + 0.005,
                floatRange: Math.random() * 2 + 1
            };
            
            shapes.push(mesh);
            this.scene.add(mesh);
        }
        
        this.geometries = shapes;
    }
    
    setupEventListeners() {
        // Mouse move for interactive elements
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX - this.windowHalf.x) / this.windowHalf.x;
            this.mouse.y = (event.clientY - this.windowHalf.y) / this.windowHalf.y;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.windowHalf.x = window.innerWidth / 2;
            this.windowHalf.y = window.innerHeight / 2;
            
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Scroll events for parallax effects
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            if (this.avatar) {
                this.avatar.group.rotation.y = scrollY * 0.001;
                this.avatar.group.position.y = Math.sin(scrollY * 0.002) * 0.5;
            }
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Animate avatar
        if (this.avatar) {
            // Gentle floating motion
            this.avatar.group.position.y += Math.sin(time * 2) * 0.001;
            this.avatar.head.rotation.y = Math.sin(time * 1.5) * 0.1;
            
            // Floating hands animation (Locomotive style)
            this.avatar.leftHand.position.y = 0.5 + Math.sin(time * 2 + 1) * 0.2;
            this.avatar.rightHand.position.y = 0.5 + Math.sin(time * 2) * 0.2;
            
            this.avatar.leftHand.rotation.z = Math.sin(time * 1.5) * 0.3;
            this.avatar.rightHand.rotation.z = Math.sin(time * 1.5 + Math.PI) * 0.3;
            
            // Mouse interaction
            this.avatar.group.rotation.x = this.mouse.y * 0.1;
            this.avatar.group.rotation.y += this.mouse.x * 0.001;
        }
        
        // Animate floating geometry
        this.geometries.forEach((shape) => {
            const userData = shape.userData;
            
            // Rotation animation
            shape.rotation.x += userData.rotationSpeed.x;
            shape.rotation.y += userData.rotationSpeed.y;
            shape.rotation.z += userData.rotationSpeed.z;
            
            // Floating motion
            shape.position.y = userData.originalPosition.y + 
                Math.sin(time * userData.floatSpeed) * userData.floatRange;
            
            // Mouse interaction
            const distance = shape.position.distanceTo(this.camera.position);
            if (distance < 10) {
                shape.position.x += this.mouse.x * 0.5;
                shape.position.y += this.mouse.y * 0.5;
            }
        });
        
        // Camera gentle motion
        this.camera.position.x += (this.mouse.x * 2 - this.camera.position.x) * 0.02;
        this.camera.position.y += (-this.mouse.y * 2 - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // Method to show/hide 3D elements based on scroll position
    updateVisibility(scrollProgress) {
        if (this.avatar) {
            const opacity = Math.max(0.2, 1 - scrollProgress);
            this.avatar.group.children.forEach(child => {
                if (child.material) {
                    child.material.opacity = opacity;
                }
            });
        }
        
        this.geometries.forEach((shape, index) => {
            const delay = index * 0.1;
            const opacity = Math.max(0.1, 1 - Math.max(0, scrollProgress - delay));
            shape.material.opacity = opacity;
        });
    }
}

// Performance check and initialization
function initThreeDAnimations() {
    // Check for WebGL support
    if (!window.WebGLRenderingContext) {
        console.log('WebGL not supported, skipping 3D animations');
        return;
    }
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        console.log('Reduced motion preferred, skipping 3D animations');
        return;
    }
    
    // Check device performance (basic check)
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
        console.log('WebGL context not available, skipping 3D animations');
        return;
    }
    
    // Initialize 3D animations
    new ThreeDAnimations();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThreeDAnimations, initThreeDAnimations };
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeDAnimations);
} else {
    initThreeDAnimations();
}