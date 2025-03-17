import React, { useState, useEffect, useRef } from 'react';
import '../styles/LandingPage.css';

const LandingPage = ({ onEnter }) => {
  const [isEntering, setIsEntering] = useState(false);
  const canvasRef = useRef(null);
  const rainCanvasRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  
  // Initialize rain animation
  useEffect(() => {
    const rainCanvas = rainCanvasRef.current;
    if (!rainCanvas) return;
    
    const ctx = rainCanvas.getContext('2d');
    const raindrops = [];
    
    // Set canvas size to match window
    const resizeCanvas = () => {
      rainCanvas.width = window.innerWidth;
      rainCanvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create raindrop class
    class Raindrop {
      constructor() {
        this.x = Math.random() * rainCanvas.width;
        this.y = Math.random() * rainCanvas.height - rainCanvas.height;
        this.length = Math.random() * 20 + 10;
        this.speed = Math.random() * 5 + 5;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.width = Math.random() * 1.5 + 0.5;
      }
      
      draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.lineWidth = this.width;
        ctx.strokeStyle = `rgba(120, 120, 120, ${this.opacity})`;
        ctx.stroke();
      }
      
      update() {
        this.y += this.speed;
        
        // Reset raindrop when it goes off screen
        if (this.y > rainCanvas.height) {
          this.y = -this.length;
          this.x = Math.random() * rainCanvas.width;
        }
      }
    }
    
    // Initialize raindrops
    const initRaindrops = () => {
      const raindropCount = Math.floor((rainCanvas.width * rainCanvas.height) / 10000);
      
      for (let i = 0; i < raindropCount; i++) {
        raindrops.push(new Raindrop());
      }
    };
    
    initRaindrops();
    
    // Animation loop for rain
    const animateRain = () => {
      ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
      
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
  
  // Initialize canvas and interactive particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
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
    
    // Create particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 20) + 1;
        this.opacity = Math.random() * 0.3 + 0.1; // Reduced opacity
        this.color = '#ffffff';
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
      
      update() {
        // Calculate distance to mouse
        const dx = mousePosition.current.x - this.x;
        const dy = mousePosition.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;
        
        if (distance < maxDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density * 0.2;
          const directionY = forceDirectionY * force * this.density * 0.2;
          
          this.x -= directionX;
          this.y -= directionY;
          this.opacity = Math.min(0.5, this.opacity + 0.01); // Lower max opacity
        } else {
          if (this.x !== this.baseX) {
            const dx = this.x - this.baseX;
            this.x -= dx / 15;
          }
          if (this.y !== this.baseY) {
            const dy = this.y - this.baseY;
            this.y -= dy / 15;
          }
          this.opacity = Math.max(0.1, this.opacity - 0.005);
        }
      }
    }
    
    // Initialize particles
    const initParticles = () => {
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 200);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    
    initParticles();
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (const particle of particles) {
        particle.draw();
        particle.update();
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const handleEnter = () => {
    setIsEntering(true);
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      if (onEnter) onEnter();
    }, 1500);
  };
  
  return (
    <div className={`minimalist-landing ${isEntering ? 'fade-out' : ''}`}>
      {/* Rain canvas */}
      <canvas ref={rainCanvasRef} className="rain-canvas"></canvas>
      
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="particle-canvas"></canvas>
      
      <div className="centered-content">
        <h1 className="main-title">ThinkBox</h1>
        <p className="tagline">Turn Your Ideas Into Reality</p>
        
        <div className="action-buttons">
          <button 
            className={`enter-button ${isEntering ? 'entering' : ''}`} 
            onClick={handleEnter}
          >
            Enter ThinkBox
          </button>
        </div>
      </div>
      
      <div className="footer-text">
        <p>Move your cursor to interact with the particles</p>
      </div>
    </div>
  );
};

export default LandingPage;