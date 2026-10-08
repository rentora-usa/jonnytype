import {firebaseEnabled,api} from './firebase.js';
const KEY='jonnytype_profile_v2';
const local=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{tests:[],email:''}}catch{return {tests:[],email:''}}};
const save=p=>localStorage.setItem(KEY,JSON.stringify(p));
export async function currentUser(){return firebaseEnabled?api.auth.currentUser:(local().email?{email:local().email,local:true}:null)}
export async function saveTest(t){if(!firebaseEnabled){const p=local();p.tests.unshift(t);p.tests=p.tests.slice(0,100);save(p);return}const u=api.auth.currentUser;if(u)await api.addDoc(api.collection(api.db,'users',u.uid,'tests'),{...t,createdAt:Date.now()})}
export async function tests(){if(!firebaseEnabled)return local().tests||[];const u=api.auth.currentUser;if(!u)return[];const q=api.query(api.collection(api.db,'users',u.uid,'tests'),api.orderBy('createdAt','desc'),api.limit(100));return(await api.getDocs(q)).docs.map(d=>d.data())}
export function setLocalEmail(e){const p=local();p.email=e;save(p)}
