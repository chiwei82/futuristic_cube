// MatrixShaderModule.jsx
export const matrixVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
export const matrixFragmentShader = `
  precision mediump float;

  uniform float uTime;
  varying vec2 vUv;

  float random(vec2 v) {
    return fract(sin(v.x * 32.1231 - v.y * 2.334 + 13399.2312) * 2412.32312);
  }
  float random(float x, float y) {
    return fract(sin(x * 32.1231 - y * 2.334 + 13399.2312) * 2412.32312);
  }
  float random(float x) {
    return fract(sin(x * 32.1231 + 13399.2312) * 2412.32312);
  }

  float hue2rgb(float f1, float f2, float hue) {
    if (hue < 0.0) hue += 1.0;
    else if (hue > 1.0) hue -= 1.0;
    float res;
    if ((6.0 * hue) < 1.0) res = f1 + (f2 - f1) * 6.0 * hue;
    else if ((2.0 * hue) < 1.0) res = f2;
    else if ((3.0 * hue) < 2.0) res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
    else res = f1;
    return res;
  }

  vec3 hsl2rgb(vec3 hsl) {
    vec3 rgb;
    if (hsl.y == 0.0) {
      rgb = vec3(hsl.z);
    } else {
      float f2 = hsl.z < 0.5 ? hsl.z * (1.0 + hsl.y) : hsl.z + hsl.y - hsl.y * hsl.z;
      float f1 = 2.0 * hsl.z - f2;
      rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
      rgb.g = hue2rgb(f1, f2, hsl.x);
      rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
    }
    return rgb;
  }

  int character(float i) {
    if (i == 0.) return 0x7b6f; // 0
    if (i == 1.) return 0x4d24; // 1
    if (i == 2.) return 0x79cf; // 2
    if (i == 3.) return 0x79e7; // 3
    if (i == 4.) return 0x5be4; // 4
    if (i == 5.) return 0x73e7; // 5
    if (i == 6.) return 0x73ef; // 6
    if (i == 7.) return 0x7924; // 7
    if (i == 8.) return 0x7bef; // 8
    if (i == 9.) return 0x7be7; // 9
    if (i == 10.) return 0x7bed; // A
    if (i == 11.) return 0x3beb; // B
    if (i == 12.) return 0x724f; // C
    if (i == 13.) return 0x3b6b; // D
    if (i == 14.) return 0x73cf; // E
    if (i == 15.) return 0x73c9; // F
    return 0;
  }

  void main() {
    vec2 coord = vUv;
    vec2 S = 50. * vec2(3., 2.);
    vec2 c = floor(coord * S);

    float offset = random(c.x) * S.x;
    float speed = (random(c.x * 3.) * 1. + 0.5) * .7;
    float len = random(c.x) * 15. + 10.;
    float X = c.y / len + uTime * speed + offset, _X = mod(X, 1.);
    float u = 1. - 2. * 1.23 * _X * (1.45 * _X) * (1. - pow(_X, 9.));

    float padding = 2.;
    vec2 smS = vec2(3., 5.);
    vec2 sm = floor(fract(coord * S) * (smS + vec2(padding))) - vec2(padding);
    int symbol = character(floor(random(c + floor(uTime * speed)) * 15.));
    bool s = sm.x < 0. || sm.x > smS.x || sm.y < 0. || sm.y > smS.y ? false
             : mod(floor(float(symbol) / pow(2., sm.x + sm.y * smS.x)), 2.) == 1.;

    // 彩虹顏色來源：c.x + c.y 做色相基礎 + 時間變化
    float hue = fract((c.x + c.y) / (S.x + S.y) + uTime * 0.05);
    vec3 color = hsl2rgb(vec3(hue, 1.0, 0.5));

    gl_FragColor = vec4(s ? color * u : vec3(0.), color);
  }
`
