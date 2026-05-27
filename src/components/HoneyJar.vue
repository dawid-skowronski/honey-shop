<template>
  <svg viewBox="0 0 100 90" class="w-full h-full drop-shadow-sm">
    <!-- Teraz jest piękne miodowe złoto -->
    <rect x="15" y="5" width="70" height="14" rx="3" fill="#F59E0B" />

    <path
      d="M20 19 L20 75 Q20 85 30 85 L70 85 Q80 85 80 75 L80 19 Z"
      fill="none"
      stroke="#D1D5DB"
      stroke-width="2.5"
    />

    <path
      d="M22 30 L22 75 Q22 83 30 83 L70 83 Q78 83 78 75 L78 30 Z"
      :fill="color || 'transparent'"
    />

    <path
      d="M28 35 L28 70"
      fill="none"
      stroke="rgba(255,255,255,0.6)"
      stroke-width="3"
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup>
defineProps({
  color: String,
})
</script>
