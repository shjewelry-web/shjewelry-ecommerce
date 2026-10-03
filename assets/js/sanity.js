// Firebase loaded via CDN compat scripts (see HTML head)
// Provides: window.fetchProductsFromSanity()

(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDshucsK9r__lO54p-9IuZzLqcS_dxRKPc",
    authDomain: "sh-jewelry.firebaseapp.com",
    projectId: "sh-jewelry",
    storageBucket: "sh-jewelry.firebasestorage.app",
    messagingSenderId: "775871414198",
    appId: "1:775871414198:web:386a8fca66b32ad9afcb17"
  };

  // Initialize Firebase app (guard against double-init)
  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // use existing
  }

  const db = firebase.firestore();

  window.fetchProductsFromSanity = async function () {
    const snap = await db.collection("products").get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  };
})();
