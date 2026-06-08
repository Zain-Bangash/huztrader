'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, Car } from 'lucide-react'

interface CarGalleryProps {
  images: string[]
  alt: string
}

export function CarGallery({ images, alt }: CarGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/10] bg-gray-100 rounded-xl flex items-center justify-center">
        <Car size={56} className="text-gray-300" />
      </div>
    )
  }

  const prev = () => setActiveIdx((i) => (i - 1 + images.length) % images.length)
  const next = () => setActiveIdx((i) => (i + 1) % images.length)

  return (
    <>
      {/* Main image */}
      <div className="relative aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden cursor-zoom-in"
        onClick={() => setLightbox(true)}>
        <Image
          src={images[activeIdx]}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {activeIdx + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                i === activeIdx ? 'border-[#e8b84b]' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image src={img} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
            onClick={() => setLightbox(false)}
          >
            <X size={20} />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
          <div className="relative w-full max-w-4xl max-h-[80vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[activeIdx]}
              alt={alt}
              width={1200}
              height={800}
              className="object-contain w-full h-full max-h-[80vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  )
}
