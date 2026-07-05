<template>
  <div class="pt-6 px-4 md:px-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto">
    <div class="flex items-center gap-4 mb-8">
      <h1 class="text-2xl font-bold text-slate-800">Profil Saya</h1>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="userProfile">
      <!-- Profile Header (Banner style) -->
      <div class="bg-blue-600 rounded-3xl p-6 md:p-10 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-white mb-8 relative overflow-hidden">
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="relative group cursor-pointer z-10 w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg border-4 border-white/20 overflow-hidden">
          <img v-if="userProfile.photoUrl" :src="userProfile.photoUrl" class="w-full h-full object-cover" alt="Profile" />
          <div v-else class="w-full h-full bg-white text-blue-600 flex items-center justify-center font-bold text-4xl">{{ userInitials }}</div>
          
          <!-- Overlay Edit Foto -->
          <label class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <svg v-if="!isUploadingPhoto" class="w-6 h-6 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span v-if="!isUploadingPhoto" class="text-white text-[10px] font-bold">Edit Foto</span>
            
            <svg v-if="isUploadingPhoto" class="animate-spin w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            
            <input type="file" class="hidden" accept="image/*" @change="handlePhotoUpload" :disabled="isUploadingPhoto" />
          </label>
        </div>
        
        <div class="flex-grow pt-2 text-center md:text-left z-10">
          <h2 class="text-2xl md:text-3xl font-bold mb-1">{{ userProfile.namaLengkap }}</h2>
          <p class="text-blue-100 font-medium mb-4">{{ userProfile.email }}</p>
          <div class="flex flex-wrap justify-center md:justify-start gap-3">
            <span class="inline-block bg-white/20 backdrop-blur-sm text-white font-bold px-3 py-1 rounded-md text-xs uppercase tracking-wider">
              Mahasiswa
            </span>
            <button @click="handleLogout" class="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-1 rounded-md text-xs uppercase tracking-wider transition-colors shadow-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Keluar
            </button>
          </div>
        </div>
      </div>

      <!-- Info & Wishlist Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Academic Info Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-6">Info Akademik</h3>
            <div class="space-y-5">
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">NIM</p>
                <p class="font-bold text-slate-700">{{ userProfile.nim }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Program Studi</p>
                <p class="font-bold text-slate-700">{{ userProfile.prodi }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Konsentrasi</p>
                <p class="font-bold text-slate-700">{{ userProfile.konsentrasi || '-' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kelas</p>
                <p class="font-bold text-slate-700">{{ userProfile.kelas }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Wishlist -->
        <div class="lg:col-span-3">
          <h3 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg class="w-6 h-6 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            Koleksi Favorit
          </h3>
          
          <div v-if="isBooksLoading" class="flex justify-center py-10">
             <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          
          <div v-else-if="favoriteBooksData.length === 0" class="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
             <svg class="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
             <h4 class="text-lg font-bold text-slate-700 mb-2">Belum ada buku favorit</h4>
             <p class="text-slate-500 text-sm">Tambahkan buku ke koleksi favoritmu dari Katalog Buku.</p>
          </div>
          
          <div v-else class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            <div v-for="book in favoriteBooksData" :key="book.id" @click="goToDetail(book.id)" class="cursor-pointer bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-slate-100 flex flex-col h-full group hover:shadow-md transition-shadow relative">
              <div class="w-full aspect-[2/3] bg-slate-100 rounded-xl mb-3 overflow-hidden shadow-sm relative">
                <img v-if="book.coverUrl" :src="book.coverUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Cover</div>
                
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore'
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth'

const router = useRouter()
const isLoading = ref(true)
const isBooksLoading = ref(false)
const userProfile = ref(null)
const userInitials = ref('')
const favoriteBooksData = ref([])
const isUploadingPhoto = ref(false)

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userDocRef)
        
        if (userDoc.exists()) {
          userProfile.value = userDoc.data()
          if (userProfile.value.namaLengkap) {
            userInitials.value = userProfile.value.namaLengkap.charAt(0).toUpperCase()
          }
          
          if (userProfile.value.favoriteBooks && userProfile.value.favoriteBooks.length > 0) {
            await fetchFavoriteBooks(userProfile.value.favoriteBooks)
          }
        }
      } catch (error) {
        console.error("Gagal mengambil profil:", error)
      } finally {
        isLoading.value = false
      }
    } else {
      router.push('/')
    }
  })
})

const fetchFavoriteBooks = async (bookIds) => {
  isBooksLoading.value = true
  try {
    const querySnapshot = await getDocs(collection(db, 'books'))
    const allBooks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    favoriteBooksData.value = allBooks.filter(b => bookIds.includes(b.id))
  } catch (error) {
    console.error("Gagal fetch buku favorit:", error)
  } finally {
    isBooksLoading.value = false
  }
}

const goToDetail = (bookId) => {
  router.push(`/student/book/${bookId}`)
}

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/')
  } catch (error) {
    console.error("Gagal logout:", error)
  }
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (!file || !auth.currentUser) return
  
  isUploadingPhoto.value = true
  
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (e) => {
    const img = new Image()
    img.src = e.target.result
    img.onload = async () => {
      // Compress image menggunakan canvas (maks 256x256)
      const canvas = document.createElement('canvas')
      const MAX_WIDTH = 256
      const MAX_HEIGHT = 256
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width
          width = MAX_WIDTH
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height
          height = MAX_HEIGHT
        }
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8) // Kualitas 80%
      
      try {
        // Simpan base64 langsung ke Firestore
        const userDocRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userDocRef, { photoUrl: compressedBase64 })
        
        // Update UI lokal
        if (userProfile.value) {
          userProfile.value.photoUrl = compressedBase64
        }
      } catch (error) {
        console.error("Gagal mengupload foto profil:", error)
        alert("Terjadi kesalahan saat menyimpan foto profil.")
      } finally {
        isUploadingPhoto.value = false
        event.target.value = ''
      }
    }
  }
}
</script>
