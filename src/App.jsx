import React, { useRef, useEffect } from "react";

function MorphingShader() {
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

    // Fragment shader (simple morphing effect)
    const frag = `
      precision mediump float;
      uniform float u_time;
      void main() {
        float x = gl_FragCoord.x / 600.0;
        float y = gl_FragCoord.y / 400.0;
        float r = 0.5 + 0.5 * sin(u_time + x * 10.0);
        float g = 0.5 + 0.5 * sin(u_time + y * 10.0 + 2.0);
        float b = 0.5 + 0.5 * sin(u_time + x * 10.0 + y * 10.0 + 4.0);
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `;

    function compile(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vs = compile(gl.VERTEX_SHADER, vert);
    const fs = compile(gl.FRAGMENT_SHADER, frag);

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

    let running = true;
    function render(t) {
      if (!running) return;
      gl.uniform1f(timeLoc, t * 0.001);
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
      width={600}
      height={400}
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

export default function App() {
  return (
    <div>
      <MorphingShader />
      <div style={{
        position: "relative",
        zIndex: 1,
        color: "#fff",
        textAlign: "center",
        marginTop: "30vh",
        fontFamily: "monospace",
        textShadow: "0 0 10px #000"
      }}>
        <h1>Breaking Robots</h1>
        <p>Experimental Electronic Collective – Brighton, UK</p>
      </div>
    </div>
  );
}
