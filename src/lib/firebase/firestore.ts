import type { City, MeassurePack, ResponseData } from '$lib/types/meassureType';
import type { Geopoint } from 'geofire-common';
import type { DocumentData, Timestamp } from 'firebase/firestore';
import {
  query,
  orderBy,
  limit,
  startAt,
  endAt,
  collection,
  addDoc,
  getDocs,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { geohashQueryBounds, distanceBetween } from 'geofire-common';
import './config.ts';



const db = getFirestore();


export function getUserData(uid: string, city: string, count: number = 1): Promise<ResponseData<MeassurePack[]>> {
  return new Promise(async (res, rej) => {
    const userDataRef = collection(db, 'user-data', uid, city);

    const q = query(userDataRef, orderBy('createdAt', 'desc'), limit(count));
    const docs = await getDocs(q);

    if (docs == null) return res({ status: false });

    const data = docs.docs.map(doc => doc.data());

    res({ status: true, data: data as MeassurePack[] });
  });
}


export function getUserCities(uid: string): Promise<ResponseData<City[]>> {
  return new Promise(async (res, rej) => {
    const userDocRef = doc(db, 'user-data', uid);
    const docsResponse = await getDoc(userDocRef);

    if (docsResponse.exists()) {
      const data = docsResponse.data();
      
      const citiesValues = Object.entries(data);
      const cities = citiesValues.map(([key, value]) => value as { cityName: string, country: string, update: Timestamp });

      return res({ status: true, data: cities as City[] });
    }

    res({ status: false });
  });
}


export function saveUserData(uid: string, city: string, newMessure: MeassurePack): Promise<ResponseData<boolean>> {
  return new Promise(async (res, rej) => {
    const userDataRef = collection(db, 'user-data', uid, city);
    const userDocRef = doc(db, 'user-data', uid);

    await addDoc(userDataRef, newMessure).catch((err) => rej({ status: false }));
    await updateDoc(userDocRef, {
      [city]: {
        cityName: city,
        country: newMessure.country,
        update: newMessure.createdAt
      }
    }).catch(async () => await setDoc(userDocRef, {
      [city]: {
        cityName: city,
        country: newMessure.country,
        update: newMessure.createdAt
      }
    }));

    res({ status: true });
  });
}


export function saveGlobalData(data: MeassurePack): Promise<ResponseData<boolean>> {
  return new Promise(async (res, rej) => {
    const globalDataRef = collection(db, 'global-data');

    await addDoc(globalDataRef, data).catch((err) =>
      rej({ status: false })
    );

    res({ status: true });
  });
}


export function getDataUsingGeoHash(lat: number, long: number, count: number = 1): Promise<ResponseData<MeassurePack[]>> {
  return new Promise(async (res, rej) => {
    const globalDataRef = collection(db, 'global-data');
    const center: Geopoint = [lat, long];
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

    const snapshots = await Promise.all(promises).catch(() => null);
    if (snapshots == null) return res({ status: false });


    let documents: DocumentData[] = [];
    let matchingDocs: DocumentData[] = [];
    let lastPositionDoc: Geopoint | null = null;

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const data = doc.data();
        documents.push(data);
      }
    }

    documents.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());


    for (const doc of documents) {
      const { geo: { lat: latDoc, lng: lngDoc } } = doc as MeassurePack;
      let isUniqueToOtherDocs = true;

      if (lastPositionDoc != null) {
        const distanceWithOtherDocs = distanceBetween([latDoc, lngDoc], lastPositionDoc);
        const distanceInMWithOtherDocs = distanceWithOtherDocs * 1000;

        isUniqueToOtherDocs = distanceInMWithOtherDocs > 30;
      }

      const distanceInKm = distanceBetween([latDoc, lngDoc], center);
      const distanceInM = distanceInKm * 1000;

      if (distanceInM <= radiusInM && isUniqueToOtherDocs) {
        matchingDocs.push(doc);
        lastPositionDoc = [latDoc, lngDoc];
      }
    }

    res({ status: true, data: matchingDocs as MeassurePack[] });
  });
}
