import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase'

export const useHoneyStore = defineStore('honey', () => {
  const products = ref([])
  const cart = ref([])
  const selectedCategory = ref('wszystko')
  const storePhoneNumber = ref('')

  // Pobieranie produktów
  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('name')
    if (data) products.value = data
  }

  // Pobieranie ustawień (numer telefonu)
  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('phone_number').eq('id', 1).single()
    if (data) storePhoneNumber.value = data.phone_number
  }

  // ---- FUNKCJE ADMINA ----
  const updatePhoneNumber = async (newPhone) => {
    await supabase.from('settings').update({ phone_number: newPhone }).eq('id', 1)
    storePhoneNumber.value = newPhone
  }

  const toggleAvailability = async (product) => {
    const newStatus = !product.is_available
    await supabase.from('products').update({ is_available: newStatus }).eq('id', product.id)
    product.is_available = newStatus
  }

  const addProduct = async (productData) => {
    const { data, error } = await supabase.from('products').insert([productData]).select()
    if (!error && data) products.value.push(data[0])
  }
  // ------------------------

  const filteredProducts = computed(() => {
    // 1. Filtrowanie po kategorii
    let result = products.value
    if (selectedCategory.value !== 'wszystko') {
      result = products.value.filter((p) => p.category === selectedCategory.value)
    }

    // 2. Tworzymy kopię i sortujemy
    return [...result].sort((a, b) => {
      // Priorytet A: Dostępność (dostępne wyżej, niedostępne na dół)
      if (a.is_available !== b.is_available) {
        return a.is_available ? -1 : 1
      }

      // Priorytet B: Kategoria (miody wyżej niż dary ula)
      if (a.category !== b.category) {
        return a.category === 'miody' ? -1 : 1
      }

      // Priorytet C: Alfabetycznie po nazwie (żeby był porządek wewnątrz grup)
      return a.name.localeCompare(b.name, 'pl')
    })
  })

  // Koszyk
  const getItemQuantity = (id) => {
    const item = cart.value.find((i) => i.id === id)
    return item ? item.quantity : 0
  }

  const addToCart = (product) => {
    const item = cart.value.find((i) => i.id === product.id)
    if (item) item.quantity++
    else cart.value.push({ ...product, quantity: 1 })
  }

  const decreaseQuantity = (product) => {
    const item = cart.value.find((i) => i.id === product.id)
    if (item) {
      item.quantity--
      if (item.quantity === 0) cart.value = cart.value.filter((i) => i.id !== product.id)
    }
  }

  const cartTotal = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  const checkoutSMS = () => {
    if (cart.value.length === 0) return
    let msg = 'Witam, chciałbym zamówić:\n\n'
    cart.value.forEach((item) => {
      msg += `- ${item.name} (${item.quantity} szt.)\n`
    })
    msg += `\nDo zapłaty: ${cartTotal.value} zł\nProszę o potwierdzenie zamówienia.`

    const link = `sms:${storePhoneNumber.value}?body=${encodeURIComponent(msg)}`
    window.location.href = link
  }

  return {
    products,
    cart,
    selectedCategory,
    storePhoneNumber,
    fetchProducts,
    fetchSettings,
    updatePhoneNumber,
    toggleAvailability,
    addProduct,
    filteredProducts,
    getItemQuantity,
    addToCart,
    decreaseQuantity,
    cartTotal,
    checkoutSMS,
  }
})
