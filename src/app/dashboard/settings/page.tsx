import { requireAdmin } from '@/lib/adminAccess'
import { getSchoolSettings, emblemUrl, DEFAULT_EMBLEM_FILE } from '@/lib/school-settings'
import SettingsForm from './SettingsForm'

export const dynamic = 'force-dynamic'

/**
 * Anne's page for the school's name and the emblem on the diploma.
 *
 * Jonathan, 2026-09-12: "I want mom to be able to edit the symbol in the middle ... she also needs
 * to be able to edit the name of the school ... make sure that you edit them in her dashboard."
 *
 * Gated exactly like the rest of the dashboard: requireAdmin() bounces anyone who is not Anne or
 * Jonathan. The settings are read from the database on every load, never from cache, so the page
 * always shows what is actually on the diploma right now.
 */
export default async function SettingsPage() {
  await requireAdmin()
  const settings = await getSchoolSettings()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">School Settings</h2>
        <p className="mt-1 text-sm text-gray-600">
          Change the name and the emblem that appear on the diploma. Nothing here affects the
          certificate&rsquo;s layout &mdash; only what it says and which symbol sits in the middle.
        </p>
      </div>

      <SettingsForm
        initialName={settings.schoolName}
        initialEmblemUrl={emblemUrl(settings.emblemPath)}
        defaultEmblemUrl={`/${DEFAULT_EMBLEM_FILE}`}
        usingDefault={!settings.emblemPath}
      />
    </div>
  )
}
