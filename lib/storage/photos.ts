import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

// Photos are stored INLINE in Firestore as compressed base64 data URIs — no
// Firebase/Cloud Storage (which now requires a billing account). Each image is
// downscaled to ~800px and JPEG-compressed so it stays well under Firestore's
// 1MB-per-document limit (~50–150KB), and is private under the owner-scoped
// security rules. The function names below match the old Storage helper so the
// call sites are unchanged — the "URL" they store is now a data URI.

export async function pickImage(): Promise<string | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
  if (res.canceled || !res.assets?.length) return null;
  return res.assets[0].uri;
}

async function toDataUri(localUri: string): Promise<string> {
  const out = await ImageManipulator.manipulateAsync(
    localUri,
    [{ resize: { width: 800 } }],
    { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG, base64: true },
  );
  return `data:image/jpeg;base64,${out.base64}`;
}

// uid/path are ignored (no Storage path) but kept so callers don't change.
export async function uploadPhoto(_uid: string, _path: string, localUri: string): Promise<string> {
  return toDataUri(localUri);
}

export async function pickAndUploadPhoto(_uid: string, _path: string): Promise<string | null> {
  const uri = await pickImage();
  if (!uri) return null;
  return toDataUri(uri);
}

// Nothing to delete from a remote store — the data lives in the Firestore field,
// which callers clear by updating the document. Kept for API compatibility.
export async function deletePhoto(_uid: string, _path: string): Promise<void> {}
