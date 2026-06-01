<template>
  <div class="space-y-8">
    
    <div class="space-y-3">
      <label class="text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em] block">01 / Destination Source</label>
      <input 
        v-model="qrStore.linkText" 
        type="text" 
        class="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3.5 text-sm text-zinc-200 outline-none focus:border-white transition-all font-medium"
        placeholder="https://your-premium-link.com"
      >
    </div>

    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <label class="text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em]">02 / Frame Canvas Architecture</label>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="qrStore.useFrame" class="sr-only peer">
          <div class="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-500 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white peer-checked:after:bg-black"></div>
        </label>
      </div>
      
      <div v-if="qrStore.useFrame" class="space-y-3 animate-fadeIn">
        <select v-model="qrStore.frameType" class="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-xs text-zinc-300 outline-none focus:border-white cursor-pointer">
          <option value="cyber-bracket">Cyber Punk Bracket</option>
          <option value="classic-banner">Classic Label Banner</option>
          <option value="modern-capsule">Modern Smooth Pill</option>
          <option value="minimal-label">Product Tag Label</option>
          <option value="double-line">Double Luxury Lines</option>
          <option value="dashed-blueprint">CAD Dashed Blueprint</option>
          <option value="split-corner">Floating Split Corner</option>
          <option value="vintage-shield">Vintage Bevel Shield</option>
          <option value="polaroid">Retro Polaroid Social</option>
          <option value="neon-shadow">3D Extruded Shadow</option>
        </select>
        
        <input 
          v-model="qrStore.frameText" 
          type="text"
          maxlength="15" 
          class="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-xs font-bold text-white outline-none focus:border-white" 
          placeholder="Masukkan Teks Bawah (Contoh: SCAN ME)"
        >
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em] block">QR Color</label>
        <div class="flex items-center gap-3 bg-black p-2.5 rounded-lg border border-zinc-800">
          <input v-model="qrStore.qrColor" type="color" class="w-7 h-7 rounded bg-transparent border-0 cursor-pointer">
          <span class="text-[10px] font-mono text-zinc-400 font-bold">{{ qrStore.qrColor.toUpperCase() }}</span>
        </div>
      </div>
      <div class="space-y-2">
        <label class="text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em] block">Background</label>
        <div class="flex items-center gap-3 bg-black p-2.5 rounded-lg border border-zinc-800">
          <input v-model="qrStore.bgColor" type="color" class="w-7 h-7 rounded bg-transparent border-0 cursor-pointer">
          <span class="text-[10px] font-mono text-zinc-400 font-bold">{{ qrStore.bgColor.toUpperCase() }}</span>
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <label class="text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em] block">03 / Matrix Dot Geometry</label>
      <div class="grid grid-cols-2 gap-2">
        <button 
          v-for="s in ['square', 'smooth-solid', 'circle', 'diamond']" 
          :key="s"
          @click="qrStore.qrStyle = s"
          :class="qrStore.qrStyle === s ? 'border-white bg-white text-black' : 'border-zinc-800 bg-black text-zinc-500 hover:text-zinc-300'"
          class="px-3 py-3 border rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
        >
          {{ s.replace('-', ' ') }}
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <label class="text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em] block">04 / Identity Center Branding</label>
      <label class="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-900 text-white rounded-lg cursor-pointer hover:bg-zinc-800 transition text-[10px] font-bold uppercase tracking-widest border border-zinc-800">
        Upload Vector Logo
        <input type="file" @change="handleUpload" class="hidden">
      </label>
    </div>

  </div>
</template>

<script setup>
import { qrStore } from '../store/qrStore';

const handleUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => qrStore.logoSrc = ev.target.result;
    reader.readAsDataURL(file);
  }
}
</script>

<style scoped>
.animate-fadeIn { animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-2px); } to { opacity: 1; transform: translateY(0); } }
</style>