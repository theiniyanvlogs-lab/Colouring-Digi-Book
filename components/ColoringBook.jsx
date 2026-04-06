"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const COLORS = ["#ff4d4f","#ff7a00","#ffd400","#52c41a","#13c2c2","#1677ff","#722ed1","#eb2f96","#8c8c8c","#8b5a2b","#000000","#ffffff"];
const ANIMALS = [
  { id: "puppy", name: "Puppy", image: "/images/puppy-coloring.png", emoji: "🐶" },
  { id: "cat", name: "Cat", image: "/images/cat-coloring.png", emoji: "🐱" },
  { id: "lion", name: "Lion", image: "/images/lion-coloring.png", emoji: "🦁" },
  { id: "elephant", name: "Elephant", image: "/images/elephant-coloring.png", emoji: "🐘" },
  { id: "giraffe", name: "Giraffe", image: "/images/giraffe-coloring.png", emoji: "🦒" },
  { id: "owl", name: "Owl", image: "/images/owl-coloring.png", emoji: "🦉" },
];

function createFallbackSvgDataUrl(label, emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><rect width="100%" height="100%" fill="white"/><circle cx="400" cy="420" r="180" fill="white" stroke="black" stroke-width="16"/><circle cx="320" cy="260" r="70" fill="white" stroke="black" stroke-width="16"/><circle cx="480" cy="260" r="70" fill="white" stroke="black" stroke-width="16"/><circle cx="350" cy="390" r="16" fill="black"/><circle cx="450" cy="390" r="16" fill="black"/><ellipse cx="400" cy="460" rx="28" ry="18" fill="white" stroke="black" stroke-width="10"/><path d="M370 500 Q400 540 430 500" fill="none" stroke="black" stroke-width="10" stroke-linecap="round"/><ellipse cx="250" cy="720" rx="80" ry="120" fill="white" stroke="black" stroke-width="16"/><ellipse cx="550" cy="720" rx="80" ry="120" fill="white" stroke="black" stroke-width="16"/><ellipse cx="400" cy="740" rx="120" ry="150" fill="white" stroke="black" stroke-width="16"/><text x="400" y="930" text-anchor="middle" font-size="48" font-family="Arial" fill="black">${emoji} ${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function AnimalSelector({ animals, currentIndex, onSelect, missingIds }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-2xl border border-gray-200">
      <h3 className="text-xl font-extrabold text-gray-800 mb-3">Choose Animal</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
        {animals.map((animal, index) => (
          <button key={animal.id} onClick={() => onSelect(index)} className={`rounded-2xl border-2 p-3 text-center transition active:scale-[0.98] ${currentIndex === index ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
            <div className="text-3xl mb-1">{animal.emoji}</div>
            <div className="text-sm font-bold text-gray-800">{animal.name}</div>
            {missingIds.has(animal.id) ? <div className="mt-1 text-[10px] font-bold text-orange-600">Fallback</div> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toolbar({ colors, selectedColor, setSelectedColor, mode, setMode, brushSize, setBrushSize, onUndo, onRedo, onClear, onDownload, canUndo, canRedo }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-2xl border border-gray-200 space-y-5">
      <div>
        <h3 className="text-xl font-extrabold text-gray-800 mb-3">Tools</h3>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => setMode("bucket")} className={`rounded-2xl px-3 py-3 font-bold transition ${mode === "bucket" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}`}>Bucket 🪣</button>
          <button onClick={() => setMode("brush")} className={`rounded-2xl px-3 py-3 font-bold transition ${mode === "brush" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-800"}`}>Brush 🖌️</button>
          <button onClick={() => setMode("eraser")} className={`rounded-2xl px-3 py-3 font-bold transition ${mode === "eraser" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-800"}`}>Eraser 🧽</button>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-extrabold text-gray-800 mb-3">Colors</h3>
        <div className="grid grid-cols-4 gap-3">
          {colors.map((color) => (
            <button key={color} onClick={() => setSelectedColor(color)} className={`h-12 w-12 rounded-2xl border-4 transition active:scale-95 ${selectedColor === color ? "border-gray-900 scale-105" : "border-white shadow"}`} style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-extrabold text-gray-800 mb-3">Brush Size</h3>
        <input type="range" min={6} max={40} value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full" />
        <div className="mt-2 text-sm font-semibold text-gray-700">{brushSize}px</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={onUndo} disabled={!canUndo} className="rounded-2xl bg-blue-500 px-4 py-3 font-bold text-white disabled:opacity-50">Undo ↩️</button>
        <button onClick={onRedo} disabled={!canRedo} className="rounded-2xl bg-purple-500 px-4 py-3 font-bold text-white disabled:opacity-50">Redo ↪️</button>
        <button onClick={onClear} className="rounded-2xl bg-red-500 px-4 py-3 font-bold text-white">Clear 🧼</button>
        <button onClick={onDownload} className="rounded-2xl bg-green-500 px-4 py-3 font-bold text-white">Save ⬇️</button>
      </div>
    </div>
  );
}

export default function ColoringBook() {
  const displayCanvasRef = useRef(null);
  const fillCanvasRef = useRef(null);
  const baseCanvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [mode, setMode] = useState("bucket");
  const [brushSize, setBrushSize] = useState(16);
  const [isReady, setIsReady] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 1000 });
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [missingIds, setMissingIds] = useState(new Set());
  const [usingFallback, setUsingFallback] = useState(false);

  const OUTLINE_THRESHOLD = 110;
  const animal = ANIMALS[currentIndex];
  const fallbackSrc = useMemo(() => createFallbackSvgDataUrl(animal.name, animal.emoji), [animal.name, animal.emoji]);

  useEffect(() => {
    const onResize = () => loadAnimalImage();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [currentIndex, fallbackSrc]);

  useEffect(() => {
    loadAnimalImage();
  }, [currentIndex, fallbackSrc]);

  const setupCanvasesFromImage = (img) => {
    const displayCanvas = displayCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    const baseCanvas = baseCanvasRef.current;
    if (!displayCanvas || !fillCanvas || !baseCanvas) return;

    const maxWidth = Math.min(window.innerWidth < 1024 ? window.innerWidth - 32 : 850, 850);
    const aspect = img.height / img.width || 1;
    const width = Math.max(280, Math.round(maxWidth));
    const height = Math.max(280, Math.round(width * aspect));

    setCanvasSize({ width, height });
    [displayCanvas, fillCanvas, baseCanvas].forEach((canvas) => { canvas.width = width; canvas.height = height; });

    const baseCtx = baseCanvas.getContext("2d", { willReadFrequently: true });
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!baseCtx || !fillCtx) return;

    baseCtx.clearRect(0, 0, width, height);
    fillCtx.clearRect(0, 0, width, height);
    baseCtx.drawImage(img, 0, 0, width, height);
    redrawAll();
    setIsReady(true);
  };

  const loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Image not found: ${src}`));
    img.src = src;
  });

  const loadAnimalImage = async () => {
    const displayCanvas = displayCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    const baseCanvas = baseCanvasRef.current;
    if (!displayCanvas || !fillCanvas || !baseCanvas) return;

    setIsReady(false);
    setUndoStack([]);
    setRedoStack([]);

    try {
      const img = await loadImage(animal.image);
      setUsingFallback(false);
      setMissingIds((prev) => {
        if (!prev.has(animal.id)) return prev;
        const next = new Set(prev); next.delete(animal.id); return next;
      });
      setupCanvasesFromImage(img);
    } catch {
      const fallbackImg = await loadImage(fallbackSrc);
      setUsingFallback(true);
      setMissingIds((prev) => {
        if (prev.has(animal.id)) return prev;
        const next = new Set(prev); next.add(animal.id); return next;
      });
      setupCanvasesFromImage(fallbackImg);
    }
  };

  const redrawAll = () => {
    const displayCanvas = displayCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    const baseCanvas = baseCanvasRef.current;
    if (!displayCanvas || !fillCanvas || !baseCanvas) return;
    const displayCtx = displayCanvas.getContext("2d");
    if (!displayCtx) return;
    displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
    displayCtx.drawImage(fillCanvas, 0, 0);
    displayCtx.drawImage(baseCanvas, 0, 0);
  };

  const hexToRgba = (hex) => {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    const num = parseInt(c, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255, a: 255 };
  };

  const isOutlinePixel = (r, g, b, a) => a >= 10 && (r + g + b) / 3 < OUTLINE_THRESHOLD;

  const getCanvasPoint = (e) => {
    const canvas = displayCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    let clientX = 0, clientY = 0;
    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX; clientY = e.touches[0].clientY;
    } else if ("changedTouches" in e && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX; clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX; clientY = e.clientY;
    }
    const x = Math.floor(((clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((clientY - rect.top) / rect.height) * canvas.height);
    return { x, y };
  };

  const pushUndoSnapshot = () => {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas) return;
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return;
    const snapshot = fillCtx.getImageData(0, 0, fillCanvas.width, fillCanvas.height);
    setUndoStack((prev) => [...prev, snapshot]);
    setRedoStack([]);
  };

  const floodFill = (x, y) => {
    const baseCanvas = baseCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    if (!baseCanvas || !fillCanvas) return;
    const baseCtx = baseCanvas.getContext("2d", { willReadFrequently: true });
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!baseCtx || !fillCtx) return;

    const width = baseCanvas.width, height = baseCanvas.height;
    if (x < 0 || y < 0 || x >= width || y >= height) return;

    const baseImage = baseCtx.getImageData(0, 0, width, height);
    const fillImage = fillCtx.getImageData(0, 0, width, height);
    const baseData = baseImage.data, fillData = fillImage.data;
    const startIndex = (y * width + x) * 4;

    if (isOutlinePixel(baseData[startIndex], baseData[startIndex + 1], baseData[startIndex + 2], baseData[startIndex + 3])) return;

    const newColor = hexToRgba(selectedColor);
    if (fillData[startIndex + 3] > 0 && fillData[startIndex] === newColor.r && fillData[startIndex + 1] === newColor.g && fillData[startIndex + 2] === newColor.b) return;

    pushUndoSnapshot();

    const visited = new Uint8Array(width * height);
    const stack = [[x, y]];

    while (stack.length) {
      const current = stack.pop();
      if (!current) continue;
      const [cx, cy] = current;
      if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
      const pos = cy * width + cx;
      if (visited[pos]) continue;
      visited[pos] = 1;
      const i = pos * 4;
      if (isOutlinePixel(baseData[i], baseData[i + 1], baseData[i + 2], baseData[i + 3])) continue;

      fillData[i] = newColor.r; fillData[i + 1] = newColor.g; fillData[i + 2] = newColor.b; fillData[i + 3] = 255;
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }

    fillCtx.putImageData(fillImage, 0, 0);
    redrawAll();
  };

  const drawBrushDot = (x, y, erase = false) => {
    const fillCanvas = fillCanvasRef.current;
    const baseCanvas = baseCanvasRef.current;
    if (!fillCanvas || !baseCanvas) return;

    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    const baseCtx = baseCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx || !baseCtx) return;

    const radius = Math.max(erase ? 4 : 2, Math.floor(brushSize / 2));
    const color = hexToRgba(selectedColor);
    const minX = Math.max(0, x - radius), maxX = Math.min(fillCanvas.width - 1, x + radius);
    const minY = Math.max(0, y - radius), maxY = Math.min(fillCanvas.height - 1, y + radius);

    const fillImage = fillCtx.getImageData(minX, minY, maxX - minX + 1, maxY - minY + 1);
    const baseImage = baseCtx.getImageData(minX, minY, maxX - minX + 1, maxY - minY + 1);
    const fillData = fillImage.data, baseData = baseImage.data;
    const localWidth = maxX - minX + 1;

    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        const dx = px - x, dy = py - y;
        if (dx * dx + dy * dy > radius * radius) continue;
        const localX = px - minX, localY = py - minY;
        const i = (localY * localWidth + localX) * 4;
        if (!erase && isOutlinePixel(baseData[i], baseData[i + 1], baseData[i + 2], baseData[i + 3])) continue;

        if (erase) {
          fillData[i] = 0; fillData[i + 1] = 0; fillData[i + 2] = 0; fillData[i + 3] = 0;
        } else {
          fillData[i] = color.r; fillData[i + 1] = color.g; fillData[i + 2] = color.b; fillData[i + 3] = 255;
        }
      }
    }

    fillCtx.putImageData(fillImage, minX, minY);
    redrawAll();
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (!isReady) return;
    const point = getCanvasPoint(e);
    if (!point) return;
    if (mode === "bucket") return floodFill(point.x, point.y);
    pushUndoSnapshot();
    isDrawingRef.current = true;
    drawBrushDot(point.x, point.y, mode === "eraser");
  };

  const handleMove = (e) => {
    e.preventDefault();
    if (!isReady || !isDrawingRef.current || mode === "bucket") return;
    const point = getCanvasPoint(e);
    if (!point) return;
    drawBrushDot(point.x, point.y, mode === "eraser");
  };

  const handleEnd = (e) => { if (e) e.preventDefault(); isDrawingRef.current = false; };

  const handleUndo = () => {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas || undoStack.length === 0) return;
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return;
    const current = fillCtx.getImageData(0, 0, fillCanvas.width, fillCanvas.height);
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, current]);
    fillCtx.putImageData(previous, 0, 0);
    redrawAll();
  };

  const handleRedo = () => {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas || redoStack.length === 0) return;
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return;
    const current = fillCtx.getImageData(0, 0, fillCanvas.width, fillCanvas.height);
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, current]);
    fillCtx.putImageData(next, 0, 0);
    redrawAll();
  };

  const handleClear = () => {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas) return;
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return;
    pushUndoSnapshot();
    fillCtx.clearRect(0, 0, fillCanvas.width, fillCanvas.height);
    redrawAll();
  };

  const handleDownload = () => {
    const displayCanvas = displayCanvasRef.current;
    if (!displayCanvas) return;
    const link = document.createElement("a");
    link.download = `${animal.id}-colored.png`;
    link.href = displayCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800">Ultra Final Kids Colouring Book 🎨🦁🐶🐘</h1>
          <p className="mt-2 text-sm md:text-base text-gray-700 font-semibold">Bucket fill inside lines + Brush + Eraser + Undo/Redo + Multi-page animals</p>
          {usingFallback ? <p className="mt-2 text-xs md:text-sm font-bold text-orange-600">Missing image for {animal.name}. Showing built-in fallback coloring page.</p> : null}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="rounded-3xl bg-white p-4 shadow-2xl border border-gray-200">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-2xl bg-yellow-100 px-4 py-3 text-lg font-extrabold text-gray-800 shadow">{animal.emoji} {animal.name}</div>
              <div className="flex gap-3">
                <button onClick={() => setCurrentIndex((prev) => (prev === 0 ? ANIMALS.length - 1 : prev - 1))} className="rounded-2xl bg-orange-500 px-4 py-3 font-bold text-white shadow">⬅ Previous</button>
                <button onClick={() => setCurrentIndex((prev) => (prev === ANIMALS.length - 1 ? 0 : prev + 1))} className="rounded-2xl bg-blue-500 px-4 py-3 font-bold text-white shadow">Next ➡</button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative overflow-hidden rounded-3xl border-4 border-yellow-300 bg-white shadow-xl touch-none" style={{ width: canvasSize.width, maxWidth: "100%" }}>
                <canvas ref={baseCanvasRef} className="hidden" />
                <canvas ref={fillCanvasRef} className="hidden" />
                <canvas
                  ref={displayCanvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  className="block h-auto w-full cursor-pointer select-none touch-none"
                  onMouseDown={handleStart}
                  onMouseMove={handleMove}
                  onMouseUp={handleEnd}
                  onMouseLeave={handleEnd}
                  onTouchStart={handleStart}
                  onTouchMove={handleMove}
                  onTouchEnd={handleEnd}
                  onTouchCancel={handleEnd}
                />
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <Toolbar
              colors={COLORS}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              mode={mode}
              setMode={setMode}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClear={handleClear}
              onDownload={handleDownload}
              canUndo={undoStack.length > 0}
              canRedo={redoStack.length > 0}
            />
            <AnimalSelector animals={ANIMALS} currentIndex={currentIndex} onSelect={setCurrentIndex} missingIds={missingIds} />
          </aside>
        </div>
      </div>
    </main>
  );
}
