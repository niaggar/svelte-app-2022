import { getAuth, updateProfile, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import './firebase.js';


const firebaseAuth = getAuth();


export function loginWithEmail({ email, password }) {
  return new Promise((res, rej) => {    
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then(user => res({ success: true, user, err: null }))
      .catch(err => rej({ success: false, user: null, err }));
  });
}


export function createUserWithEmail({ email, password, name }) {
  return new Promise((res, rej) => {    
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then(user => {
        updateProfile(user.user, { displayName: name, photoURL: '' })
          .then(() => res({ success: true, user, err: null }))
          .catch(err => rej({ success: false, user: null, err: 'Error actualizando informacion.' }));
      })
      .catch(err => rej({ success: false, user: null, err }));
  });
}

