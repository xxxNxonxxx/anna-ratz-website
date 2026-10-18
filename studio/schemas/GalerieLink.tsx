// Zeigt den fertigen Link (Adresse + Code) zum Kopieren an.

import { Button, Flex, Text, TextInput } from '@sanity/ui';
import { useState } from 'react';
import { useFormValue, type StringInputProps } from 'sanity';

// Adresse der Website. Nach dem Livegang in studio/.env setzen:
// SANITY_STUDIO_WEBSITE_URL=https://www.<domain>
const WEBSITE = (process.env.SANITY_STUDIO_WEBSITE_URL ?? 'http://localhost:5174').replace(/\/$/, '');

export function GalerieLink(_props: StringInputProps) {
  const slug = useFormValue(['slug', 'current']) as string | undefined;
  const code = useFormValue(['code']) as string | undefined;
  const [kopiert, setKopiert] = useState(false);

  if (!slug || !code) return <Text muted size={1}>Erst Name, Adresse und Code ausfüllen.</Text>;
  const link = `${WEBSITE}/galerie/${slug}?code=${encodeURIComponent(code)}`;
  return (
    <Flex gap={2}>
      <TextInput value={link} readOnly style={{ fontFamily: 'monospace' }} onFocus={(e) => e.currentTarget.select()} />
      <Button
        mode="ghost"
        text={kopiert ? 'Kopiert ✓' : 'Kopieren'}
        onClick={() => {
          void navigator.clipboard.writeText(link).then(() => {
            setKopiert(true);
            setTimeout(() => setKopiert(false), 2000);
          });
        }}
      />
    </Flex>
  );
}
