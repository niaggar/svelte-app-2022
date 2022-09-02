import { getAuth, updateProfile, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { variables } from '../variables.js';
import './firebase.js';

import { browser } from '$app/environment';
import { writable } from 'svelte/store';


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


export function getUserCity() {
  return new Promise((res, rej) => {    
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const url = `https://us1.locationiq.com/v1/reverse?key=${variables.API_LOCATIONIQ}&lat=${lat}&lon=${lng}&format=json`;

      if (browser) {
        let city = window.localStorage.getItem('city');
        let country = window.localStorage.getItem('country');

        if (city && country && city !== '' && country !== '') {
          return res({ success: true, city, country });
        }
      }
      
      fetch(url)
        .then(res => res.json())
        .then(data => {
          const city = data.address.city || data.address.town;
          const country = data.address.country;

          if (browser) {
            window.localStorage.setItem('city', city);
            window.localStorage.setItem('country', country);
          }
          
          res({ success: true, city, country });
        }).catch(err => rej({ success: false, err }));
    });
  });
}

