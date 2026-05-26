<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-12 text-gray-800 font-sans pb-24">
    <div
      v-if="!isLogged"
      class="max-w-md mx-auto bg-white p-8 rounded-[2.5rem] shadow-sm text-center mt-10 md:mt-20 border border-amber-100/50"
    >
      <div class="text-6xl mb-6">🔒</div>
      <h1 class="text-2xl font-black text-amber-600 mb-6">Panel Pasieki</h1>
      <p class="text-gray-500 font-medium mb-6">Podaj hasło, aby zarządzać sklepem.</p>

      <input
        v-model="password"
        type="password"
        @keyup.enter="checkPassword"
        placeholder="Wprowadź hasło..."
        class="w-full border-2 border-gray-100 p-4 rounded-2xl font-bold text-center mb-4 focus:outline-none focus:border-amber-400 transition-colors"
      />
      <button
        @click="checkPassword"
        class="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-2xl transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
      >
        Wejdź do panelu
      </button>

      <p v-if="error" class="text-red-500 font-bold mt-4 bg-red-50 py-2 rounded-xl">
        Nieprawidłowe hasło!
      </p>

      <router-link
        to="/"
        class="block mt-8 text-gray-400 font-bold hover:text-amber-600 transition-colors"
        >← Wróć do sklepu</router-link
      >
    </div>

    <div v-else class="max-w-2xl mx-auto animate-fade-in">
      <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 class="text-3xl font-black text-amber-600">Panel Zarządzania</h1>
        <div class="flex gap-4">
          <button
            @click="isLogged = false"
            class="text-gray-500 font-bold hover:text-amber-600 transition-colors px-4 py-2 bg-white rounded-xl shadow-sm"
          >
            Wyloguj
          </button>
          <router-link
            to="/"
            class="text-white font-bold bg-gray-800 hover:bg-gray-900 transition-colors px-4 py-2 rounded-xl shadow-sm"
            >Do sklepu →</router-link
          >
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm mb-8 border border-gray-100">
        <h2 class="text-xl font-bold mb-4">Numer do zamówień (SMS)</h2>
        <div class="flex flex-col md:flex-row gap-3">
          <input
            v-model="phoneInput"
            type="text"
            class="border-2 border-gray-100 p-4 rounded-2xl flex-1 font-bold text-lg focus:outline-none focus:border-amber-400 transition-colors"
            placeholder="np. +48 123 456 789"
          />
          <button
            @click="savePhone"
            class="bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 rounded-2xl font-black transition-transform active:scale-95"
          >
            Zapisz
          </button>
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm mb-8 border border-gray-100">
        <h2 class="text-xl font-bold mb-4">Stan magazynowy oferty</h2>
        <div class="flex flex-col gap-3">
          <div
            v-for="product in store.products"
            :key="product.id"
            class="flex flex-col p-4 border-2 border-gray-50 rounded-2xl transition-colors"
            :class="{ 'bg-red-50 border-red-100': !product.is_available }"
          >
            <div
              v-if="editingId !== product.id"
              class="flex justify-between items-center w-full gap-2"
            >
              <div class="flex flex-col">
                <span
                  class="font-bold text-base md:text-lg"
                  :class="{ 'text-red-900': !product.is_available }"
                  >{{ product.name }}</span
                >
                <span class="text-sm text-gray-500 font-bold"
                  >{{ product.price }} zł | {{ product.category }}</span
                >
              </div>

              <div class="flex items-center gap-1.5 md:gap-2">
                <button
                  @click="startEditing(product)"
                  class="w-10 h-10 flex items-center justify-center bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl transition-colors active:scale-90"
                  title="Edytuj"
                >
                  ✏️
                </button>
                <button
                  @click="removeProduct(product.id)"
                  class="w-10 h-10 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors active:scale-90"
                  title="Usuń"
                >
                  🗑️
                </button>

                <button
                  @click="store.toggleAvailability(product)"
                  class="w-28 px-2 py-2.5 rounded-xl font-black transition-transform active:scale-95 text-xs md:text-sm"
                  :class="
                    product.is_available
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  "
                >
                  {{ product.is_available ? 'Zgłoś brak' : 'Przywróć' }}
                </button>
              </div>
            </div>

            <div
              v-else
              class="flex flex-col gap-3 w-full bg-amber-50/70 p-3 rounded-xl mt-1 border border-amber-200"
            >
              <input
                v-model="editForm.name"
                class="p-3 rounded-xl border border-amber-200 font-bold outline-none focus:border-amber-400"
                placeholder="Nazwa produktu"
              />

              <div class="flex gap-2">
                <input
                  v-model="editForm.price"
                  type="number"
                  step="1"
                  class="p-3 rounded-xl border border-amber-200 font-bold outline-none focus:border-amber-400 w-24 text-center"
                  placeholder="Cena"
                />
                <select
                  v-model="editForm.category"
                  class="p-3 rounded-xl border border-amber-200 font-bold outline-none focus:border-amber-400 flex-1 bg-white"
                >
                  <option value="miody">Miód</option>
                  <option value="dary ula">Dary ula</option>
                </select>
                <input
                  v-if="editForm.category === 'miody'"
                  type="color"
                  v-model="editForm.color_hex"
                  class="w-12 h-12 rounded-xl cursor-pointer p-0 border-0"
                />
              </div>

              <div class="flex gap-2 justify-end mt-1">
                <button
                  @click="cancelEditing"
                  class="px-5 py-2.5 bg-white border-2 border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl font-bold transition-colors active:scale-95"
                >
                  Anuluj
                </button>
                <button
                  @click="saveEditing"
                  class="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black transition-transform active:scale-95 shadow-md shadow-green-500/20"
                >
                  Zapisz zmiany
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-amber-100/50 p-6 rounded-3xl shadow-sm border border-amber-200/50">
        <h2 class="text-xl font-bold mb-4">Dodaj nowy produkt do oferty</h2>
        <form @submit.prevent="submitNewProduct" class="flex flex-col gap-4">
          <input
            v-model="newProd.name"
            placeholder="Nazwa (np. Miód Malinowy)"
            class="border-2 border-white focus:border-amber-400 outline-none p-4 rounded-2xl font-bold transition-colors"
            required
          />

          <div class="flex gap-4">
            <select
              v-model="newProd.category"
              class="border-2 border-white focus:border-amber-400 outline-none p-4 rounded-2xl font-bold flex-1 bg-white cursor-pointer transition-colors"
            >
              <option value="miody">Miód</option>
              <option value="dary ula">Dary ula (pyłek, wosk)</option>
            </select>
            <input
              v-model="newProd.price"
              type="number"
              step="1"
              placeholder="Cena (zł)"
              class="border-2 border-white focus:border-amber-400 outline-none p-4 rounded-2xl font-bold w-32 text-center transition-colors"
              required
            />
          </div>

          <div
            v-if="newProd.category === 'miody'"
            class="flex items-center gap-4 bg-white p-4 rounded-2xl border-2 border-white transition-colors"
          >
            <label class="font-bold text-gray-500">Wybierz kolor miodu:</label>
            <input
              type="color"
              v-model="newProd.color_hex"
              class="w-12 h-12 rounded-xl cursor-pointer border-0 p-0"
            />
          </div>

          <button
            type="submit"
            class="bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-2xl text-lg transition-transform active:scale-95 mt-2 shadow-lg shadow-amber-500/20"
          >
            Dodaj do sklepu
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHoneyStore } from '../stores/honeyStore'

const isLogged = ref(false)
const password = ref('')
const error = ref(false)

const checkPassword = () => {
  if (password.value === 'pszczola123') {
    isLogged.value = true
    error.value = false
    password.value = ''
  } else {
    error.value = true
  }
}

const store = useHoneyStore()
const phoneInput = ref('')

const editingId = ref(null)
const editForm = ref({})

const startEditing = (product) => {
  editingId.value = product.id
  editForm.value = { ...product }
}

const cancelEditing = () => {
  editingId.value = null
  editForm.value = {}
}

const saveEditing = async () => {
  if (!editForm.value.name || !editForm.value.price) return
  await store.updateProduct(editForm.value)
  editingId.value = null
}

const removeProduct = async (id) => {
  if (
    confirm('⚠️ Na pewno chcesz trwale usunąć ten produkt ze sklepu? Tej akcji nie da się cofnąć!')
  ) {
    await store.deleteProduct(id)
  }
}

const newProd = ref({
  name: '',
  category: 'miody',
  color_hex: '#FDE887',
  price: '',
  is_available: true,
})

onMounted(async () => {
  await store.fetchProducts()
  await store.fetchSettings()
  phoneInput.value = store.storePhoneNumber
})

const savePhone = () => {
  if (phoneInput.value) {
    store.updatePhoneNumber(phoneInput.value)
    alert('Zapisano nowy numer!')
  }
}

const submitNewProduct = async () => {
  if (!newProd.value.name || !newProd.value.price) return

  await store.addProduct({
    name: newProd.value.name,
    category: newProd.value.category,
    color_hex: newProd.value.category === 'miody' ? newProd.value.color_hex : null,
    price: parseFloat(newProd.value.price),
    is_available: true,
  })

  newProd.value.name = ''
  newProd.value.price = ''
  alert('Dodano produkt!')
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
