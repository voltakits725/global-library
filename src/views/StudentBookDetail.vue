<template>
  <div class="pt-6 px-4 md:px-8 pb-24 md:pb-8 w-full max-w-5xl mx-auto">
    <!-- Back Button -->
    <button @click="router.back()" class="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium mb-6">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      Kembali ke Katalog
    </button>

    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
    
    <div v-else-if="!book" class="text-center py-20">
      <h2 class="text-2xl font-bold text-slate-800 mb-2">Buku Tidak Ditemukan</h2>
      <p class="text-slate-500">Buku yang Anda cari mungkin telah dihapus.</p>
    </div>

    <div v-else class="flex flex-col md:flex-row gap-8 lg:gap-12">
      <!-- 1. Cover (Kiri) -->
      <div class="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
        <div class="w-48 md:w-full mx-auto aspect-[2/3] bg-slate-100 rounded-2xl overflow-hidden shadow-md border border-slate-200 sticky top-24">
          <img v-if="book.coverUrl" :src="book.coverUrl" class="w-full h-full object-cover" :alt="book.title" />
          <div v-else class="w-full h-full flex items-center justify-center text-slate-400">No Cover</div>
        </div>
      </div>

      <!-- 2. Details & Actions (Kanan) -->
      <div class="w-full md:w-2/3 lg:w-3/4 flex-grow">
        <div class="mb-2">
          <span class="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">{{ book.category }}</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-slate-800 leading-tight mb-2">{{ book.title }}</h1>
        <p class="text-lg text-slate-500 mb-6">Oleh <span class="font-semibold text-slate-700">{{ book.author }}</span></p>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 border-b border-slate-200 pb-8">
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tahun Terbit</p>
            <p class="font-medium text-slate-800">{{ book.publishYear || '-' }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Penerbit</p>
            <p class="font-medium text-slate-800">{{ book.publisher || '-' }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Halaman</p>
            <p class="font-medium text-slate-800">{{ book.pages || '-' }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ISBN</p>
            <p class="font-medium text-slate-800">{{ book.isbn || '-' }}</p>
          </div>
        </div>

        <div class="mb-10">
          <h3 class="text-xl font-bold text-slate-800 mb-4">Sinopsis</h3>
          <p class="text-slate-600 leading-relaxed whitespace-pre-line">{{ book.synopsis || 'Sinopsis belum tersedia untuk buku ini.' }}</p>
        </div>

        <!-- Borrow Actions -->
        <div class="mb-6 max-w-lg bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-sm font-semibold text-slate-500">Stok Tersedia:</span>
            <span class="text-lg font-bold text-slate-800">{{ book.stock }}</span>
          </div>
          
          <div v-if="book.stock > 0">
            <div class="mb-4">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Rencana Pengembalian</label>
              <div class="flex flex-col sm:flex-row gap-3">
                <input v-model="returnDate" type="date" :min="today" class="flex-1 px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all shadow-sm" />
                <input v-model="returnTime" type="time" class="w-full sm:w-32 px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all shadow-sm" />
              </div>
            </div>
          </div>
          
          <div class="flex gap-3 mt-4">
            <!-- Tombol Pinjam / Stok Habis -->
            <button v-if="book.stock > 0" @click="submitBorrowRequest" :disabled="isSubmitting || !returnDate || !returnTime" class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3.5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
              <svg v-if="isSubmitting" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSubmitting ? 'Memproses...' : 'Pinjam Buku' }}
            </button>
            <button v-else disabled class="flex-1 bg-slate-200 text-slate-400 font-bold py-3.5 rounded-xl cursor-not-allowed">
              Stok Habis
            </button>
            
            <!-- Tombol Favorit -->
            <button v-if="book" @click="toggleFavorite" :class="['flex-1 border font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2', favoriteBooks.includes(book.id) ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50']">
              <svg v-if="favoriteBooks.includes(book.id)" class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              <svg v-else class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              <span>{{ favoriteBooks.includes(book.id) ? 'Difavoritkan' : 'Favorit' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db, auth } from '../firebase'
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const route = useRoute()
const router = useRouter()
const book = ref(null)
const isLoading = ref(true)
const isSubmitting = ref(false)

const today = ref(new Date().toISOString().split('T')[0])
const returnDate = ref(today.value)
const returnTime = ref('15:00')

const currentUser = ref(null)
const userProfile = ref(null)
const favoriteBooks = ref([])

onMounted(() => {
  // Ambil data buku
  const fetchBook = async () => {
    try {
      const docRef = doc(db, 'books', route.params.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        book.value = { id: docSnap.id, ...docSnap.data() }
      }
    } catch (error) {
      console.error("Gagal mengambil detail buku:", error)
    } finally {
      isLoading.value = false
    }
  }

  // Cek Auth dan ambil Profil User
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser.value = user
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        userProfile.value = userDoc.data()
        if (userProfile.value.favoriteBooks) {
          favoriteBooks.value = userProfile.value.favoriteBooks
        }
      } else {
        router.push('/student/setup-profile')
      }
    } else {
      router.push('/')
    }
  })

  fetchBook()
})

const submitBorrowRequest = async () => {
  if (!currentUser.value || !userProfile.value || !book.value) return
  
  isSubmitting.value = true
  try {
    const requestData = {
      userId: currentUser.value.uid,
      userName: userProfile.value.namaLengkap,
      userNim: userProfile.value.nim,
      userProdi: userProfile.value.prodi || '-',
      userKonsentrasi: userProfile.value.konsentrasi || '-',
      userKelas: userProfile.value.kelas || '-',
      bookId: book.value.id,
      bookTitle: book.value.title,
      bookCover: book.value.coverUrl || '',
      bookAuthor: book.value.author,
      status: 'pending',
      requestDate: serverTimestamp(),
      expectedReturnDate: returnDate.value,
      expectedReturnTime: returnTime.value
    }
    
    // Simpan ke tabel requests
    await addDoc(collection(db, 'requests'), requestData)
    
    alert('Permintaan peminjaman berhasil diajukan! Menunggu persetujuan Admin.')
    router.push('/student/history')
    
  } catch (error) {
    console.error("Gagal mengajukan pinjaman:", error)
    alert('Terjadi kesalahan: ' + error.message)
  } finally {
    isSubmitting.value = false
  }
}

const toggleFavorite = async () => {
  if (!currentUser.value || !book.value) return

  const userRef = doc(db, 'users', currentUser.value.uid)
  const isFavorited = favoriteBooks.value.includes(book.value.id)

  try {
    if (isFavorited) {
      favoriteBooks.value = favoriteBooks.value.filter(id => id !== book.value.id)
      await updateDoc(userRef, { favoriteBooks: arrayRemove(book.value.id) })
    } else {
      favoriteBooks.value.push(book.value.id)
      await updateDoc(userRef, { favoriteBooks: arrayUnion(book.value.id) })
    }
  } catch (error) {
    console.error("Gagal update favorit:", error)
    if (isFavorited) favoriteBooks.value.push(book.value.id)
    else favoriteBooks.value = favoriteBooks.value.filter(id => id !== book.value.id)
  }
}
</script>
