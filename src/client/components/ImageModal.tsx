import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageType: string | null;
}

const ImageModal = ({ isOpen, onClose, imageUrl, imageType }: ImageModalProps) => {
  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[90vw] p-0 overflow-hidden bg-black/95 border-slate-800">
        <DialogHeader className="p-4 bg-slate-900/50 absolute top-0 left-0 right-0 z-10 backdrop-blur-sm border-b border-white/10">
          <DialogTitle className="text-white capitalize flex items-center gap-2">
            {imageType} Shot
          </DialogTitle>
        </DialogHeader>
        <div className="relative aspect-square w-full flex items-center justify-center p-4 pt-16">
          <img
            src={imageUrl}
            alt={`${imageType} preview`}
            className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
