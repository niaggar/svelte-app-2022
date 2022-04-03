import { getDocs, getFirestore } from "firebase/firestore"
import { collection, doc, addDoc, query, orderBy, limit } from "firebase/firestore";


const db = getFirestore();

// using firebase 8.0.0
export function getUserData({ uid, city, count = 1}) {
  return new Promise(async (res, rej) => { 
    const userDataRef = collection(db, 'user-data', uid, city);

    const q = query(userDataRef, orderBy('createdAt', 'desc'), limit(count));
    const docs = await getDocs(q).catch(err => rej({ success: false, err }));

    console.log(docs.docs.map(doc => doc.data()))

    res({ success: true, data: docs.docs.map(doc => doc.data()) })
  });
}


export function saveUserData({ uid, city, data}) {
  return new Promise((res, rej) => {
    const userDataRef = collection(db, 'user-data', uid, city);

    addDoc(userDataRef, data)
      .then(() => res({ success: true, err: null }))
      .catch(err => rej({ success: false, err }));
  });
}


export function saveGlobalData({ city, data }) {
  return new Promise(async (res, rej) => {
    const globalDataRef = collection(db, 'global-data', city);
    const globalDataDocRef = doc(db, 'global-data', city);

    let globalDocData = {
      geo: data.geo,
      creation: data.creation,
    };

    await setDoc(globalDataRef, data).catch(err => rej({ success: false, err }));
    await setDoc(globalDataDocRef, globalDocData).catch(err => rej({ success: false, err }));

    res({ success: true, err: null });
  });
}
