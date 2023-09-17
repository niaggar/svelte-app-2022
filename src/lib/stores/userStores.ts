import type { User } from 'firebase/auth';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export const UserInfo: Writable<{isLoggin: boolean, user?: User}> = writable({ isLoggin: false });
