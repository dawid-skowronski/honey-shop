<template>
  <div class="min-h-screen bg-amber-50/40 text-gray-800 font-sans pb-36">
    <header class="bg-amber-100/60 pt-12 pb-10 text-center shadow-sm mb-8 rounded-b-[3rem]">
      <h1 class="text-4xl md:text-5xl font-black text-amber-700 mb-2 tracking-tight">
        Pasieka Bobińskiego
      </h1>
      <p class="text-amber-900/60 font-bold text-lg">Prawdziwe, naturalne dary ula</p>
    </header>

    <main class="max-w-5xl mx-auto px-4">
      <div class="flex justify-center gap-3 mb-10 flex-wrap">
        <button
          v-for="cat in ['wszystko', 'miody', 'dary ula']"
          :key="cat"
          @click="store.selectedCategory = cat"
          :class="[
            'px-6 py-3 rounded-full capitalize transition-all font-bold shadow-sm text-sm md:text-base',
            store.selectedCategory === cat
              ? 'bg-amber-400 text-amber-950 scale-105'
              : 'bg-white text-gray-500 hover:bg-amber-50',
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        <div
          v-for="product in store.filteredProducts"
          :key="product.id"
          class="bg-white p-4 md:p-6 rounded-[2rem] shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md border border-amber-100/50"
          :class="{ 'opacity-60 grayscale': !product.is_available }"
        >
          <div class="w-20 h-20 md:w-28 md:h-28 mb-4 relative flex justify-center items-center">
            <HoneyJar :color="product.color_hex" v-if="product.category === 'miody'" />
            <div
              v-else
              class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-3xl"
            >
              🐝
            </div>

            <div
              v-if="!product.is_available"
              class="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <span
                class="bg-red-500 text-white text-[10px] md:text-xs px-3 py-1.5 rounded-full font-black -rotate-12 shadow-sm uppercase tracking-wider"
                >Brak</span
              >
            </div>
          </div>

          <h3 class="font-bold text-gray-800 mb-1 leading-tight text-sm md:text-lg">
            {{ product.name }}
          </h3>
          <p class="text-gray-400 text-xs font-semibold mb-2" v-if="product.category === 'miody'">
            Pojemność: 0.9l
          </p>
          <p class="text-amber-600 font-black mb-4 text-xl md:text-2xl">{{ product.price }} zł</p>

          <div class="mt-auto w-full h-12">
            <button
              v-if="!product.is_available"
              disabled
              class="w-full h-full rounded-2xl text-sm md:text-base font-bold bg-gray-100 text-gray-400 cursor-not-allowed"
            >
              Niedostępny
            </button>

            <button
              v-else-if="store.getItemQuantity(product.id) === 0"
              @click="store.addToCart(product)"
              class="w-full h-full rounded-2xl text-sm md:text-base font-extrabold transition-colors active:scale-95 bg-amber-100 text-amber-800 hover:bg-amber-200"
            >
              Dodaj
            </button>

            <div
              v-else
              class="w-full h-full flex justify-between items-center bg-amber-400 rounded-2xl px-1.5 shadow-inner text-amber-950"
            >
              <button
                @click="store.decreaseQuantity(product)"
                class="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-300 hover:bg-amber-200 font-black text-xl active:scale-90 transition-transform"
              >
                -
              </button>
              <span class="font-black text-lg w-6 text-center">{{
                store.getItemQuantity(product.id)
              }}</span>
              <button
                @click="store.addToCart(product)"
                class="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-300 hover:bg-amber-200 font-black text-xl active:scale-90 transition-transform"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div
      v-if="store.cart.length > 0"
      class="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-40"
    >
      <button
        @click="isSummaryOpen = true"
        class="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white px-6 md:px-10 py-4 md:py-5 rounded-full shadow-xl shadow-amber-500/30 font-black flex items-center justify-between md:justify-center gap-4 transition-transform hover:scale-105 active:scale-95"
      >
        <span
          class="bg-white/20 px-3 py-1.5 rounded-xl text-white font-black text-base md:text-lg leading-none whitespace-nowrap"
          >{{ store.cartTotal }} zł</span
        >
        <span class="text-base md:text-lg">Złóż zamówienie</span>
      </button>
    </div>

    <div
      v-if="isSummaryOpen"
      class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity"
    >
      <div
        class="bg-white w-full max-w-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl transform transition-all pb-10 md:pb-8"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-black text-gray-800">Twoje zamówienie</h2>
          <button
            @click="isSummaryOpen = false"
            class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 hover:bg-gray-200 active:bg-gray-300 transition-colors"
          >
            ✕
          </button>
        </div>

        <div class="max-h-[40vh] md:max-h-60 overflow-y-auto mb-6 pr-2">
          <div
            v-for="item in store.cart"
            :key="item.id"
            class="flex justify-between items-center py-4 border-b border-gray-100 last:border-0"
          >
            <div>
              <p class="font-bold text-gray-800 text-lg">{{ item.name }}</p>
              <p class="text-sm text-gray-500 font-medium">
                {{ item.quantity }} szt. x {{ item.price }} zł
              </p>
            </div>
            <p class="font-black text-amber-600 text-lg whitespace-nowrap">
              {{ item.quantity * item.price }} zł
            </p>
          </div>
        </div>

        <div class="flex justify-between items-center bg-amber-50 p-5 rounded-2xl mb-6">
          <span class="font-bold text-amber-900 text-lg">Do zapłaty:</span>
          <span class="font-black text-3xl text-amber-600">{{ store.cartTotal }} zł</span>
        </div>

        <button
          @click="store.checkoutSMS()"
          class="w-full h-16 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-green-500/30 transition-transform active:scale-95 flex justify-center items-center gap-3"
        >
          <span>Złóż zamówienie SMS-em</span>
          <span class="text-2xl">💬</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useHoneyStore } from '../stores/honeyStore'
import HoneyJar from '../components/HoneyJar.vue'

const store = useHoneyStore()
const isSummaryOpen = ref(false)

// zaktualizowany dół pliku HomeView.vue
onMounted(() => {
  store.fetchProducts()
  store.fetchSettings()
})
</script>
