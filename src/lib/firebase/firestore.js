import {
  query,
  orderBy,
  limit,
  startAt,
  endAt,
  collection,
  addDoc,
  getDocs,
  getFirestore
} from 'firebase/firestore';
import { geohashQueryBounds, distanceBetween } from 'geofire-common';



const db = getFirestore();


export function getUserData({ uid, city, count = 1 }) {
  return new Promise(async (res, rej) => {
    const userDataRef = collection(db, 'user-data', uid, city);

    const q = query(userDataRef, orderBy('createdAt', 'desc'), limit(count));
    const docs = await getDocs(q).catch((err) => rej({ success: false, err }));

    res({ success: true, data: docs.docs.map((doc) => doc.data()) });
  });
}


export function saveUserData({ uid, city, data }) {
  return new Promise((res, rej) => {
    const userDataRef = collection(db, 'user-data', uid, city);

    addDoc(userDataRef, data)
      .then(() => res({ success: true, err: null }))
      .catch((err) => rej({ success: false, err }));
  });
}


export function saveGlobalData({ data }) {
  return new Promise(async (res, rej) => {
    const globalDataRef = collection(db, 'global-data');

    await addDoc(globalDataRef, data).catch((err) =>
      rej({ success: false, err })
    );

    res({ success: true, err: null });
  });
}


export function getDataUsingGeoHash({ count = 1 }) {
  return new Promise(async (res, rej) => {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
  
        const globalDataRef = collection(db, 'global-data');
        const center = [lat, long];
        const radiusInM = 3 * 1000;
  
        const bounds = geohashQueryBounds(center, radiusInM);
  
        const promises = [];
        for (const b of bounds) {
          const q = query(
            globalDataRef,
            orderBy('geo.hash', 'asc'),
            orderBy('createdAt', 'desc'),
            startAt(b[0]),
            endAt(b[1]),
            limit(count)
          );
          promises.push(getDocs(q));
        }
  
        Promise.all(promises).then((snapshots) => {
          const matchingDocs = [];
          let lastPositionDoc = undefined;
  
          for (const snap of snapshots) {
            for (const doc of snap.docs) {
              const data = doc.data();
              const { geo: { lat: latDoc, lng: lngDoc } } = data;
              let isUniqueToOtherDocs = true;
  
              if (lastPositionDoc != undefined) {
                const distanceWithOtherDocs = distanceBetween([latDoc, lngDoc], lastPositionDoc);
                const distanceInMWithOtherDocs = distanceWithOtherDocs * 1000;
  
                isUniqueToOtherDocs = distanceInMWithOtherDocs > 20;
              }
              
              const distanceInKm = distanceBetween([latDoc, lngDoc], center);
              const distanceInM = distanceInKm * 1000;
  
              if (distanceInM <= radiusInM && isUniqueToOtherDocs) {
                matchingDocs.push(data);
                lastPositionDoc = [latDoc, lngDoc];
              }
            }
          }
  
          res({ success: true, data: matchingDocs });
        });
      });
    } catch (error) {
      rej({ success: false, err: error });
    }
  });
}
