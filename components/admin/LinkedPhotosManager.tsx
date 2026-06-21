'use client';
import { useEffect, useRef, useState, DragEvent } from 'react';
import { Upload, X } from 'lucide-react';
import adminApi from '@/lib/adminApi';
import type { ChurchPhoto } from '@/lib/types';

interface LinkedPhotosManagerProps {
  recordType: 'event' | 'sermon';
  recordId: number;
  label?: string;
}

export default function LinkedPhotosManager({ recordType, recordId, label = 'Linked Photos' }: LinkedPhotosManagerProps) {
  const [photos, setPhotos] = useState<ChurchPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const param = recordType === 'event' ? 'event_id' : 'sermon_id';

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.get<{ results?: ChurchPhoto[] } | ChurchPhoto[]>(`/gallery/?${param}=${recordId}`);
      const data = res.data;
      setPhotos(Array.isArray(data) ? data : data.results ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordId]);

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await adminApi.post('/upload/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await adminApi.post('/gallery/', {
          title: file.name.replace(/\.[^/.]+$/, ''),
          image: uploadRes.data.url,
          destination: recordType,
          [param]: recordId,
        });
      }
      await load();
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  }

  async function removePhoto(photo: ChurchPhoto) {
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    await adminApi.delete(`/gallery/${photo.id}/`);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative h-16 rounded-md overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(photo)}
                aria-label="Remove photo"
                className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 text-white rounded-full hover:bg-black/80"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-1.5 py-5 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          dragOver ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-300 hover:border-brand-blue/50'
        }`}
      >
        <Upload className="w-4 h-4 text-gray-400" />
        <p className="text-xs text-gray-500">
          {uploading ? 'Uploading…' : `Add Photos to This ${recordType === 'event' ? 'Event' : 'Sermon'}`}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) uploadFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
