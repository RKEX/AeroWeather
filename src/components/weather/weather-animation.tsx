"use client";

import { useEffect, useRef } from "react";
import { WeatherTheme } from "@/lib/weather-theme";

interface WeatherAnimationProps {
    theme: WeatherTheme;
}

export function WeatherAnimation({ theme }: WeatherAnimationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let animationFrameId: number;

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        // Core particle types
        class Drop {
            x: number;
            y: number;
            velocity: number;
            length: number;
            opacity: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * -height;
                this.velocity = Math.random() * 15 + 10;
                this.length = Math.random() * 20 + 10;
                this.opacity = Math.random() * 0.4 + 0.1;
            }

            draw() {
                if(!ctx) return;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + this.length);
                ctx.strokeStyle = `rgba(200, 220, 255, ${this.opacity})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            update() {
                this.y += this.velocity;
                if (this.y > height) {
                    this.y = Math.random() * -height;
                    this.x = Math.random() * width;
                }
            }
        }

        class Flake {
            x: number;
            y: number;
            radius: number;
            velocity: number;
            opacity: number;
            sway: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * -height;
                this.radius = Math.random() * 3 + 1;
                this.velocity = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.6 + 0.2;
                this.sway = Math.random() * Math.PI * 2;
            }

            draw() {
                if(!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }

            update() {
                this.y += this.velocity;
                this.sway += 0.02;
                this.x += Math.sin(this.sway) * 1;
                if (this.y > height) {
                    this.y = Math.random() * -100;
                    this.x = Math.random() * width;
                }
            }
        }

        let particles: (Drop | Flake)[] = [];
        let lightningOpacity = 0;

        const initParticles = () => {
            particles = [];
            if (theme === 'rain' || theme === 'storm') {
                for (let i = 0; i < 150; i++) particles.push(new Drop());
            } else if (theme === 'snow') {
                for (let i = 0; i < 200; i++) particles.push(new Flake());
            }
        };

        initParticles();

        const triggerLightning = () => {
            if (theme === 'storm' && Math.random() < 0.01) {
                lightningOpacity = 0.8;
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Handle Lightning Background Flash
            if (lightningOpacity > 0) {
                 ctx.fillStyle = `rgba(255, 255, 255, ${lightningOpacity})`;
                 ctx.fillRect(0, 0, width, height);
                 lightningOpacity -= 0.05;
            }
            triggerLightning();

            particles.forEach((p) => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        // If theme has no particles, just clear canvas and skip loop to save resources
        if (theme === 'rain' || theme === 'storm' || theme === 'snow') {
             render();
        } else {
             ctx.clearRect(0,0,width,height);
        }

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed inset-0 pointer-events-none z-0" 
            style={{ mixBlendMode: theme === 'storm' ? 'screen' : 'normal' }}
        />
    );
}
