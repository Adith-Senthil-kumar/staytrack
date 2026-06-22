import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

// Opens the device image library and returns the chosen image's local uri
// (null if cancelled or permission denied). Upload happens separately so the
// caller can pick before an entity exists (e.g. while logging a new ticket).
export async function pickImage(): Promise<string | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.5 });
  if (res.canceled || !res.assets?.length) return null;
  return res.assets[0].uri;
}

// Uploads a local image uri to Cloud Storage under the owner's namespace
// (users/{uid}/{path}) and returns the public download URL.
export async function uploadPhoto(uid: string, path: string, localUri: string): Promise<string> {
  const blob = await (await fetch(localUri)).blob();
  const r = ref(storage, `users/${uid}/${path}`);
  await uploadBytes(r, blob);
  return getDownloadURL(r);
}

// Pick + upload in one step, for attaching to an entity that already exists.
export async function pickAndUploadPhoto(uid: string, path: string): Promise<string | null> {
  const uri = await pickImage();
  if (!uri) return null;
  return uploadPhoto(uid, path, uri);
}

// Best-effort delete; ignores "object not found" so callers can fire-and-forget.
export async function deletePhoto(uid: string, path: string): Promise<void> {
  try {
    await deleteObject(ref(storage, `users/${uid}/${path}`));
  } catch {
    /* already gone */
  }
}
