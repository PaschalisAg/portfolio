/**
 * Subtle, warm, theme-aware network animation for a hero section.
 *
 * Improvements over v1.0:
 *  - Symmetric node velocities (fixed biased drift)
 *  - Theme colours cached, re-read only on theme change (no per-frame style recalc)
 *  - prefers-reduced-motion respected (renders a static frame, no looping)
 *  - devicePixelRatio scaling for crisp lines on retina/HiDPI
 *  - Squared-distance comparison + early-out to cut per-frame cost
 *  - Node density recalculated on resize
 *  - Animation pauses when the tab/hero is not visible (saves battery)
 *
 * @version 2.0
 * @author Paschalis (revised)
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const heroSection = canvas.closest('.hero') || canvas.parentElement;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const NODE_SPEED = 0.15;
    const CONNECTION_DISTANCE = 130;
    const CONNECTION_DISTANCE_SQ = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

    let nodes = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2 to limit fill cost
    let nodeColor = 'rgba(255, 193, 7, 0.2)';
    let lineColor = 'rgba(255, 193, 7, 0.2)';
    let rafId = null;

    function getThemeColors() {
        const styles = getComputedStyle(document.body);
        nodeColor = styles.getPropertyValue('--network-node-color').trim() || nodeColor;
        lineColor = styles.getPropertyValue('--network-line-color').trim() || lineColor;
    }

    function nodeCountForSize() {
        return window.innerWidth < 768 ? 40 : 80;
    }

    function setCanvasSize() {
        const rect = heroSection.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
    }

    function width()  { return canvas.width  / dpr; }
    function height() { return canvas.height / dpr; }

    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            // symmetric spread: -0.5..+0.5
            this.vx = (Math.random() - 0.5) * NODE_SPEED;
            this.vy = (Math.random() - 0.5) * NODE_SPEED;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width())  this.vx *= -1;
            if (this.y < 0 || this.y > height()) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = nodeColor;
            ctx.fill();
        }
    }

    function createNodes() {
        const count = nodeCountForSize();
        nodes = [];
        for (let i = 0; i < count; i++) {
            nodes.push(new Node(Math.random() * width(), Math.random() * height()));
        }
    }

    function connectNodes() {
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const dx = a.x - b.x;
                if (dx > CONNECTION_DISTANCE || dx < -CONNECTION_DISTANCE) continue;
                const dy = a.y - b.y;
                if (dy > CONNECTION_DISTANCE || dy < -CONNECTION_DISTANCE) continue;
                const distSq = dx * dx + dy * dy;
                if (distSq < CONNECTION_DISTANCE_SQ) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1 - Math.sqrt(distSq) / CONNECTION_DISTANCE;
                    ctx.stroke();
                }
            }
        }
    }

    function renderFrame() {
        ctx.clearRect(0, 0, width(), height());
        nodes.forEach(node => node.draw());
        connectNodes();
    }

    function animate() {
        ctx.clearRect(0, 0, width(), height());
        nodes.forEach(node => { node.update(); node.draw(); });
        connectNodes();
        rafId = requestAnimationFrame(animate);
    }

    function start() {
        stop();
        if (reduceMotion.matches) {
            renderFrame();           // one static frame, no loop
        } else {
            rafId = requestAnimationFrame(animate);
        }
    }

    function stop() {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    // Re-read colours only when the theme changes, not every frame.
    // Adjust the target/attribute to match however you toggle themes.
    const themeObserver = new MutationObserver(() => {
        getThemeColors();
        if (reduceMotion.matches) renderFrame(); // refresh the static frame
    });
    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme', 'class']
    });

    window.addEventListener('resize', () => {
        setCanvasSize();
        createNodes();
        if (reduceMotion.matches) renderFrame();
    });

    // Pause when off-screen / tab hidden.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop();
        else start();
    });

    // React live if the user flips the OS reduced-motion setting.
    reduceMotion.addEventListener('change', start);

    getThemeColors();
    setCanvasSize();
    createNodes();
    start();
});