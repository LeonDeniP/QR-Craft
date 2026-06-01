<template>
  <div class="bg-black border border-zinc-900 p-6 rounded-[24px] text-center max-w-[320px] w-full mx-auto shadow-2xl">
    
    <div class="relative inline-block w-full">
      <div class="bg-zinc-950 p-3 rounded-[18px] border border-zinc-900 flex justify-center items-center shadow-inner">
        <canvas ref="canvasRef" class="w-full aspect-square max-w-[220px] bg-white rounded shadow-sm"></canvas>
      </div>
    </div>

    <div class="mt-5 p-3 bg-zinc-950/50 rounded-lg border border-zinc-900 text-left">
      <div class="flex justify-between items-center mb-1.5">
        <span class="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Contrast Readability</span>
        <span class="text-[9px] font-mono font-bold text-white">{{ stability }}%</span>
      </div>
      <div class="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
        <div class="h-full bg-white transition-all duration-500" :style="{ width: stability + '%' }"></div>
      </div>
    </div>

    <div class="mt-4">
      <button 
        @click="download" 
        :disabled="!qrStore.linkText.trim()" 
        class="w-full bg-white disabled:bg-zinc-900 text-black disabled:text-zinc-600 font-bold py-3 rounded-lg hover:bg-zinc-200 transition-all active:scale-[0.98] text-[9px] uppercase tracking-widest border border-transparent"
      >
        Export PNG Format
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { qrStore } from '../store/qrStore';
import QRCode from 'qrcode';

const canvasRef = ref(null);
const stability = ref(100);

const calculateStability = () => {
  let score = 100;
  if (qrStore.qrColor.toLowerCase() === qrStore.bgColor.toLowerCase()) score -= 80;
  if (qrStore.logoSrc) score -= 15;
  if (qrStore.linkText.length > 120) score -= 10;
  stability.value = Math.max(score, 15);
};

const draw = async () => {
  if (!qrStore.linkText.trim() || !canvasRef.value) return;
  calculateStability();

  try {
    const rawQrSize = 500;
    const padding = qrStore.useFrame ? 85 : 40;
    const bottomPadding = qrStore.useFrame ? 140 : 40;
    const fullWidth = rawQrSize + (padding * 2);
    const fullHeight = rawQrSize + padding + bottomPadding;

    const canvas = canvasRef.value;
    canvas.width = fullWidth;
    canvas.height = fullHeight;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = qrStore.bgColor;
    ctx.fillRect(0, 0, fullWidth, fullHeight);

    if (qrStore.useFrame && qrStore.frameType) {
      ctx.save();
      ctx.strokeStyle = qrStore.qrColor;
      ctx.fillStyle = qrStore.qrColor;
      const bX = padding - 18; const bY = padding - 18;
      const bW = rawQrSize + 36; const bH = rawQrSize + 36;

      switch (qrStore.frameType) {
        case 'classic-banner':
          ctx.lineWidth = 14; ctx.strokeRect(bX, bY, bW, bH);
          ctx.fillRect(bX, padding + rawQrSize + 18, bW, 75);
          ctx.fillStyle = qrStore.bgColor; ctx.font = 'bold 30px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(qrStore.frameText.toUpperCase(), fullWidth / 2, padding + rawQrSize + 55);
          break;
        case 'cyber-bracket':
          ctx.lineWidth = 10; const len = 50;
          ctx.beginPath(); ctx.moveTo(bX, bY + len); ctx.lineTo(bX, bY); ctx.lineTo(bX + len, bY); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(bX + bW, bY + len); ctx.lineTo(bX + bW, bY); ctx.lineTo(bX + bW - len, bY); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(bX, bY + bH - len); ctx.lineTo(bX, bY + bH); ctx.lineTo(bX + len, bY + bH); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(bX + bW, bY + bH - len); ctx.lineTo(bX + bW, bY + bH); ctx.lineTo(bX + bW - len, bY + bH); ctx.stroke();
          break;
        case 'modern-capsule':
          ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(bX, bY, bW, bH, 50); ctx.stroke();
          break;
        case 'minimal-label':
          ctx.lineWidth = 4; ctx.strokeRect(bX, bY, bW, bH);
          ctx.fillRect(fullWidth/2 - 100, padding+rawQrSize+18, 200, 35);
          ctx.fillStyle = qrStore.bgColor; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(qrStore.frameText.toUpperCase(), fullWidth/2, padding+rawQrSize+42);
          break;
        case 'double-line':
          ctx.lineWidth = 2; ctx.strokeRect(padding-28, padding-28, rawQrSize+56, rawQrSize+56);
          ctx.lineWidth = 8; ctx.strokeRect(bX, bY, bW, bH);
          break;
        case 'dashed-blueprint':
          ctx.lineWidth = 5; ctx.setLineDash([15, 12]); ctx.strokeRect(bX, bY, bW, bH); ctx.setLineDash([]);
          break;
        case 'split-corner':
          ctx.lineWidth = 6; const gap = 70;
          ctx.beginPath(); ctx.moveTo(bX, bY); ctx.lineTo(bX+bW/2-gap, bY); ctx.moveTo(bX+bW/2+gap, bY); ctx.lineTo(bX+bW, bY);
          ctx.moveTo(bX, bY+bH); ctx.lineTo(bX+bW/2-gap, bY+bH); ctx.moveTo(bX+bW/2+gap, bY+bH); ctx.lineTo(bX+bW, bY+bH);
          ctx.moveTo(bX, bY); ctx.lineTo(bX, bY+bH/2-gap); ctx.moveTo(bX, bY+bH/2+gap); ctx.lineTo(bX, bY+bH);
          ctx.moveTo(bX+bW, bY); ctx.lineTo(bX+bW, bY+bH/2-gap); ctx.moveTo(bX+bW, bY+bH/2+gap); ctx.lineTo(bX+bW, bY+bH);
          ctx.stroke();
          break;
        case 'vintage-shield':
          ctx.lineWidth = 6; const cut = 35; ctx.beginPath();
          ctx.moveTo(bX+cut, bY); ctx.lineTo(bX+bW-cut, bY); ctx.lineTo(bX+bW, bY+cut);
          ctx.lineTo(bX+bW, bY+bH-cut); ctx.lineTo(bX+bW-cut, bY+bH); ctx.lineTo(bX+cut, bY+bH);
          ctx.lineTo(bX, bY+bH-cut); ctx.lineTo(bX, bY+cut); ctx.closePath(); ctx.stroke();
          break;
        case 'polaroid':
          ctx.fillRect(bX-12, bY-12, bW+24, bH+70);
          ctx.fillStyle = qrStore.bgColor; ctx.fillRect(bX, bY, bW, bH);
          ctx.fillStyle = qrStore.qrColor; ctx.font = 'bold 24px monospace'; ctx.textAlign = 'center';
          ctx.fillText(qrStore.frameText.toUpperCase(), fullWidth/2, bY+bH+45);
          break;
        case 'neon-shadow':
          ctx.fillStyle = qrStore.qrColor + '22'; ctx.fillRect(bX+15, bY+15, bW, bH);
          ctx.lineWidth = 6; ctx.strokeStyle = qrStore.qrColor; ctx.strokeRect(bX, bY, bW, bH);
          break;
      }
      ctx.restore();
    }

    const qrData = QRCode.create(qrStore.linkText, { errorCorrectionLevel: 'H' });
    const modules = qrData.modules;
    const moduleCount = modules.size;
    const cellSize = rawQrSize / moduleCount;

    ctx.fillStyle = qrStore.qrColor;
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (modules.get(row, col)) {
          const x = padding + (col * cellSize);
          const y = padding + (row * cellSize);
          const isFinderPattern = (row < 7 && col < 7) || (row < 7 && col >= moduleCount - 7) || (row >= moduleCount - 7 && col < 7);
          ctx.beginPath();
          if (qrStore.qrStyle === 'smooth-solid') {
            const r = cellSize * 0.45;
            const t = row > 0 && modules.get(row-1, col); const b = row < moduleCount-1 && modules.get(row+1, col);
            const l = col > 0 && modules.get(row, col-1); const rt = col < moduleCount-1 && modules.get(row, col+1);
            const tl = (!t && !l) ? r : 0; const tr = (!t && !rt) ? r : 0;
            const bl = (!b && !l) ? r : 0; const br = (!b && !rt) ? r : 0;
            ctx.roundRect ? ctx.roundRect(x, y, cellSize+0.3, cellSize+0.3, [tl,tr,br,bl]) : ctx.rect(x,y,cellSize,cellSize);
            ctx.fill();
          } else if (qrStore.qrStyle === 'circle' && !isFinderPattern) {
            ctx.arc(x+cellSize/2, y+cellSize/2, (cellSize/2)*0.85, 0, 2*Math.PI); ctx.fill();
          } else if (qrStore.qrStyle === 'diamond' && !isFinderPattern) {
            ctx.save(); ctx.translate(x+cellSize/2, y+cellSize/2); ctx.rotate(Math.PI/4);
            ctx.fillRect(-cellSize/2.4, -cellSize/2.4, cellSize/1.2, cellSize/1.2); ctx.restore();
          } else {
            ctx.fillRect(x, y, cellSize+0.2, cellSize+0.2);
          }
        }
      }
    }

    if (qrStore.logoSrc) {
      const logoImg = new Image(); logoImg.src = qrStore.logoSrc;
      await new Promise(r => logoImg.onload = r);
      const lSize = rawQrSize * 0.22;
      const lX = padding + (rawQrSize - lSize) / 2;
      const lY = padding + (rawQrSize - lSize) / 2;
      ctx.beginPath(); ctx.fillStyle = qrStore.bgColor;
      if (qrStore.qrStyle !== 'square') {
        ctx.arc(fullWidth/2, padding+rawQrSize/2, (lSize/2)+8, 0, 2*Math.PI); ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.arc(fullWidth/2, padding+rawQrSize/2, lSize/2, 0, 2*Math.PI);
        ctx.clip(); ctx.drawImage(logoImg, lX, lY, lSize, lSize); ctx.restore();
      } else {
        ctx.fillRect(lX-6, lY-6, lSize+12, lSize+12); ctx.drawImage(logoImg, lX, lY, lSize, lSize);
      }
    }
  } catch (err) { console.error(err); }
};

watch(() => [qrStore.linkText, qrStore.qrColor, qrStore.bgColor, qrStore.qrStyle, qrStore.logoSrc, qrStore.useFrame, qrStore.frameText, qrStore.frameType], draw, { deep: true });
onMounted(() => setTimeout(draw, 150));

const download = () => {
  const link = document.createElement('a'); link.download = `qr-pro-${Date.now()}.png`;
  link.href = canvasRef.value.toDataURL(); link.click();
};
</script>