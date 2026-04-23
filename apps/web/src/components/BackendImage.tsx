import Image, { ImageLoaderProps, ImageProps } from "next/image";
import { MangaSourceType } from "@mangarr/shared";

const proxyUrls = ["https://cdn.readdetectiveconan.com"];
const backendProxyUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/image-proxy`;

const isProxyUrl = (url: string) =>
  proxyUrls.some((proxyUrl) => url.includes(proxyUrl));

const imageLoader =
  (source?: MangaSourceType) =>
  ({ src, width, quality }: ImageLoaderProps) => {
    if (!isProxyUrl(src) || !source)
      return `${src}?w=${width}&q=${quality || 75}`;

    return `${backendProxyUrl}?src=${encodeURIComponent(
      src,
    )}&source=${encodeURIComponent(source)}&w=${width}&q=${quality || 75}`;
  };

const BackendImage = ({
  src,
  alt,
  sizes,
  fill,
  className,
  source,
}: Omit<ImageProps, "loader"> & {
  source?: MangaSourceType;
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      fill={fill}
      className={className}
      loader={imageLoader(source)}
    />
  );
};

export default BackendImage;
