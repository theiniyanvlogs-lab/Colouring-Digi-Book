"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";

const COLORS = [
  "#ff1f1f", "#ff4d4f", "#ff6b6b", "#ff7a00", "#ff9f1a", "#ffb84d", "#ffd400", "#ffe066",
  "#f7ff00", "#c6ff00", "#7CFC00", "#22c55e", "#34d399", "#13c2c2", "#2dd4bf", "#06b6d4",
  "#22d3ee", "#38bdf8", "#1677ff", "#2563eb", "#1d4ed8", "#0000ff", "#4f46e5", "#6366f1",
  "#722ed1", "#8b5cf6", "#a855f7", "#c026d3", "#eb2f96", "#ff66c4", "#f8b4c4", "#b91c1c",
  "#b45309", "#8b5a2b", "#a3a3a3", "#737373", "#8c8c8c", "#000000", "#ffffff", "#17e3f0"
];

const ANIMALS = [
  { id: "lion", name: "Lion", emoji: "🦁", coloring: "/images/lion-coloring.png", reference: "/reference/lion-reference.png" },
  { id: "elephant", name: "Elephant", emoji: "🐘", coloring: "/images/elephant-coloring.png", reference: "/reference/elephant-reference.png" },
  { id: "giraffe", name: "Giraffe", emoji: "🦒", coloring: "/images/giraffe-coloring.png", reference: "/reference/giraffe-reference.png" },
  { id: "owl", name: "Owl", emoji: "🦉", coloring: "/images/owl-coloring.png", reference: "/reference/owl-reference.png" },
  { id: "cat", name: "Cat", emoji: "🐱", coloring: "/images/cat-coloring.png", reference: "/reference/cat-reference.png" },
  { id: "puppy", name: "Puppy", emoji: "🐶", coloring: "/images/puppy-coloring.png", reference: "/reference/puppy-reference.png" },
];

// Fallback SVG generators
function createFallbackColoringSvgDataUrl(label, emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
    <rect width="100%" height="100%" fill="white"/>
    <circle cx="450" cy="350" r="180" fill="white" stroke="black" stroke-width="18"/>
    <circle cx="360" cy="220" r="70" fill="white" stroke="black" stroke-width="18"/>
    <circle cx="540" cy="220" r="70" fill="white" stroke="black" stroke-width="18"/>
    <circle cx="395" cy="330" r="18" fill="black"/>
    <circle cx="505" cy="330" r="18" fill="black"/>
    <ellipse cx="450" cy="395" rx="28" ry="18" fill="white" stroke="black" stroke-width="10"/>
    <path d="M415 430 Q450 465 485 430" fill="none" stroke="black" stroke-width="10" stroke-linecap="round"/>
    <ellipse cx="320" cy="650" rx="85" ry="110" fill="white" stroke="black" stroke-width="18"/>
    <ellipse cx="580" cy="650" rx="85" ry="110" fill="white" stroke="black" stroke-width="18"/>
    <ellipse cx="450" cy="650" rx="150" ry="160" fill="white" stroke="black" stroke-width="18"/>
    <text x="450" y="840" text-anchor="middle" font-size="46" font-family="Arial" fill="black">${emoji} ${label}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createFallbackReferenceSvgDataUrl(label, emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#dff4ff"/><stop offset="100%" stop-color="#fef3c7"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="450" cy="350" r="180" fill="#ffd54f" stroke="#111" stroke-width="18"/>
    <circle cx="360" cy="220" r="70" fill="#ffcc80" stroke="#111" stroke-width="18"/>
    <circle cx="540" cy="220" r="70" fill="#ffcc80" stroke="#111" stroke-width="18"/>
    <circle cx="395" cy="330" r="18" fill="#111"/><circle cx="505" cy="330" r="18" fill="#111"/>
    <ellipse cx="450" cy="395" rx="28" ry="18" fill="#111"/>
    <path d="M415 430 Q450 465 485 430" fill="none" stroke="#111" stroke-width="10" stroke-linecap="round"/>
    <ellipse cx="320" cy="650" rx="85" ry="110" fill="#ffb74d" stroke="#111" stroke-width="18"/>
    <ellipse cx="580" cy="650" rx="85" ry="110" fill="#ffb74d" stroke="#111" stroke-width="18"/>
    <ellipse cx="450" cy="650" rx="150" ry="160" fill="#ffe082" stroke="#111" stroke-width="18"/>
    <text x="450" y="840" text-anchor="middle" font-size="46" font-family="Arial" fill="#111">${emoji} ${label}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Image loader with error handling
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Image load failed: ${src}`));
    img.src = src;
  });
}

// Animal selection card component
function AnimalCard({ animal, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        borderRadius: 22,
        border: active ? "2px solid #5b4bff" : "2px solid #d8d8de",
        background: active ? "#eef0ff" : "#f4f4f6",
        padding: "22px 12px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        minHeight: 116,
        boxShadow: active ? "0 8px 18px rgba(91,75,255,0.18)" : "none",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ fontSize: 38, lineHeight: 1 }}>{animal.emoji}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: active ? "#4f46e5" : "#4b5563" }}>{animal.name}</div>
    </button>
  );
}

// Reference panel component
function ReferencePanel({ animal, src, hasFallback }) {
  return (
    <div style={styles.sideCard}>
      <div style={styles.panelTitle}>✨ Reference Image</div>
      <div style={styles.previewBox}>
        <img
          src={src}
          alt={`${animal.name} reference`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: 18,
            background: "#f3f4f6"
          }}
          draggable={false}
        />
      </div>
      <div style={styles.helperText}>
        {hasFallback
          ? "🎨 Fallback reference shown. Upload your custom image to /public/reference/"
          : "🎯 Match these colors or create your own style!"}
      </div>
    </div>
  );
}

export default function ColoringBook() {
  // Canvas refs
  const displayCanvasRef = useRef(null);
  const fillCanvasRef = useRef(null);
  const baseCanvasRef = useRef(null);
  
  // State
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [tool, setTool] = useState("bucket");
  const [brushSize, setBrushSize] = useState(16);
  const [canvasSize, setCanvasSize] = useState({ width: 760, height: 760 });
  const [isReady, setIsReady] = useState(false);
  const [referenceSrc, setReferenceSrc] = useState("");
  const [referenceFallback, setReferenceFallback] = useState(false);
  const [coloringFallback, setColoringFallback] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Refs for performance
  const isDrawingRef = useRef(false);
  const lastDrawTimeRef = useRef(0);
  
  const animal = ANIMALS[selectedIndex];
  const OUTLINE_THRESHOLD = 120;
  const MAX_UNDO_STEPS = 10;

  // Memoized fallback sources
  const coloringFallbackSrc = useMemo(
    () => createFallbackColoringSvgDataUrl(animal.name, animal.emoji),
    [animal.name, animal.emoji]
  );
  const referenceFallbackSrc = useMemo(
    () => createFallbackReferenceSvgDataUrl(animal.name, animal.emoji),
    [animal.name, animal.emoji]
  );

  // Load all images when animal changes
  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isReady) loadColoringCanvas();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isReady, selectedIndex]);

  // Load reference and coloring images
  const loadAll = useCallback(async () => {
    setUndoStack([]);
    setRedoStack([]);
    await Promise.all([loadColoringCanvas(), loadReferenceImage()]);
  }, []);

  const loadReferenceImage = useCallback(async () => {
    try {
      await loadImage(animal.reference);
      setReferenceSrc(animal.reference);
      setReferenceFallback(false);
    } catch {
      setReferenceSrc(referenceFallbackSrc);
      setReferenceFallback(true);
    }
  }, [animal.reference, referenceFallbackSrc]);

  const loadColoringCanvas = useCallback(async () => {
    const displayCanvas = displayCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    const baseCanvas = baseCanvasRef.current;
    if (!displayCanvas || !fillCanvas || !baseCanvas) return;

    setIsReady(false);

    let img;
    try {
      img = await loadImage(animal.coloring);
      setColoringFallback(false);
    } catch {
      img = await loadImage(coloringFallbackSrc);
      setColoringFallback(true);
    }

    // Calculate responsive size
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1440;
    const isMobile = screenWidth < 1100;
    const maxW = isMobile ? Math.min(screenWidth - 60, 760) : 760;
    const maxH = 760;
    const ratio = Math.min(maxW / img.width, maxH / img.height);
    const width = Math.max(320, Math.round(img.width * ratio));
    const height = Math.max(320, Math.round(img.height * ratio));

    setCanvasSize({ width, height });
    [displayCanvas, fillCanvas, baseCanvas].forEach((canvas) => {
      canvas.width = width;
      canvas.height = height;
    });

    // Draw base outline
    const baseCtx = baseCanvas.getContext("2d", { willReadFrequently: true });
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (baseCtx && fillCtx) {
      baseCtx.clearRect(0, 0, width, height);
      fillCtx.clearRect(0, 0, width, height);
      baseCtx.drawImage(img, 0, 0, width, height);
      redrawAll();
    }
    setIsReady(true);
  }, [animal.coloring, coloringFallbackSrc]);

  // Redraw display canvas
  const redrawAll = useCallback(() => {
    const displayCanvas = displayCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    const baseCanvas = baseCanvasRef.current;
    if (!displayCanvas || !fillCanvas || !baseCanvas) return;

    const displayCtx = displayCanvas.getContext("2d");
    if (!displayCtx) return;

    displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
    displayCtx.drawImage(fillCanvas, 0, 0);
    displayCtx.drawImage(baseCanvas, 0, 0);
  }, []);

  // Color utilities
  const hexToRgba = useCallback((hex) => {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    const num = parseInt(c, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255, a: 255 };
  }, []);

  const isOutlinePixel = useCallback((r, g, b, a) => {
    if (a < 10) return false;
    return (r + g + b) / 3 < OUTLINE_THRESHOLD;
  }, []);

  // Get canvas coordinates from event
  const getCanvasPoint = useCallback((e) => {
    const canvas = displayCanvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0, clientY = 0;

    if (e.touches?.[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches?.[0]) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: Math.floor(((clientX - rect.left) / rect.width) * canvas.width),
      y: Math.floor(((clientY - rect.top) / rect.height) * canvas.height),
    };
  }, []);

  // Undo/Redo system with memory limit
  const pushUndoSnapshot = useCallback(() => {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas) return;
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return;

    const snapshot = fillCtx.getImageData(0, 0, fillCanvas.width, fillCanvas.height);
    setUndoStack((prev) => {
      const newStack = [...prev, snapshot];
      return newStack.slice(-MAX_UNDO_STEPS);
    });
    setRedoStack([]);
  }, []);

  // Flood fill algorithm - stays inside black outlines
  const floodFill = useCallback((startX, startY) => {
    const baseCanvas = baseCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    if (!baseCanvas || !fillCanvas) return;

    const baseCtx = baseCanvas.getContext("2d", { willReadFrequently: true });
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!baseCtx || !fillCtx) return;

    const width = baseCanvas.width;
    const height = baseCanvas.height;
    if (startX < 0 || startY < 0 || startX >= width || startY >= height) return;

    const baseImage = baseCtx.getImageData(0, 0, width, height);
    const fillImage = fillCtx.getImageData(0, 0, width, height);
    const baseData = baseImage.data;
    const fillData = fillImage.data;
    const startIndex = (startY * width + startX) * 4;

    // Don't fill on black outlines
    if (isOutlinePixel(baseData[startIndex], baseData[startIndex+1], baseData[startIndex+2], baseData[startIndex+3])) {
      return;
    }

    const newColor = hexToRgba(selectedColor);
    
    // Skip if already this color
    if (fillData[startIndex+3] > 0 && 
        fillData[startIndex] === newColor.r && 
        fillData[startIndex+1] === newColor.g && 
        fillData[startIndex+2] === newColor.b) {
      return;
    }

    pushUndoSnapshot();

    const visited = new Uint8Array(width * height);
    const stack = [[startX, startY]];

    while (stack.length > 0) {
      const [cx, cy] = stack.pop();
      if (!cx && cx !== 0) continue;
      
      if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
      
      const pos = cy * width + cx;
      if (visited[pos]) continue;
      visited[pos] = 1;

      const i = pos * 4;
      
      // Stop at black outlines
      if (isOutlinePixel(baseData[i], baseData[i+1], baseData[i+2], baseData[i+3])) continue;
      
      // Fill the pixel
      fillData[i] = newColor.r;
      fillData[i+1] = newColor.g;
      fillData[i+2] = newColor.b;
      fillData[i+3] = 255;

      // Add neighbors to stack
      stack.push([cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1]);
    }

    fillCtx.putImageData(fillImage, 0, 0);
    redrawAll();
  }, [hexToRgba, isOutlinePixel, pushUndoSnapshot, redrawAll, selectedColor]);

  // Brush drawing with outline detection
  const drawBrushDot = useCallback((x, y) => {
    const fillCanvas = fillCanvasRef.current;
    const baseCanvas = baseCanvasRef.current;
    if (!fillCanvas || !baseCanvas) return;

    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    const baseCtx = baseCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx || !baseCtx) return;

    const radius = Math.max(2, Math.floor(brushSize / 2));
    const color = hexToRgba(selectedColor);
    const minX = Math.max(0, x - radius);
    const maxX = Math.min(fillCanvas.width - 1, x + radius);
    const minY = Math.max(0, y - radius);
    const maxY = Math.min(fillCanvas.height - 1, y + radius);

    const fillImage = fillCtx.getImageData(minX, minY, maxX - minX + 1, maxY - minY + 1);
    const baseImage = baseCtx.getImageData(minX, minY, maxX - minX + 1, maxY - minY + 1);
    const fillData = fillImage.data;
    const baseData = baseImage.data;
    const localWidth = maxX - minX + 1;

    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        const dx = px - x, dy = py - y;
        if (dx * dx + dy * dy > radius * radius) continue;

        const localX = px - minX, localY = py - minY;
        const i = (localY * localWidth + localX) * 4;

        if (isOutlinePixel(baseData[i], baseData[i+1], baseData[i+2], baseData[i+3])) continue;

        fillData[i] = color.r;
        fillData[i+1] = color.g;
        fillData[i+2] = color.b;
        fillData[i+3] = 255;
      }
    }
    fillCtx.putImageData(fillImage, minX, minY);
    redrawAll();
  }, [brushSize, hexToRgba, isOutlinePixel, redrawAll, selectedColor]);

  // Eraser tool
  const eraseDot = useCallback((x, y) => {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas) return;
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return;

    const radius = Math.max(4, Math.floor(brushSize / 2));
    const minX = Math.max(0, x - radius);
    const maxX = Math.min(fillCanvas.width - 1, x + radius);
    const minY = Math.max(0, y - radius);
    const maxY = Math.min(fillCanvas.height - 1, y + radius);

    const fillImage = fillCtx.getImageData(minX, minY, maxX - minX + 1, maxY - minY + 1);
    const fillData = fillImage.data;
    const localWidth = maxX - minX + 1;

    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        const dx = px - x, dy = py - y;
        if (dx * dx + dy * dy > radius * radius) continue;

        const localX = px - minX, localY = py - minY;
        const i = (localY * localWidth + localX) * 4;
        fillData[i] = fillData[i+1] = fillData[i+2] = fillData[i+3] = 0;
      }
    }
    fillCtx.putImageData(fillImage, minX, minY);
    redrawAll();
  }, [brushSize, redrawAll]);

  // Event handlers with throttling
  const handleStart = useCallback((e) => {
    e.preventDefault();
    if (!isReady) return;
    const point = getCanvasPoint(e);
    if (!point) return;

    if (tool === "bucket") {
      floodFill(point.x, point.y);
      return;
    }

    pushUndoSnapshot();
    setIsDrawing(true);
    isDrawingRef.current = true;
    lastDrawTimeRef.current = Date.now();

    if (tool === "brush") drawBrushDot(point.x, point.y);
    else eraseDot(point.x, point.y);
  }, [drawBrushDot, eraseDot, floodFill, getCanvasPoint, isReady, pushUndoSnapshot, tool]);

  const handleMove = useCallback((e) => {
    e.preventDefault();
    if (!isReady || !isDrawingRef.current || tool === "bucket") return;
    
    // Throttle to ~60fps for performance
    const now = Date.now();
    if (now - lastDrawTimeRef.current < 16) return;
    lastDrawTimeRef.current = now;

    const point = getCanvasPoint(e);
    if (!point) return;

    if (tool === "brush") drawBrushDot(point.x, point.y);
    else eraseDot(point.x, point.y);
  }, [drawBrushDot, eraseDot, getCanvasPoint, isReady, tool]);

  const handleEnd = useCallback((e) => {
    if (e) e.preventDefault();
    setIsDrawing(false);
    isDrawingRef.current = false;
  }, []);

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas || undoStack.length === 0) return;
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return;

    const current = fillCtx.getImageData(0, 0, fillCanvas.width, fillCanvas.height);
    const previous = undoStack[undoStack.length - 1];
    
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, current]);
    fillCtx.putImageData(previous, 0, 0);
    redrawAll();
  }, [redoStack, redrawAll, undoStack]);

  const handleRedo = useCallback(() => {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas || redoStack.length === 0) return;
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return;

    const current = fillCtx.getImageData(0, 0, fillCanvas.width, fillCanvas.height);
    const next = redoStack[redoStack.length - 1];
    
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, current]);
    fillCtx.putImageData(next, 0, 0);
    redrawAll();
  }, [redoStack, redrawAll, undoStack]);

  const handleReset = useCallback(() => {
    if (!confirm("Clear all coloring and start over?")) return;
    pushUndoSnapshot();
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas) return;
    const fillCtx = fillCanvas.getContext("2d");
    if (!fillCtx) return;
    fillCtx.clearRect(0, 0, fillCanvas.width, fillCanvas.height);
    redrawAll();
  }, [pushUndoSnapshot, redrawAll]);

  const handleSave = useCallback(() => {
    const displayCanvas = displayCanvasRef.current;
    if (!displayCanvas) return;
    const link = document.createElement("a");
    link.download = `${animal.id}-colored.png`;
    link.href = displayCanvas.toDataURL("image/png");
    link.click();
  }, [animal.id]);

  return (
    <div style={styles.appShell}>
      {/* Header */}
      <header style={styles.topBar}>
        <div style={styles.topRow}>
          <div style={styles.brandBox}>
            <div style={styles.logo}>🎨</div>
            <div style={styles.brandText}>WildColor</div>
          </div>

          <div style={styles.headerCenter}>
            <div style={styles.toolGroup}>
              {["bucket", "brush", "eraser"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTool(t)}
                  style={{ 
                    ...styles.toolBtn, 
                    ...(tool === t ? styles.toolBtnActive : {}),
                    transition: "all 0.2s ease"
                  }}
                >
                  {t === "bucket" ? "🪣 Bucket" : t === "brush" ? "🖌️ Brush" : "🧽 Eraser"}
                </button>
              ))}
            </div>

            <div style={styles.paletteScroll}>
              <div style={styles.paletteWrap}>
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    style={{
                      ...styles.colorDot,
                      background: color,
                      border: selectedColor === color 
                        ? "3px solid #4f46e5" 
                        : color === "#ffffff" 
                          ? "1px solid #d1d5db" 
                          : "1px solid rgba(255,255,255,0.6)",
                      boxShadow: selectedColor === color ? "0 0 0 2px rgba(79,70,229,0.15)" : "none",
                      transition: "transform 0.15s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  />
                ))}
              </div>
            </div>
          </div>

          <div style={styles.actionGroup}>
            <button style={styles.secondaryBtn} onClick={handleUndo} disabled={undoStack.length === 0}>↩</button>
            <button style={styles.secondaryBtn} onClick={handleRedo} disabled={redoStack.length === 0}>↪</button>
            <button style={styles.secondaryBtn} onClick={handleReset}>🔄</button>
            <button style={styles.primaryBtn} onClick={handleSave}>💾 Save</button>
          </div>
        </div>

        <div style={styles.brushBar}>
          <span style={styles.brushLabel}>Brush: {brushSize}px</span>
          <input
            type="range"
            min="6"
            max="40"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={styles.rangeInput}
          />
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.mainGrid}>
        {/* Animal Selector */}
        <aside style={styles.leftPanel}>
          <div style={styles.sideHeading}>🐾 Choose Animal</div>
          <div style={styles.animalGrid}>
            {ANIMALS.map((item, index) => (
              <AnimalCard
                key={item.id}
                animal={item}
                active={selectedIndex === index}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>
        </aside>

        {/* Coloring Canvas */}
        <main style={styles.centerPanel}>
          <div style={styles.canvasOuterCard}>
            <div style={styles.canvasInnerBox}>
              <canvas ref={baseCanvasRef} style={{ display: "none" }} />
              <canvas ref={fillCanvasRef} style={{ display: "none" }} />
              <canvas
                ref={displayCanvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                onTouchCancel={handleEnd}
                style={{
                  width: canvasSize.width,
                  height: canvasSize.height,
                  maxWidth: "100%",
                  maxHeight: "100%",
                  display: "block",
                  borderRadius: 18,
                  background: "#f3f4f6",
                  cursor: tool === "bucket" ? "pointer" : "crosshair",
                  touchAction: "none",
                  userSelect: "none"
                }}
                draggable={false}
              />
            </div>
            <div style={styles.centerHelper}>
              {coloringFallback 
                ? `🎨 Fallback image for ${animal.name}. Add /public/images/${animal.id}-coloring.png for custom art.`
                : tool === "bucket" 
                  ? `🪣 Tap inside shapes to color ${animal.name}`
                  : tool === "brush" 
                    ? `🖌️ Paint freely inside the lines`
                    : `🧽 Erase colors (outlines stay intact)`}
            </div>
          </div>
        </main>

        {/* Reference Panel */}
        <aside style={styles.rightPanel}>
          <ReferencePanel animal={animal} src={referenceSrc} hasFallback={referenceFallback} />
        </aside>
      </div>
    </div>
  );
}

// Styles object
const styles = {
  appShell: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
    padding: 0,
    fontFamily: "system-ui, -apple-system, sans-serif"
  },
  topBar: {
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 50,
    padding: "12px 16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
  },
  topRow: {
    display: "grid",
    gridTemplateColumns: "160px minmax(0, 1fr) auto",
    alignItems: "center",
    gap: 12
  },
  brandBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    flexShrink: 0
  },
  brandText: {
    fontSize: 17,
    fontWeight: 800,
    color: "#1f2937",
    whiteSpace: "nowrap"
  },
  headerCenter: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: 12,
    overflow: "hidden"
  },
  toolGroup: {
    display: "flex",
    gap: 6,
    flexShrink: 0
  },
  toolBtn: {
    height: 36,
    padding: "0 14px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    color: "#374151",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 13,
    whiteSpace: "nowrap"
  },
  toolBtnActive: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    border: "1px solid #667eea",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
  },
  paletteScroll: {
    minWidth: 0,
    overflowX: "auto",
    overflowY: "hidden",
    flex: 1,
    paddingBottom: 4,
    scrollbarWidth: "thin"
  },
  paletteWrap: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "nowrap",
    minWidth: "max-content",
    paddingLeft: 4
  },
  colorDot: {
    width: 20,
    height: 20,
    minWidth: 20,
    minHeight: 20,
    borderRadius: "50%",
    cursor: "pointer",
    padding: 0,
    outline: "none",
    flexShrink: 0,
    transition: "transform 0.15s ease"
  },
  actionGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    flexWrap: "nowrap",
    flexShrink: 0
  },
  secondaryBtn: {
    height: 36,
    width: 36,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#4b5563",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    transition: "all 0.2s ease"
  },
  primaryBtn: {
    height: 36,
    padding: "0 16px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
    whiteSpace: "nowrap",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: 6,
    transition: "all 0.2s ease"
  },
  brushBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
    paddingTop: 10,
    borderTop: "1px solid #f3f4f6",
    flexWrap: "wrap"
  },
  brushLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#4b5563"
  },
  rangeInput: {
    width: 140,
    accentColor: "#667eea"
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "280px minmax(400px, 1fr) 300px",
    gap: 20,
    padding: 20,
    alignItems: "start"
  },
  leftPanel: {
    minWidth: 0
  },
  sideHeading: {
    fontSize: 13,
    fontWeight: 700,
    color: "#6b7280",
    letterSpacing: 0.3,
    marginBottom: 14,
    textTransform: "uppercase"
  },
  animalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14
  },
  centerPanel: {
    minWidth: 0
  },
  canvasOuterCard: {
    borderRadius: 24,
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    padding: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
  },
  canvasInnerBox: {
    minHeight: 700,
    borderRadius: 20,
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    overflow: "hidden"
  },
  centerHelper: {
    marginTop: 14,
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: 500,
    lineHeight: 1.4
  },
  rightPanel: {
    minWidth: 0
  },
  sideCard: {
    borderRadius: 24,
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    padding: 20,
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
  },
  panelTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 6
  },
  previewBox: {
    height: 700,
    borderRadius: 18,
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    overflow: "hidden"
  },
  helperText: {
    marginTop: 14,
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 1.5
  }
};
