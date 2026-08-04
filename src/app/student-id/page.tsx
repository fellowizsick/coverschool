'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type MouseEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import { SUBJECTS_BY_GRADE } from '@/lib/subjects'
import {
  AlertCircle,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Camera,
  CheckCircle2,
  Download,
  FileImage,
  GraduationCap,
  HardDrive,
  Hash,
  IdCard,
  Loader2,
  RefreshCw,
  Ruler,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MIN_DIMENSION = 300;
const MAX_DIMENSION = 2000;
const SCHOOL_YEAR = '2026-2027';

const HOLO_CSS = `
  @keyframes holoShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  @keyframes shineSweep {
    0% { transform: translateX(-180%) skewX(-18deg); }
    55%, 100% { transform: translateX(320%) skewX(-18deg); }
  }
  @keyframes sealSpin {
    to { transform: rotate(360deg); }
  }
  .id-card-tilt {
    transition: transform 0.25s ease;
    transform-style: preserve-3d;
    will-change: transform;
  }
  .holo-layer {
    background: linear-gradient(
      115deg,
      transparent 15%,
      rgba(45, 212, 191, 0.22) 32%,
      rgba(167, 139, 250, 0.18) 45%,
      rgba(250, 204, 21, 0.22) 58%,
      rgba(244, 114, 182, 0.16) 70%,
      transparent 85%
    );
    background-size: 280% 280%;
    animation: holoShift 7s ease-in-out infinite;
    mix-blend-mode: screen;
  }
  .holo-shine {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.28), transparent);
    animation: shineSweep 5.5s ease-in-out infinite;
  }
  .holo-seal {
    background: conic-gradient(from 0deg, #fde68a, #34d399, #38bdf8, #e879f9, #fde68a);
    animation: sealSpin 9s linear infinite;
  }
  .barcode {
    background: repeating-linear-gradient(
      90deg,
      rgba(255,255,255,0.92) 0 2px,
      transparent 2px 5px,
      rgba(255,255,255,0.92) 5px 6px,
      transparent 6px 10px,
      rgba(255,255,255,0.92) 10px 13px,
      transparent 13px 16px,
      rgba(255,255,255,0.92) 16px 17px,
      transparent 17px 21px
    );
  }
`;

interface AuthUser {
  email: string;
  name?: string;
  [key: string]: unknown;
}

interface Enrollment {
  enrollment_id?: string | number;
  id?: string | number;
  student_name?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  grade?: string | number;
  grade_level?: string | number;
  [key: string]: unknown;
}

function validateImageFile(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      resolve('Unsupported format. Please upload a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      resolve(
        `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed size is 5MB.`
      );
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (img.naturalWidth < MIN_DIMENSION || img.naturalHeight < MIN_DIMENSION) {
        resolve(
          `Image is too small (${img.naturalWidth}×${img.naturalHeight}px). Minimum dimension is ${MIN_DIMENSION}×${MIN_DIMENSION}px.`
        );
      } else if (img.naturalWidth > MAX_DIMENSION || img.naturalHeight > MAX_DIMENSION) {
        resolve(
          `Image is too large (${img.naturalWidth}×${img.naturalHeight}px). Maximum dimension is ${MAX_DIMENSION}×${MAX_DIMENSION}px.`
        );
      } else {
        resolve(null);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve('The selected file could not be read as an image.');
    };
    img.src = objectUrl;
  });
}

export default function StudentIdPage() {
  const router = useRouter();

  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadCount, setDownloadCount] = useState(0);
  const [reportData, setReportData] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const lastDownloadRef = useRef(0);
  const MAX_DOWNLOADS = 10;

  const cardRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const bothSidesRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/auth/user', { credentials: 'include' });
        if (!res.ok) {
          router.replace('/login?redirect=/student-id');
          return;
        }
        const data = await res.json();
        const authedUser: AuthUser | null = data?.user ?? data ?? null;
        if (!authedUser?.email) {
          router.replace('/login?redirect=/student-id');
          return;
        }
        if (cancelled) return;
        setUser(authedUser);

        try {
          const encRes = await fetch(
            `/api/enrollments?email=${encodeURIComponent(authedUser.email)}`,
            { credentials: 'include' }
          );
          if (encRes.ok) {
            const encData = await encRes.json();
            let record: Enrollment | null = null;
            if (Array.isArray(encData)) record = encData[0] ?? null;
            else if (Array.isArray(encData?.enrollments)) record = encData.enrollments[0] ?? null;
            else if (encData?.enrollment) record = encData.enrollment;
            else if (encData && typeof encData === 'object') record = encData;
            if (!cancelled && record) setEnrollment(record);
            // 🧠 Pull the latest report-card extraction (grades) for this student
            if (record?.id) {
              setReportLoading(true);
              try {
                const rc = await fetch(
                  `/api/report-card-snapshots?enrollmentId=${encodeURIComponent(record.id)}`,
                  { credentials: 'include' }
                );
                if (rc.ok) {
                  const rcData = await rc.json();
                  const snaps = rcData?.snapshots || [];
                  const withData = snaps.find((s: any) => s.extracted_json && s.extraction_status === 'done');
                  if (withData) setReportData(withData.extracted_json);
                }
              } catch {
                // Non-fatal: report card data is a bonus, not required
              } finally {
                if (!cancelled) setReportLoading(false);
              }
            }
          }
        } catch {
          // Enrollment lookup failure is non-fatal; fall back to account data.
        }
      } catch {
        router.replace('/login?redirect=/student-id');
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const processFile = useCallback(async (file: File | null | undefined) => {
    if (!file) return;
    setValidating(true);
    setPhotoError(null);
    const error = await validateImageFile(file);
    if (error) {
      setPhoto(null);
      setPhotoError(error);
      setValidating(false);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(typeof reader.result === 'string' ? reader.result : null);
      setValidating(false);
    };
    reader.onerror = () => {
      setPhotoError('Failed to read the file. Please try again.');
      setValidating(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0]);
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleTilt = (e: MouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1100px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  };

  const resetTilt = () => {
    if (tiltRef.current) {
      tiltRef.current.style.transform = 'perspective(1100px) rotateY(0deg) rotateX(0deg)';
    }
  };

  const studentName =
    enrollment?.student_name ||
    [enrollment?.first_name, enrollment?.last_name].filter(Boolean).join(' ').trim() ||
    enrollment?.name ||
    user?.name ||
    user?.email?.split('@')[0] ||
    'Student Name';

  const grade = enrollment?.grade ?? enrollment?.grade_level ?? '—';
  const studentId = enrollment?.enrollment_id ?? enrollment?.id ?? 'PENDING';

  const handleDownload = async () => {
    const target = bothSidesRef.current || cardRef.current;
    if (!target || !photo) return;

    // Rate limit: max 1 download per 3 seconds
    const now = Date.now();
    if (now - lastDownloadRef.current < 3000) {
      setDownloadError('Please wait a moment before downloading again.');
      setTimeout(() => setDownloadError(null), 2000);
      return;
    }

    // Max downloads per session
    if (downloadCount >= MAX_DOWNLOADS) {
      setDownloadError('Download limit reached for this session. Reload to reset.');
      return;
    }

    lastDownloadRef.current = now;
    setDownloading(true);
    setDownloadError(null);
    try {
      const dataUrl = await toPng(target, { pixelRatio: 3, cacheBust: true });
      const link = document.createElement('a');
      link.download = `LCA-Student-ID-${String(studentId).replace(/[^a-z0-9-]/gi, '_')}.png`;
      link.href = dataUrl;
      link.click();
      setDownloadCount((c) => c + 1);
    } catch {
      setDownloadError('Could not generate the PNG. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060a08]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl" />
            <Loader2 className="relative h-10 w-10 animate-spin text-emerald-400" />
          </div>
          <p className="text-sm font-medium text-zinc-400">Verifying your session…</p>
        </div>
      </div>
    );
  }

  const steps = [
    { icon: ShieldCheck, label: 'Account verified', done: true },
    { icon: Camera, label: 'Portrait uploaded', done: Boolean(photo) },
    { icon: Download, label: 'Download PNG', done: false },
  ];

  return (
    <div className="min-h-screen bg-[#060a08] text-zinc-100">
      <style>{HOLO_CSS}</style>

      {/* Light header band so the site navbar text is readable */}
      <div className="bg-emerald-50 pb-4">
        <div className="mx-auto max-w-6xl px-6 pt-20 md:pt-24">
          <div className="mb-2">
            <h2 className="text-xl font-black tracking-tight text-emerald-900 sm:text-2xl">
              Your Digital Student ID
            </h2>
            <p className="mt-0.5 text-sm text-emerald-700">
              Upload a photo to generate your official Larose Christian Academy ID card.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-white/60 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3 w-3" />
            {SCHOOL_YEAR} Academic Year
          </div>
        </div>
      </div>

      {/* Floating blurs background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#060a08]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-amber-500 shadow-lg">
            <IdCard className="h-4 w-4 text-emerald-950" />
          </div>
          <h1 className="text-sm font-bold text-white">Student ID</h1>
          <div className="ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="max-w-[160px] truncate text-xs font-medium text-zinc-300">
              {user?.email}
            </span>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 py-6">

        <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-2">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  step.done
                    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                    : 'border-white/10 bg-white/5 text-zinc-500'
                }`}
              >
                <step.icon className="h-3.5 w-3.5" />
                {step.label}
              </div>
              {i < steps.length - 1 && <div className="h-px w-6 bg-white/15" />}
            </div>
          ))}
        </div>

        {!enrollment && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs text-amber-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              No enrollment record was found for{' '}
              <span className="font-semibold">{user?.email}</span>. Your card will use
              account details as a fallback.
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <section className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Camera className="h-4 w-4 text-amber-300" />
              <h3 className="text-sm font-bold text-white">Portrait Photo</h3>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all ${
                dragging
                  ? 'border-emerald-400 bg-emerald-400/10'
                  : photo
                    ? 'border-emerald-400/40 bg-emerald-400/5'
                    : 'border-white/15 bg-white/[0.02] hover:border-amber-300/40 hover:bg-amber-300/5'
              }`}
            >
              {validating ? (
                <>
                  <Loader2 className="mb-3 h-8 w-8 animate-spin text-emerald-400" />
                  <p className="text-sm font-medium text-zinc-300">Validating photo…</p>
                  <p className="mt-1 text-xs text-zinc-500">Checking format, size and dimensions</p>
                </>
              ) : photo ? (
                <>
                  <div className="mb-3 h-20 w-20 overflow-hidden rounded-xl border-2 border-emerald-400/50 shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt="Uploaded portrait" className="h-full w-full object-cover" />
                  </div>
                  <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    Photo verified
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">Click or drop a new file to replace</p>
                </>
              ) : (
                <>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 transition-transform duration-300 group-hover:scale-110">
                    <Upload className="h-6 w-6 text-emerald-300" />
                  </div>
                  <p className="text-sm font-bold text-white">Drop your photo here</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    or{' '}
                    <span className="font-semibold text-amber-300 underline underline-offset-2">
                      browse files
                    </span>{' '}
                    from your device
                  </p>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleInputChange}
            />

            {photoError && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-400/10 p-3.5 text-xs text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{photoError}</p>
              </div>
            )}

            <ul className="mt-6 space-y-2.5 border-t border-white/5 pt-5">
              <li className="flex items-center gap-2.5 text-xs text-zinc-400">
                <FileImage className="h-4 w-4 shrink-0 text-emerald-400" />
                JPG, PNG or WebP format
              </li>
              <li className="flex items-center gap-2.5 text-xs text-zinc-400">
                <HardDrive className="h-4 w-4 shrink-0 text-emerald-400" />
                Maximum file size of 5MB
              </li>
              <li className="flex items-center gap-2.5 text-xs text-zinc-400">
                <Ruler className="h-4 w-4 shrink-0 text-emerald-400" />
                Between 300×300 and 2000×2000 pixels
              </li>
              <li className="flex items-center gap-2.5 text-xs text-zinc-400">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                Verified instantly in your browser — never uploaded first
              </li>
            </ul>

            {photo && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-zinc-300 transition hover:bg-white/10"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Replace photo
              </button>
            )}
          </section>

          <section className="flex flex-col">
            <div className="mb-4 flex items-center gap-2">
              <IdCard className="h-4 w-4 text-amber-300" />
              <h3 className="text-sm font-bold text-white">Live Preview</h3>
              {photo && (
                <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  <BadgeCheck className="h-3 w-3" />
                  Official
                </span>
              )}
            </div>

            <div className="flex w-full justify-center py-4 sm:py-6">
              {/* Demo preview when no photo uploaded */}
              {!photo && (
                <div className="relative w-full max-w-[540px] overflow-hidden rounded-2xl border border-amber-200/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]" style={{background:'linear-gradient(130deg,#02120b 0%,#05301f 30%,#0b5c38 52%,#6b5410 78%,#c9a227 100%)'}}>
                  <svg className="absolute inset-0 h-full w-full opacity-[0.13]" viewBox="0 0 540 340" fill="none">
                    <circle cx="480" cy="50" r="150" stroke="#fbbf24" strokeWidth="0.6" strokeDasharray="3 4" />
                    <circle cx="480" cy="50" r="115" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="2 5" />
                    <circle cx="50" cy="310" r="120" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="2 6" />
                    <circle cx="50" cy="310" r="88" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="3 5" />
                    <path d="M0 170 Q 135 120 270 170 T 540 170" stroke="#fde68a" strokeWidth="0.7" strokeDasharray="1 4" />
                    <path d="M0 192 Q 135 142 270 192 T 540 192" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="1 5" />
                  </svg>
                  <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />
                  <div className="relative z-10 flex h-full flex-col p-5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[2px] shadow-lg">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#032117]">
                          <span className="text-sm font-black tracking-widest text-amber-300">LCA</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold leading-tight tracking-wide text-amber-50">Larose Christian Academy</p>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-emerald-100/70">Official Student Identity</p>
                      </div>
                      <div className="ml-auto rounded-md border border-amber-200/30 bg-black/30 px-2.5 py-1 text-right">
                        <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-amber-200/70">School Year</p>
                        <p className="text-[11px] font-bold text-amber-100">2026-2027</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-1 gap-4">
                      <div className="relative shrink-0">
                        <div className="flex h-[150px] w-[120px] items-center justify-center overflow-hidden rounded-xl border-2 border-amber-300/70 bg-gradient-to-br from-emerald-900 to-emerald-950 shadow-lg">
                          <Camera className="h-8 w-8 text-amber-300/60" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-200/40 bg-[#032117] px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.18em] text-amber-200">Sample</div>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-emerald-100/60">Student Name</p>
                        <p className="text-[22px] font-bold leading-tight tracking-tight text-amber-50">John Doe</p>
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                          <div><p className="text-[7px] font-semibold uppercase tracking-[0.22em] text-emerald-100/50">Grade</p><p className="text-[13px] font-bold text-emerald-100">Kindergarten</p></div>
                          <div><p className="text-[7px] font-semibold uppercase tracking-[0.22em] text-emerald-100/50">Student ID</p><p className="text-[13px] font-bold font-mono text-emerald-100">LCA-2026-0001</p></div>
                          <div><p className="text-[7px] font-semibold uppercase tracking-[0.22em] text-emerald-100/50">Enrolled</p><p className="text-[11px] font-bold text-emerald-100">August 2026</p></div>
                          <div><p className="text-[7px] font-semibold uppercase tracking-[0.22em] text-emerald-100/50">Status</p><p className="text-[11px] font-bold text-emerald-100">Active</p></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-4">
                    <p className="text-[6px] font-medium tracking-[0.15em] text-amber-200/40">SAMPLE ID &mdash; Upload your photo to create yours</p>
                  </div>
                </div>
              )}
              {photo ? (
                <div
                  ref={tiltRef}
                  onMouseMove={handleTilt}
                  onMouseLeave={resetTilt}
                  className="id-card-tilt"
                >
                  <div ref={bothSidesRef} className="flex w-full max-w-[540px] flex-col gap-5">
                  <div
                    ref={cardRef}
                    className="relative w-full max-w-[540px] overflow-hidden rounded-2xl border border-amber-200/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]"
                    style={{
                      background:
                        'linear-gradient(130deg, #02120b 0%, #05301f 30%, #0b5c38 52%, #6b5410 78%, #c9a227 100%)',
                    }}
                  >
                    <svg
                      className="absolute inset-0 h-full w-full opacity-[0.13]"
                      viewBox="0 0 540 340"
                      fill="none"
                    >
                      <circle cx="480" cy="50" r="150" stroke="#fbbf24" strokeWidth="0.6" strokeDasharray="3 4" />
                      <circle cx="480" cy="50" r="115" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="2 5" />
                      <circle cx="480" cy="50" r="82" stroke="#fbbf24" strokeWidth="0.6" strokeDasharray="4 3" />
                      <circle cx="50" cy="310" r="120" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="2 6" />
                      <circle cx="50" cy="310" r="88" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="3 5" />
                      <path d="M0 170 Q 135 120 270 170 T 540 170" stroke="#fde68a" strokeWidth="0.7" strokeDasharray="1 4" />
                      <path d="M0 192 Q 135 142 270 192 T 540 192" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="1 5" />
                    </svg>

                    <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />

                    <div className="relative z-10 flex h-full flex-col p-5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[2px] shadow-lg">
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#032117]">
                            <span className="text-sm font-black tracking-widest text-amber-300">
                              LCA
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[13px] font-bold leading-tight tracking-wide text-amber-50">
                            Larose Christian Academy
                          </p>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-emerald-100/70">
                            Official Student Identity
                          </p>
                        </div>
                        <div className="ml-auto rounded-md border border-amber-200/30 bg-black/30 px-2.5 py-1 text-right">
                          <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-amber-200/70">
                            School Year
                          </p>
                          <p className="text-[11px] font-bold text-amber-100">{SCHOOL_YEAR}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-1 gap-4">
                        <div className="relative shrink-0">
                          <div className="h-[150px] w-[120px] overflow-hidden rounded-xl border-2 border-amber-300/70 bg-black/40 shadow-lg">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo}
                              alt="Student portrait"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-200/40 bg-[#032117] px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.18em] text-amber-200">
                            Verified
                          </div>
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div>
                            <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-emerald-100/60">
                              Student Name
                            </p>
                            <p className="truncate text-xl font-black tracking-wide text-white drop-shadow-md">
                              {studentName}
                            </p>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
                            <div>
                              <p className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-emerald-100/60">
                                <GraduationCap className="h-3 w-3" />
                                Grade
                              </p>
                              <p className="mt-0.5 text-sm font-bold text-amber-100">{grade}</p>
                            </div>
                            <div>
                              <p className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-emerald-100/60">
                                <CalendarDays className="h-3 w-3" />
                                Year
                              </p>
                              <p className="mt-0.5 text-sm font-bold text-amber-100">
                                {SCHOOL_YEAR}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-emerald-100/60">
                                <Hash className="h-3 w-3" />
                                Student ID
                              </p>
                              <p className="mt-0.5 font-mono text-sm font-bold tracking-wider text-white">
                                {studentId}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex items-end justify-between border-t border-white/10 pt-2.5">
                        <div>
                          <div className="barcode h-7 w-44 opacity-90" />
                          <p className="mt-1 font-mono text-[9px] tracking-[0.3em] text-white/70">
                            {studentId}
                          </p>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="text-right">
                            <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-emerald-100/60">
                              Valid Through
                            </p>
                            <p className="text-[11px] font-bold text-amber-100">June 2027</p>
                          </div>
                          <div className="holo-seal h-9 w-9 rounded-full p-[2px] opacity-90">
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#032117]">
                              <BadgeCheck className="h-4 w-4 text-amber-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="holo-layer pointer-events-none absolute inset-0 z-20" />
                    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl">
                      <div className="holo-shine absolute inset-y-0 w-1/3" />
                    </div>
                  </div>

                  {/* 🔄 BACK SIDE — report card data scanned from uploads */}
                  <div
                    ref={backRef}
                    className="relative w-full max-w-[540px] overflow-hidden rounded-2xl border border-amber-200/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]"
                    style={{
                      background:
                        'linear-gradient(130deg, #02120b 0%, #05301f 30%, #0b5c38 52%, #6b5410 78%, #c9a227 100%)',
                    }}
                  >
                    <svg
                      className="absolute inset-0 h-full w-full opacity-[0.1]"
                      viewBox="0 0 540 340"
                      fill="none"
                    >
                      <circle cx="480" cy="50" r="150" stroke="#fbbf24" strokeWidth="0.6" strokeDasharray="3 4" />
                      <circle cx="50" cy="310" r="120" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="2 6" />
                      <path d="M0 170 Q 135 120 270 170 T 540 170" stroke="#fde68a" strokeWidth="0.7" strokeDasharray="1 4" />
                    </svg>
                    <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />
                    <div className="relative z-10 flex h-full flex-col p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-amber-200/80">
                          Academic Record
                        </p>
                        <div className="rounded-md border border-amber-200/30 bg-black/30 px-2.5 py-1 text-right">
                          <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-amber-200/70">
                            {reportData?.term || 'Term'}
                          </p>
                          <p className="text-[11px] font-bold text-amber-100">
                            {reportData?.schoolYear || SCHOOL_YEAR}
                          </p>
                        </div>
                      </div>

                      {reportLoading ? (
                        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
                          <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
                          Reading report card…
                        </div>
                      ) : reportData?.subjects?.length ? (
                        <>
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            {reportData.subjects.map((s: any, i: number) => (
                              <div
                                key={i}
                                className="flex items-center justify-between rounded-lg border border-white/10 bg-black/25 px-3 py-2"
                              >
                                <span className="min-w-0 truncate text-[11px] font-semibold text-emerald-50">
                                  {s.name}
                                </span>
                                <span className="ml-2 rounded-md bg-gradient-to-br from-amber-300 to-yellow-500 px-2 py-0.5 text-[11px] font-black text-emerald-950">
                                  {s.grade}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-3">
                            {reportData.gpa && (
                              <div>
                                <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-emerald-100/60">GPA</p>
                                <p className="text-lg font-black text-amber-100">{reportData.gpa}</p>
                              </div>
                            )}
                            {reportData.attendance && (
                              <div>
                                <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-emerald-100/60">Attendance</p>
                                <p className="text-lg font-black text-amber-100">{reportData.attendance}</p>
                              </div>
                            )}
                          </div>
                          {reportData.comments && (
                            <p className="mt-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-[10px] italic leading-relaxed text-emerald-50/80">
                              “{reportData.comments}”
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="mt-4 rounded-lg border border-white/10 bg-black/20 px-4 py-6 text-center">
                          <p className="text-xs font-semibold text-zinc-300">No report card scanned yet</p>
                          <p className="mt-1 text-[10px] text-zinc-500">
                            Upload a report card in the Parent Portal and it appears here automatically.
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-2.5">
                        <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-emerald-100/50">
                          Larose Christian Academy
                        </p>
                        <p className="font-mono text-[8px] tracking-[0.2em] text-white/40">
                          {studentId}
                        </p>
                      </div>
                    </div>
                    <div className="holo-layer pointer-events-none absolute inset-0 z-20" />
                  </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-[240px] w-full max-w-[540px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] sm:h-[340px]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                    <Camera className="h-7 w-7 text-zinc-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-zinc-400">No photo uploaded yet</p>
                    <p className="mt-1 text-xs text-zinc-600">
                      Upload a portrait to reveal your official ID card
                    </p>
                  </div>
                </div>
              )}
            </div>

            {photo && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-zinc-400">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  Holographic Security
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-zinc-400">
                  <BadgeCheck className="h-3 w-3 text-amber-300" />
                  Official Credential
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-zinc-400">
                  <CalendarDays className="h-3 w-3 text-emerald-400" />
                  {SCHOOL_YEAR}
                </span>
              </div>
            )}

            <div className="mt-6 flex flex-col items-center gap-3">
              <button
                onClick={handleDownload}
                disabled={!photo || downloading || downloadCount >= MAX_DOWNLOADS}
                className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 px-8 py-3.5 text-sm font-black text-emerald-950 shadow-[0_10px_40px_-10px_rgba(251,191,36,0.5)] transition-all hover:shadow-[0_15px_50px_-10px_rgba(251,191,36,0.7)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                )}
                {downloading ? 'Rendering PNG…' : 'Download ID Card'}
              </button>
              <p className="text-[11px] text-zinc-600">
                Exported as a high-resolution PNG — front &amp; back sides together
              </p>
              {downloadError && (
                <div className="flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-400/10 px-3.5 py-2 text-xs text-red-300">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {downloadError}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Course of Study */}
        {grade && typeof grade === 'string' && SUBJECTS_BY_GRADE[grade] && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-300" />
              <h3 className="text-sm font-bold text-white">Course of Study — {grade}</h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {SUBJECTS_BY_GRADE[grade].map((subject) => (
                <div
                  key={subject}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{subject}</p>
                    <p className="text-[10px] text-zinc-500">In Progress</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}