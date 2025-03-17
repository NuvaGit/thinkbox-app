import React, { useState, useEffect, useRef } from 'react';
import '../styles/LandingPage.css';

const LandingPage = ({ onEnter }) => {
  const [isEntering, setIsEntering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef(null);
  const rainCanvasRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const titleRef = useRef(null);
  const buttonRef = useRef(null);
  
  // Handle component mount animation
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);
  
  // Initialize rain animation with a more creative approach
  useEffect(() => {
    const rainCanvas = rainCanvasRef.current;
    if (!rainCanvas) return;
    
    const ctx = rainCanvas.getContext('2d');
    let raindrops = [];
    
    // Create sophisticated raindrop class
    class Raindrop {
      constructor() {
        this.reset();
        // Start at random positions
        this.y = Math.random() * rainCanvas.height;
      }
      
      reset() {
        this.x = Math.random() * rainCanvas.width;
        this.y = -20;
        this.length = Math.random() * 25 + 15;
        this.speed = Math.random() * 7 + 10;
        this.opacity = Math.random() * 0.3 + 0.2;
        this.width = Math.random() * 2 + 0.5;
        // Add slight angle to rain for realism
        this.angle = (Math.random() * 0.2 + 0.1) * (Math.random() > 0.5 ? 1 : -1);
        // Vary the color slightly for depth
        this.brightness = Math.floor(Math.random() * 30) + 60; // 60-90 range
      }
      
      draw() {
        ctx.beginPath();
        // Calculate end position with angle
        const endX = this.x + this.length * Math.sin(this.angle);
        const endY = this.y + this.length * Math.cos(this.angle);
        
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = this.width;
        
        // Create a gradient for each raindrop
        const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
        const color = this.brightness;
        gradient.addColorStop(0, `rgba(${color}, ${color}, ${color}, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${color}, ${color}, ${color}, ${this.opacity})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Optional splash effect at bottom
        if (this.y > rainCanvas.height - 30 && this.splash) {
          ctx.beginPath();
          ctx.arc(endX, endY, this.width * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${color}, ${color}, ${this.opacity * 0.3})`;
          ctx.fill();
        }
      }
      
      update() {
        this.y += this.speed;
        this.x += this.speed * Math.sin(this.angle) * 0.5;
        
        // Add random splash effect when hitting bottom
        if (this.y > rainCanvas.height - 30) {
          this.splash = Math.random() > 0.7;
        }
        
        // Reset raindrop when it goes off screen
        if (this.y > rainCanvas.height) {
          this.reset();
        }
      }
    }
    
    // Initialize raindrops
    const initRaindrops = () => {
      // More raindrops for a denser effect
      const raindropCount = Math.floor((rainCanvas.width * rainCanvas.height) / 5000);
      raindrops = [];
      
      for (let i = 0; i < raindropCount; i++) {
        raindrops.push(new Raindrop());
      }
    };
    
    // Set canvas size to match window - truly fullscreen
    const resizeCanvas = () => {
      rainCanvas.width = window.innerWidth;
      rainCanvas.height = window.innerHeight;
      
      // Re-initialize raindrops on resize
      initRaindrops();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation loop for rain
    const animateRain = () => {
      // Use semi-transparent clear for trail effect
      ctx.fillStyle = 'rgba(40, 40, 45, 0.3)';
      ctx.fillRect(0, 0, rainCanvas.width, rainCanvas.height);
      
      for (const raindrop of raindrops) {
        raindrop.draw();
        raindrop.update();
      }
      
      requestAnimationFrame(animateRain);
    };
    
    animateRain();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  // Initialize interactive particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    let animationFrame;
    
    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Track mouse movement
    const handleMouseMove = (e) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Create advanced particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 20) + 1;
        this.opacity = Math.random() * 0.2 + 0.1;
        
        // Add velocity for more dynamic movement
        this.vx = Math.random() * 0.2 - 0.1;
        this.vy = Math.random() * 0.2 - 0.1;
        
        // Create varying particle colors from white to light blue
        this.r = 200 + Math.random() * 55;
        this.g = 200 + Math.random() * 55;
        this.b = 255;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`;
        ctx.fill();
      }
      
      update() {
        // Natural movement
        this.x += this.vx;
        this.y += this.vy;
        
        // Boundary check with bounce effect
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        
        // Calculate distance to mouse
        const dx = mousePosition.current.x - this.x;
        const dy = mousePosition.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;
        
        if (distance < maxDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density * 0.3;
          const directionY = forceDirectionY * force * this.density * 0.3;
          
          this.x -= directionX;
          this.y -= directionY;
          this.opacity = Math.min(0.5, this.opacity + 0.02);
          this.size = Math.min(5, this.size + 0.1);
        } else {
          // Gradually return to base position
          if (this.x !== this.baseX) {
            const dx = this.x - this.baseX;
            this.x -= dx / 20;
          }
          if (this.y !== this.baseY) {
            const dy = this.y - this.baseY;
            this.y -= dy / 20;
          }
          this.opacity = Math.max(0.1, this.opacity - 0.005);
          this.size = Math.max(this.size * 0.95, 1);
        }
      }
    }
    
    // Initialize particles
    const initParticles = () => {
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 300);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    
    initParticles();
    
    // Function to draw lines between particles that are close to each other
    const connectParticles = () => {
      const maxDistance = 100;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            // Opacity based on distance
            const opacity = 1 - (distance / maxDistance);
            
            ctx.beginPath();
            ctx.strokeStyle = `rgba(200, 200, 255, ${opacity * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update each particle
      for (const particle of particles) {
        particle.draw();
        particle.update();
      }
      
      // Connect particles that are close to each other
      connectParticles();
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  const handleEnter = () => {
    setIsEntering(true);
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      if (onEnter) onEnter();
    }, 1500);
  };
  
  // Add hover animation for the button
  const handleButtonHover = () => {
    if (buttonRef.current) {
      buttonRef.current.classList.add('hover');
    }
  };
  
  const handleButtonLeave = () => {
    if (buttonRef.current) {
      buttonRef.current.classList.remove('hover');
    }
  };
  
  return (
    <div className={`immersive-landing ${isLoaded ? 'loaded' : ''} ${isEntering ? 'fade-out' : ''}`}>
      {/* Rain canvas */}
      <canvas ref={rainCanvasRef} className="rain-canvas"></canvas>
      
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="particle-canvas"></canvas>
      
      {/* Background gradient overlay for depth */}
      <div className="gradient-overlay"></div>
      
      <div className="centered-content">
        <div className="title-container">
          <h1 ref={titleRef} className="main-title">
            <span className="letter-t">T</span>
            <span className="letter-h">H</span>
            <span className="letter-i">I</span>
            <span className="letter-n">N</span>
            <span className="letter-k">K</span>
            <span className="letter-b">B</span>
            <span className="letter-o">O</span>
            <span className="letter-x">X</span>
          </h1>
          <p className="tagline">Turn Your Ideas Into Reality</p>
        </div>
        
        <div className="action-container">
          <button 
            ref={buttonRef}
            className={`enter-button ${isEntering ? 'entering' : ''}`} 
            onClick={handleEnter}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
          >
            <span className="button-text">Enter ThinkBox</span>
            <span className="button-glow"></span>
          </button>
        </div>
      </div>
      
      <div className="interaction-hint">
        <p>Move your cursor to interact with the particles</p>
      </div>
    </div>
  );
};

export default LandingPage;