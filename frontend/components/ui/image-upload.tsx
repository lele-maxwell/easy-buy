"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { X, Upload, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"

interface ImageUploadProps {
  productId: string
  onUploadComplete: (imageUrl: string) => void
  onUploadError: (error: string) => void
}

export function ImageUpload({ productId, onUploadComplete, onUploadError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true)
    
    try {
      for (const file of acceptedFiles) {
        const formData = new FormData()
        formData.append("image", file)

        const response = await api.post(`/api/products/upload-image/${productId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        if (response.data.images) {
          const newImageUrl = response.data.images[response.data.images.length - 1]
          onUploadComplete(newImageUrl)
        }
      }
    } catch (error) {
      console.error("Failed to upload image:", error)
      onUploadError("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }, [productId, onUploadComplete, onUploadError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive 
          ? "border-emerald-500 bg-emerald-500/10" 
          : "border-slate-600 hover:border-slate-500"
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <Upload className="w-8 h-8 text-slate-400" />
        <div className="text-slate-400">
          {isDragActive ? (
            <p>Drop the images here...</p>
          ) : (
            <p>Drag & drop images here, or click to select files</p>
          )}
        </div>
        <p className="text-sm text-slate-500">
          Supports: JPG, PNG, GIF (max 5MB)
        </p>
      </div>
    </div>
  )
}

interface ImageGalleryProps {
  images?: string[]
  onDelete?: (imageUrl: string) => void
  isDeleting?: boolean
}

export function ImageGallery({ images = [], onDelete, isDeleting }: ImageGalleryProps) {
  const handleDelete = async (imageUrl: string) => {
    if (!onDelete) return
    if (!confirm("Are you sure you want to delete this image?")) return
    onDelete(imageUrl)
  }

  // Ensure images is always an array
  const imageArray = Array.isArray(images) ? images : []

  if (imageArray.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-600 rounded-lg">
        <div className="text-center text-slate-400">
          <ImageIcon className="w-8 h-8 mx-auto mb-2" />
          <p>No images uploaded</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {imageArray.map((image, index) => (
        <div key={index} className="relative group aspect-square">
          <img
            src={image}
            alt={`Product image ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
          {onDelete && (
            <button
              onClick={() => handleDelete(image)}
              disabled={isDeleting}
              className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
} 