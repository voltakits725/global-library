<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 md:flex">
    
    <!-- Notifications Wrapper -->
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <transition-group name="notif">
        <div v-for="notif in notifications" :key="notif.id" class="bg-white border-l-4 border-blue-500 rounded-xl shadow-xl p-4 flex items-start gap-3 pointer-events-auto">
          <div class="bg-blue-100 text-blue-600 rounded-full p-2 shrink-0 mt-0.5">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </div>
          <div class="flex-1">
            <h4 class="text-sm font-bold text-slate-800">Permintaan Baru</h4>
            <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ notif.message }}</p>
          </div>
          <button @click="removeNotif(notif.id)" class="text-slate-400 hover:text-slate-600 p-1 bg-slate-50 rounded-md">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </transition-group>
    </div>

    <!-- Sidebar (Hanya tampil di Desktop / min-width: md) -->
    <aside class="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-50 shadow-sm">
      <!-- Logo / Title & Lang Switcher -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="https://cdn-icons-png.flaticon.com/512/7637/7637078.png" alt="Global Library Logo" class="w-9 h-9 object-contain" />
          <h1 class="text-lg font-bold text-slate-800 tracking-tight">{{ $t('login.title') }}</h1>
        </div>
        <button @click="toggleLang" class="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors">
          {{ $i18n.locale.toUpperCase() }}
        </button>
      </div>
      
      <!-- Desktop Navigation Links -->
      <div class="flex-grow py-6 px-4 space-y-2">
        <router-link to="/admin/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors" active-class="!text-blue-700 !bg-blue-100 font-semibold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <span class="text-sm">{{ $t('nav.dashboard') }}</span>
        </router-link>

        <router-link to="/admin/requests" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors" active-class="!text-blue-700 !bg-blue-100 font-semibold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          <span class="text-sm">{{ $t('nav.requests') }}</span>
        </router-link>

        <router-link to="/admin/books" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors" active-class="!text-blue-700 !bg-blue-100 font-semibold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          <span class="text-sm">{{ $t('nav.books') }}</span>
        </router-link>
      </div>

      <!-- User/Logout -->
      <div class="p-4 border-t border-slate-100">
        <router-link to="/admin/login" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span class="text-sm font-medium">{{ $t('nav.logout') }}</span>
        </router-link>
      </div>
    </aside>

    <!-- Mobile Header (Hanya tampil di Mobile / max-width: md) -->
    <header class="md:hidden bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-2">
        <img src="https://cdn-icons-png.flaticon.com/512/7637/7637078.png" alt="Global Library Logo" class="w-8 h-8 object-contain" />
        <h1 class="text-base font-bold text-slate-800 tracking-tight">{{ $t('login.title') }}</h1>
      </div>
      <button @click="toggleLang" class="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-md transition-colors">
        {{ $i18n.locale.toUpperCase() }}
      </button>
    </header>

    <!-- Bottom Navigation Bar (Hanya tampil di Mobile / max-width: md) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div class="max-w-md mx-auto flex justify-between items-center relative">
        
        <!-- Dashboard -->
        <router-link to="/admin/dashboard" class="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors" active-class="!text-blue-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <span class="text-[10px] font-medium">{{ $t('nav.dashboard') }}</span>
        </router-link>

        <!-- Requests -->
        <router-link to="/admin/requests" class="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors" active-class="!text-blue-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          <span class="text-[10px] font-medium">{{ $t('nav.requests') }}</span>
        </router-link>

        <!-- Books -->
        <router-link to="/admin/books" class="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors" active-class="!text-blue-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          <span class="text-[10px] font-medium">{{ $t('nav.books') }}</span>
        </router-link>

        <!-- Profile / Logout -->
        <router-link to="/admin/login" class="flex flex-col items-center gap-1 text-slate-400 hover:text-red-600 transition-colors" active-class="!text-red-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span class="text-[10px] font-medium">{{ $t('nav.logout') }}</span>
        </router-link>
      </div>
    </nav>

    <!-- Konten Halaman Aktif -->
    <main class="flex-grow md:ml-64 transition-all duration-300 min-h-screen">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { db } from '../firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'

const { locale } = useI18n()

const toggleLang = () => {
  locale.value = locale.value === 'id' ? 'en' : 'id'
}

const notifications = ref([])
let unsubscribe = null

const removeNotif = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

onMounted(() => {
  // Minta izin notifikasi Chrome/OS
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission()
  }

  const q = query(collection(db, 'requests'), where('status', '==', 'pending'))
  let isInitialLoad = true
  
  unsubscribe = onSnapshot(q, (snapshot) => {
    if (isInitialLoad) {
      isInitialLoad = false
      console.log('Firebase Listener: Initial load skipped.')
      return
    }
    
    snapshot.docChanges().forEach((change) => {
      console.log('Firebase Listener: change detected', change.type, change.doc.data())
      if (change.type === 'added') {
        const data = change.doc.data()
        const notifMessage = `${data.userName} ingin meminjam buku "${data.bookTitle}"`
        const notif = {
          id: Date.now() + Math.random(),
          message: notifMessage
        }
        notifications.value.push(notif)
        
        // Munculkan juga notifikasi asli Chrome/OS jika diizinkan
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Permintaan Pinjam Baru", { 
            body: notifMessage,
            requireInteraction: true
          })
        }
        
        // Notifikasi Toast di UI sekarang tidak akan hilang otomatis, 
        // harus di-klik silang (x) oleh admin.
      }
    })
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<style scoped>
.notif-enter-active, .notif-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.notif-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.notif-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>
