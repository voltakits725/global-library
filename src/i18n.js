import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      requests: 'Borrow Requests',
      books: 'Manage Books',
      logout: 'Sign Out'
    },
    dashboard: {
      title: 'Library Analytics',
      overview: 'Overview',
      total_books: 'Total Books',
      active_requests: 'Active Requests',
      active_students: 'Total Students',
      top_books: 'Top 5 Borrowed Books',
      top_categories: 'Top 5 Categories',
      no_data: 'No borrow data available',
      borrows: 'borrows'
    },
    requests: {
      title: 'Borrow Management',
      inventory: '{count} Requests',
      search: 'Search by student name or ID...',
      approve: 'Approve',
      reject: 'Reject',
      no_requests: 'No active borrow requests.',
      tab_pending: 'Pending Requests',
      tab_active: 'Active Loans',
      tab_completed: 'Completed History',
      no_data_title: 'No Data',
      no_data_cat: 'No borrow data in this category.',
      action_return: 'Mark as Returned',
      status_returned: 'Returned',
      status_rejected: 'Rejected'
    },
    books: {
      title: 'Manage Books',
      inventory: 'Inventory: {count} Items',
      add_book: 'Add Book',
      search: 'Search by title, author...',
      cover: 'Cover',
      details: 'Book Details',
      category: 'Category',
      stock: 'Stock',
      actions: 'Actions',
      available: '{count} Available',
      out_of_stock: 'Out of Stock',
      no_img: 'No Img',
      no_books: 'No books found matching your criteria.',
      modal_add: 'Add New Book',
      modal_edit: 'Edit Book',
      book_title: 'Book Title',
      author: 'Author',
      url: 'Cover Image URL (from Google)',
      cancel: 'Cancel',
      save: 'Save Book',
      saving: 'Saving...'
    },
    login: {
      title: 'Admin Portal',
      subtitle: 'Secure access for library staff.',
      email: 'Admin Email',
      password: 'Password',
      remember: 'Remember Me',
      forgot: 'Forgot Password?',
      login_btn: 'Login to Dashboard',
      logging_in: 'Logging in...',
      error: 'Invalid credentials. Please try again.',
      footer1: 'Authorized personnel only.',
      footer2: 'Contact IT support for access issues.'
    }
  },
  id: {
    nav: {
      dashboard: 'Beranda',
      requests: 'Permintaan',
      books: 'Kelola Buku',
      logout: 'Keluar'
    },
    dashboard: {
      title: 'Analitik Perpustakaan',
      overview: 'Ringkasan',
      total_books: 'Total Buku',
      active_requests: 'Permintaan Aktif',
      active_students: 'Total Mhs',
      top_books: 'Buku Paling Sering Dipinjam (Top 5)',
      top_categories: 'Kategori Terpopuler (Top 5)',
      no_data: 'Belum ada data peminjaman',
      borrows: 'pinjaman'
    },
    requests: {
      title: 'Manajemen Peminjaman',
      inventory: '{count} Permintaan',
      search: 'Cari nama atau NIM mahasiswa...',
      approve: 'Setujui',
      reject: 'Tolak',
      no_requests: 'Tidak ada permintaan aktif.',
      tab_pending: 'Menunggu Persetujuan',
      tab_active: 'Sedang Dipinjam',
      tab_completed: 'Riwayat Selesai',
      no_data_title: 'Tidak Ada Data',
      no_data_cat: 'Belum ada data peminjaman dalam kategori ini.',
      action_return: 'Tandai Dikembalikan',
      status_returned: 'Selesai Dikembalikan',
      status_rejected: 'Ditolak'
    },
    books: {
      title: 'Kelola Buku',
      inventory: 'Inventaris: {count} Buku',
      add_book: 'Tambah Buku',
      search: 'Cari judul, penulis...',
      cover: 'Sampul',
      details: 'Detail Buku',
      category: 'Kategori',
      stock: 'Stok',
      actions: 'Aksi',
      available: 'Tersedia {count}',
      out_of_stock: 'Stok Habis',
      no_img: 'No Img',
      no_books: 'Tidak ada buku yang cocok dengan pencarian.',
      modal_add: 'Tambah Buku Baru',
      modal_edit: 'Edit Buku',
      book_title: 'Judul Buku',
      author: 'Penulis',
      url: 'URL Gambar Sampul (dari Google)',
      cancel: 'Batal',
      save: 'Simpan Buku',
      saving: 'Menyimpan...'
    },
    login: {
      title: 'Portal Admin',
      subtitle: 'Akses khusus staf perpustakaan.',
      email: 'Email Admin',
      password: 'Kata Sandi',
      remember: 'Ingat Saya',
      forgot: 'Lupa Sandi?',
      login_btn: 'Masuk ke Dashboard',
      logging_in: 'Masuk...',
      error: 'Email atau Sandi salah. Coba lagi.',
      footer1: 'Hanya untuk staf berwenang.',
      footer2: 'Hubungi IT jika terkendala akses.'
    }
  }
}

const i18n = createI18n({
  locale: 'id', // Default language
  fallbackLocale: 'en',
  messages,
})

export default i18n
