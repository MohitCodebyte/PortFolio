export const auroraVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const auroraFragmentShader = /* glsl */ `
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
`;

