import { goto } from '$app/navigation';
import { getAuth } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();
const authChanged = () =>
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      let name = user.displayName || '';

      if (name.length > 0) {
        let userUrl = `/${name.replace(/\s+/g, '').toLowerCase()}/home`;
        await goto(userUrl);
      }
    }
  });

export default authChanged;
