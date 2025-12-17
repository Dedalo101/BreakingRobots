import React, { useRef, useEffect } from "react";

// GLSL fragment shader for glitchy, datamatix-inspired effect with true randomness
const fragShader = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;

  // Hash function for randomness
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;

    // Glitchy grid
    float gridSize = mix(20.0, 80.0, hash(vec2(u_time, 0.0)));
    vec2 grid = floor(uv * gridSize);
    float cell = hash(grid + floor(u_time * 2.0));
    float glitch = step(0.85, cell);

    // Random flash
    float flash = step(0.98, hash(vec2(floor(u_time * 3.0), 99.0)));
    float flash2 = step(0.995, hash(vec2(floor(u_time * 7.0), 199.0)));

    // Flicker effect
    float flicker = step(0.5, fract(sin(u_time * 10.0 + uv.x * 100.0) * 10000.0));

    // High contrast black/white with random flashes
    vec3 color = mix(vec3(0.05), vec3(1.0), glitch * flicker);
    color = mix(color, vec3(1.0), flash);
    color = mix(color, vec3(0.0), flash2);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function PsyShader() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Vertex shader
    const vert = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0, 1);
      }
    `;

    function compile(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vs = compile(gl.VERTEX_SHADER, vert);
    const fs = compile(gl.FRAGMENT_SHADER, fragShader);

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Fullscreen quad
    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc = gl.getUniformLocation(program, "u_resolution");

    let running = true;
    function render(t) {
      if (!running) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, t * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }
    render(0);

    return () => {
      running = false;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    />
  );
}

export default PsyShader;
