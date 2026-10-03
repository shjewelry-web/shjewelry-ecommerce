(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDshucsK9r__lO54p-9IuZzLqcS_dxRKPc",
    authDomain: "sh-jewelry.firebaseapp.com",
    projectId: "sh-jewelry",
    storageBucket: "sh-jewelry.firebasestorage.app",
    messagingSenderId: "775871414198",
    appId: "1:775871414198:web:386a8fca66b32ad9afcb17"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.firestore();

  window.fetchProductsFromSanity = async function () {
    const snap = await db.collection("products").get();
    return snap.docs.map(function(d) {
      return Object.assign({ id: d.id }, d.data());
    });
  };

})();
