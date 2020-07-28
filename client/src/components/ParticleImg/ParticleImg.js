import * as React from "react";
import useWindowSize from "@rooks/use-window-size";
import CiwaLogo from '../../assets/images/test9.png'
import ParticleImage, {
  ParticleOptions,
  Vector,
  forces,
  ParticleForce
} from "react-particle-image";
// import "./styles.css";

// Round number up to nearest step for better canvas performance
const round = (n: number, step = 20) => Math.ceil(n / step) * step;

// Try making me lower to see how performance degrades
const STEP = 40;

const particleOptions: ParticleOptions = {
  filter: ({ x, y, image }) => {
    // Get pixel
    const pixel = image.get(x, y);
    // Make a particle for this pixel if magnitude < 200 (range 0-255)
    const magnitude = (pixel.r + pixel.g + pixel.b) / 3;
    return magnitude < 200;
  },
  color: ({ x, y, image }) => {
    const pixel = image.get(x, y);
    // Canvases are much more performant when painting as few colors as possible.
    // Use color of pixel as color for particle however round to nearest 30
    // to decrease the number of unique colors painted on the canvas.
    // You'll notice if we remove this rounding, the framerate will slow down a lot.
    return `rgba(
      ${round(pixel.r, STEP)}, 
      ${round(pixel.g, STEP)}, 
      ${round(pixel.b, STEP)}, 
      ${round(pixel.a, STEP) / 255}
    )`;
  },
  radius: ({ x, y, image }) => {
    const pixel = image.get(x, y);
    const magnitude = (pixel.r + pixel.g + pixel.b) / 3;
    // Lighter colors will have smaller radius
    return 3 - (magnitude / 255) * 1.5;
  },
  mass: () => 40,
  friction: () => 0.15,
  initialPosition: ({ canvasDimensions }) => {
    return new Vector(canvasDimensions.width / 2, canvasDimensions.height / 2);
  }
};

const motionForce = (x: number, y: number): ParticleForce => {
  return forces.disturbance(x, y, 5);
};

const ParticleImg = props => {
    const { innerWidth, innerHeight } = useWindowSize();
    
    return (
      <ParticleImage
        src={CiwaLogo}
        width={Number(innerWidth)}
        height={Number(innerHeight/2.5)}
        scale={1.4}
        entropy={5}
        maxParticles={4000}
        particleOptions={particleOptions}
        mouseMoveForce={motionForce}
        touchMoveForce={motionForce}
        backgroundColor="#191D1F"
      />
    );
}

export default ParticleImg