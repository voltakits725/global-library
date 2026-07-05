<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
    <div class="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-3xl mb-6 shadow-sm">
      <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
    </div>
    <h1 class="text-3xl font-bold text-slate-800 mb-3">Portal Mahasiswa</h1>
    <p class="text-slate-500 mb-8 max-w-md mx-auto">Selamat datang di Perpustakaan Digital. Silakan masuk menggunakan akun Google Universitas untuk mulai meminjam buku.</p>
    
    <div v-if="errorMessage" class="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl max-w-sm w-full mx-auto text-left flex items-start gap-2">
      <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span>{{ errorMessage }}</span>
    </div>

    <div class="flex flex-col gap-4 max-w-xs w-full mx-auto">
      <button @click="loginWithGoogle" :disabled="isLoading" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-3 disabled:opacity-70">
        <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        {{ isLoading ? 'Memproses...' : 'Login dengan Google' }}
      </button>
      
      <div class="relative flex py-4 items-center">
        <div class="flex-grow border-t border-slate-200"></div>
        <span class="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-wider font-semibold">Staf Perpustakaan</span>
        <div class="flex-grow border-t border-slate-200"></div>
      </div>
      
      <router-link to="/admin/login" class="bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold py-3.5 px-4 rounded-xl border border-slate-200 transition-colors">
        Masuk sebagai Admin
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('')

const loginWithGoogle = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    
    // Mengecek apakah profil pengguna sudah ada di Firestore
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)
    
    if (userDoc.exists()) {
      // Profil sudah ada, arahkan ke Katalog
      router.push('/student')
    } else {
      // Profil belum ada, arahkan ke halaman Setup Profile
      router.push('/student/setup-profile')
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Gagal login dengan Google: ' + error.message
  } finally {
    isLoading.value = false
  }
}
</script>
