import { defineCollection, z } from 'astro:content';

// ---------------------------------------------------------------------------
// Schémas des contenus éditables depuis le panneau d'administration Decap CMS
// (https://www.mon-site.fr/admin)
// ---------------------------------------------------------------------------

const spectacles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    heroImage: z.string(),
    public: z.string(),
    genre: z.string(),
    artistes: z.string(),
    duree: z.string(),
    credits: z.string().optional(),
    video: z.string().optional(),
    dossier: z.string().optional(),
    residences: z.array(z.string()).default([]),
    joue: z.array(z.string()).default([]),
    galerie: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

const prestations = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    icon: z.string().default('sparkle'),
    image: z.string().optional(),
    order: z.number().default(0),
  }),
});

const ateliers = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publics: z.string().default(''),
    image: z.string().optional(),
    order: z.number().default(0),
  }),
});

const partenaires = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    url: z.string().optional(),
  }),
});

const settings = defineCollection({
  type: 'content',
  schema: z.object({
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
  }),
});

export const collections = { spectacles, prestations, ateliers, partenaires, settings };
