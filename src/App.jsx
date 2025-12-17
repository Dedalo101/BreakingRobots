

import PsyShader from "./PsyShader";

export default function App() {
  return (
    <div>
      <PsyShader />
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1,
        color: "#fff",
        textAlign: "center",
        fontFamily: "monospace",
        textShadow: "0 0 10px #000"
      }}>
        <h1>Breaking Robots</h1>
        <p>Experimental Electronic Collective – Brighton, UK</p>
        <p>Promoting the human awakening process through music and performance.</p>
      </div>
      <nav style={{
        position: "relative",
        zIndex: 1,
        textAlign: "center",
        marginTop: "20px",
        fontFamily: "monospace"
      }}>
        <a href="#music" style={{ color: "#fff", margin: "0 20px", textDecoration: "none" }}>Music</a>
        <a href="#events" style={{ color: "#fff", margin: "0 20px", textDecoration: "none" }}>Events</a>
        <a href="#contact" style={{ color: "#fff", margin: "0 20px", textDecoration: "none" }}>Contact</a>
      </nav>
      <section id="music" style={{
        position: "relative",
        zIndex: 1,
        padding: "50px",
        color: "#fff",
        fontFamily: "monospace",
        textAlign: "center"
      }}>
        <h2>Music</h2>
        <p>Listen to our tracks on SoundCloud and Mixcloud.</p>
        {/* Placeholder for embeds */}
        <div>SoundCloud Embed Here</div>
      </section>
      <section id="events" style={{
        position: "relative",
        zIndex: 1,
        padding: "50px",
        color: "#fff",
        fontFamily: "monospace",
        textAlign: "center"
      }}>
        <h2>Events</h2>
        <p>Upcoming and past performances in Brighton and beyond.</p>
        {/* Placeholder for events list */}
        <div>Event List Here</div>
      </section>
      <section id="contact" style={{
        position: "relative",
        zIndex: 1,
        padding: "50px",
        color: "#fff",
        fontFamily: "monospace",
        textAlign: "center"
      }}>
        <h2>Contact & Community</h2>
        <p>Join us on Facebook and connect with the [beep] collective.</p>
        <a href="https://www.facebook.com/BreakingRobotsOfTzion" style={{ color: "#fff" }}>Facebook</a>
      </section>
    </div>
  );
}
