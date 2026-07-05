<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:block">
    
    <!-- Top Navbar (Hanya tampil di Desktop / min-width: md) -->
    <header class="hidden md:flex bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm px-8 py-3 items-center justify-between">
      <div class="flex items-center gap-8">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <img src="https://cdn-icons-png.flaticon.com/512/7637/7637078.png" alt="Global Library Logo" class="w-9 h-9 object-contain" />
          <h1 class="text-lg font-bold text-slate-800 tracking-tight">Global Library</h1>
        </div>
        
        <!-- Desktop Navigation Links -->
        <nav class="flex gap-1">
          <router-link to="/student" exact-active-class="text-blue-700 bg-blue-50 font-bold" class="px-4 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium text-sm">
            Katalog Buku
          </router-link>
          <router-link to="/student/history" active-class="text-blue-700 bg-blue-50 font-bold" class="px-4 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium text-sm">
            Riwayat Pinjam
          </router-link>
          <router-link to="/student/profile" active-class="text-blue-700 bg-blue-50 font-bold" class="px-4 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium text-sm">
            Profil Saya
          </router-link>
        </nav>
      </div>

      <!-- User Profile & Logout -->
      <div class="flex items-center gap-3">
        <!-- User Profile Link -->
        <router-link to="/student/profile" class="flex items-center gap-3 bg-slate-50 py-1.5 px-3 rounded-full border border-slate-100 hover:bg-slate-100 hover:shadow-sm transition-all cursor-pointer">
          <img v-if="userPhoto" :src="userPhoto" class="w-7 h-7 rounded-full object-cover shadow-sm" alt="Profile" />
          <div v-else class="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">{{ userInitials }}</div>
          <span class="text-sm font-semibold text-slate-700 hidden lg:block pr-2">{{ userName }}</span>
        </router-link>
        
        <!-- Logout Button (Desktop) -->
        <button @click="handleLogout" class="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Logout">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </button>
      </div>
    </header>

    <!-- Mobile Header (Hanya tampil di Mobile) -->
    <header class="md:hidden bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-2">
        <img src="https://cdn-icons-png.flaticon.com/512/7637/7637078.png" alt="Global Library Logo" class="w-8 h-8 object-contain" />
        <h1 class="text-base font-bold text-slate-800 tracking-tight">Global Library</h1>
      </div>
    </header>

    <!-- Konten Halaman Aktif -->
    <main class="flex-grow transition-all duration-300 w-full relative">
      <router-view />
    </main>

    <!-- Bottom Navigation Bar (Hanya tampil di Mobile / max-width: md) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div class="max-w-md mx-auto flex justify-between items-center">
        
        <!-- Catalog -->
        <router-link to="/student" exact-active-class="!text-blue-600" class="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors w-16">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          <span class="text-[10px] font-medium">Katalog</span>
        </router-link>

        <!-- History -->
        <router-link to="/student/history" active-class="!text-blue-600" class="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors w-16">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span class="text-[10px] font-medium">Riwayat</span>
        </router-link>

        <!-- Profile -->
        <router-link to="/student/profile" active-class="!text-blue-600" class="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors w-16">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <span class="text-[10px] font-medium">Profil</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { db, auth } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore'

const router = useRouter()
const userName = ref('Mahasiswa')
const userPhoto = ref('')
const userInitials = ref('M')
let unsubscribeNotif = null
let unsubscribeAuth = null
let overdueInterval = null
const activeRequests = ref([])

// Catat notifikasi yang sudah muncul (mencegah bug double notif karena HMR / Auth Reload)
const notifiedStatus = new Set()
window.overdueNotifiedSet = window.overdueNotifiedSet || new Set()

onMounted(() => {
  // Minta izin notifikasi browser
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission()
  }

  unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    if (user) {
      userName.value = user.displayName || 'Mahasiswa'
      userPhoto.value = user.photoURL || ''
      userInitials.value = userName.value.charAt(0).toUpperCase()
      
      // Ambil data profil lengkap dari Firestore
      try {
        const userDocRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userDocRef)
        if (userSnap.exists()) {
          const userData = userSnap.data()
          if (userData.namaLengkap) {
            userName.value = userData.namaLengkap
            userInitials.value = userName.value.charAt(0).toUpperCase()
          }
          if (userData.photoUrl) {
            userPhoto.value = userData.photoUrl
          }
        }
      } catch (err) {
        console.error("Gagal fetch profil user:", err)
      }
      
      // Bersihkan listener lama jika onAuthStateChanged terpanggil lebih dari sekali
      if (unsubscribeNotif) unsubscribeNotif()
      
      // Setup notifikasi perubahan status request
      let isInitialLoad = true
      const q = query(collection(db, 'requests'), where('userId', '==', user.uid))
      unsubscribeNotif = onSnapshot(q, (snapshot) => {
        
        // Simpan daftar peminjaman aktif untuk dicek oleh interval overdue
        const allReqs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        activeRequests.value = allReqs.filter(r => r.status === 'active')
        
        if (isInitialLoad) {
          isInitialLoad = false
          return
        }
        
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'modified') {
            const data = change.doc.data()
            
            // CEGAH NOTIFIKASI MUNCUL SAAT MAHASISWA MENGHAPUS RIWAYAT
            if (data.isDeletedByStudent) return;
            
            // CEGAH NOTIFIKASI DOUBLE UNTUK STATUS YANG SAMA (Per dokumen)
            const notifKey = `${change.doc.id}_${data.status}`
            if (notifiedStatus.has(notifKey)) return;
            notifiedStatus.add(notifKey);
            
            let title = ""
            let body = ""
            
            if (data.status === 'active') {
              title = "Peminjaman Disetujui! 🎉"
              body = `Buku "${data.bookTitle}" siap untuk diambil/dibaca.`
            } else if (data.status === 'rejected') {
              title = "Peminjaman Ditolak ❌"
              body = `Maaf, pengajuan pinjam buku "${data.bookTitle}" ditolak Admin.`
            } else if (data.status === 'returned') {
              title = "Buku Dikembalikan ✅"
              body = `Buku "${data.bookTitle}" berhasil dikembalikan. Terima kasih!`
            }
            
            // CEGAH SPAM: Jika buku yang sama di-approve/dikembalikan bersamaan, jadikan 1 notif aja
            const spamKey = `${title}_${data.bookTitle}`
            if (title && "Notification" in window && Notification.permission === "granted") {
              // Cek spam cache (dibikin properti global di window biar aman dari HMR)
              window.spamCache = window.spamCache || new Set();
              if (!window.spamCache.has(spamKey)) {
                window.spamCache.add(spamKey);
                setTimeout(() => window.spamCache.delete(spamKey), 5000); // Hapus dari cache setelah 5 detik
                
                new Notification(title, { 
                  body: body,
                  icon: data.bookCover || '/favicon.ico',
                  requireInteraction: true
                })
              }
            }
          }
        })
      })
    } else {
      if (unsubscribeNotif) unsubscribeNotif()
      router.push('/')
    }
  })
  
  // Setup Interval Checker untuk Notifikasi Overdue (Tenggat Waktu)
  overdueInterval = setInterval(() => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      console.log("Menunggu izin notifikasi dari browser...");
      return;
    }
    
    const now = new Date()
    
    activeRequests.value.forEach(req => {
      // Pastikan buku memiliki tanggal dan jam pengembalian
      if (req.expectedReturnDate && req.expectedReturnTime) {
        const dueDateTimeStr = `${req.expectedReturnDate}T${req.expectedReturnTime}`
        const dueDate = new Date(dueDateTimeStr)
        
        if (now > dueDate) {
          // Buku sudah overdue!
          if (!window.overdueNotifiedSet.has(req.id)) {
            window.overdueNotifiedSet.add(req.id)
            
            new Notification("Tenggat Waktu Pengembalian! ⏰", {
              body: `Waktu peminjaman buku "${req.bookTitle}" telah habis. Segera kembalikan ke perpustakaan!`,
              icon: req.bookCover || '/favicon.ico',
              requireInteraction: true
            })
          }
        }
      }
    })
  }, 10000) // Berjalan setiap 10 detik untuk pengecekan yang lebih cepat
})

onUnmounted(() => {
  if (unsubscribeNotif) unsubscribeNotif()
  if (unsubscribeAuth) unsubscribeAuth()
  if (overdueInterval) clearInterval(overdueInterval)
})

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/')
  } catch (error) {
    console.error("Gagal logout:", error)
  }
}
</script>
