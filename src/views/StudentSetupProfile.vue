<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden p-8 sm:p-10">
      
      <!-- Header -->
      <div class="flex flex-col items-center text-center mb-8">
        <div class="w-14 h-14 bg-indigo-50 text-slate-800 rounded-full flex items-center justify-center mb-5">
          <!-- User circle icon -->
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 mb-2">Complete Your Profile</h1>
        <p class="text-slate-500 text-sm">Please provide your details to finalize your academic account setup.</p>
      </div>
      
      <!-- Form -->
      <form @submit.prevent="saveProfile" class="space-y-6">
        
        <!-- NIM -->
        <div>
          <label class="block text-[13px] font-bold text-slate-800 mb-2">Student ID (NIM)</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <!-- ID Badge Icon -->
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
            </div>
            <input v-model="form.nim" required type="text" placeholder="e.g. 12345678" class="w-full pl-11 pr-4 py-3 border-none rounded-xl bg-slate-100/80 focus:bg-slate-200/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-slate-700 placeholder-slate-500 text-sm" />
          </div>
        </div>
        
        <!-- Full Name -->
        <div>
          <label class="block text-[13px] font-bold text-slate-800 mb-2">Full Name</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <!-- User Person Icon -->
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <input v-model="form.namaLengkap" required type="text" placeholder="e.g. John Doe" class="w-full pl-11 pr-4 py-3 border-none rounded-xl bg-slate-100/80 focus:bg-slate-200/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-slate-700 placeholder-slate-500 text-sm" />
          </div>
        </div>
        
        <!-- Study Program -->
        <div>
          <label class="block text-[13px] font-bold text-slate-800 mb-2">Study Program</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <!-- Academic Cap Icon -->
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
            </div>
            <select v-model="form.prodi" required class="w-full pl-11 pr-10 py-3 border-none rounded-xl bg-slate-100/80 focus:bg-slate-200/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-slate-700 text-sm appearance-none cursor-pointer">
              <option value="" disabled>Select your program</option>
              <option value="Teknik Informatika">Teknik Informatika</option>
              <option value="Sistem Informasi">Sistem Informasi</option>
              <option value="Ilmu Komputer">Ilmu Komputer</option>
              <option value="Desain Komunikasi Visual">DKV</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <!-- Concentration -->
        <div>
          <label class="block text-[13px] font-bold text-slate-800 mb-2">Concentration</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <!-- Bookmark Icon -->
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
            </div>
            <input v-model="form.konsentrasi" type="text" placeholder="e.g. Software Engineering" class="w-full pl-11 pr-4 py-3 border-none rounded-xl bg-slate-100/80 focus:bg-slate-200/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-slate-700 placeholder-slate-500 text-sm" />
          </div>
        </div>
        
        <!-- Class -->
        <div>
          <label class="block text-[13px] font-bold text-slate-800 mb-2">Class</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <!-- Calendar Icon -->
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <input v-model="form.kelas" required type="text" placeholder="e.g. Class of 2026" class="w-full pl-11 pr-4 py-3 border-none rounded-xl bg-slate-100/80 focus:bg-slate-200/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-slate-700 placeholder-slate-500 text-sm" />
          </div>
        </div>
        
        <!-- Submit Button -->
        <div class="pt-2">
          <button type="submit" :disabled="isSaving" class="w-full bg-[#0d6efd] hover:bg-blue-700 text-white font-bold py-3.5 rounded-full shadow-sm disabled:opacity-70 flex justify-center items-center gap-2 transition-colors text-[15px]">
            <svg v-if="isSaving" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isSaving ? 'Saving...' : 'Save Profile & Continue' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const router = useRouter()
const isSaving = ref(false)
const currentUser = ref(null)

const form = ref({
  nim: '',
  namaLengkap: '',
  prodi: '',
  konsentrasi: '',
  kelas: ''
})

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser.value = user
      form.value.namaLengkap = user.displayName || ''
    } else {
      // Tendang jika belum login Google
      router.push('/')
    }
  })
})

const saveProfile = async () => {
  if (!currentUser.value) return
  isSaving.value = true
  
  try {
    const userData = {
      nim: form.value.nim,
      namaLengkap: form.value.namaLengkap,
      prodi: form.value.prodi,
      konsentrasi: form.value.konsentrasi,
      kelas: form.value.kelas,
      email: currentUser.value.email,
      photoUrl: currentUser.value.photoURL,
      role: 'student',
      createdAt: new Date().toISOString()
    }
    
    // Simpan ke Firestore koleksi 'users'
    await setDoc(doc(db, 'users', currentUser.value.uid), userData)
    
    // Jika sukses, lanjut ke Katalog
    router.push('/student')
  } catch (error) {
    console.error('Gagal menyimpan profil:', error)
    alert('Terjadi kesalahan saat menyimpan profil: ' + error.message)
  } finally {
    isSaving.value = false
  }
}
</script>
