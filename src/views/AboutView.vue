<template>
  <div class="min-h-screen bg-amber-50/30 p-4 md:p-12 font-sans text-gray-800">
    <div
      class="max-w-2xl mx-auto bg-white p-8 md:p-16 rounded-[3rem] shadow-sm border border-amber-100"
    >
      <router-link to="/" class="text-amber-600 font-bold hover:text-amber-700 transition-colors"
        >← Powrót do sklepu</router-link
      >
      <h1 class="text-4xl md:text-5xl font-black text-gray-900 mt-8 mb-6">Pasieka Bobińscy</h1>

      <div class="prose prose-amber prose-lg font-medium text-gray-600 leading-relaxed">
        <p>
          Witaj w naszej rodzinnej pasiece. Działamy w sercu Dolnego Śląska, w okolicach
          <strong>Lubina</strong>, gdzie otaczają nas czyste pola i lasy sprzyjające naszym
          pszczołom.
        </p>

        <p>
          <strong>Pasieka Bobińscy</strong> to nie tylko produkcja miodu - to przede wszystkim
          szacunek do natury i tradycyjne metody pszczelarskie, które przekazujemy z pokolenia na
          pokolenie. Nasze pszczoły mają dostęp do różnorodnych pożytków, co sprawia, że każdy słoik
          miodu, który od nas otrzymujesz, jest wyjątkowy.
        </p>

        <div class="bg-amber-100/50 p-6 rounded-3xl my-8 border-l-4 border-amber-500">
          <p class="text-amber-900 italic font-bold">
            „Każda kropla naszego miodu to efekt ciężkiej pracy pszczół i naszej wielkiej pasji,
            którą chcemy dzielić się z mieszkańcami Lubina i okolic.”
          </p>
        </div>

        <p>
          Dbamy o to, aby nasze miody były w pełni naturalne, nierozgrzewane i pełne wartości
          odżywczych. Kupując u nas, wspierasz lokalne pszczelarstwo i masz pewność, że na Twój stół
          trafia produkt najwyższej jakości.
        </p>
      </div>

      <div class="mt-12 flex gap-4">
        <a
          :href="`tel:${store.storePhoneNumber}`"
          class="bg-amber-500 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-transform active:scale-95"
          >Zadzwoń do nas</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useHoneyStore } from '../stores/honeyStore'

const store = useHoneyStore()

onMounted(async () => {
  await store.fetchSettings()
})
</script>
