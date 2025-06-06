"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Upload, MoreHorizontal, Download, Trash2, ImageIcon, FileText, File } from "lucide-react"

// Mock data - replace with actual API calls
const files = [
  {
    id: "1",
    name: "product-headphones.jpg",
    type: "image",
    size: "245 KB",
    uploadDate: "2024-01-15",
    url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "product-tshirt.jpg",
    type: "image",
    size: "189 KB",
    uploadDate: "2024-01-14",
    url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    name: "product-camera.jpg",
    type: "image",
    size: "312 KB",
    uploadDate: "2024-01-13",
    url: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "4",
    name: "product-specs.pdf",
    type: "document",
    size: "1.2 MB",
    uploadDate: "2024-01-12",
    url: "#",
  },
  {
    id: "5",
    name: "category-banner.jpg",
    type: "image",
    size: "456 KB",
    uploadDate: "2024-01-11",
    url: "/placeholder.svg?height=100&width=100",
  },
]

export default function FilesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-5 h-5 text-emerald-400" />
      case "document":
        return <FileText className="w-5 h-5 text-blue-400" />
      default:
        return <File className="w-5 h-5 text-slate-400" />
    }
  }

  const handleFileUpload = () => {
    // Handle file upload logic here
    console.log("Uploading files:", selectedFiles)
    setIsUploadDialogOpen(false)
    setSelectedFiles(null)
  }

  const handleDeleteFile = (fileId: string) => {
    // Handle delete file logic here
    console.log("Deleting file:", fileId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">File Management</h1>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Upload New Files</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload" className="text-white">
                  Select Files
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="bg-slate-700 border-slate-600 text-white file:bg-emerald-500 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                />
                <p className="text-slate-400 text-sm mt-1">
                  Supported formats: JPG, PNG, PDF, DOC. Max size: 10MB per file.
                </p>
              </div>

              {selectedFiles && selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-white">Selected Files:</Label>
                  <div className="bg-slate-700 rounded-lg p-3 max-h-32 overflow-y-auto">
                    {Array.from(selectedFiles).map((file, index) => (
                      <div key={index} className="text-slate-300 text-sm">
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsUploadDialogOpen(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFileUpload}
                  disabled={!selectedFiles || selectedFiles.length === 0}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Upload Files
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Files</CardTitle>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500"
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <div key={file.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getFileIcon(file.type)}
                    <span className="text-sm text-slate-400">{file.type}</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white hover:bg-slate-600"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-800 border-slate-700">
                      <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {file.type === "image" && (
                  <div className="aspect-square bg-slate-600 rounded-lg mb-3 overflow-hidden">
                    <img src={file.url || "/placeholder.svg"} alt={file.name} className="w-full h-full object-cover" />
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-white text-sm truncate" title={file.name}>
                    {file.name}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-slate-400 text-xs">{file.size}</span>
                    <span className="text-slate-500 text-xs">{file.uploadDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-2">No files found</div>
              <div className="text-slate-500 text-sm">Try adjusting your search or upload some files</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
