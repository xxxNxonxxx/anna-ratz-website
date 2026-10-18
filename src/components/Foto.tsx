import type { ImgHTMLAttributes } from 'react';
import { useSprache } from '../i18n/sprache.ts';
import type { Foto as FotoDaten } from '../inhalt/typen.ts';

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  foto: FotoDaten | null | undefined;
  /** Bildbreite im Layout, damit der Browser die passende Größe lädt. */
  sizes?: string;
  sofort?: boolean;
}

export function Foto({ foto, sizes = '(min-width: 1024px) 50vw, 100vw', sofort, className = '', style, ...rest }: Props) {
  const { l } = useSprache();
  if (!foto) return null;
  return (
    <img
      src={foto.url(1800)}
      srcSet={[800, 1200, 1800, 2400].map((w) => `${foto.url(w)} ${w}w`).join(', ')}
      sizes={sizes}
      alt={l(foto.alt)}
      width={foto.breite}
      height={foto.hoehe}
      loading={sofort ? 'eager' : 'lazy'}
      decoding="async"
      className={`object-cover ${className}`}
      style={{ objectPosition: foto.position, ...style }}
      {...rest}
    />
  );
}
