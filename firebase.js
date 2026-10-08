import { firebaseConfig, firebaseEnabled } from './firebase-config.js';
let api = null;
if (firebaseEnabled) {
  const appMod = await import('https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js');
  const authMod = await import('https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js');
  const fsMod = await import('https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js');
  const app = appMod.initializeApp(firebaseConfig), auth = authMod.getAuth(app), db = fsMod.getFirestore(app);
  api = {auth,db,onAuthStateChanged:authMod.onAuthStateChanged,createUserWithEmailAndPassword:authMod.createUserWithEmailAndPassword,signInWithEmailAndPassword:authMod.signInWithEmailAndPassword,signOut:authMod.signOut,collection:fsMod.collection,addDoc:fsMod.addDoc,query:fsMod.query,orderBy:fsMod.orderBy,limit:fsMod.limit,getDocs:fsMod.getDocs};
}
export {firebaseEnabled,api};
