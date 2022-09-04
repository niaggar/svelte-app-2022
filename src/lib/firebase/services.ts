import { getAuth, updateProfile, signInWithEmailAndPassword, createUserWithEmailAndPassword, type UserCredential } from 'firebase/auth';
import { variables } from '../variables';
import { browser } from '$app/environment';
import './config.ts';



const firebaseAuth = getAuth();


export function loginWithEmail(email: string, password: string): Promise<{ success: boolean, user?: UserCredential }> {
  return new Promise((res, rej) => {    
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then(user => res({ success: true, user }))
      .catch(err => res({ success: false }));
  });
}


export function createUserWithEmail(email: string, password: string, name: string): Promise<{ success: boolean, user?: UserCredential }> {
  return new Promise((res, rej) => {    
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then(user => {
        updateProfile(user.user, { displayName: name, photoURL: '' })
          .then(() => res({ success: true, user }))
          .catch(err => res({ success: false }));
      })
      .catch(err => res({ success: false }));
  });
}


export function getUserCity(): Promise<{success: boolean, city: string, country: string}> {
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
        }).catch(err => res({ success: false, city: '', country: '', }));
    });
  });
}

