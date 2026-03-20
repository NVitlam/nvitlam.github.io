(function() {
    const canvas = document.getElementById('network-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;

    const BLUE = { r: 74, g: 124, b: 165 };
    const ORANGE = { r: 196, g: 75, b: 43 };

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        initNodes();
    }

    let nodes = [];

    function initNodes() {
        nodes = [];
        // Grid-based placement with randomness for organic feel
        const spacing = 140;
        const cols = Math.ceil(W / spacing) + 1;
        const rows = Math.ceil(H / spacing) + 1;
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                // ~40% chance to place a node at each grid point
                if (Math.random() > 0.4) continue;
                const isAccent = Math.random() > 0.8; // 20% are orange accent nodes
                nodes.push({
                    x: i * spacing + (Math.random() - 0.5) * spacing * 0.6,
                    y: j * spacing + (Math.random() - 0.5) * spacing * 0.6,
                    r: Math.random() * 1.8 + 0.6,
                    color: isAccent ? ORANGE : BLUE,
                    vx: (Math.random() - 0.5) * 0.15,
                    vy: (Math.random() - 0.5) * 0.15,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }
    }

    function draw(time) {
        ctx.clearRect(0, 0, W, H);

        // Update positions (very slow drift)
        nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < -20 || n.x > W + 20) n.vx *= -1;
            if (n.y < -20 || n.y > H + 20) n.vy *= -1;
        });

        // Draw edges
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    const alpha = (1 - dist / 180) * 0.08;
                    // Use orange for edges between mixed node types
                    const c = (nodes[i].color === ORANGE || nodes[j].color === ORANGE) ? ORANGE : BLUE;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        // Draw nodes
        nodes.forEach(n => {
            const pulse = 0.5 + 0.5 * Math.sin(time * 0.001 + n.phase);
            const alpha = 0.15 + pulse * 0.2;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);
})();
