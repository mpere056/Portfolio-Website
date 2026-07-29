import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  PIANO_CLEARING_CAMERA,
  PIANO_CLEARING_PIANO,
  PIANO_CLEARING_PERFORMANCE,
  pianoClearingCameraFov,
  pianoClearingRiverCenterX,
  pianoClearingRiverWidth,
  pianoClearingTerrainHeight,
  pianoClearingTreeAllowed,
} from '@/lib/artDirection/pianoClearing';

const root = process.cwd();

describe('piano clearing Home proof', () => {
  it('keeps the first environmental proof deliberately bounded', () => {
    expect(PIANO_CLEARING_PERFORMANCE.grassInstances).toBeLessThanOrEqual(220000);
    expect(PIANO_CLEARING_PERFORMANCE.pianoParticles).toBeLessThanOrEqual(9000);
    expect(PIANO_CLEARING_PERFORMANCE.maxDpr).toBeLessThanOrEqual(1.25);
    expect(PIANO_CLEARING_PERFORMANCE.horizonTrees).toBeLessThanOrEqual(60);
    expect(PIANO_CLEARING_PERFORMANCE.valleyRocks).toBeLessThanOrEqual(24);
    expect(PIANO_CLEARING_PERFORMANCE.wildflowers).toBeLessThanOrEqual(160);
    expect(PIANO_CLEARING_PERFORMANCE.atmosphericMotes).toBeLessThanOrEqual(200);
    expect(PIANO_CLEARING_PERFORMANCE.bridgeArches).toBe(5);
    expect(PIANO_CLEARING_PERFORMANCE.distantBirds).toBe(7);
    expect(PIANO_CLEARING_PERFORMANCE.realtimeShadows).toBe(false);
    expect(PIANO_CLEARING_PERFORMANCE.postProcessing).toBe(false);
  });

  it('uses a restrained oblique overlook from the sunlit right meadow', () => {
    expect(PIANO_CLEARING_CAMERA.position[0]).toBeGreaterThanOrEqual(18);
    expect(PIANO_CLEARING_CAMERA.position[2]).toBeGreaterThanOrEqual(22);
    expect(PIANO_CLEARING_CAMERA.target[0]).toBeGreaterThan(8.8);
    expect(PIANO_CLEARING_CAMERA.position[1] - PIANO_CLEARING_CAMERA.target[1])
      .toBeGreaterThan(0.5);
    expect(PIANO_CLEARING_CAMERA.target[2]).toBeLessThan(-6);
    expect(pianoClearingCameraFov(16 / 9)).toBe(PIANO_CLEARING_CAMERA.fov);
    expect(pianoClearingCameraFov(1.22)).toBeGreaterThan(PIANO_CLEARING_CAMERA.fov);
    expect(pianoClearingCameraFov(1.22)).toBeLessThanOrEqual(
      PIANO_CLEARING_CAMERA.maxVerticalFov,
    );
    expect(PIANO_CLEARING_CAMERA.maxPointerTravel).toBe(0.18);
  });

  it('places the piano on the near right meadow, safely outside the ravine', () => {
    const riverCenter = pianoClearingRiverCenterX(PIANO_CLEARING_PIANO.z);
    const riverClearance = pianoClearingRiverWidth(PIANO_CLEARING_PIANO.z);

    expect(PIANO_CLEARING_PIANO.x - riverCenter).toBeGreaterThan(riverClearance + 12);
    expect(pianoClearingTerrainHeight(
      PIANO_CLEARING_PIANO.x,
      PIANO_CLEARING_PIANO.z,
    )).toBeGreaterThan(4.5);
  });

  it('separates the piano plateau, steep descent, river floor, and opposite hillside', () => {
    const nearZ = 4;
    const farZ = -27;
    const nearCenter = pianoClearingRiverCenterX(nearZ);
    const farCenter = pianoClearingRiverCenterX(farZ);
    const riverFloor = pianoClearingTerrainHeight(nearCenter, nearZ);
    const rightPlateau = pianoClearingTerrainHeight(nearCenter + 12, nearZ);
    const leftPlateau = pianoClearingTerrainHeight(nearCenter - 12, nearZ);

    expect(rightPlateau - riverFloor).toBeGreaterThan(6);
    expect(leftPlateau - riverFloor).toBeGreaterThan(5);
    expect(nearCenter).toBeLessThan(farCenter);
    expect(pianoClearingRiverWidth(nearZ)).toBeGreaterThan(3.5);
    expect(pianoClearingRiverWidth(farZ)).toBeLessThan(2);
  });

  it('keeps horizon trees clear of the river and steep ravine walls', () => {
    for (const z of [-28, -32, -36, -40]) {
      const riverCenter = pianoClearingRiverCenterX(z);
      expect(pianoClearingTreeAllowed(riverCenter, z)).toBe(false);
      expect(pianoClearingTreeAllowed(riverCenter + 3, z)).toBe(false);
      expect(pianoClearingTreeAllowed(riverCenter - 3, z)).toBe(false);
      expect(
        pianoClearingTreeAllowed(
          riverCenter + pianoClearingRiverWidth(z) + 9,
          z,
        ),
      ).toBe(true);
    }
  });

  it('renders the existing piano as one bounded particle cloud in a fixed scenic world', async () => {
    const component = await readFile(
      path.join(root, 'src/components/home/PianoClearingProof.tsx'),
      'utf8',
    );

    expect(component).toContain("useGLTF('/models/grand_piano/grand_piano_(GLB).gltf')");
    expect(component).toContain('<ParticlePiano reducedMotion={reducedMotion} />');
    expect(component).toContain('<Suspense fallback={null}>');
    expect(component).toContain('opacity: 0.3');
    expect(component).toContain('new THREE.Box3().setFromObject(scene)');
    expect(component).toContain('GROUND_Y + pianoClearingTerrainHeight(PIANO_X, PIANO_Z) + 0.035');
    expect(component).toContain('vec3 pearl = vec3(1.0, 0.84, 0.94)');
    expect(component).toContain('blending: THREE.NormalBlending');
    expect(component).not.toContain('vec3 blue = vec3(0.16, 0.46, 0.72)');
    expect(component).toContain('<Stream reducedMotion={reducedMotion} />');
    expect(component).toContain('data-river-flow="far-to-foreground"');
    expect(component).toContain('vUv.y * 46.0 + time * 2.3');
    expect(component).toContain('<ValleyDetails />');
    expect(component).toContain('new THREE.ShaderMaterial');
    expect(component).toContain('<GrassField reducedMotion={reducedMotion} />');
    expect(component).toContain('<Ground reducedMotion={reducedMotion} />');
    expect(component).toContain('vec3 tipColor = vec3(0.87, 0.52, 0.7)');
    expect(component).toContain('float windBand = sin');
    expect(component).toContain('uWind: { value: reducedMotion ? 0 : 0.34 }');
    expect(component).toContain('uniform vec2 uCursor');
    expect(component).toContain('float cursorFalloff = 1.0 - smoothstep(0.15, 3.2, cursorDistance)');
    expect(component).toContain('const pointerDelta = previousPointer.current.distanceTo(pointer)');
    expect(component).toContain('THREE.MathUtils.clamp(pointerDelta * 34, 0, 1)');
    expect(component).toContain('smoothedCursorPoint.current.x = THREE.MathUtils.damp');
    expect(component).toContain('cursorImpulse.current = Math.max(cursorImpulse.current, movementEnergy)');
    expect(component).toContain('data-grass-wind="0.34"');
    expect(component).toContain('data-cloud-streaks="procedural-wisps"');
    expect(component).toContain('<SkyDome reducedMotion={reducedMotion} />');
    expect(component).toContain('className={styles.cloudStreaks}');
    expect(component).toContain('data-grass-cursor="terrain-local-3.2"');
    expect(component).toContain('data-distant-birds={PIANO_CLEARING_PERFORMANCE.distantBirds}');
    expect(component).toContain('data-color-script="dusk-refrain"');
    expect(component).toContain('Dusk Refrain');
    expect(component).toContain('new THREE.InstancedBufferGeometry()');
    expect(component).toContain('const z = 24 - random() * 61');
    expect(component).toContain("geometry.setAttribute('iRoot'");
    expect(component).toContain("geometry.setAttribute('iParams'");
    expect(component).not.toContain('pianoGap');
    expect(component).toContain('steepRavineEdge');
    expect(component).not.toContain('vPianoShade');
    expect(component).toContain('new THREE.PlaneGeometry(92, 96, 92, 96)');
    expect(component).toContain('const z = 12 - progress * 68');
    expect(component).toContain('1.0 - smoothstep(0.72, 0.94, vUv.y)');
    expect(component).toContain('const span = 160');
    expect(component).not.toContain('<PianoShadow />');
    expect(component).toContain('vec3 sunlitColor = vec3(0.77, 0.4, 0.65)');
    expect(component).toContain('pianoClearingTreeAllowed(x, z)');
    expect(component).toContain('ref={crownHighlights}');
    expect(component).toContain('<StoneViaduct />');
    expect(component).not.toContain('function PassingTrain');
    expect(component).not.toContain('<PassingTrain');
    expect(component).toContain('<DistantBirds reducedMotion={reducedMotion} />');
    expect(component).toContain('<instancedMesh');
    expect(component).toContain('<CameraRig reducedMotion={reducedMotion} />');
    expect(component).toContain('pianoClearingCameraFov(size.width / Math.max(size.height, 1))');
    expect(component).not.toContain('<primitive object={piano}');
    expect(component).not.toContain('OrbitControls');
    expect(component).not.toContain('EffectComposer');
    expect(component).not.toContain('category-screen');
    expect(component).not.toContain('piano-player');
    expect(component).not.toContain('shadowMap');
  });

  it('promotes the clearing to canonical Home while retaining the review route', async () => {
    const [proofPage, homePage, presentationPage] = await Promise.all([
      readFile(path.join(root, 'src/app/home-world-proof/page.tsx'), 'utf8'),
      readFile(path.join(root, 'src/app/page.tsx'), 'utf8'),
      readFile(path.join(root, 'src/app/presentation/page.tsx'), 'utf8'),
    ]);

    expect(proofPage).toContain('robots: { index: false, follow: false }');
    expect(proofPage).toContain('<PianoClearingProof />');
    expect(homePage).toContain('<PianoClearingProof />');
    expect(homePage).toContain('href="/presentation"');
    expect(homePage).toContain('Today&apos;s presentation');
    expect(presentationPage).toContain('<AboutPresentation />');
    expect(presentationPage).toContain('robots: { index: false, follow: false }');
  });
});
