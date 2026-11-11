import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{U as t}from"./icons-vendor-CvrBJZEB.js";import{a as n,c as r,d as i,f as a,h as o,i as s,l as c,m as l,n as u,p as d,r as f,s as p,t as m,u as h}from"./three-vendor-CQpaGa7B.js";import{t as g}from"./index-D6Mc_nEq.js";import{i as _}from"./motion-vendor-WPEDGXzG.js";var v=e(t(),1),y=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,b=`
  precision mediump float;

  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform float uLiteMode;

  // Hash & 2D Value Noise
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = rot * p * 2.02 + vec2(0.15, -0.12);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 centered = uv - 0.5;

    // Deep obsidian base
    vec3 baseBg = vec3(0.022, 0.024, 0.055);
    vec3 neonPurple = vec3(0.45, 0.16, 0.78);
    vec3 neonBlue = vec3(0.18, 0.24, 0.72);
    vec3 neonCyan = vec3(0.06, 0.58, 0.72);

    if (uLiteMode > 0.5) {
      // Lightweight mobile shader path
      float wave = sin(uv.x * 4.0 + uTime * 0.35 + uScroll * 3.14) * 0.5 + 0.5;
      float radial = 1.0 - smoothstep(0.0, 0.9, length(centered));
      vec3 col = baseBg;
      col += neonPurple * wave * radial * 0.22;
      col += neonCyan * (1.0 - wave) * radial * 0.16;
      gl_FragColor = vec4(col, 1.0);
      return;
    }

    vec2 mouseOffset = uMouse * 0.14;
    vec2 q = uv * 2.4 + mouseOffset + vec2(0.0, uScroll * 1.6);

    float n1 = fbm(q + vec2(uTime * 0.08, -uTime * 0.05));
    float n2 = fbm(q * 1.4 - vec2(uTime * 0.06, uTime * 0.09) + n1 * 0.8);

    // Flowing aurora ribbons
    float ribbon1 = smoothstep(0.25, 0.78, sin((uv.y + n1 * 0.45 - uScroll * 0.6) * 5.0 + uTime * 0.25) * 0.5 + 0.5);
    float ribbon2 = smoothstep(0.35, 0.85, cos((uv.x - n2 * 0.4 + uScroll * 0.4) * 4.2 - uTime * 0.2) * 0.5 + 0.5);

    // Cursor spotlight glow
    vec2 mouseUv = uMouse * 0.5 + 0.5;
    float cursorGlow = smoothstep(0.55, 0.0, length(uv - mouseUv));

    vec3 color = baseBg;
    color = mix(color, neonBlue * 0.42, n1 * 0.55);
    color += neonPurple * ribbon1 * 0.24;
    color += neonCyan * ribbon2 * n2 * 0.22;
    color += mix(neonPurple, neonCyan, 0.5) * cursorGlow * 0.14;

    // Subtle vignette
    float vig = smoothstep(0.95, 0.2, length(centered));
    color *= mix(0.55, 1.0, vig);

    gl_FragColor = vec4(color, 1.0);
  }
`,x=_();function S({count:e=420,prefersReducedMotion:t=!1}){let n=(0,v.useRef)(null),i=(0,v.useMemo)(()=>new d,[]),a=(0,v.useMemo)(()=>{let t=[];for(let n=0;n<e;n++){let e=(n*9301+49297)%233280/233280,r=(n*4211+17231)%233280/233280,i=(n*7919+82311)%233280/233280,a=(e-.5)*28,o=(r-.5)*18,s=8-i*34,c=.018+n%7*.008,l=.15+n%5*.08,u=n*.37;t.push({x:a,y:o,z:s,scale:c,speed:l,phase:u})}return t},[e]),o=(0,v.useMemo)(()=>{let t=new Float32Array(e*3),n=[new h(`#a855f7`),new h(`#22d3ee`),new h(`#818cf8`),new h(`#e879f9`),new h(`#f4f4f5`)];for(let r=0;r<e;r++){let e=n[r%n.length];t[r*3]=e.r,t[r*3+1]=e.g,t[r*3+2]=e.b}return t},[e]);return(0,v.useEffect)(()=>{let e=n.current;if(e)return a.forEach((t,n)=>{i.position.set(t.x,t.y,t.z),i.scale.setScalar(t.scale),i.updateMatrix(),e.setMatrixAt(n,i.matrix)}),e.instanceMatrix.needsUpdate=!0,()=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()}},[a,i]),r(r=>{let o=n.current;if(!o||t)return;let s=r.clock.getElapsedTime(),c=g.pointer.x,l=g.pointer.y,u=Math.min(2.5,Math.max(-2.5,g.scrollVelocity*.04));for(let t=0;t<e;t++){let e=a[t],n=e.x+Math.sin(s*e.speed+e.phase)*.25+c*.45,r=e.y+Math.cos(s*e.speed+e.phase)*.25+l*.35,d=e.z+u*.4;i.position.set(n,r,d);let f=e.scale*(.85+.3*Math.sin(s*1.5+e.phase));i.scale.set(f,f,f*(1+Math.abs(u)*1.6)),i.updateMatrix(),o.setMatrixAt(t,i.matrix)}o.instanceMatrix.needsUpdate=!0}),(0,x.jsxs)(`instancedMesh`,{ref:n,args:[null,null,e],frustumCulled:!1,children:[(0,x.jsx)(`octahedronGeometry`,{args:[1,0],children:(0,x.jsx)(`instancedBufferAttribute`,{attach:`attributes-color`,args:[o,3]})}),(0,x.jsx)(`meshBasicMaterial`,{vertexColors:!0,transparent:!0,opacity:.78})]})}function C({isMobile:e=!1,prefersReducedMotion:t=!1}){let n=(0,v.useRef)(null),o=(0,v.useRef)(null),s=(0,v.useRef)(null),l=(0,v.useRef)(null),u=(0,v.useRef)(null),d=(0,v.useRef)(null),f=(0,v.useMemo)(()=>[{id:0,basePos:[1.55,1.15,-.4],scale:.12,speed:.6,phase:.2,isCyan:!0},{id:1,basePos:[1.75,-1.05,.3],scale:.1,speed:.5,phase:1.7,isCyan:!1},{id:2,basePos:[.4,1.45,-.8],scale:.09,speed:.7,phase:3.1,isCyan:!0}],[]),p=(0,v.useMemo)(()=>{let e=[];f.forEach(t=>{e.push(0,0,0,t.basePos[0],t.basePos[1],t.basePos[2])});let t=new c;return t.setAttribute(`position`,new i(e,3)),t},[f]);(0,v.useEffect)(()=>()=>{p.dispose()},[p]);let m=(0,v.useMemo)(()=>[{id:`about-margin`,pos:[5.4,1.6,-2.8],color:`#a855f7`,scale:.45},{id:`skills-margin`,pos:[-5.6,-1.4,-6.8],color:`#22d3ee`,scale:.48},{id:`exp-margin`,pos:[5.5,1.5,-10.8],color:`#6366f1`,scale:.42},{id:`projects-margin`,pos:[-5.8,1.8,-14.8],color:`#a855f7`,scale:.5},{id:`edu-margin`,pos:[5.4,-1.5,-17.8],color:`#22d3ee`,scale:.42},{id:`contact-margin`,pos:[5.6,1.4,-21.2],color:`#a855f7`,scale:.45}],[]);return r((r,i)=>{if(t)return;let c=r.clock.getElapsedTime(),p=g.pointer.x,m=g.pointer.y,h=Math.min(2.5,Math.max(-2.5,g.scrollVelocity*.025));if(n.current){let t=e?1.85:2.75+p*.28,r=e?1.75:.1+m*.22;n.current.position.x=a.lerp(n.current.position.x,t,i*3.5),n.current.position.y=a.lerp(n.current.position.y,r,i*3.5),n.current.rotation.y+=i*(.22+Math.abs(h)*.25),n.current.rotation.x=a.lerp(n.current.rotation.x,m*.25+h*.08,i*4)}if(o.current&&(o.current.rotation.x=c*.32,o.current.rotation.y=c*.2),s.current&&(s.current.rotation.z=-c*.42,s.current.rotation.x=Math.sin(c*.5)*.4),l.current){let e=1+Math.sin(c*1.8)*.04;l.current.scale.setScalar(e),l.current.rotation.y=-c*.35}u.current&&u.current.children.forEach((e,t)=>{let n=f[t];n&&(e.position.y=n.basePos[1]+Math.sin(c*n.speed+n.phase)*.14,e.rotation.x=c*n.speed,e.rotation.y=c*(n.speed*.8))}),d.current&&d.current.children.forEach((e,t)=>{e.rotation.y=c*(.18+t*.03),e.rotation.x=Math.sin(c*.3+t)*.2})}),(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)(`group`,{ref:n,position:[e?1.85:2.75,e?1.75:.1,3],scale:e?.58:.92,children:[(0,x.jsxs)(`mesh`,{ref:l,children:[(0,x.jsx)(`icosahedronGeometry`,{args:[.88,1]}),(0,x.jsx)(`meshPhysicalMaterial`,{color:`#1e1b4b`,emissive:`#6d28d9`,emissiveIntensity:.5,metalness:.4,roughness:.14,clearcoat:1,clearcoatRoughness:.1,iridescence:.7,iridescenceIOR:1.4})]}),(0,x.jsxs)(`mesh`,{scale:1.06,children:[(0,x.jsx)(`icosahedronGeometry`,{args:[.9,1]}),(0,x.jsx)(`meshBasicMaterial`,{color:`#22d3ee`,wireframe:!0,transparent:!0,opacity:.32})]}),(0,x.jsxs)(`mesh`,{ref:o,children:[(0,x.jsx)(`torusGeometry`,{args:[1.38,.022,16,72]}),(0,x.jsx)(`meshStandardMaterial`,{color:`#a855f7`,emissive:`#a855f7`,emissiveIntensity:1,metalness:.8,roughness:.2})]}),(0,x.jsxs)(`mesh`,{ref:s,rotation:[Math.PI/3,0,0],children:[(0,x.jsx)(`torusGeometry`,{args:[1.68,.016,16,72]}),(0,x.jsx)(`meshStandardMaterial`,{color:`#22d3ee`,emissive:`#22d3ee`,emissiveIntensity:1,metalness:.8,roughness:.2})]}),(0,x.jsx)(`lineSegments`,{geometry:p,children:(0,x.jsx)(`lineBasicMaterial`,{color:`#818cf8`,transparent:!0,opacity:.18})}),(0,x.jsx)(`group`,{ref:u,children:f.map(e=>(0,x.jsxs)(`mesh`,{position:e.basePos,scale:e.scale,children:[(0,x.jsx)(`octahedronGeometry`,{args:[1,0]}),(0,x.jsx)(`meshPhysicalMaterial`,{color:e.isCyan?`#22d3ee`:`#a855f7`,emissive:e.isCyan?`#0891b2`:`#7e22ce`,emissiveIntensity:.7,metalness:.6,roughness:.2})]},e.id))})]}),!e&&(0,x.jsx)(`group`,{ref:d,children:m.map(e=>(0,x.jsx)(`group`,{position:e.pos,scale:e.scale,children:(0,x.jsxs)(`mesh`,{children:[(0,x.jsx)(`octahedronGeometry`,{args:[.65,0]}),(0,x.jsx)(`meshBasicMaterial`,{color:e.color,wireframe:!0,transparent:!0,opacity:.13})]})},e.id))})]})}function w({isMobile:e,prefersReducedMotion:t}){let n=(0,v.useRef)(null),i=(0,v.useMemo)(()=>({uTime:{value:0},uScroll:{value:0},uMouse:{value:new l(0,0)},uLiteMode:{value:+!!e}}),[e]);return r(r=>{n.current&&(t||(n.current.uniforms.uTime.value=r.clock.getElapsedTime()),n.current.uniforms.uScroll.value=g.scrollProgress,n.current.uniforms.uMouse.value.set(g.pointer.x,g.pointer.y),n.current.uniforms.uLiteMode.value=+!!e)}),(0,x.jsxs)(`mesh`,{position:[0,0,-28],scale:[70,45,1],children:[(0,x.jsx)(`planeGeometry`,{args:[1,1,1,1]}),(0,x.jsx)(`shaderMaterial`,{ref:n,vertexShader:y,fragmentShader:b,uniforms:i,depthWrite:!1})]})}function T({prefersReducedMotion:e}){let t=(0,v.useRef)(new o(0,0,0)),n=(0,v.useRef)(new o(0,.2,8.5)),i=(0,v.useRef)(new o(0,0,0));return r((r,o)=>{let s=r.camera,c=g.scrollProgress,l=g.pointer.x,u=g.pointer.y,d=Math.min(2.5,Math.max(-2.5,g.scrollVelocity*.015)),f=8.5-c*21.5,p=g.targetWaypoint,m=p.position[0]*.45+l*(e?.05:.45),h=p.position[1]*.45+u*(e?.05:.32),_=a.lerp(f,p.position[2],.35);n.current.set(m,h,_),i.current.set(p.lookAt[0]*.35+l*.2,p.lookAt[1]*.35+u*.15-d*.25,_-6.5);let v=e?12:3.2;s.position.lerp(n.current,Math.min(1,o*v)),t.current.lerp(i.current,Math.min(1,o*v)),s.lookAt(t.current),e||(s.rotation.z=a.lerp(s.rotation.z,-l*.035+d*.018,Math.min(1,o*4)))}),null}function E({capabilities:e}){let{webglSupported:t,isMobile:r,prefersReducedMotion:i,dpr:a}=e,[o,c]=(0,v.useState)(!1);if(!t)return(0,x.jsx)(`div`,{"aria-hidden":`true`,className:`fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.22),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(34,211,238,0.18),transparent_55%),#06060e]`});let l=!r&&!i&&!o;return(0,x.jsx)(`div`,{"aria-hidden":`true`,className:`fixed inset-0 z-0 pointer-events-none overflow-hidden`,children:(0,x.jsxs)(p,{dpr:[1,a],camera:{position:[0,.2,8.5],fov:46,near:.1,far:60},gl:{powerPreference:`high-performance`,antialias:!l,alpha:!1,stencil:!1,depth:!0},children:[(0,x.jsx)(`color`,{attach:`background`,args:[`#06060e`]}),(0,x.jsx)(`fog`,{attach:`fog`,args:[`#06060e`,10,34]}),(0,x.jsx)(n,{onDecline:()=>c(!0),flipflops:2,onFallback:()=>c(!0)}),(0,x.jsx)(`ambientLight`,{intensity:.65}),(0,x.jsx)(`directionalLight`,{position:[6,8,6],intensity:1.8,color:`#a855f7`}),(0,x.jsx)(`directionalLight`,{position:[-6,-5,4],intensity:1.6,color:`#22d3ee`}),(0,x.jsx)(`pointLight`,{position:[0,3,5],intensity:1.4,color:`#6366f1`,distance:20}),(0,x.jsx)(w,{isMobile:r||o,prefersReducedMotion:i}),(0,x.jsx)(S,{count:r||o?140:420,prefersReducedMotion:i}),(0,x.jsx)(C,{isMobile:r,prefersReducedMotion:i}),(0,x.jsx)(T,{prefersReducedMotion:i}),l&&(0,x.jsxs)(f,{disableNormalPass:!0,multisampling:0,children:[(0,x.jsx)(m,{intensity:.65,luminanceThreshold:.35,luminanceSmoothing:.85,mipmapBlur:!0}),(0,x.jsx)(u,{offset:[6e-4,6e-4],radialModulation:!1,modulationOffset:.15}),(0,x.jsx)(s,{eskil:!1,offset:.15,darkness:.75})]})]})})}export{E as default};