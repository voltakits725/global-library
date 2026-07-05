<template>
  <div class="pt-6 px-4 md:px-8 pb-24 md:pb-8 w-full max-w-5xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-slate-800">Riwayat Peminjaman</h1>
      <button v-if="clearableRequests.length > 0" @click="clearHistory" class="text-sm bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-semibold py-2 px-4 rounded-xl transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        <span class="hidden sm:inline">Bersihkan Riwayat</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="requests.length === 0" class="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 text-center max-w-2xl mx-auto mt-10">
      <svg class="w-20 h-20 mx-auto text-blue-200 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <h2 class="text-xl font-bold text-slate-800 mb-2">Belum ada riwayat</h2>
      <p class="text-slate-500 mb-8">Anda belum meminjam buku apapun dari perpustakaan digital ini.</p>
      
      <router-link to="/student" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-sm transition-colors inline-block">
        Mulai Pinjam Buku
      </router-link>
    </div>

    <!-- History List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="req in requests" :key="req.id" class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center">
        <!-- Book Cover -->
        <div class="w-16 h-24 shrink-0 bg-slate-100 rounded-lg overflow-hidden shadow-sm border border-slate-200">
          <img v-if="req.bookCover" :src="req.bookCover" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No Cover</div>
        </div>

        <!-- Details -->
        <div class="flex-grow">
          <div class="flex justify-between items-start mb-1">
            <h3 class="font-bold text-slate-800 text-sm leading-tight line-clamp-2 pr-2">{{ req.bookTitle }}</h3>
            <span :class="statusConfig[req.status].bg + ' ' + statusConfig[req.status].text" class="text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shrink-0">
              {{ statusConfig[req.status].label }}
            </span>
          </div>
          <p class="text-xs text-slate-500 mb-3">{{ req.bookAuthor }}</p>
          
          <div class="flex items-center gap-4 text-xs">
            <div class="flex flex-col">
              <span class="text-slate-400 font-semibold mb-0.5">Tanggal Pengajuan</span>
              <span class="text-slate-700 font-medium">{{ formatDate(req.requestDate) }}</span>
            </div>
            <div class="flex flex-col border-l border-slate-200 pl-4">
              <span class="text-slate-400 font-semibold mb-0.5">Rencana Kembali</span>
              <span class="text-slate-700 font-medium">{{ req.expectedReturnDate }} • {{ req.expectedReturnTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { db, auth } from '../firebase'
import { collection, query, where, onSnapshot, writeBatch, doc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const isLoading = ref(true)
const requests = ref([])
let unsubscribe = null

const statusConfig = {
  'pending': { label: 'Menunggu Persetujuan', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  'active': { label: 'Disetujui', bg: 'bg-green-50', text: 'text-green-700' },
  'rejected': { label: 'Ditolak', bg: 'bg-red-50', text: 'text-red-700' },
  'returned': { label: 'Dikembalikan', bg: 'bg-slate-100', text: 'text-slate-600' }
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const q = query(collection(db, 'requests'), where('userId', '==', user.uid))
      unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedRequests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).filter(req => !req.isDeletedByStudent)
        
        requests.value = fetchedRequests.sort((a, b) => b.requestDate?.seconds - a.requestDate?.seconds)
        isLoading.value = false
      }, (error) => {
        console.error("Gagal mengambil riwayat:", error)
        isLoading.value = false
      })
    } else {
      isLoading.value = false
    }
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp.seconds * 1000)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const clearableRequests = computed(() => {
  return requests.value.filter(req => req.status === 'returned' || req.status === 'rejected')
})

const clearHistory = async () => {
  if (clearableRequests.value.length === 0) return
  if (!confirm('Yakin ingin membersihkan riwayat yang sudah selesai? (Hanya riwayat yang dikembalikan/ditolak yang akan dihapus)')) return
  
  try {
    const batch = writeBatch(db)
    clearableRequests.value.forEach(req => {
      const ref = doc(db, 'requests', req.id)
      batch.update(ref, { isDeletedByStudent: true })
    })
    await batch.commit()
  } catch (error) {
    console.error('Gagal membersihkan riwayat:', error)
    alert('Terjadi kesalahan saat membersihkan riwayat.')
  }
}
</script>
