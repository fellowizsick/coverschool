/**
 * The school's own settings — the name on the diploma and the emblem in the middle.
 *
 * Jonathan, 2026-09-12: "I want mom to be able to edit the symbol in the middle to add a new one if
 * she would like ... she also needs to be able to edit the name of the school if she needs to later."
 *
 * Stored in the `school_settings` table (one row, id=1) with the emblem in the public `school-assets`
 * bucket, so Anne can change either from /dashboard/settings without a code change.
 *
 * Everything has a FALLBACK: if the table is missing, empty, or unreachable, the bundled constants
 * are used. A diploma must never fail to render because a settings row is absent.
 */
import fs from 'fs'
import path from 'path'
import { createAdminClient } from '@/lib/supabase/server'
import { SCHOOL_CONFIG } from '@/lib/constants'

export const DEFAULT_EMBLEM_FILE = 'lca-logo-transparent.png'
const BUCKET = 'school-assets'

export type SchoolSettings = {
  schoolName: string
  emblemPath: string | null        // object path inside the bucket, or null for the bundled file
}

const FALLBACK: SchoolSettings = { schoolName: SCHOOL_CONFIG.name, emblemPath: null }

/** Read the settings. Never throws — a broken settings read must not break a certificate. */
export async function getSchoolSettings(): Promise<SchoolSettings> {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('school_settings')
      .select('school_name, emblem_path')
      .eq('id', 1)
      .maybeSingle()
    if (!data) return FALLBACK
    return {
      schoolName: (data.school_name || '').trim() || FALLBACK.schoolName,
      emblemPath: data.emblem_path || null,
    }
  } catch {
    return FALLBACK
  }
}

/** A URL a browser can load: the uploaded emblem if there is one, otherwise the bundled file. */
export function emblemUrl(emblemPath: string | null): string {
  if (!emblemPath) return `/${DEFAULT_EMBLEM_FILE}`
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
  if (!base) return `/${DEFAULT_EMBLEM_FILE}`
  return `${base}/storage/v1/object/public/${BUCKET}/${emblemPath}`
}

/**
 * The emblem's bytes, for embedding in a PDF. Reads the uploaded emblem when there is one, else the
 * bundled file. Returns null rather than throwing — the emblem is decoration.
 */
export async function loadEmblemBytes(emblemPath: string | null): Promise<Uint8Array | null> {
  try {
    if (emblemPath) {
      const admin = createAdminClient()
      const { data } = await admin.storage.from(BUCKET).download(emblemPath)
      if (data) return new Uint8Array(await data.arrayBuffer())
    }
    const p = path.join(process.cwd(), 'public', DEFAULT_EMBLEM_FILE)
    if (fs.existsSync(p)) return new Uint8Array(fs.readFileSync(p))
  } catch { /* fall through — the emblem is optional */ }
  return null
}

/**
 * The school name, split for the arched headline. Kept here so the page and the PDF break it the same
 * way. A single long word has nothing to split, so it stays whole and the renderer scales it down.
 */
export function nameLines(name: string): string[] {
  return name.trim().split(/\s+/).filter(Boolean)
}
