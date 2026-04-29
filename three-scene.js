/**
 * three-scene.js — Shared Three.js utility for Climate Change website
 * Provides: initEarth(), initParticles(), initMolecules()
 */

/* ─── Earth / Hero Scene ─────────────────────────────────────────────────── */
function initEarth(containerId) {
  const container = document.getElementById(containerId);
  if (!container || typeof THREE === 'undefined') return;

  const W = container.clientWidth, H = container.clientHeight;
  const scene   = new THREE.Scene();
  const camera  = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
  camera.position.z = 3.2;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  container.appendChild(renderer.domElement);

  /* ── Neon wireframe globe ── */
  const geo = new THREE.IcosahedronGeometry(1.1, 6);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x58a6ff,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  });
  const globe = new THREE.Mesh(geo, wireMat);
  scene.add(globe);

  /* ── Solid inner sphere with glow-ish gradient ── */
  const innerGeo = new THREE.SphereGeometry(1.08, 64, 64);
  const innerMat = new THREE.MeshPhongMaterial({
    color: 0x0a1628,
    emissive: 0x0d2a4a,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.85,
    shininess: 40,
  });
  const innerSphere = new THREE.Mesh(innerGeo, innerMat);
  scene.add(innerSphere);

  /* ── Continent-like patches (random icosahedron subsets) ── */
  const patchGeo = new THREE.IcosahedronGeometry(1.09, 3);
  const patchMat = new THREE.MeshPhongMaterial({
    color: 0x1a5c38,
    emissive: 0x0a2e1c,
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.9,
  });
  // Keep only ~35% of faces to simulate continents
  const positions = patchGeo.attributes.position;
  const totalTris = positions.count / 3;
  const keepMask = [];
  for (let i = 0; i < totalTris; i++) keepMask.push(Math.random() < 0.35);
  const newPositions = [];
  for (let i = 0; i < totalTris; i++) {
    if (keepMask[i]) {
      for (let j = 0; j < 3; j++) {
        const idx = i * 3 + j;
        newPositions.push(positions.getX(idx), positions.getY(idx), positions.getZ(idx));
      }
    }
  }
  const patchGeoFiltered = new THREE.BufferGeometry();
  patchGeoFiltered.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
  patchGeoFiltered.computeVertexNormals();
  const patches = new THREE.Mesh(patchGeoFiltered, patchMat);
  scene.add(patches);

  /* ── Atmosphere halo ── */
  const haloGeo = new THREE.SphereGeometry(1.22, 64, 64);
  const haloMat = new THREE.MeshPhongMaterial({
    color: 0x58a6ff,
    transparent: true,
    opacity: 0.06,
    side: THREE.BackSide,
  });
  scene.add(new THREE.Mesh(haloGeo, haloMat));

  /* ── Outer glow ring ── */
  const ringGeo = new THREE.SphereGeometry(1.35, 64, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x58a6ff,
    transparent: true,
    opacity: 0.025,
    side: THREE.BackSide,
  });
  scene.add(new THREE.Mesh(ringGeo, ringMat));

  /* ── Floating particles around earth ── */
  const particleCount = 500;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r = 1.5 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i * 3 + 2] = r * Math.cos(phi);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x58a6ff, size: 0.02, transparent: true, opacity: 0.6 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ── Lights ── */
  const ambLight = new THREE.AmbientLight(0x102040, 0.8);
  scene.add(ambLight);
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
  sunLight.position.set(5, 3, 5);
  scene.add(sunLight);
  const blueLight = new THREE.PointLight(0x58a6ff, 1.5, 10);
  blueLight.position.set(-3, 2, 2);
  scene.add(blueLight);

  /* ── Mouse parallax ── */
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── Resize ── */
  window.addEventListener('resize', () => {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  /* ── Animate ── */
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;
    const t = frame * 0.003;

    globe.rotation.y  += 0.002;
    globe.rotation.x  += 0.0003;
    patches.rotation.y = globe.rotation.y;
    patches.rotation.x = globe.rotation.x;
    innerSphere.rotation.y = globe.rotation.y * 0.8;

    particles.rotation.y += 0.0005;

    // Mouse parallax tilt
    const targetX = mouseY * 0.3;
    const targetY = mouseX * 0.3;
    globe.rotation.x += (targetX - globe.rotation.x) * 0.02;
    globe.rotation.y += (targetY - globe.rotation.y) * 0.01 + 0.002;
    patches.rotation.x = globe.rotation.x;
    innerSphere.rotation.x = globe.rotation.x;

    // Pulsing atmosphere
    haloMat.opacity = 0.04 + 0.02 * Math.sin(t * 1.5);
    wireMat.opacity = 0.14 + 0.06 * Math.sin(t);

    renderer.render(scene, camera);
  }
  animate();
}


/* ─── Starfield Particles (Evidence page) ───────────────────────────────── */
function initParticles(containerId) {
  const container = document.getElementById(containerId);
  if (!container || typeof THREE === 'undefined') return;

  const scene    = new THREE.Scene();
  const W = window.innerWidth, H = window.innerHeight;
  const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.prepend(renderer.domElement);

  const count = 2500;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 40;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    // Mix blue and white
    const t = Math.random();
    colors[i * 3]     = 0.3 + t * 0.7;
    colors[i * 3 + 1] = 0.5 + t * 0.4;
    colors[i * 3 + 2] = 1.0;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.7 });
  const stars = new THREE.Points(geo, mat);
  scene.add(stars);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += mouseX * 0.0005;
    stars.rotation.x += mouseY * 0.0005;
    stars.rotation.z += 0.0002;
    renderer.render(scene, camera);
  }
  animate();
}


/* ─── Molecule Visualizer (Causes page) ────────────────────────────────── */
function initMolecules(containerId) {
  const container = document.getElementById(containerId);
  if (!container || typeof THREE === 'undefined') return;

  const W = container.clientWidth;
  const H = container.clientHeight || 340;

  const scene   = new THREE.Scene();
  const camera  = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';
  container.appendChild(renderer.domElement);

  const ambLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambLight);
  const dirLight = new THREE.DirectionalLight(0x58a6ff, 1.5);
  dirLight.position.set(3, 5, 5);
  scene.add(dirLight);
  const pinkLight = new THREE.PointLight(0xff6b6b, 1.0, 20);
  pinkLight.position.set(-4, 0, 2);
  scene.add(pinkLight);

  // Molecule definitions: [center color, atom-offsets, bond-color]
  const molecules = [
    { // CO2
      label: 'co2',
      center: { color: 0x4fc3f7, r: 0.28 },
      atoms: [
        { pos: [-0.9, 0, 0], color: 0xff6b6b, r: 0.22 },
        { pos: [ 0.9, 0, 0], color: 0xff6b6b, r: 0.22 },
      ],
      offset: new THREE.Vector3(-2.5, 0.5, 0),
    },
    { // H2O
      label: 'h2o',
      center: { color: 0xff6b6b, r: 0.28 },
      atoms: [
        { pos: [-0.5, -0.7, 0], color: 0xffffff, r: 0.18 },
        { pos: [ 0.5, -0.7, 0], color: 0xffffff, r: 0.18 },
      ],
      offset: new THREE.Vector3(0, 0.5, 0),
    },
    { // CH4
      label: 'ch4',
      center: { color: 0xa5d6a7, r: 0.28 },
      atoms: [
        { pos: [ 0,    0.85,  0   ], color: 0xffffff, r: 0.16 },
        { pos: [ 0.8, -0.4,   0.4 ], color: 0xffffff, r: 0.16 },
        { pos: [-0.8, -0.4,   0.4 ], color: 0xffffff, r: 0.16 },
        { pos: [ 0,   -0.4,  -0.7 ], color: 0xffffff, r: 0.16 },
      ],
      offset: new THREE.Vector3(2.5, 0.5, 0),
    },
  ];

  const moleculeGroups = [];

  molecules.forEach((mol) => {
    const group = new THREE.Group();
    group.position.copy(mol.offset);

    // Center atom
    const cGeo = new THREE.SphereGeometry(mol.center.r, 32, 32);
    const cMat = new THREE.MeshPhongMaterial({ color: mol.center.color, emissive: mol.center.color, emissiveIntensity: 0.3, shininess: 80 });
    group.add(new THREE.Mesh(cGeo, cMat));

    // Outer atoms + bonds
    mol.atoms.forEach((a) => {
      const aGeo = new THREE.SphereGeometry(a.r, 32, 32);
      const aMat = new THREE.MeshPhongMaterial({ color: a.color, emissive: a.color, emissiveIntensity: 0.2, shininess: 60 });
      const aMesh = new THREE.Mesh(aGeo, aMat);
      aMesh.position.set(...a.pos);
      group.add(aMesh);

      // Bond (cylinder from 0,0,0 to atom pos)
      const start = new THREE.Vector3(0, 0, 0);
      const end = new THREE.Vector3(...a.pos);
      const bondDir = new THREE.Vector3().subVectors(end, start);
      const bondLen = bondDir.length();
      const bondGeo = new THREE.CylinderGeometry(0.04, 0.04, bondLen, 8);
      const bondMat = new THREE.MeshPhongMaterial({ color: 0x78909c, transparent: true, opacity: 0.7 });
      const bond = new THREE.Mesh(bondGeo, bondMat);
      bond.position.copy(start).addScaledVector(bondDir.normalize(), bondLen / 2);
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), bondDir.normalize());
      group.add(bond);
    });

    scene.add(group);
    moleculeGroups.push(group);
  });

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  container.addEventListener('mousemove', e => {
    const rect = container.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    mouseY = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    const nW = container.clientWidth;
    camera.aspect = nW / H;
    camera.updateProjectionMatrix();
    renderer.setSize(nW, H);
  });

  // Allow external highlight by gas card clicks
  window._highlightMolecule = (label) => {
    moleculeGroups.forEach((g, i) => {
      const isTarget = molecules[i].label === label;
      g.children.forEach(child => {
        if (child.material) {
          child.material.emissiveIntensity = isTarget ? 1.2 : 0.2;
        }
      });
    });
    setTimeout(() => {
      moleculeGroups.forEach(g => {
        g.children.forEach(child => {
          if (child.material) child.material.emissiveIntensity = 0.2;
        });
      });
    }, 1200);
  };

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;
    const t = frame * 0.008;

    moleculeGroups.forEach((g, i) => {
      g.rotation.y += 0.008 + i * 0.002;
      g.rotation.x  = Math.sin(t + i) * 0.15;
      g.position.y  = molecules[i].offset.y + Math.sin(t * 0.8 + i * 1.2) * 0.12;
    });

    // Gentle camera parallax
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();
}
