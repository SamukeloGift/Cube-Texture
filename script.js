// get every Element
let image = document.querySelector("img");
let canvas = document.querySelector("canvas");
if (!canvas) {
  console.log("No canvas found...");
  canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
}
const webgl = canvas.getContext("webgl");
if (!webgl) {
  console.log("Webgl not found... ");
  webgl = canvas.getContext("experimental-webgl");
  if (!webgl) {
    console.log("Web terminating...");
    // return null;
  }
}
let cubeVert = new Float32Array([
  //Front Face
  0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5,
  //Back Face
  0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5,
  //Left Side
  -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5,
  //Right Side
  0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5,
  //TOP
  0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
  //Buttom side
  0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
]);
let Texturecod = new Float32Array([
  // Front face
  0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,

  // Back face
  1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0,

  // Top face
  0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,

  // // Bottom face
  0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,

  // // Left face
  0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,

  // // Right face
  0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,
]);
webgl.enable(webgl.DEPTH_TEST);
let buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, cubeVert, webgl.STATIC_DRAW);

//Texture Buffer
let texcoBuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, texcoBuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, Texturecod, webgl.STATIC_DRAW);

//Creating Texture
let textBufer = webgl.createTexture();
webgl.bindTexture(webgl.TEXTURE_2D, textBufer);
webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
webgl.texParameteri(
  webgl.TEXTURE_2D,
  webgl.TEXTURE_WRAP_S,
  webgl.CLAMP_TO_EDGE
);
webgl.texParameteri(
  webgl.TEXTURE_2D,
  webgl.TEXTURE_WRAP_T,
  webgl.CLAMP_TO_EDGE
);

webgl.texImage2D(
  webgl.TEXTURE_2D,
  0,
  webgl.RGBA,
  webgl.RGBA,
  webgl.UNSIGNED_BYTE,
  image
);

let vsShader = `
precision highp float;
attribute vec3 vecposition;
uniform mat4 rotateY;
uniform mat4 rotateX;
uniform mat4 rotateZ;
attribute vec2 vtexture;
varying vec2 fragtexture;
void main()
{
    fragtexture = vtexture;
    gl_Position = rotateX*rotateY*vec4(vecposition, 1.0);
    gl_PointSize = 5.0;
}
`;
let fsShader = `
precision highp float;
uniform vec3 color;
varying vec2 fragtexture;
uniform sampler2D fragSampler;
void main()
{
     vec4 tex = texture2D(fragSampler, fragtexture);
     gl_FragColor = vec4(tex.rgb,tex.a);
}
`;

let vShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(vShader, vsShader);
webgl.compileShader(vShader);
if (!webgl.getShaderParameter(vShader, webgl.COMPILE_STATUS)) {
  console.log("error found! ", webgl.getShaderInfoLog(vShader));
  webgl.deleteShader(vShader);
}

let fShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(fShader, fsShader);
webgl.compileShader(fShader);
if (!webgl.getShaderParameter(fShader, webgl.COMPILE_STATUS)) {
  console.log("error found! ", webgl.getShaderInfoLog(fShader));
  webgl.deleteShader(fShader);
}

let program = webgl.createProgram();
webgl.attachShader(program, vShader);
webgl.attachShader(program, fShader);
webgl.linkProgram(program);
webgl.useProgram(program);
if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
  console.log("error found! ", webgl.getProgramInfoLog(program));
  webgl.deleteProgram(program);
}
jhxbvjbdfj
kvhjfn

webgl.enable(webgl.BLEND);
webgl.blendFunc(webgl.SRC_ALPHA, webgl.ONE_MINUS_SRC_ALPHA);
//webgl.blendFunc(webgl.ONE, webgl.ONE_MINUS_SRC_ALPHA);

if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
  console.log(webgl.getProgramInfoLog(program));
}
let Position = webgl.getAttribLocation(program, "vecposition");
console.log(Position);
webgl.enableVertexAttribArray(Position);
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.vertexAttribPointer(Position, 3, webgl.FLOAT, false, 0, 0);
webgl.clearColor(0.0, 0.0, 1.0, 1.0);
webgl.clear(webgl.COLOR_BUFFER_BIT);

let textPos = webgl.getAttribLocation(program, "vtexture");
webgl.enableVertexAttribArray(textPos);
webgl.bindBuffer(webgl.ARRAY_BUFFER, texcoBuffer);
webgl.vertexAttribPointer(textPos, 2, webgl.FLOAT, false, 0, 0);
let angle = Math.PI / 500;
let unloc = webgl.getUniformLocation(program, "rotateY");
let unloc2 = webgl.getUniformLocation(program, "rotateX");
let unloc3 = webgl.getUniformLocation(program, "rotateZ");
let colorloc = webgl.getUniformLocation(program, "color");

function draw() {
  webgl.clear(webgl.COLOR_BUFFER_BIT) | webgl.clear(webgl.DEPTH_BUFFER_BIT);
  webgl.uniformMatrix4fv(unloc, false, rotateY(angle));
  webgl.uniformMatrix4fv(unloc2, false, rotateX(angle));
  webgl.uniformMatrix4fv(unloc3, false, rotateZ(angle));
  webgl.uniform3f(colorloc, 0.0, 1.0, 1.0);
  // webgl.drawArrays(webgl.TRIANGLE_FAN, 0, 4);
  webgl.uniform3f(colorloc, 1.0, 1.0, 0.0);
  // webgl.drawArrays(webgl.TRIANGLE_FAN, 4, 4);
  webgl.uniform3f(colorloc, 0.0, 1.0, 0.0);
  // webgl.drawArrays(webgl.TRIANGLE_FAN, 8, 4);
  webgl.uniform3f(colorloc, 0.3, 0.3, 0.0);
  webgl.drawArrays(webgl.TRIANGLE_STRIP, 12, 4);
  webgl.uniform3f(colorloc, 1, 0.0, 0.1);
  webgl.drawArrays(webgl.TRIANGLE_STRIP, 16, 4);
  webgl.uniform3f(colorloc, 0, 0.5, 0.5);
  webgl.drawArrays(webgl.TRIANGLE_STRIP, 20, 4);
  angle += 0.01;
  window.requestAnimationFrame(draw);
}
function rotateY(angle) {
  let Cosine, Sine;
  (Cosine = Math.cos(angle)), (Sine = Math.sin(angle));
  return new Float32Array([
    Cosine,
    0,
    -Sine,
    0,
    0,
    1,
    0,
    0,
    Sine,
    0,
    Cosine,
    0,
    0,
    0,
    0,
    1,
  ]);
}
function rotateX(angle) {
  let Cosine = Math.cos(angle);
  let Sine = Math.sin(angle);
  return new Float32Array([
    1,
    0,
    0,
    0,
    0,
    Cosine,
    -Sine,
    0,
    0,
    Sine,
    Cosine,
    0,
    0,
    0,
    0,
    1,
  ]);
}
function rotateZ(angle) {
  let Cosine, Sine;
  (Cosine = Math.cos(angle)), (Sine = Math.sin(angle));
  return new Float32Array([
    Cosine,
    -Sine,
    0,
    0,
    Sine,
    Cosine,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
  ]);
}
draw();
