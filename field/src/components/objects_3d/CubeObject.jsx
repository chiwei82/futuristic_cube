import { useGLTF } from '@react-three/drei'
import { forwardRef, useEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { matrixVertexShader, matrixFragmentShader } from './shaders/cube_texture/boxTexture'

const CubeObject = forwardRef(function CubeObject(props, ref) {
    const { nodes } = useGLTF('./box.glb')
    const materialRef = useRef()
    const uTime = useRef(0)

    const lid_material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
        },
        vertexShader: matrixVertexShader,
        fragmentShader: matrixFragmentShader,
        transparent: true,
        side: THREE.DoubleSide
    })
    
    // Memoize the custom material so it's only created once
    const customMaterial_cubeBody = useMemo(() => {
        const mat = new THREE.MeshStandardMaterial({ 
            color: 'white',
            side: THREE.DoubleSide 
        })
        mat.onBeforeCompile = (shader) => {
            shader.uniforms.uTime = { value: 0 }
            shader.uniforms.custom_scale = { value: new THREE.Vector2( 1.0,  props.scale[1]) }
            materialRef.current = shader

            // Step 1: 宣告 vUv (插入 shader 頭部)
            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                `#include <common>
                varying vec2 vUv;
                uniform vec2 custom_scale;
                `
            )
            // Step 2: 在 main() 裡的適當位置賦值
            shader.vertexShader = shader.vertexShader.replace(
                '#include <uv_vertex>',
                `#include <uv_vertex>
                vUv = uv / custom_scale ;`
            )
            // 注入 uTime 前綴
            shader.fragmentShader = shader.fragmentShader.replace(
                'void main() {',
                `uniform float uTime; uniform vec2 custom_scale;\nvarying vec2 vUv;\nvoid main() {`
            )
            // 安全插入修改色彩段落
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <dithering_fragment>',
                `
                    mat2 rotate90 = mat2(0.0, -1.0, 1.0, 0.0);
                    vec2 rotatedUV = rotate90 * (vUv - 0.5) + 0.5;
                    float scale = 100.0 * custom_scale.y;
                    vec2 grid = floor(rotatedUV * scale) / scale;
                    float wave = sin(grid.y * 10.0 + uTime) * 0.1;
                    vec2 centerUV = fract(rotatedUV * scale) - 0.5;
                    centerUV.x += wave;
                    float gray = sin(rotatedUV.x * 10.0 + uTime) * 0.5 + 0.5;
                    float radius = 0.25 * (1.0 - gray);
                    float dist = length(centerUV);
                    float mask = smoothstep(radius, radius - 0.01, dist);
                    vec3 color0 = vec3(0.302, 0.0, 0.973);
                    vec3 color1 = vec3(0.0, 1.0, 0.0);
                    vec3 finalColor = mix(color0, color1, mask);
                    gl_FragColor = vec4(finalColor, 1.0);
                    #include <dithering_fragment>
                `
            )
        }
        return mat
    }, [])

    useEffect(() => {
        if (!nodes?.body || !nodes?.lid) return;
        nodes.body.material = customMaterial_cubeBody;
        nodes.body.material.needsUpdate = true;

        // 給 lid 指派 MeshPhysicalMaterial，transmission 設為 1
        nodes.lid.material = lid_material;
        nodes.lid.material.needsUpdate = true;
    }, [nodes?.body, nodes?.lid, customMaterial_cubeBody]);

    useFrame((_, delta) => {
        uTime.current += delta
        if (materialRef.current?.uniforms?.uTime) {
            materialRef.current.uniforms.uTime.value = uTime.current
            lid_material.uniforms.uTime.value = uTime.current
        }
    })

    if (!nodes?.body || !nodes?.lid) return null

    return (
        <group ref={ref} {...props}>
            <primitive object={nodes.body} />
            <primitive object={nodes.lid} />
        </group>
    )
})

export default CubeObject;
