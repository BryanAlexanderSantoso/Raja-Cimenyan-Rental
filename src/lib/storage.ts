import { supabase } from './supabase';

export const uploadFile = async (
    bucket: string,
    path: string,
    file: File
): Promise<string | null> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${path}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
};

export const uploadCarImage = (file: File) => uploadFile('cars', 'images', file);
export const uploadTenantKtp = (file: File) => uploadFile('tenants', 'ktp', file);
export const uploadHandover = (file: File) => uploadFile('rentals', 'handover', file);
