'use client';
import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';

const MINISTRY_OPTIONS = [
  'Worship / Music',
  'Children\'s Ministry',
  'Youth Ministry',
  'Men\'s Fellowship',
  'Women\'s Fellowship',
  'Outreach / Evangelism',
  'Prayer Ministry',
  'Ushering / Protocol',
  'Media & AV Team',
  'Administration',
];

interface Props {
  memberType: 'new' | 'existing';
}

type SubmitStatus = 'idle' | 'uploading' | 'submitting' | 'success' | 'error';

const base = () => process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

const fieldCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-blue placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm';
const selectCls = `${fieldCls} cursor-pointer`;
const labelCls = 'block text-sm font-medium text-brand-blue mb-1.5';
const sectionHeadingCls = 'font-display text-lg font-semibold text-brand-blue mb-4 pb-2 border-b border-brand-gold/30 flex items-center gap-2';

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className={sectionHeadingCls}>{children}</h3>;
}

export default function MemberRegistrationForm({ memberType }: Props) {
  // Photo
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Personal
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');

  // Address
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Professional
  const [occupation, setOccupation] = useState('');
  const [employer, setEmployer] = useState('');

  // Church
  const [baptismStatus, setBaptismStatus] = useState('');
  const [ministryInterests, setMinistryInterests] = useState<string[]>([]);

  // Emergency contact
  const [ecName, setEcName] = useState('');
  const [ecPhone, setEcPhone] = useState('');
  const [ecRelationship, setEcRelationship] = useState('');

  // Meta
  const [howHeard, setHowHeard] = useState('');
  const [notes, setNotes] = useState('');

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function toggleMinistry(ministry: string) {
    setMinistryInterests((prev) =>
      prev.includes(ministry)
        ? prev.filter((m) => m !== ministry)
        : [...prev, ministry],
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitStatus('uploading');

    let photoUrl = '';
    if (photoFile) {
      try {
        const fd = new FormData();
        fd.append('photo', photoFile);
        const res = await fetch(`${base()}/members/photo/`, { method: 'POST', body: fd });
        if (!res.ok) throw new Error();
        const data = await res.json();
        photoUrl = data.url;
      } catch {
        setSubmitStatus('error');
        return;
      }
    }

    setSubmitStatus('submitting');
    try {
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        date_of_birth: dob || null,
        gender: gender || '',
        marital_status: maritalStatus || '',
        photo: photoUrl,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        occupation: occupation.trim(),
        employer: employer.trim(),
        baptism_status: baptismStatus || '',
        ministry_interests: ministryInterests.join(', '),
        emergency_contact_name: ecName.trim(),
        emergency_contact_phone: ecPhone.trim(),
        emergency_contact_relationship: ecRelationship.trim(),
        member_type: memberType,
        how_heard: howHeard || '',
        notes: notes.trim(),
      };
      const res = await fetch(`${base()}/members/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-16" role="status" aria-live="polite">
        <div className="w-16 h-16 rounded-full bg-brand-gold/20 flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-brand-gold" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="font-display text-3xl font-bold text-brand-blue mb-3">
          Welcome to the Family!
        </p>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          Your registration has been received. We are so glad to have you with us at
          The SpringHouse Church. Our team will be in touch soon.
        </p>
      </div>
    );
  }

  const isLoading = submitStatus === 'uploading' || submitStatus === 'submitting';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10">

      {/* ── 1. PHOTO ─────────────────────────────────────────── */}
      <div>
        <SectionHeading>Your Photo</SectionHeading>
        <div className="flex items-center gap-6">
          <div
            className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-brand-gold/40 bg-amber-50 flex-shrink-0 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload photo"
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          >
            {photoPreview ? (
              <Image src={photoPreview} alt="Photo preview" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-gold/60">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm border border-brand-blue text-brand-blue rounded-full hover:bg-brand-blue hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              {photoPreview ? 'Change Photo' : 'Upload Photo'}
            </button>
            <p className="text-xs text-gray-400 mt-2">JPEG, PNG or WebP · max 5 MB · optional</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={handlePhotoChange}
            aria-label="Photo file input"
          />
        </div>
      </div>

      {/* ── 2. PERSONAL DETAILS ──────────────────────────────── */}
      <div>
        <SectionHeading>Personal Details</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="mr-first-name" className={labelCls}>First Name</label>
            <input id="mr-first-name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" placeholder="First name" className={fieldCls} />
          </div>
          <div>
            <label htmlFor="mr-last-name" className={labelCls}>Last Name</label>
            <input id="mr-last-name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" placeholder="Last name" className={fieldCls} />
          </div>
          <div>
            <label htmlFor="mr-email" className={labelCls}>Email Address</label>
            <input id="mr-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="your@email.com" className={fieldCls} />
          </div>
          <div>
            <label htmlFor="mr-phone" className={labelCls}>Phone Number</label>
            <input id="mr-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="+234 000 000 0000" className={fieldCls} />
          </div>
          <div>
            <label htmlFor="mr-dob" className={labelCls}>Date of Birth</label>
            <input id="mr-dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={fieldCls} />
          </div>
          <div>
            <label htmlFor="mr-gender" className={labelCls}>Gender</label>
            <select id="mr-gender" value={gender} onChange={(e) => setGender(e.target.value)} className={selectCls}>
              <option value="">Select…</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="mr-marital" className={labelCls}>Marital Status</label>
            <select id="mr-marital" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className={selectCls}>
              <option value="">Select…</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="widowed">Widowed</option>
              <option value="divorced">Divorced</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. ADDRESS ───────────────────────────────────────── */}
      <div>
        <SectionHeading>Home Address</SectionHeading>
        <div className="space-y-5">
          <div>
            <label htmlFor="mr-address" className={labelCls}>Street Address</label>
            <input id="mr-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" placeholder="House / flat number, street name" className={fieldCls} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="mr-city" className={labelCls}>City</label>
              <input id="mr-city" type="text" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" placeholder="e.g. Calabar" className={fieldCls} />
            </div>
            <div>
              <label htmlFor="mr-state" className={labelCls}>State / Province</label>
              <input id="mr-state" type="text" value={state} onChange={(e) => setState(e.target.value)} autoComplete="address-level1" placeholder="e.g. Cross River" className={fieldCls} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. PROFESSIONAL ──────────────────────────────────── */}
      <div>
        <SectionHeading>Work & Profession</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="mr-occupation" className={labelCls}>Occupation</label>
            <input id="mr-occupation" type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} autoComplete="organization-title" placeholder="e.g. Teacher, Engineer, Student" className={fieldCls} />
          </div>
          <div>
            <label htmlFor="mr-employer" className={labelCls}>Employer / School</label>
            <input id="mr-employer" type="text" value={employer} onChange={(e) => setEmployer(e.target.value)} autoComplete="organization" placeholder="Where you work or study" className={fieldCls} />
          </div>
        </div>
      </div>

      {/* ── 5. CHURCH ────────────────────────────────────────── */}
      <div>
        <SectionHeading>Church Life</SectionHeading>
        <div className="space-y-6">
          <div>
            <label htmlFor="mr-baptism" className={labelCls}>Baptism Status</label>
            <select id="mr-baptism" value={baptismStatus} onChange={(e) => setBaptismStatus(e.target.value)} className={selectCls}>
              <option value="">Select…</option>
              <option value="yes">Yes, I have been baptised</option>
              <option value="no">Not yet</option>
              <option value="na">N/A</option>
            </select>
          </div>
          <div>
            <p className={labelCls}>Ministry Interests <span className="text-gray-400 font-normal">(select all that apply)</span></p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              {MINISTRY_OPTIONS.map((m) => {
                const checked = ministryInterests.includes(m);
                return (
                  <label
                    key={m}
                    className={`flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 border text-sm transition-colors ${
                      checked
                        ? 'border-brand-gold bg-brand-gold/10 text-brand-blue font-medium'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-brand-gold/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleMinistry(m)}
                      className="accent-brand-gold w-4 h-4 flex-shrink-0"
                    />
                    {m}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. EMERGENCY CONTACT ─────────────────────────────── */}
      <div>
        <SectionHeading>Emergency Contact</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="mr-ec-name" className={labelCls}>Contact Name</label>
            <input id="mr-ec-name" type="text" value={ecName} onChange={(e) => setEcName(e.target.value)} placeholder="Full name" className={fieldCls} />
          </div>
          <div>
            <label htmlFor="mr-ec-phone" className={labelCls}>Contact Phone</label>
            <input id="mr-ec-phone" type="tel" value={ecPhone} onChange={(e) => setEcPhone(e.target.value)} placeholder="+234 000 000 0000" className={fieldCls} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="mr-ec-rel" className={labelCls}>Relationship</label>
            <input id="mr-ec-rel" type="text" value={ecRelationship} onChange={(e) => setEcRelationship(e.target.value)} placeholder="e.g. Spouse, Parent, Sibling" className={fieldCls} />
          </div>
        </div>
      </div>

      {/* ── 7. FINAL DETAILS ─────────────────────────────────── */}
      <div>
        <SectionHeading>A Little More</SectionHeading>
        <div className="space-y-5">
          <div>
            <label htmlFor="mr-how-heard" className={labelCls}>How did you hear about us?</label>
            <select id="mr-how-heard" value={howHeard} onChange={(e) => setHowHeard(e.target.value)} className={selectCls}>
              <option value="">Select…</option>
              <option value="friend_family">Friend or Family</option>
              <option value="social_media">Social Media</option>
              <option value="website">Church Website</option>
              <option value="walked_in">Walked In</option>
              <option value="church_event">Church Event</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="mr-notes" className={labelCls}>Anything else you'd like us to know?</label>
            <textarea
              id="mr-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Prayer requests, special needs, questions…"
              className={`${fieldCls} resize-none`}
            />
          </div>
        </div>
      </div>

      {submitStatus === 'error' && (
        <p role="alert" className="text-sm text-brand-red text-center">
          Something went wrong. Please check your connection and try again.
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-brand-blue text-white font-display font-semibold uppercase tracking-widest text-sm rounded-full hover:bg-brand-blue/80 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:opacity-60"
      >
        {submitStatus === 'uploading'
          ? 'Uploading photo…'
          : submitStatus === 'submitting'
          ? 'Registering…'
          : 'Complete Registration'}
      </button>

      <p className="text-center text-xs text-gray-400">
        All fields are optional — share only what you are comfortable with.
      </p>
    </form>
  );
}
