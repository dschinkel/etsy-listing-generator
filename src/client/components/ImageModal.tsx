import React from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";
import Download from "yet-another-react-lightbox/plugins/download";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: { url: string; type: string }[];
  initialIndex: number;
}

const ImageModal = ({ isOpen, onClose, images, initialIndex }: ImageModalProps) => {
  if (!images || images.length === 0) return null;

  const slides = images.map(img => ({
    src: img.url,
    title: `${img.type} Shot`,
    description: `Shot Type: ${img.type}`
  }));

  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      index={initialIndex}
      slides={slides}
      plugins={[Zoom, Thumbnails, Captions, Counter, Download]}
      captions={{ showToggle: true, descriptionMaxLines: 3 }}
      thumbnails={{ position: "bottom", width: 120, height: 80, border: 1, borderRadius: 4, padding: 4, gap: 16 }}
    />
  );
};

export default ImageModal;
