// ===================================
// NLP & Data Science Text Animation - Performance Optimized
// ===================================
class NLPAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        this.embeddings = [];
        this.isDarkTheme = true;
        this.isMobile = window.innerWidth <= 768;
        this.frameInterval = this.isMobile ? 1000 / 24 : 1000 / 30; // Lower FPS on mobile
        this.lastFrameTime = 0;
        this.animationId = null;
        this.isVisible = true;
        
        // Semantic clusters for embeddings (grouped by meaning)
        this.clusters = {
            nlp: { 
                words: ['NLP', 'tokenize', 'embedding', 'semantic', 'syntax', 'parse', 'sentiment', 'entity', 'lemma', 'language'],
                color: { r: 100, g: 181, b: 246 } // Blue
            },
            ml: {
                words: ['neural', 'transformer', 'model', 'train', 'predict', 'accuracy', 'learning', 'algorithm'],
                color: { r: 156, g: 39, b: 176 } // Purple
            },
            data: {
                words: ['data', 'analysis', 'vector', 'classify', 'cluster', 'feature', 'extract', 'pattern', 'insight'],
                color: { r: 38, g: 166, b: 154 } // Teal
            },
            network: {
                words: ['network', 'graph', 'node', 'edge', 'context', 'corpus', 'tf-idf'],
                color: { r: 255, g: 152, b: 0 } // Orange
            }
        };
        
        this.resize();
        this.initEmbeddings();
        this.bindEvents();
        this.checkVisibility();
        this.animate();
    }

    resize() {
        this.isMobile = window.innerWidth <= 768;
        this.frameInterval = this.isMobile ? 1000 / 24 : 1000 / 30;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
        this.initEmbeddings();
    }

    initEmbeddings() {
        this.embeddings = [];
        const isMobile = this.isMobile;
        const embeddingCount = isMobile ? 10 : 30;
        
        // Create embeddings from clustered vocabulary
        const allWords = [];
        Object.entries(this.clusters).forEach(([clusterName, cluster]) => {
            cluster.words.forEach(word => {
                allWords.push({ word, cluster: clusterName, color: cluster.color });
            });
        });
        
        // Select random words and create embedding nodes
        for (let i = 0; i < embeddingCount; i++) {
            const selected = allWords[Math.floor(Math.random() * allWords.length)];
            const fontSize = isMobile ? Math.random() * 6 + 9 : Math.random() * 8 + 10;
            
            this.embeddings.push({
                text: selected.word,
                cluster: selected.cluster,
                color: selected.color,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                fontSize: fontSize,
                nodeRadius: isMobile ? Math.random() * 4 + 4 : Math.random() * 5 + 3,
                opacity: isMobile ? Math.random() * 0.2 + 0.1 : Math.random() * 0.1,
                glowIntensity: Math.random() * 0.5 + 0.5
            });
        }
    }

    updateTheme(isDark) {
        this.isDarkTheme = isDark;
    }

    checkVisibility() {
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            if (this.isVisible && !this.animationId) {
                this.animate();
            }
        });
    }

    bindEvents() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.resize(), 250);
        });
    }

    animate(currentTime = 0) {
        if (!this.isVisible) {
            this.animationId = null;
            return;
        }

        if (currentTime - this.lastFrameTime < this.frameInterval) {
            this.animationId = requestAnimationFrame((time) => this.animate(time));
            return;
        }
        this.lastFrameTime = currentTime;

        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Optimizations for mobile
        const isMobile = this.isMobile;

        // Draw network connections first (behind nodes)
        for (let i = 0; i < this.embeddings.length; i++) {
            for (let j = i + 1; j < this.embeddings.length; j++) {
                const embA = this.embeddings[i];
                const embB = this.embeddings[j];
                const dx = embA.x - embB.x;
                const dy = embA.y - embB.y;
                const distSq = dx * dx + dy * dy;
                
                // Stronger connections for same cluster (semantic similarity)
                const maxDistance = embA.cluster === embB.cluster ? (isMobile ? 170 : 200) : (isMobile ? 130 : 150);
                const maxDistSq = maxDistance * maxDistance;

                if (distSq < maxDistSq) {
                    const distance = Math.sqrt(distSq);
                    const baseOpacity = embA.cluster === embB.cluster ? (isMobile ? 0.7 : 0.5) : (isMobile ? 0.6 : 0.5);
                    const opacity = (maxDistance - distance) / maxDistance * baseOpacity;
                    const lineWidth = embA.cluster === embB.cluster ? (isMobile ? 1.1 : 0.5) : (isMobile ? 1.3 : 0.8);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(embA.x, embA.y);
                    this.ctx.lineTo(embB.x, embB.y);
                    
                    // Use gradient for connections only on desktop
                    const colorA = this.isDarkTheme ? embA.color : this.adjustColorForLight(embA.color);
                    
                    if (!isMobile) {
                        const gradient = this.ctx.createLinearGradient(embA.x, embA.y, embB.x, embB.y);
                        const colorB = this.isDarkTheme ? embB.color : this.adjustColorForLight(embB.color);
                        gradient.addColorStop(0, `rgba(${colorA.r}, ${colorA.g}, ${colorA.b}, ${opacity})`);
                        gradient.addColorStop(1, `rgba(${colorB.r}, ${colorB.g}, ${colorB.b}, ${opacity})`);
                        this.ctx.strokeStyle = gradient;
                    } else {
                        // Solid color for mobile performance
                        this.ctx.strokeStyle = `rgba(${colorA.r}, ${colorA.g}, ${colorA.b}, ${opacity})`;
                    }

                    this.ctx.lineWidth = lineWidth;
                    this.ctx.stroke();
                }
            }
        }
        
        // Update and draw embedding nodes with text
        this.embeddings.forEach((emb) => {
            emb.x += emb.vx;
            emb.y += emb.vy;
            
            // Bounce off edges
            if (emb.x < -50 || emb.x > window.innerWidth + 50) emb.vx *= -1;
            if (emb.y < -50 || emb.y > window.innerHeight + 50) emb.vy *= -1;
            
            // Apply subtle attraction within same cluster (skip on mobile)
            if (!isMobile) {
                this.embeddings.forEach((other) => {
                    if (other !== emb && other.cluster === emb.cluster) {
                        const dx = other.x - emb.x;
                        const dy = other.y - emb.y;
                        const distSq = dx * dx + dy * dy;
                        // 250^2 = 62500
                        if (distSq > 0 && distSq < 62500) {
                            const distance = Math.sqrt(distSq);
                            const force = 0.0002;
                            emb.vx += (dx / distance) * force;
                            emb.vy += (dy / distance) * force;
                        }
                    }
                });
            }
            
            // Limit velocity
            const maxSpeed = 0.3;
            const speedSq = emb.vx * emb.vx + emb.vy * emb.vy;
            if (speedSq > maxSpeed * maxSpeed) {
                const speed = Math.sqrt(speedSq);
                emb.vx = (emb.vx / speed) * maxSpeed;
                emb.vy = (emb.vy / speed) * maxSpeed;
            }
            
            const color = this.isDarkTheme ? emb.color : this.adjustColorForLight(emb.color);
            
            // Draw glow effect - Disable on mobile
            this.ctx.save();
            if (!isMobile) {
                this.ctx.shadowBlur = 15 * emb.glowIntensity;
                this.ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`;
            }
            
            // Draw node circle
            this.ctx.beginPath();
            this.ctx.arc(emb.x, emb.y, emb.nodeRadius, 0, Math.PI * 2);
            const nodeAlpha = emb.opacity + (isMobile ? 0.35 : 0.15);
            this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${nodeAlpha})`;
            this.ctx.fill();
            
            // Draw node border
            this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${emb.opacity + (isMobile ? 0.45 : 0.3)})`;
            this.ctx.lineWidth = isMobile ? 1.8 : 1.5;
            this.ctx.stroke();
            
            this.ctx.restore();
            
        });
        
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    adjustColorForLight(color) {
        // Map to specific warm/cosy/accessible colors for light theme
        
        // NLP (Blue) -> Deep Slate/Denim Blue
        if (color.r === 100 && color.g === 181 && color.b === 246) {
            return { r: 21, g: 101, b: 192 };
        }
        // ML (Purple) -> Deep Aubergine
        if (color.r === 156 && color.g === 39 && color.b === 176) {
            return { r: 106, g: 27, b: 154 };
        }
        // Data (Teal) -> Deep Pine Green
        if (color.r === 38 && color.g === 166 && color.b === 154) {
            return { r: 0, g: 77, b: 64 };
        }
        // Network (Orange) -> Burnt Rust/Sienna
        if (color.r === 255 && color.g === 152 && color.b === 0) {
            return { r: 191, g: 54, b: 12 };
        }

        // Fallback: darken and slight warm shift (reduce blue)
        return {
            r: Math.floor(color.r * 0.6),
            g: Math.floor(color.g * 0.6),
            b: Math.floor(color.b * 0.55)
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('networkCanvas');
    if (canvas) {
        const nlpAnimation = new NLPAnimation(canvas);

        // Check for theme toggle and update animation
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            // Function to update animation theme based on body data-theme
            const updateAnimationTheme = () => {
                const isDark = document.body.getAttribute('data-theme') === 'dark';
                nlpAnimation.updateTheme(isDark);
            };

            // Initial theme check
            updateAnimationTheme();

            // Create a MutationObserver to watch for theme changes
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                        updateAnimationTheme();
                    }
                }
            });

            observer.observe(document.body, { attributes: true });
        }
    }
});
