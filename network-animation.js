/**
 * A script for a network animation on a website.
 * The animation is designed to be subtle, warm, and responsive, suitable for both light and dark themes.
 * It features nodes moving on a canvas, with lines connecting nearby nodes, creating a dynamic network effect.
 *
 * @version 1.0
 * @author Paschalis
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'network-animation';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let nodes = [];
    const nodeCount = window.innerWidth < 768 ? 40 : 80;
    const nodeSpeed = 0.5;
    const connectionDistance = 120;
    const nodeColor = 'rgba(255, 193, 7, 0.8)'; 
    const lineColor = 'rgba(255, 193, 7, 0.4)'; 

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * nodeSpeed;
            this.vy = (Math.random() - 0.5) * nodeSpeed;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = nodeColor;
            ctx.fill();
        }
    }

    function createNodes() {
        nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height));
        }
    }

    function connectNodes() {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = Math.sqrt(Math.pow(nodes[i].x - nodes[j].x, 2) + Math.pow(nodes[i].y - nodes[j].y, 2));
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1 - distance / connectionDistance;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        nodes.forEach(node => {
            node.update();
            node.draw();
        });
        connectNodes();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        setCanvasSize();
        createNodes();
    });

    setCanvasSize();
    createNodes();
    animate();
});
