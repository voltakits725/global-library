<template>
  <div class="pt-6 px-4 md:px-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-slate-800">{{ $t('dashboard.title') }}</h1>
      <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">AU</div>
    </div>
    
    <!-- Stats Grid -->
    <h2 class="text-lg font-bold text-slate-800 mb-4">{{ $t('dashboard.overview') }}</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <!-- Total Books -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div class="text-slate-400 mb-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-slate-800">{{ totalBooks }}</h3>
          <p class="text-xs text-slate-500 font-medium">{{ $t('dashboard.total_books') }}</p>
        </div>
      </div>
      
      <!-- Borrow Requests -->
      <div class="bg-blue-600 p-5 rounded-2xl shadow-sm flex flex-col justify-between text-white">
        <div class="text-blue-200 mb-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </div>
        <div>
          <h3 class="text-2xl font-bold">{{ activeRequests }}</h3>
          <p class="text-xs text-blue-100 font-medium">{{ $t('dashboard.active_requests') }}</p>
        </div>
      </div>

      <!-- Active Users (Students) -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div class="text-slate-400 mb-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-slate-800">{{ activeStudents }}</h3>
          <p class="text-xs text-slate-500 font-medium">{{ $t('dashboard.active_students') }}</p>
        </div>
      </div>
    </div>

    <!-- Analytics Charts -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
      
      <!-- Top 5 Books Section -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
        <h2 class="text-lg font-bold text-slate-800 mb-6">{{ $t('dashboard.top_books') }}</h2>
        
        <!-- Chart.js Doughnut for Books -->
        <div class="w-full h-64 shrink-0 flex flex-col items-center justify-center relative pb-6 mb-2">
          <Doughnut v-if="topBooks.length > 0" :data="bookChartData" :options="chartOptions" />
          <span v-else class="text-slate-400 text-sm font-medium">{{ $t('dashboard.no_data') }}</span>
        </div>

        <div class="w-full flex-grow">
          <div v-if="topBooks.length === 0" class="h-10 flex items-center justify-center text-slate-400 text-sm">
            {{ $t('dashboard.no_data') }}
          </div>
          <div v-else class="space-y-6">
            <div v-for="(book, index) in topBooks" :key="index">
              <div class="flex justify-between items-end mb-2">
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                       :style="{ backgroundColor: bookColors[index % bookColors.length] }">
                    {{ index + 1 }}
                  </div>
                  <span class="font-bold text-slate-700 text-sm truncate max-w-[200px] md:max-w-xs">{{ book.title }}</span>
                </div>
                <div class="text-right">
                  <span class="font-bold text-sm text-slate-600 block">{{ book.count }} {{ $t('dashboard.borrows') }}</span>
                </div>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div class="h-2.5 rounded-full transition-all duration-1000 ease-out" 
                     :style="{ width: book.percent + '%', backgroundColor: bookColors[index % bookColors.length] }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top 5 Categories Section -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
        <h2 class="text-lg font-bold text-slate-800 mb-6">{{ $t('dashboard.top_categories') }}</h2>
        
        <!-- Chart.js Pie for Categories -->
        <div class="w-full h-64 shrink-0 flex flex-col items-center justify-center relative pb-6 mb-2">
          <Pie v-if="topCategories.length > 0" :data="catChartData" :options="chartOptions" />
          <span v-else class="text-slate-400 text-sm font-medium">{{ $t('dashboard.no_data') }}</span>
        </div>

        <div class="w-full flex-grow">
          <div v-if="topCategories.length === 0" class="h-10 flex items-center justify-center text-slate-400 text-sm">
            {{ $t('dashboard.no_data') }}
          </div>
          <div v-else class="space-y-6">
            <div v-for="(cat, index) in topCategories" :key="index">
              <div class="flex justify-between items-end mb-2">
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                       :style="{ backgroundColor: catColors[index % catColors.length] }">
                    {{ index + 1 }}
                  </div>
                  <span class="font-bold text-slate-700 text-sm truncate max-w-[200px] md:max-w-xs">{{ cat.title }}</span>
                </div>
                <div class="text-right">
                  <span class="font-bold text-sm text-slate-600 block">{{ cat.count }} {{ $t('dashboard.borrows') }}</span>
                </div>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div class="h-2.5 rounded-full transition-all duration-1000 ease-out" 
                     :style="{ width: cat.percent + '%', backgroundColor: catColors[index % catColors.length] }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut, Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

// Palet warna yang berbeda untuk membedakan Buku (Biru) dan Kategori (Orange/Merah)
const bookColors = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe']
const catColors = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa']

const booksData = ref([])
const requestsData = ref([])
const activeStudents = ref(0)

// 1. Computed Metrics
const totalBooks = computed(() => booksData.value.length)
const activeRequests = computed(() => requestsData.value.filter(r => r.status === 'pending' || r.status === 'active').length)

// 2. Computed Analytics: Top 5 Books
const topBooks = computed(() => {
  const counts = {}
  let totalBorrows = 0
  requestsData.value.forEach(req => {
    const title = req.bookTitle || 'Buku Tidak Diketahui'
    counts[title] = (counts[title] || 0) + 1
    totalBorrows++
  })
  
  return Object.entries(counts)
    .map(([title, count]) => ({ 
      title, 
      count, 
      percent: totalBorrows > 0 ? Math.round((count / totalBorrows) * 100) : 0 
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

// 3. Computed Analytics: Top 5 Categories
const topCategories = computed(() => {
  // Bikin kamus (map) untuk mencocokkan ID buku ke Kategori
  const bookCategories = {}
  booksData.value.forEach(b => {
    bookCategories[b.id] = b.category || 'Lainnya'
  })
  
  const counts = {}
  let totalBorrows = 0
  requestsData.value.forEach(req => {
    // Cari kategori buku berdasarkan ID-nya, kalau gak nemu anggap 'Lainnya'
    const cat = bookCategories[req.bookId] || 'Lainnya'
    counts[cat] = (counts[cat] || 0) + 1
    totalBorrows++
  })
  
  return Object.entries(counts)
    .map(([title, count]) => ({ 
      title, 
      count, 
      percent: totalBorrows > 0 ? Math.round((count / totalBorrows) * 100) : 0 
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

// 4. Chart Data Bindings
const bookChartData = computed(() => ({
  labels: topBooks.value.map(b => b.title),
  datasets: [{
    backgroundColor: bookColors,
    data: topBooks.value.map(b => b.count),
    borderWidth: 0,
    hoverOffset: 4
  }]
}))

const catChartData = computed(() => ({
  labels: topCategories.value.map(c => c.title),
  datasets: [{
    backgroundColor: catColors,
    data: topCategories.value.map(c => c.count),
    borderWidth: 0,
    hoverOffset: 4
  }]
}))

// Konfigurasi umum Chart.js
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%', // Untuk pie chart, opsi ini akan diabaikan sebagian karena bentuk utuh
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: function(context) {
          return ` ${context.label}: ${context.raw} kali`
        }
      }
    }
  }
}

let unsubs = []

onMounted(() => {
  // Ambil Data Buku (Untuk metrik dan mapping kategori)
  unsubs.push(onSnapshot(collection(db, 'books'), (snap) => {
    booksData.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }))

  // Ambil Data Permintaan (Untuk seluruh kalkulasi analitik)
  unsubs.push(onSnapshot(collection(db, 'requests'), (snap) => {
    requestsData.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }))

  // Ambil Data Mahasiswa Terdaftar
  const qUsers = query(collection(db, 'users'), where('role', '==', 'student'))
  unsubs.push(onSnapshot(qUsers, (snap) => {
    activeStudents.value = snap.size
  }))
})

onUnmounted(() => {
  unsubs.forEach(unsub => unsub())
})
</script>
