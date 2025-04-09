document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const canvasContainer = document.querySelector('.canvas-container');
    const canvasOverlay = document.getElementById('canvas-overlay');
    const cursorPosition = document.getElementById('cursor-position');
    const notification = document.getElementById('notification');
    
    // Tool elements
    const toolButtons = document.querySelectorAll('.tool-btn');
    const brushSizeSlider = document.getElementById('brush-size');
    const brushSizeValue = document.getElementById('brush-size-value');
    const opacitySlider = document.getElementById('opacity');
    const opacityValue = document.getElementById('opacity-value');
    const colorOptions = document.querySelectorAll('.color-option');
    const customColor = document.getElementById('custom-color');
    const bgSelector = document.getElementById('bg-selector');
    
    // Action buttons
    const saveBtn = document.getElementById('save-btn');
    const clearBtn = document.getElementById('clear-btn');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetZoomBtn = document.getElementById('reset-zoom');
    const zoomLevel = document.getElementById('zoom-level');
    
    // App state
    let isDrawing = false;
    let currentTool = 'pen';
    let currentColor = '#000000';
    let currentSize = 5;
    let currentOpacity = 1;
    let zoom = 1;
    let lastX = 0;
    let lastY = 0;
    
    // Initialize canvas
    function initCanvas() {
        resizeCanvas();
        setCanvasBackground('white');
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        updateCursor();
        
        // Hide overlay after first interaction
        const hideOverlay = () => {
            canvasOverlay.classList.add('hidden');
            canvas.removeEventListener('mousedown', hideOverlay);
            canvas.removeEventListener('touchstart', hideOverlay);
        };
        
        canvas.addEventListener('mousedown', hideOverlay);
        canvas.addEventListener('touchstart', hideOverlay);
    }
    
    // Resize canvas to fit container
    function resizeCanvas() {
        const containerWidth = canvasContainer.clientWidth;
        const containerHeight = canvasContainer.clientHeight;
        
        canvas.width = containerWidth * 0.9;
        canvas.height = containerHeight * 0.8;
        
        // Redraw canvas content if it exists
        redrawCanvas();
    }
    
    // Set canvas background
    function setCanvasBackground(bgType) {
        switch(bgType) {
            case 'transparent':
                canvas.style.background = 'transparent';
                canvas.classList.remove('bg-grid', 'bg-parchment');
                break;
            case 'white':
                canvas.style.background = 'white';
                canvas.classList.remove('bg-grid', 'bg-parchment');
                break;
            case 'grid':
                canvas.style.background = 'white';
                canvas.classList.add('bg-grid');
                canvas.classList.remove('bg-parchment');
                break;
            case 'parchment':
                canvas.style.background = 'white';
                canvas.classList.add('bg-parchment');
                canvas.classList.remove('bg-grid');
                break;
        }
    }
    
    // Redraw canvas content (for resize)
    function redrawCanvas() {
        // In a real app, you would save and redraw the drawing data
        // For simplicity, we're just clearing here
        clearCanvas();
    }
    
    // Clear canvas
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        showNotification('Canvas cleared');
    }
    
    // Start drawing
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getPosition(e);
        
        // For tools that need immediate drawing (like spray)
        if (currentTool === 'spray') {
            draw(e);
        }
    }
    
    // Draw
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.globalAlpha = currentOpacity;
        
        const [x, y] = getPosition(e);
        
        switch(currentTool) {
            case 'pen':
            case 'marker':
                ctx.lineWidth = currentSize;
                ctx.strokeStyle = currentColor;
                ctx.globalCompositeOperation = 'source-over';
                
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(x, y);
                ctx.stroke();
                break;
                
            case 'eraser':
                ctx.lineWidth = currentSize;
                ctx.strokeStyle = canvas.style.backgroundColor || 'white';
                ctx.globalCompositeOperation = 'destination-out';
                
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(x, y);
                ctx.stroke();
                break;
                
            case 'spray':
                ctx.fillStyle = currentColor;
                ctx.globalCompositeOperation = 'source-over';
                
                const density = currentSize * 2;
                const radius = currentSize * 3;
                
                for (let i = 0; i < density; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const sprayRadius = Math.random() * radius;
                    const sprayX = x + Math.cos(angle) * sprayRadius;
                    const sprayY = y + Math.sin(angle) * sprayRadius;
                    
                    ctx.beginPath();
                    ctx.arc(sprayX, sprayY, currentSize / 3, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
        }
        
        [lastX, lastY] = [x, y];
    }
    
    // Stop drawing
    function stopDrawing() {
        isDrawing = false;
    }
    
    // Get mouse/touch position
    function getPosition(e) {
        let x, y;
        
        if (e.type.includes('touch')) {
            const touch = e.touches[0] || e.changedTouches[0];
            const rect = canvas.getBoundingClientRect();
            x = (touch.clientX - rect.left) / zoom;
            y = (touch.clientY - rect.top) / zoom;
        } else {
            const rect = canvas.getBoundingClientRect();
            x = (e.clientX - rect.left) / zoom;
            y = (e.clientY - rect.top) / zoom;
        }
        
        return [x, y];
    }
    
    // Update cursor position display
    function updateCursorPosition(e) {
        const [x, y] = getPosition(e);
        cursorPosition.textContent = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
    }
    
    // Update cursor style based on tool
    function updateCursor() {
        let cursor = 'crosshair';
        let size = currentSize * zoom;
        
        switch(currentTool) {
            case 'pen':
            case 'marker':
                canvas.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${currentColor.replace('#', '%23')}" opacity="${currentOpacity}"/></svg>') ${size/2} ${size/2}, auto`;
                break;
            case 'eraser':
                canvas.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white" stroke="black" stroke-width="1"/></svg>') ${size/2} ${size/2}, auto`;
                break;
            case 'spray':
                canvas.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${size*3}" height="${size*3}" viewBox="0 0 ${size*3} ${size*3}"><circle cx="${size*1.5}" cy="${size*1.5}" r="${size/2}" fill="${currentColor.replace('#', '%23')}" opacity="0.5"/></svg>') ${size*1.5} ${size*1.5}, auto`;
                break;
        }
    }
    
    // Save drawing as image
    function saveDrawing() {
        const link = document.createElement('a');
        link.download = `drawing-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showNotification('Drawing saved!');
    }
    
    // Show notification
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Zoom functions
    function zoomIn() {
        if (zoom < 3) {
            zoom += 0.1;
            updateZoom();
        }
    }
    
    function zoomOut() {
        if (zoom > 0.5) {
            zoom -= 0.1;
            updateZoom();
        }
    }
    
    function resetZoom() {
        zoom = 1;
        updateZoom();
    }
    
    function updateZoom() {
        canvas.style.transform = `scale(${zoom})`;
        zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
        updateCursor();
    }
    
    // Event listeners
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
    
    // Drawing events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mousemove', updateCursorPosition);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e);
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e);
        updateCursorPosition(e);
    });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopDrawing();
    });
    
    // Tool selection
    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            toolButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentTool = button.dataset.tool;
            updateCursor();
            showNotification(`${currentTool.charAt(0).toUpperCase() + currentTool.slice(1)} tool selected`);
        });
    });
    
    // Brush size
    brushSizeSlider.addEventListener('input', () => {
        currentSize = brushSizeSlider.value;
        brushSizeValue.textContent = `${currentSize}px`;
        updateCursor();
    });
    
    // Opacity
    opacitySlider.addEventListener('input', () => {
        currentOpacity = opacitySlider.value / 100;
        opacityValue.textContent = `${opacitySlider.value}%`;
        updateCursor();
    });
    
    // Color selection
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            currentColor = option.dataset.color;
            customColor.value = currentColor;
            updateCursor();
        });
    });
    
    customColor.addEventListener('input', () => {
        currentColor = customColor.value;
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        updateCursor();
    });
    
    // Background selection
    bgSelector.addEventListener('change', () => {
        setCanvasBackground(bgSelector.value);
    });
    
    // Action buttons
    saveBtn.addEventListener('click', saveDrawing);
    clearBtn.addEventListener('click', clearCanvas);
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    resetZoomBtn.addEventListener('click', resetZoom);
    
    // Initialize the app
    initCanvas();
    
    // Set first color as selected
    if (colorOptions.length > 0) {
        colorOptions[0].classList.add('selected');
    }
});