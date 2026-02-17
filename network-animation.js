document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('animationCanvas');
    const ctx = canvas.getContext('2d');
    let nodes = [];
    const nodeCount = 50; // Increased number of nodes
    const connectionDistance = 150; // Increased distance for connections
    const nodeSpeed = 0.5; // Reduced speed for smoother animation
    const nodeColor = '#4CAF50'; // Green color for nodes
    const lineColor = '#757575'; // Gray color for lines

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function getThemeColors() {
        // You can adjust these colors to match your theme
        return {
            nodeColor: '#4CAF50', // Green color for nodes
            lineColor: '#757575'  // Gray color for lines
        };
    }

    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * nodeSpeed;
            this.vy = (Math.random() - 0.5) * nodeSpeed;
            this.radius = Math.random() * 3 + 2; // Slightly larger nodes
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off the edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            // Draw the node as a circle with a gradient to simulate a neuron
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            gradient.addColorStop(0, '#4CAF50');
            gradient.addColorStop(1, '#45a049');
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Draw a smaller circle inside to give a neuron-like appearance
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius / 2, 0, Math.PI * 2);
            ctx.fillStyle = '#388E3C';
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
                    // Draw a line with opacity based on distance
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(117, 117, 117, ${1 - distance / connectionDistance})`;
                    ctx.lineWidth = 1 - distance / connectionDistance;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ({ nodeColor, lineColor } = getThemeColors());
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