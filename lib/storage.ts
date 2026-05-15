import { supabase } from "./supabase";

export async function uploadFile(bucket: string, file: File, filePath: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true });

  if (error) {
    throw new Error(`Error subiendo archivo: ${error.message}`);
  }

  return data;
}

export function getPublicUrl(bucket: string, filePath: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}
