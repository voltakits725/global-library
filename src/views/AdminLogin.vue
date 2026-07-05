<template>
  <div class="flex items-center justify-center min-h-screen bg-slate-50 p-6">
    <div class="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 text-center border border-slate-100">
      <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mx-auto flex items-center justify-center font-bold text-2xl mb-6 shadow-sm">L</div>
      <h1 class="text-2xl font-bold text-slate-800 mb-2">{{ $t('login.title') }}</h1>
      <p class="text-slate-500 text-sm mb-8">{{ $t('login.subtitle') }}</p>
      
      <!-- Error Message Box -->
      <div v-if="errorMessage" class="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-left flex items-start gap-2">
        <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>{{ errorMessage }}</span>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="text-left">
          <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('login.email') }}</label>
          <input v-model="email" type="email" required class="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors" />
        </div>
        <div class="text-left">
          <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('login.password') }}</label>
          <input v-model="password" type="password" required class="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors" />
        </div>
        
        <div class="flex items-center justify-between text-sm py-2">
          <label class="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input type="checkbox" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
            {{ $t('login.remember') }}
          </label>
          <a href="#" class="text-blue-600 font-medium hover:underline">{{ $t('login.forgot') }}</a>
        </div>
        
        <button type="submit" :disabled="isLoading" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-sm disabled:opacity-70 flex justify-center items-center gap-2 transition-colors mt-2">
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ isLoading ? $t('login.logging_in') : $t('login.login_btn') }}
        </button>
      </form>
      
      <div class="mt-8 text-xs text-slate-400">
        <p>{{ $t('login.footer1') }}</p>
        <p>{{ $t('login.footer2') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { useI18n } from 'vue-i18n'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const router = useRouter()
const { t } = useI18n()

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    await signInWithEmailAndPassword(auth, email.value, password.value)
    // Successful login, navigate to dashboard
    router.push('/admin/dashboard')
  } catch (error) {
    // Handle error messages
    console.error(error)
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      errorMessage.value = t('login.error')
    } else {
      errorMessage.value = 'Login failed: ' + error.message
    }
  } finally {
    isLoading.value = false
  }
}
</script>
