import React, { useRef, useEffect } from "react";



const fragShader = `
#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_resolution;
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float yLines = step(0.95, fract(uv.y * 40.0));
  float xLines = step(0.98, fract(uv.x * 80.0));
  float glitch = step(0.8, random(vec2(u_time * 2.0, uv.y * 100.0 + u_time * 10.0)));
  float flicker = step(0.7, random(vec2(u_time * 10.0, uv.x * 200.0)));
  float color = max(yLines, xLines);
  color = max(color, glitch * flicker);
  gl_FragColor = vec4(vec3(color), 1.0);
}
`;


function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const msg = gl.getShaderInfoLog(shader);
    console.error('Shader compile error:', msg, '\nSource:', source);
    throw new Error(msg);
  }
  return shader;
}

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }
  return program;
}

const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0, 1);
}`;

export default function DatamaticsShader() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    // Setup GLSL program
    const program = createProgram(gl, vertexShader, fragShader);
    gl.useProgram(program);
    // Set up rectangle covering the screen
    const positionLoc = gl.getAttribLocation(program, "position");
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
      ]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    // Uniforms
    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    let running = true;
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);
    let start = Date.now();
    function render() {
      if (!running) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, (Date.now() - start) * 0.001);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }
    render();
    return () => {
      running = false;
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        display: "block",
      }}
    />
  );
}
