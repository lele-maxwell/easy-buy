import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Loader2, Upload } from 'lucide-react';

interface ImageUploadProps {
    productId: string;
    onUploadComplete: () => void;
    isPrimary?: boolean;
}

export function ImageUpload({ productId, onUploadComplete, isPrimary = false }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', acceptedFiles[0]);
        formData.append('product_id', productId);
        formData.append('is_primary', isPrimary.toString());

        try {
            await api.post('/api/product-images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Image uploaded successfully');
            onUploadComplete();
        } catch (error) {
            console.error('Failed to upload image:', error);
            toast.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    }, [productId, isPrimary, onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        maxFiles: 1,
        disabled: isUploading
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-600 hover:border-emerald-500'}
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <input {...getInputProps()} />
            {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    <p className="text-sm text-slate-400">Uploading...</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6 text-slate-400" />
                    <p className="text-sm text-slate-400">
                        {isDragActive
                            ? 'Drop the image here'
                            : 'Drag and drop an image, or click to select'}
                    </p>
                    <p className="text-xs text-slate-500">
                        Supports: JPG, PNG, GIF
                    </p>
                </div>
            )}
        </div>
    );
} 