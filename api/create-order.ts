import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs';
import crypto from 'crypto';

import { PackType, ImageStyle } from '../types';

/* =========================
   ⚙️ Config Vercel
========================= */
export const config = {
  api: {
    bodyParser: false,
  },
};

/* =========================
   🔐 Supabase (SERVICE ROLE)
   👉 LAS KEYS VAN SOLO EN VERCEL
========================= */
if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* =========================
   💰 Precio por pack
========================= */
const PRICE_BY_PACK: Record<PackType, number> = {
  basico: 25,
  emocion: 39,
  artistico: 49,
};

/* =========================
   🧰 Helpers
========================= */
const getField = (field: any) =>
  Array.isArray(field) ? field[0] : field;

/* =========================
   🚀 Handler
========================= */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({ multiples: true });

    const { fields, files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    /* =========================
       📥 Campos
    ========================= */
    const pack = getField(fields.pack) as PackType;
    const email = getField(fields.email) as string;
    const title = getField(fields.title) as string;
    const from_name = getField(fields.from_name) as string;
    const to_name = getField(fields.to_name) as string;
    const story = getField(fields.story) as string;
    const occasion = getField(fields.occasion) as string;
    const musicalStyle = getField(fields.musicalStyle) as string;
    const voice = getField(fields.voice) as string;

    if (!PRICE_BY_PACK[pack]) {
      return res.status(400).json({ error: 'Invalid pack' });
    }

    const price = PRICE_BY_PACK[pack];

    /* =========================
       1️⃣ Crear pedido
    ========================= */
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        email,
        pack,
        price,
        title,
        from_name,
        to_name,
        story,
        occasion,
        musical_style: musicalStyle,
        voice,
        status: 'pendiente',
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('❌ Order insert error:', orderError);
      return res.status(500).json({ error: 'Order creation failed' });
    }

    const orderId = order.id;

    /* =========================
       2️⃣ Fotos
    ========================= */
    const uploadedFiles = files.photos
      ? Array.isArray(files.photos)
        ? files.photos
        : [files.photos]
      : [];

    const styles: ImageStyle[] =
      pack === 'artistico' && fields.imageStyles
        ? JSON.parse(getField(fields.imageStyles))
        : [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      if (!file || Array.isArray(file)) continue;

      const buffer = fs.readFileSync(file.filepath);
      const ext = file.originalFilename?.split('.').pop() || 'jpg';
      const filePath = `${orderId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('order_photos')
        .upload(filePath, buffer, {
          contentType: file.mimetype || undefined,
        });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        return res.status(500).json({ error: 'Photo upload failed' });
      }

      const { error: photoError } = await supabase
        .from('order_photos')
        .insert({
          order_id: orderId,
          file_path: filePath,
          image_style: styles[i] ?? null,
        });

      if (photoError) {
        console.error('❌ Photo DB error:', photoError);
        return res.status(500).json({ error: 'Photo DB insert failed' });
      }
    }

    /* =========================
       ✅ OK
    ========================= */
    return res.status(200).json({
      success: true,
      orderId,
    });
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
