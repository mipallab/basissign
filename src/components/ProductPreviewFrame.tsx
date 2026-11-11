"use client";

import type {
  ProductGalleryPhoto,
  ProductGalleryVideo,
} from "@/data/catalog";
import { ProductGallerySlider } from "./ProductGallerySlider";

interface ProductPreviewFrameProps {
  productName: string;
  shortName: string;
  supportsDayNight: boolean;
  gallery: ProductGalleryPhoto[];
  video: ProductGalleryVideo;
}

export function ProductPreviewFrame({
  productName,
  shortName,
  supportsDayNight,
  gallery,
  video,
}: ProductPreviewFrameProps) {
  return (
    <ProductGallerySlider
      productName={productName}
      shortName={shortName}
      supportsDayNight={supportsDayNight}
      gallery={gallery}
      video={video}
      priority
      sizes="(max-width: 1024px) 100vw, 52vw"
    />
  );
}
