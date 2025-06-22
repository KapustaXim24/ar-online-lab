import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';

document.addEventListener('DOMContentLoaded', () => {
    const start = async () => {
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.querySelector(".container"),
            imageTargetSrc: './targets.mind',
            maxTrack: 2,
        });
        const { renderer, scene, camera } = mindarThree;

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        // --- МАРКЕР 1: ВІДЕО ---
        const video = document.createElement("video");
        // Вказуємо пряме посилання на відео з інтернету
        video.src = "https://download.blender.org/demo/movies/BBB/bbb_sunflower_1080p_30fps_normal.mp4";
        video.crossOrigin = "anonymous"; // Важливо для завантаження з іншого домену
        video.loop = true;
        video.muted = true;

        const videoTexture = new THREE.VideoTexture(video);
        const videoPlaneGeometry = new THREE.PlaneGeometry(1, 1080/1920); // Співвідношення сторін відео
        const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
        const videoMesh = new THREE.Mesh(videoPlaneGeometry, videoMaterial);

        const videoAnchor = mindarThree.addAnchor(0);
        videoAnchor.group.add(videoMesh);

        videoAnchor.onTargetFound = () => { video.play(); }
        videoAnchor.onTargetLost = () => { video.pause(); }

        // --- МАРКЕР 2: 3D-МОДЕЛЬ ---
        const loader = new GLTFLoader();
        // Вказуємо пряме посилання на модель з інтернету
        loader.load("https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/image-tracking/assets/band-example/bear/scene.gltf", (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.1, 0.1, 0.1);
            model.position.set(0, -0.4, 0);

            const modelAnchor = mindarThree.addAnchor(1);
            modelAnchor.group.add(model);
        });

        // Запуск
        await mindarThree.start();
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });
    }
    start();
});
