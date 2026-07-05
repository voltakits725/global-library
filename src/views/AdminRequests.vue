<template>
  <div class="pt-6 px-4 md:px-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-slate-800">{{ $t('requests.title') }}</h1>
      <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">AU</div>
    </div>
    
    <!-- Filter Tabs -->
    <div class="flex bg-slate-100 p-1 rounded-xl mb-6 max-w-2xl overflow-x-auto">
      <button @click="activeTab = 'pending'" :class="activeTab === 'pending' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'" class="flex-1 whitespace-nowrap font-semibold text-sm py-2 px-4 rounded-lg transition-colors">{{ $t('requests.tab_pending') }}</button>
      <button @click="activeTab = 'active'" :class="activeTab === 'active' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'" class="flex-1 whitespace-nowrap font-semibold text-sm py-2 px-4 rounded-lg transition-colors">{{ $t('requests.tab_active') }}</button>
      <button @click="activeTab = 'completed'" :class="activeTab === 'completed' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'" class="flex-1 whitespace-nowrap font-semibold text-sm py-2 px-4 rounded-lg transition-colors">{{ $t('requests.tab_completed') }}</button>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredRequests.length === 0" class="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <svg class="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
      <h2 class="text-xl font-bold text-slate-700 mb-2">{{ $t('requests.no_data_title') }}</h2>
      <p class="text-slate-500 text-sm">{{ $t('requests.no_data_cat') }}</p>
    </div>

    <!-- Requests Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div v-for="req in filteredRequests" :key="req.id" class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between" :class="{'opacity-75': activeTab === 'completed'}">
        <div>
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center font-bold text-blue-600">
                {{ req.userName ? req.userName.charAt(0).toUpperCase() : 'U' }}
              </div>
              <div>
                <h3 class="font-bold text-slate-800 text-sm">{{ req.userName }}</h3>
                <p class="text-xs text-slate-500 mt-0.5">NIM: {{ req.userNim }}</p>
                <p class="text-[10px] text-slate-400 mt-1 font-medium bg-slate-50 inline-block px-1.5 py-0.5 rounded border border-slate-100">
                  {{ req.userProdi || '-' }} • {{ req.userKonsentrasi || '-' }} • {{ req.userKelas || '-' }}
                </p>
              </div>
            </div>
            <span class="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">{{ formatDate(req.requestDate) }}</span>
          </div>
          
          <div class="bg-slate-50 rounded-xl p-3 flex gap-3 mb-4 border border-slate-100">
            <div class="w-12 h-16 bg-slate-200 rounded shadow-sm flex-shrink-0 flex items-center justify-center text-[10px] text-slate-500 text-center overflow-hidden border border-slate-300">
              <img v-if="req.bookCover" :src="req.bookCover" class="w-full h-full object-cover" />
              <span v-else>No Img</span>
            </div>
            <div>
              <h4 class="font-bold text-slate-800 text-sm leading-tight mb-1">{{ req.bookTitle }}</h4>
              <p class="text-xs text-slate-500">Oleh {{ req.bookAuthor }}</p>
              <p class="text-xs text-orange-600 font-semibold mt-1">Kembali: {{ req.expectedReturnDate }} {{ req.expectedReturnTime }}</p>
            </div>
          </div>
        </div>
        
        <!-- Actions & Status Badges -->
        <div v-if="req.status === 'pending'" class="flex gap-3 mt-auto">
          <button @click="handleReject(req.id)" class="flex-1 bg-white border border-red-500 text-red-500 hover:bg-red-50 font-semibold py-2.5 rounded-xl text-sm transition-colors">{{ $t('requests.reject') }}</button>
          <button @click="handleApprove(req)" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm shadow-sm transition-colors">{{ $t('requests.approve') }}</button>
        </div>
        <div v-else-if="req.status === 'active'" class="flex gap-3 mt-auto">
           <button @click="handleReturn(req)" class="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold py-2.5 rounded-xl text-sm transition-colors">{{ $t('requests.action_return') }}</button>
        </div>
        <div v-else-if="req.status === 'returned'" class="flex gap-3 mt-auto">
           <div class="w-full bg-slate-100 text-slate-500 font-bold py-2.5 rounded-xl text-sm text-center border border-slate-200">{{ $t('requests.status_returned') }}</div>
        </div>
        <div v-else-if="req.status === 'rejected'" class="flex gap-3 mt-auto">
           <div class="w-full bg-red-50 text-red-500 font-bold py-2.5 rounded-xl text-sm text-center border border-red-100">{{ $t('requests.status_rejected') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { db } from '../firebase'
import { collection, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore'

const requests = ref([])
const isLoading = ref(true)
const activeTab = ref('pending') // 'pending', 'active', atau 'completed'

let unsubscribe = null

onMounted(() => {
  isLoading.value = true
  unsubscribe = onSnapshot(collection(db, 'requests'), (snapshot) => {
    const allReqs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    // Urutkan terbaru
    requests.value = allReqs.sort((a, b) => b.requestDate?.seconds - a.requestDate?.seconds)
    isLoading.value = false
  }, (error) => {
    console.error("Gagal memuat permintaan:", error)
    isLoading.value = false
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const filteredRequests = computed(() => {
  if (activeTab.value === 'completed') {
    return requests.value.filter(req => req.status === 'returned' || req.status === 'rejected')
  }
  return requests.value.filter(req => req.status === activeTab.value)
})

const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp.seconds * 1000)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

const handleApprove = async (req) => {
  if (confirm(`Yakin menyetujui peminjaman buku "${req.bookTitle}"? Stok buku akan berkurang 1.`)) {
    try {
      // 1. Ubah status request
      const reqRef = doc(db, 'requests', req.id)
      await updateDoc(reqRef, { status: 'active' })
      
      // 2. Kurangi stok buku
      const bookRef = doc(db, 'books', req.bookId)
      await updateDoc(bookRef, {
        stock: increment(-1)
      })
      
      // 3. Refresh UI
      req.status = 'active' // update local state
      alert('Berhasil disetujui!')
    } catch (error) {
      console.error("Gagal approve:", error)
      alert("Terjadi kesalahan: " + error.message)
    }
  }
}

const handleReject = async (reqId) => {
  if (confirm('Yakin menolak peminjaman ini?')) {
    try {
      const reqRef = doc(db, 'requests', reqId)
      await updateDoc(reqRef, { status: 'rejected' })
      // Update local state
      const index = requests.value.findIndex(r => r.id === reqId)
      if (index !== -1) requests.value[index].status = 'rejected'
    } catch (error) {
      console.error("Gagal reject:", error)
    }
  }
}

const handleReturn = async (req) => {
  if (confirm(`Buku "${req.bookTitle}" sudah dikembalikan? Stok buku akan bertambah 1.`)) {
    try {
      // 1. Ubah status request
      const reqRef = doc(db, 'requests', req.id)
      await updateDoc(reqRef, { status: 'returned' })
      
      // 2. Tambah stok buku
      const bookRef = doc(db, 'books', req.bookId)
      await updateDoc(bookRef, {
        stock: increment(1)
      })
      
      req.status = 'returned'
      alert('Buku berhasil dikembalikan!')
    } catch (error) {
       console.error("Gagal return:", error)
    }
  }
}
</script>
