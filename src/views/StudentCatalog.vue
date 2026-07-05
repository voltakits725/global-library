<template>
  <div class="pt-6 px-4 md:px-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto">
    
    <!-- Banner & Search -->
    <div class="bg-blue-600 rounded-3xl p-6 md:p-10 text-white mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h2 class="text-3xl font-bold mb-2">Mau baca buku apa hari ini?</h2>
        <p class="text-blue-100 opacity-90 max-w-md">Jelajahi koleksi ribuan buku perpustakaan digital kami, mulai dari fiksi sains hingga buku panduan IT.</p>
      </div>
      <div class="w-full md:w-80 shrink-0 relative text-slate-800">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input v-model="searchQuery" type="text" class="block w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors" placeholder="Cari judul buku atau penulis...">
      </div>
    </div>

    <!-- Category Filters -->
    <div class="flex gap-2 overflow-x-auto pb-4 mb-4 hide-scrollbar">
      <button v-for="cat in ['Semua', 'Fiction', 'Non-Fiction', 'IT', 'Science', 'Design']" :key="cat"
        @click="activeCategory = cat"
        :class="activeCategory === cat ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'"
        class="px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors shadow-sm">
        {{ cat }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <!-- Book Grid -->
    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      <div v-for="book in filteredBooks" :key="book.id" @click="goToDetail(book.id)" class="cursor-pointer bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-slate-100 flex flex-col h-full group hover:shadow-md transition-shadow relative">
        <div class="w-full aspect-[2/3] bg-slate-100 rounded-xl mb-3 overflow-hidden shadow-sm relative">
          <img v-if="book.coverUrl" :src="book.coverUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Cover</div>
          
          <!-- Heart Button -->
          <button @click="(e) => toggleFavorite(e, book.id)" class="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white hover:scale-110 transition-all z-10 text-red-500">
            <svg v-if="favoriteBooks.includes(book.id)" class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </button>
          
          <div v-if="book.stock === 0" class="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span class="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">Stok Habis</span>
          </div>
        </div>
        <div class="flex-grow flex flex-col">
          <div class="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{{ book.category }}</div>
          <h3 class="font-bold text-slate-800 text-sm leading-tight mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">{{ book.title }}</h3>
          <p class="text-xs text-slate-500 mb-3 line-clamp-1">{{ book.author }}</p>
          
          <div class="mt-auto pt-3 flex items-center justify-between border-t border-slate-100">
            <span class="text-xs font-medium text-slate-500">{{ book.stock }} Tersedia</span>
            <div :class="book.stock > 0 ? 'bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white' : 'bg-slate-100 text-slate-400'" class="w-8 h-8 rounded-full flex items-center justify-center transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="!isLoading && filteredBooks.length === 0" class="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm mt-4">
      <svg class="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
      <h3 class="text-lg font-bold text-slate-700 mb-1">Buku tidak ditemukan</h3>
      <p class="text-slate-500 text-sm max-w-sm mx-auto">Kami tidak dapat menemukan buku dengan kata kunci atau kategori tersebut.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db, auth } from '../firebase'
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const router = useRouter()
const books = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const activeCategory = ref('Semua')
const favoriteBooks = ref([])
const currentUser = ref(null)

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser.value = user
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists() && userDoc.data().favoriteBooks) {
        favoriteBooks.value = userDoc.data().favoriteBooks
      }
    }
    
    try {
      const querySnapshot = await getDocs(collection(db, 'books'))
      books.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error("Error fetching books:", error)
    } finally {
      isLoading.value = false
    }
  })
})

const filteredBooks = computed(() => {
  let result = books.value

  // Filter kategori
  if (activeCategory.value !== 'Semua') {
    result = result.filter(b => b.category === activeCategory.value)
  }

  // Filter pencarian
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(b => 
      b.title.toLowerCase().includes(query) || 
      b.author.toLowerCase().includes(query)
    )
  }

  return result
})

const toggleFavorite = async (event, bookId) => {
  event.stopPropagation()
  if (!currentUser.value) return

  const userRef = doc(db, 'users', currentUser.value.uid)
  const isFavorited = favoriteBooks.value.includes(bookId)

  try {
    if (isFavorited) {
      favoriteBooks.value = favoriteBooks.value.filter(id => id !== bookId)
      await updateDoc(userRef, { favoriteBooks: arrayRemove(bookId) })
    } else {
      favoriteBooks.value.push(bookId)
      await updateDoc(userRef, { favoriteBooks: arrayUnion(bookId) })
    }
  } catch (error) {
    console.error("Gagal update favorit:", error)
    // Rollback state if failed
    if (isFavorited) {
      favoriteBooks.value.push(bookId)
    } else {
      favoriteBooks.value = favoriteBooks.value.filter(id => id !== bookId)
    }
  }
}

const goToDetail = (bookId) => {
  router.push(`/student/book/${bookId}`)
}
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
