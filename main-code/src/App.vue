<template>
  <div class="h-screen w-screen bg-black text-zinc-100 flex flex-col overflow-hidden font-sans selection:bg-zinc-800 selection:text-white">
    
    <Header />

    <main class="flex-1 flex w-full overflow-hidden">
      
      <aside class="w-[400px] xl:w-[440px] h-full border-r border-zinc-900 bg-black overflow-y-auto custom-scroll p-8">
        <ControlPanel />
      </aside>

      <section class="flex-1 h-full bg-zinc-950 flex flex-col items-center justify-center p-8 overflow-y-auto relative">
        <div class="absolute top-6 left-8 text-[10px] font-mono text-zinc-700 uppercase tracking-[0.2em]">
          Engine Matrix Core / Monochrome Studio Active
        </div>
        
        <QrPreview />
      </section>

    </main>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import ControlPanel from './components/ControlPanel.vue';
import QrPreview from './components/QrPreview.vue';
</script>

<style>
html, body, #app { 
  margin: 0; 
  padding: 0; 
  width: 100vw; 
  height: 100vh; 
  overflow: hidden; 
  background-color: #000000; 
}

/* Custom Scrollbar Tipis Monochrome */
.custom-scroll::-webkit-scrollbar { 
  width: 3px; 
}
.custom-scroll::-webkit-scrollbar-thumb { 
  background: #27272a; 
  border-radius: 9px; 
}
.custom-scroll::-webkit-scrollbar-thumb:hover { 
  background: #71717a; 
}
</style>