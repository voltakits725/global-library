<template>
  <div class="pt-6 px-4 md:px-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">{{ $t('books.title') }}</h1>
        <p class="text-slate-500 text-sm mt-1">{{ $t('books.inventory', { count: books.length }) }}</p>
      </div>
      
      <div class="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <!-- Search Bar -->
        <div class="relative w-full md:w-80">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input v-model="searchQuery" type="text" class="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-colors" :placeholder="$t('books.search')">
        </div>

        <button @click="seedBooksData" :disabled="isSeeding" class="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-xl flex justify-center items-center gap-2 shadow-sm transition-colors shrink-0 disabled:opacity-50" title="Isi database dengan buku dummy yang nyata">
          <svg v-if="isSeeding" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span v-else>🌱</span>
          {{ isSeeding ? 'Menyuntikkan Data...' : 'Seed Data Dummy' }}
        </button>

        <button @click="toggleAddForm" class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl flex justify-center items-center gap-2 shadow-sm transition-colors shrink-0">
          <svg v-if="!showForm || isEditing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          {{ (showForm && !isEditing) ? 'Batal Tambah' : $t('books.add_book') }}
        </button>
      </div>
    </div>

    <!-- Category Filter -->
    <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-4 hide-scrollbar">
      <button 
        v-for="cat in categories" 
        :key="cat"
        @click="activeCategory = cat"
        :class="[
          'whitespace-nowrap px-4 py-2 rounded-full font-semibold text-sm transition-all flex items-center gap-2',
          activeCategory === cat 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
        ]"
      >
        {{ cat }} 
        <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold', activeCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500']">
          {{ getCategoryCount(cat) }}
        </span>
      </button>
    </div>

    <!-- Form Tambah/Edit (Modal) -->
    <div v-if="showForm" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm transition-opacity" @click.self="closeForm">
      <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-300">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-slate-800">{{ isEditing ? $t('books.modal_edit') : $t('books.modal_add') }}</h2>
        <button @click="closeForm" class="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 p-2 rounded-xl">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <form @submit.prevent="saveBook" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">{{ $t('books.book_title') }}</label>
            <input v-model="form.title" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">{{ $t('books.author') }}</label>
            <input v-model="form.author" required type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
          </div>
          
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">{{ $t('books.category') }}</label>
              <select v-model="form.category" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all">
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="IT">IT</option>
                <option value="Science">Science</option>
                <option value="Design">Design</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">{{ $t('books.stock') }}</label>
              <input v-model="form.stock" required type="number" min="0" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">{{ $t('books.url') }}</label>
            <input v-model="form.coverUrl" type="url" placeholder="https://contoh.com/gambar.jpg" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Tahun Terbit</label>
            <input v-model="form.publishYear" type="number" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Penerbit</label>
            <input v-model="form.publisher" type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
          </div>
          
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Halaman</label>
              <input v-model="form.pages" type="number" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">ISBN</label>
              <input v-model="form.isbn" type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Sinopsis</label>
          <textarea v-model="form.synopsis" rows="4" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"></textarea>
        </div>
        
        <div class="flex gap-3 pt-4 border-t border-slate-100 justify-end">
          <button type="button" @click="closeForm" class="px-6 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors">{{ $t('books.cancel') }}</button>
          <button type="submit" :disabled="isSaving" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-sm disabled:opacity-50 transition-colors flex items-center gap-2">
            <svg v-if="isSaving" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isSaving ? $t('books.saving') : $t('books.save') }}
          </button>
        </div>
      </form>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingData" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <template v-else>
      <!-- Book List (Mobile View: Card Layout) -->
      <div class="md:hidden space-y-4">
        <div v-for="book in paginatedBooks" :key="book.id" class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-start gap-4 relative">
          <div class="w-16 h-24 bg-slate-200 rounded-md flex-shrink-0 overflow-hidden shadow-sm">
            <img v-if="book.coverUrl" :src="book.coverUrl" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 text-center p-1">{{ $t('books.no_img') }}</div>
          </div>
          <div class="flex-grow pt-1">
            <h3 class="font-bold text-slate-800 leading-tight mb-1">{{ book.title }}</h3>
            <p class="text-slate-500 text-sm mb-2">{{ book.author }} • {{ book.category }}</p>
            <div class="flex flex-wrap gap-1.5 mb-3">
              <span v-if="book.publishYear" class="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100">{{ book.publishYear }}</span>
              <span v-if="book.publisher" class="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100">{{ book.publisher }}</span>
              <span v-if="book.pages" class="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100">{{ book.pages }} hal</span>
              <span v-if="book.isbn" class="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100">ISBN: {{ book.isbn }}</span>
            </div>
            <span :class="book.stock > 0 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'" class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full">
              <span :class="book.stock > 0 ? 'bg-blue-500' : 'bg-red-500'" class="w-1.5 h-1.5 rounded-full"></span>
              {{ book.stock > 0 ? $t('books.available', { count: book.stock }) : $t('books.out_of_stock') }}
            </span>
          </div>
          <div class="flex flex-col gap-3 ml-2 z-10 relative">
            <button @click="openEditForm(book)" class="text-slate-400 hover:text-blue-600 p-1 bg-slate-50 rounded-lg"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
            <button @click="deleteBook(book.id)" class="text-slate-400 hover:text-red-600 p-1 bg-slate-50 rounded-lg"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
          </div>
          <div class="absolute left-0 top-4 bottom-4 w-1 bg-blue-600 rounded-r-md"></div>
        </div>
        
        <div v-if="filteredBooks.length === 0" class="text-center py-10 text-slate-500 bg-white rounded-2xl border border-slate-100">
          <p>{{ $t('books.no_books') }}</p>
        </div>
      </div>

      <!-- Book Table (Desktop View: Data Table Layout) -->
      <div class="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <th class="p-4 font-semibold w-24">{{ $t('books.cover') }}</th>
              <th class="p-4 font-semibold">{{ $t('books.details') }}</th>
              <th class="p-4 font-semibold">{{ $t('books.category') }}</th>
              <th class="p-4 font-semibold">{{ $t('books.stock') }}</th>
              <th class="p-4 font-semibold text-right">{{ $t('books.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="book in paginatedBooks" :key="book.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="p-4">
                <div class="w-12 h-16 bg-slate-200 rounded overflow-hidden shadow-sm">
                  <img v-if="book.coverUrl" :src="book.coverUrl" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">{{ $t('books.no_img') }}</div>
                </div>
              </td>
              <td class="p-4">
                <h3 class="font-bold text-slate-800 text-base">{{ book.title }}</h3>
                <p class="text-slate-500 text-sm mt-0.5">{{ book.author }}</p>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span v-if="book.publishYear" class="text-[11px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200">{{ book.publishYear }}</span>
                  <span v-if="book.publisher" class="text-[11px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200">{{ book.publisher }}</span>
                  <span v-if="book.pages" class="text-[11px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200">{{ book.pages }} hal</span>
                  <span v-if="book.isbn" class="text-[11px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200">ISBN: {{ book.isbn }}</span>
                </div>
              </td>
              <td class="p-4">
                <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">{{ book.category }}</span>
              </td>
              <td class="p-4">
                <span :class="book.stock > 0 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'" class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <span :class="book.stock > 0 ? 'bg-blue-500' : 'bg-red-500'" class="w-1.5 h-1.5 rounded-full"></span>
                  {{ book.stock > 0 ? $t('books.available', { count: book.stock }) : $t('books.out_of_stock') }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2 transition-opacity">
                  <button @click="openEditForm(book)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" :title="$t('books.edit')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button @click="deleteBook(book.id)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" :title="$t('books.delete')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredBooks.length === 0">
              <td colspan="5" class="p-12 text-center text-slate-500">
                <svg class="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                <p>{{ $t('books.no_books') }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
        <!-- First Page Button -->
        <button @click="currentPage = 1" :disabled="currentPage === 1" class="h-10 px-3 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-bold tracking-wider" title="Ke Halaman Pertama">
          FIRST
        </button>
        <!-- Prev Page Button -->
        <button @click="currentPage--" :disabled="currentPage === 1" class="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title="Halaman Sebelumnya">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        
        <div class="flex items-center gap-1 mx-2">
          <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="['w-10 h-10 rounded-lg font-bold transition-colors', currentPage === page ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100']">
            {{ page }}
          </button>
        </div>
        
        <!-- Next Page Button -->
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title="Halaman Selanjutnya">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
        <!-- Last Page Button -->
        <button @click="currentPage = totalPages" :disabled="currentPage === totalPages" class="h-10 px-3 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-bold tracking-wider" title="Ke Halaman Terakhir">
          LAST
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { db } from '../firebase'
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore'

const books = ref([])
const searchQuery = ref('')
const isLoadingData = ref(true)
let unsubscribe = null

// Form States
const showForm = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const currentEditId = ref(null)

const form = ref({
  title: '',
  author: '',
  category: 'IT',
  stock: 1,
  coverUrl: '',
  publishYear: '',
  publisher: '',
  pages: '',
  isbn: '',
  synopsis: ''
})

const isSeeding = ref(false)

const seedBooksData = async () => {
  const dummyBooks = [
    {
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      isbn: "9780062316097",
      pages: 464,
      publishYear: 2015,
      publisher: "Harper",
      synopsis: "Menelusuri sejarah umat manusia sejak awal evolusi hingga peradaban modern, menyoroti bagaimana biologi dan sejarah mendefinisikan spesies kita.",
      category: "Non-Fiction",
      stock: 6,
      coverUrl: "https://m.media-amazon.com/images/I/41yu2qXhXXL._SY445_SX342_.jpg"
    },
    {
      title: "1984",
      author: "George Orwell",
      isbn: "9780451524935",
      pages: 328,
      publishYear: 1961,
      publisher: "Signet Classic",
      synopsis: "Novel distopia klasik tentang masyarakat totaliter yang diawasi penuh oleh 'Big Brother', mengeksplorasi tema kebebasan, penyensoran, dan kebenaran.",
      category: "Fiction",
      stock: 4,
      coverUrl: "https://m.media-amazon.com/images/I/4117X1lXlPL._SY445_SX342_.jpg"
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "9780060935467",
      pages: 336,
      publishYear: 2002,
      publisher: "Harper Perennial",
      synopsis: "Sebuah novel abadi tentang keadilan dan prasangka di daerah Selatan Amerika, diceritakan melalui kacamata seorang anak perempuan.",
      category: "Fiction",
      stock: 3,
      coverUrl: "https://m.media-amazon.com/images/I/51p12IQO4VL._SY445_SX342_.jpg"
    },
    {
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen, et al.",
      isbn: "9780262033848",
      pages: 1312,
      publishYear: 2009,
      publisher: "MIT Press",
      synopsis: "Buku panduan definitif dan ekstensif tentang algoritma komputer. Sering disebut sebagai 'buku suci' para mahasiswa ilmu komputer di seluruh dunia.",
      category: "IT",
      stock: 5,
      coverUrl: "https://m.media-amazon.com/images/I/41T0iBxY8FL._SY445_SX342_.jpg"
    },
    {
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      isbn: "9781449373320",
      pages: 616,
      publishYear: 2017,
      publisher: "O'Reilly Media",
      synopsis: "Panduan mendalam tentang arsitektur sistem backend modern, membahas database, caching, messaging, dan konsep distributed systems.",
      category: "IT",
      stock: 4,
      coverUrl: "https://m.media-amazon.com/images/I/51ZSpMl1-lL._SY445_SX342_.jpg"
    },
    {
      title: "The Lean Startup",
      author: "Eric Ries",
      isbn: "9780307887894",
      pages: 336,
      publishYear: 2011,
      publisher: "Crown Business",
      synopsis: "Metodologi revolusioner untuk membangun bisnis dan meluncurkan produk inovatif secara cepat, efisien, dan berdasarkan validasi pasar.",
      category: "Non-Fiction",
      stock: 8,
      coverUrl: "https://m.media-amazon.com/images/I/411X+t69+VL._SY445_SX342_.jpg"
    },
    {
      title: "Steal Like an Artist",
      author: "Austin Kleon",
      isbn: "9780761169253",
      pages: 160,
      publishYear: 2012,
      publisher: "Workman Publishing Company",
      synopsis: "Sepuluh prinsip transformasi tentang kreativitas. Mengajarkan bahwa tidak ada ide yang sepenuhnya orisinal, dan bagaimana mengambil inspirasi untuk menciptakan karya hebat.",
      category: "Design",
      stock: 7,
      coverUrl: "https://m.media-amazon.com/images/I/41D8B1a1i4L._SY445_SX342_.jpg"
    },
    {
      title: "Refactoring: Improving the Design of Existing Code",
      author: "Martin Fowler",
      isbn: "9780134757599",
      pages: 448,
      publishYear: 2018,
      publisher: "Addison-Wesley",
      synopsis: "Panduan legendaris tentang bagaimana membersihkan kode yang berantakan menjadi kode yang elegan dan mudah dirawat tanpa mengubah perilaku program.",
      category: "IT",
      stock: 2,
      coverUrl: "https://m.media-amazon.com/images/I/41yXG1Q8R3L._SY445_SX342_.jpg"
    },
    {
      title: "Thinking in Systems: A Primer",
      author: "Donella H. Meadows",
      isbn: "9781603580557",
      pages: 240,
      publishYear: 2008,
      publisher: "Chelsea Green Publishing",
      synopsis: "Pengantar cemerlang tentang pemikiran sistem (systems thinking) yang mengajarkan cara melihat dunia sebagai sekumpulan elemen yang saling terhubung.",
      category: "Science",
      stock: 5,
      coverUrl: "https://m.media-amazon.com/images/I/416G4X-eA9L._SY445_SX342_.jpg"
    },
    {
      title: "Educated: A Memoir",
      author: "Tara Westover",
      isbn: "9780399590504",
      pages: 352,
      publishYear: 2018,
      publisher: "Random House",
      synopsis: "Kisah nyata inspiratif tentang seorang wanita muda yang lahir di keluarga survivalis di pegunungan Idaho dan perjuangannya meraih pendidikan hingga ke Universitas Cambridge.",
      category: "Non-Fiction",
      stock: 5,
      coverUrl: "https://m.media-amazon.com/images/I/41xWf30N50L._SY445_SX342_.jpg"
    }
  ]

  if (!confirm("Apakah Anda yakin ingin menyuntikkan 10 buku nyata ke dalam database?")) return

  isSeeding.value = true
  try {
    for (const book of dummyBooks) {
      await addDoc(collection(db, 'books'), book)
    }
    alert("Berhasil menyuntikkan 10 buku nyata ke database!")
  } catch (error) {
    console.error("Gagal melakukan seeder:", error)
    alert("Terjadi kesalahan saat menyuntikkan data.")
  } finally {
    isSeeding.value = false
  }
}

// Pagination & Filter Logic
const activeCategory = ref('Semua')
const categories = ['Semua', 'IT', 'Fiction', 'Non-Fiction', 'Science', 'Design']

const getCategoryCount = (cat) => {
  if (cat === 'Semua') return books.value.length
  return books.value.filter(b => b.category === cat).length
}

// Search & Category filter
const filteredBooks = computed(() => {
  return books.value.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          b.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          b.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesCategory = activeCategory.value === 'Semua' || b.category === activeCategory.value
    
    return matchesSearch && matchesCategory
  })
})

// Pagination Logic
const currentPage = ref(1)
const itemsPerPage = 5

const totalPages = computed(() => Math.ceil(filteredBooks.value.length / itemsPerPage))

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredBooks.value.slice(start, start + itemsPerPage)
})

// Reset ke halaman 1 jika ada pencarian atau ganti kategori
watch([searchQuery, activeCategory], () => {
  currentPage.value = 1
})

// Real-time listener for books
onMounted(() => {
  isLoadingData.value = true
  unsubscribe = onSnapshot(collection(db, "books"), (snapshot) => {
    books.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    isLoadingData.value = false
  }, (error) => {
    console.error("Error fetching books: ", error)
    isLoadingData.value = false
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const toggleAddForm = () => {
  if (showForm.value && !isEditing.value) {
    // If it's already open for adding, toggle it off
    closeForm()
  } else {
    // Open for adding
    isEditing.value = false
    currentEditId.value = null
    form.value = { title: '', author: '', category: 'IT', stock: 1, coverUrl: '', publishYear: '', publisher: '', pages: '', isbn: '', synopsis: '' }
    showForm.value = true
  }
}

const openEditForm = (book) => {
  isEditing.value = true
  currentEditId.value = book.id
  form.value = { ...book } // Clone object
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

const saveBook = async () => {
  isSaving.value = true
  try {
    const bookData = {
      title: form.value.title || '',
      author: form.value.author || '',
      category: form.value.category || 'IT',
      stock: parseInt(form.value.stock) || 0,
      coverUrl: form.value.coverUrl || '',
      publishYear: form.value.publishYear || '',
      publisher: form.value.publisher || '',
      pages: form.value.pages ? parseInt(form.value.pages) : '',
      isbn: form.value.isbn || '',
      synopsis: form.value.synopsis || ''
    }

    // Save to Firestore
    if (isEditing.value) {
      await updateDoc(doc(db, "books", currentEditId.value), bookData)
    } else {
      await addDoc(collection(db, "books"), bookData)
    }

    closeForm()
  } catch (error) {
    console.error("Error saving book: ", error)
    alert("Gagal menyimpan buku! Cek koneksi atau rules Firebase.")
  } finally {
    isSaving.value = false
  }
}

const deleteBook = async (id) => {
  if (confirm("Yakin ingin menghapus buku ini?")) {
    try {
      await deleteDoc(doc(db, "books", id))
      books.value = books.value.filter(b => b.id !== id) // Remove from UI
    } catch (error) {
      console.error("Error deleting book: ", error)
      alert("Gagal menghapus buku!")
    }
  }
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
