import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDshucsK9r__lO54p-9IuZzLqcS_dxRKPc",
  authDomain: "sh-jewelry.firebaseapp.com",
  projectId: "sh-jewelry",
  storageBucket: "sh-jewelry.firebasestorage.app",
  messagingSenderId: "775871414198",
  appId: "1:775871414198:web:386a8fca66b32ad9afcb17"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function fetchProducts() {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Alias so data.js keeps working
window.fetchProductsFromSanity = fetchProducts;
