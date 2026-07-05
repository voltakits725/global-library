<template>
  <div class="p-6 md:p-8 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-slate-800 mb-2">{{ $t('nav.dashboard') }}</h1>
    <p class="text-slate-500 mb-8">Selamat datang kembali di Panel Admin Global Library.</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center transition-all hover:-translate-y-1 hover:shadow-md">
        <div class="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        </div>
        <h3 class="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Buku</h3>
        <p class="text-4xl font-black text-slate-800">{{ totalBooks }}</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center transition-all hover:-translate-y-1 hover:shadow-md">
        <div class="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </div>
        <h3 class="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Permintaan Pending</h3>
        <p class="text-4xl font-black text-slate-800">{{ pendingRequests }}</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center transition-all hover:-translate-y-1 hover:shadow-md">
        <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Peminjaman Aktif</h3>
        <p class="text-4xl font-black text-slate-800">{{ activeRequests }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

const totalBooks = ref(0)
const pendingRequests = ref(0)
const activeRequests = ref(0)

onMounted(async () => {
  try {
    const booksSnap = await getDocs(collection(db, 'books'))
    totalBooks.value = booksSnap.size

    const reqSnap = await getDocs(collection(db, 'requests'))
    let p = 0
    let a = 0
    reqSnap.forEach(doc => {
      const data = doc.data()
      if (data.status === 'pending') p++
      if (data.status === 'active') a++
    })
    pendingRequests.value = p
    activeRequests.value = a
  } catch (error) {
    console.error("Gagal memuat dashboard:", error)
  }
})
</script>
