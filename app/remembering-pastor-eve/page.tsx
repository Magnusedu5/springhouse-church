import type { Metadata } from 'next';
import HeroBackground from '@/components/HeroBackground';
import FadedBackgroundPhoto from '@/components/FadedBackgroundPhoto';
import MemorialPortrait from '@/components/MemorialPortrait';
import MemorialGallery from '@/components/MemorialGallery';
import FadeIn from '@/components/FadeIn';
import { Reveal, ScriptureReveal, CascadeGroup, CascadeItem } from '@/components/motion';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thespringhouse.org';

const FULL_NAME = 'Associate Professor Ofonime Eve Mboso';
const DESCRIPTORS = 'Scholar · Biochemist · Minister · Intercessor · Wife and Mother';

export const metadata: Metadata = {
  title: 'Remembering Pastor Eve Mboso — The SpringHouse Church',
  description:
    'Celebrating the life of Associate Professor Ofonime Eve Mboso (1977–2026) — Associate Lead Pastor of The SpringHouse Church, Associate Professor of Biochemistry, scholar, minister, intercessor, wife and mother.',
  openGraph: {
    title: 'Remembering Pastor Eve Mboso — The SpringHouse Church',
    description:
      'Celebrating the life of Associate Professor Ofonime Eve Mboso (1977–2026) — scholar, biochemist, minister, intercessor, wife and mother.',
    url: `${SITE_URL}/remembering-pastor-eve`,
  },
};

// ── Her story, drawn from the funeral programme ───────────────────────────────

const STORY: { heading: string; paragraphs: string[] }[] = [
  {
    heading: 'Early Life and Education',
    paragraphs: [
      'Ofonime Eve Mboso was born on February 5, 1977, in Calabar, Cross River State, to Dr. Anietie Bassey and Mrs. Grace Anietie Bassey, both of blessed memory. She hailed from Otung Akpa Isemin in Etinan Local Government Area of Akwa Ibom State.',
      'Her pursuit of excellence began early. She attended Aunty Margaret International School, Calabar, obtaining her First School Leaving Certificate in November 1988, then proceeded to Federal Government Girls’ College, Calabar, where she earned the West African Senior School Certificate in 1994.',
      'Her journey in biochemistry began at the University of Calabar, where she earned a B.Sc. (Hons.) in January 2000. After completing the National Youth Service Corps, she returned to her alma mater for postgraduate studies — a Postgraduate Diploma in Medical Microbiology (2005–2006), a Master of Science in Biochemistry (2006–2010), and a PhD in Biochemistry in 2014.',
    ],
  },
  {
    heading: 'The Scholar and Scientist',
    paragraphs: [
      'Dr. Eve Mboso’s academic journey was one of steady ascent and service to the University of Calabar and to her generation. She began in Administration in the Faculty of Education in 2008 before following her calling to the sciences. In 2011 she joined the Department of Biochemistry as an Assistant Lecturer. Her dedication to research and teaching earned her promotion to Lecturer II in 2014, Senior Lecturer in 2020, and Associate Professor in March 2026.',
      'Her peers knew her as a rigorous, hardworking and thorough scholar, deeply committed to raising students ready to learn and work independently. She was a scholar who refused to choose between the laboratory and the pulpit, between the microscope and the altar. In the lecture halls she shaped minds with clarity and rigour, simplifying complex biochemical equations to ease her students’ understanding. Her commitment to knowledge was never for personal acclaim, but to equip the next generation to think critically and serve honestly.',
      'Her scholarship gained international recognition when she was awarded the TWAS-ICCBS Research Fellowship in 2018. She carried out postdoctoral research at the H. E. J. Research Institute, University of Karachi, Pakistan, honing expertise in fluorescence microscopy, cell culture, and liquid and gas chromatography — training she brought home to strengthen both her research and the practical skills she passed on to her students.',
      'Before her passing she was working towards purifying identified female fertility enhancement bioactive agents from local plants. She served the Department of Biochemistry as Examination Officer for the Medicine and Surgery preclinical programme, Chairperson of the Welfare Committee, Students Industrial Attachment Coordinator, and Chairman of the Departmental Postgraduate Committee. She was a member of the Nigerian Society of Biochemistry and Molecular Biology, the Society of Basic and Clinical Toxicology of Nigeria, and the West African Society of Toxicology.',
    ],
  },
  {
    heading: 'The Minister and Intercessor',
    paragraphs: [
      'Beyond the academics, Dr. Eve Mboso was a Minister of the Gospel. Her faith was not separate from her scholarship — it was its foundation. In the pulpit she taught with clarity and conviction, turning scripture into life for those who listened. In the place of prayer she interceded for families, students, colleagues, and generations. Many will remember her not only for what she taught, but for how she stood in the gap when they had no words left.',
      'Her heart for intercession found expression in Pray Mompray, the annual prayer gathering she founded and hosted for mothers. Through it she encouraged women to see prayer not as a last resort, but as a spiritual investment in their children’s destiny and a weapon of intercession through Christ Jesus.',
    ],
  },
  {
    heading: 'Christian Ministry and Leadership',
    paragraphs: [
      'She was ordained a Pastor of the Fountain of Life Church in August 1998 by Pastors Taiwo and Bimbo Odukoya. When the church transitioned, she prepared all the foundational documents for the move from Fountain of Life Church to The SpringHouse Church. From 1999 through the late 2000s she wrote the weekly church bulletins, shaping the voice and communication of the congregation for nearly a decade. She later served as Associate Lead Pastor of The SpringHouse Church, Calabar.',
      'Her theological training matched her practical service. She completed the Bible Institute for Christian Leadership on July 22, 2006, with over 500 hours of instruction, and on July 16, 2006 was ordained Reverend by Women of Wisdom Ministries International under the leadership of Dr. Curtis McCall-Way.',
    ],
  },
  {
    heading: 'The Wife and Mother',
    paragraphs: [
      'Dr. Ofonime Eve Mboso was joined in marital bliss to her heartthrob, Dr. Austin Godwin Mboso, in July 2000. For the rest of the first quarter of the 21st century, this couple and their beloved children exemplified a modest family life. To her family, Eve was a loving wife and mother whose home reflected the same order, warmth, and devotion she gave her work.',
      'She understood that legacy is built in people, and she invested in hers daily — that the greatest legacy is not in titles or publications, but in the people who are stronger because you passed through their lives. She is survived by her husband, three children — Susan, Lerato, and Agape — extended family, colleagues and students. She is greatly missed by The SpringHouse Church, her lifelong stronghold in faith.',
    ],
  },
  {
    heading: 'A Life Fulfilled',
    paragraphs: [
      'Before her passing on April 1, 2026, Dr. Ofonime Eve Mboso shaped minds in lecture halls, advanced scientific knowledge in the laboratory, transformed lives from the pulpit, and interceded for the future on her knees. She proved that a woman could be excellent in science without losing her tenderness, and strong in faith without abandoning her intellect. To humanity, she bequeathed a legacy of faith, scholarship, and service.',
    ],
  },
];

const TRIBUTES: { title: string; from: string; body: string[] }[] = [
  {
    title: 'A Tribute to My Courageous Wife',
    from: 'Dr. Austin Godwin Mboso — her husband',
    body: [
      'August 2026 would have made it 26 wonderful years of marriage together.',
      'Over the years, I watched you evolve, become the unique and strong person you became. You endured pains you never created for yourself. You carried the wounds of a difficult childhood with quiet strength. In the midst of challenges, you refused to become a victim of your beginnings; you were misunderstood, yet you were determined to carve out your own path beautifully.',
      'In ill health, you fought bravely. Through painful therapies, you held firmly to God’s Word and to prayer. Faith never left your lips. You carried burdens without crumbling under their weight, faced battles without demanding applause. What others called hardship, you met with a determined heart and unyielding faith.',
      'Today, I salute your strength, doggedness and focus. The SpringHouse honours your quiet but powerful impact. And I celebrate the wife of my youth, a woman whose courage will never stop speaking. Adieu my Eve.',
    ],
  },
  {
    title: 'Hardworking. Loving. Strong. Wise.',
    from: 'Susan — her daughter',
    body: [
      'One of the conversations we had a few weeks before her passing was about how proud she was of the way she raised me. She said she was proud that she introduced me to God, proud that she raised me with values, compassion, and a heart for people. Looking back now, I realise those are some of the greatest gifts anyone could ever receive from a parent.',
      'She gave her all in everything she did. No matter how tired she was, she always found a way to keep going — for her family, for her students, and for the people around her. She once told me she would always treat every child willing to learn as her own. She had a heart that made people feel seen.',
      'She rarely complained. She carried so much quietly, yet still wore a smile so often that people sometimes did not fully realise the weight she carried. Even though words will never fully capture who she was or what she meant to us, the love she gave, the lives she touched, and the values she planted in people will continue to live on forever.',
    ],
  },
  {
    title: 'To Our Beloved Mama',
    from: 'The SpringHouse Choir',
    body: [
      'You sat in the front row, but you worshipped like no one was watching. You clapped for every song, prayed in the background for every singer, stayed through every rehearsal you met, with that smile that said "Go Great Guys".',
      'From your teachings we gleaned it wasn’t about the music — it was about the Master. When our voices were tired, your "Amen" gave us strength. You were our mother in the choir, even without the title.',
      'Now the choir loft feels quieter. But heaven’s choir just got louder. Thank you, Mama — for loving us, for cheering us, for showing us Jesus. We’ll see you where the song never ends.',
    ],
  },
  {
    title: 'To Our Associate Senior Pastor',
    from: 'The Men’s Fellowship',
    body: [
      'You stood with our Senior Pastor — not behind him, but beside him. You carried the weight of the Word, and the weight of our burdens too. A shepherd to the men, a Mother in Israel.',
      'You taught us to lead our homes, to pray on our knees at dawn, to serve when no one was watching. You showed us strength is in surrender, and true men walk in humility. You didn’t just preach the gospel — you lived it.',
      'Yet your charge still echoes: "If you enter a new place, turn on the light." Your legacy is not in stone — it’s in us. Rest now from your labour, for your works follow you.',
    ],
  },
];

export default function RememberingPastorEvePage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 bg-brand-blue overflow-hidden"
        style={{ minHeight: '70vh' }}
        aria-label="In loving memory of Pastor Eve Mboso"
      >
        <HeroBackground destination="hero_memorial" />
        <div className="absolute inset-0 bg-brand-blue/85" aria-hidden="true" />
        <div className="absolute inset-0 bg-cross-pattern opacity-10" aria-hidden="true" />

        <div className="relative z-10 max-w-3xl mx-auto py-20">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold mb-8">
              In Loving Memory
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <MemorialPortrait />
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mt-8 mb-3 leading-tight">
              Ofonime Eve Mboso
            </h1>
            <p className="text-white/60 text-sm mb-6">(Nee Bassey)</p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-10 bg-brand-gold/60" aria-hidden="true" />
              <p className="font-display text-brand-gold text-lg sm:text-xl italic">
                1977 &ndash; 2026
              </p>
              <div className="h-px w-10 bg-brand-gold/60" aria-hidden="true" />
            </div>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Associate Lead Pastor, The SpringHouse Church<br />
              Associate Professor of Biochemistry, University of Calabar
            </p>
            <p className="text-white/50 text-xs sm:text-sm tracking-wide mt-5">{DESCRIPTORS}</p>
          </FadeIn>
        </div>
      </section>

      {/* ── Her words ── */}
      <section className="bg-brand-cream py-20 px-4 sm:px-6 lg:px-8" aria-label="Her words">
        <Reveal>
          <blockquote className="max-w-3xl mx-auto text-center">
            <p className="font-display text-3xl sm:text-4xl lg:text-5xl italic text-brand-blue leading-snug">
              &ldquo;Faith does not deny facts; it simply <span className="text-brand-red not-italic font-semibold">refuses</span> to make facts <span className="text-brand-red not-italic font-semibold">final</span>.&rdquo;
            </p>
            <footer className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
              &mdash; Pastor Eve
            </footer>
          </blockquote>
        </Reveal>
      </section>

      {/* ── Scripture ── */}
      <section className="bg-brand-blue py-20 px-4 sm:px-6 lg:px-8" aria-label="Scripture">
        <ScriptureReveal>
          <blockquote className="max-w-2xl mx-auto text-center">
            <p className="font-display text-xl sm:text-2xl italic text-white/90 leading-relaxed">
              &ldquo;While we look not at the things which are seen, but at the things which are not
              seen: for the things which are seen are temporal; but the things which are not seen
              are eternal.&rdquo;
            </p>
            <footer className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
              2 Corinthians 4:18
            </footer>
          </blockquote>
        </ScriptureReveal>
      </section>

      {/* ── Her story ── */}
      <section className="relative bg-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden" aria-label="Her story">
        <FadedBackgroundPhoto destination="bg_memorial" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">
                Her Story
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-brand-blue">
                A Life of Faith &amp; Scholarship
              </h2>
            </div>
          </FadeIn>

          <div className="space-y-14">
            {STORY.map(({ heading, paragraphs }) => (
              <Reveal key={heading}>
                <article>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-brand-blue mb-2">
                    {heading}
                  </h3>
                  <div className="h-0.5 w-14 bg-brand-gold mb-6" aria-hidden="true" />
                  <div className="space-y-4">
                    {paragraphs.map((p, i) => (
                      <p key={i} className="text-gray-600 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo gallery ── */}
      <MemorialGallery />

      {/* ── Tributes ── */}
      <section className="bg-brand-cream py-20 px-4 sm:px-6 lg:px-8" aria-label="Tributes">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">
                In Her Honour
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-brand-blue">
                Tributes
              </h2>
            </div>
          </FadeIn>

          <CascadeGroup className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {TRIBUTES.map(({ title, from, body }) => (
              <CascadeItem key={title}>
                <article className="h-full bg-white rounded-2xl p-7 sm:p-8 border border-brand-gold/20 shadow-sm">
                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-brand-blue mb-1.5 leading-snug">
                    {title}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-5">
                    {from}
                  </p>
                  <div className="space-y-3.5">
                    {body.map((p, i) => (
                      <p key={i} className="text-gray-600 text-sm leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </article>
              </CascadeItem>
            ))}
          </CascadeGroup>
        </div>
      </section>

      {/* ── Closing ── */}
      <section className="bg-brand-blue py-24 px-4 sm:px-6 lg:px-8 text-center" aria-label="Closing tribute">
        <Reveal>
          <div className="max-w-2xl mx-auto">
            <p className="font-display text-3xl sm:text-4xl italic text-white leading-snug mb-8">
              &ldquo;Well done, good and faithful servant.&rdquo;
            </p>
            <p className="text-white/70 leading-relaxed">
              You lived with purpose. You served with excellence. You finished well.
              May the Almighty Father grant your soul peaceful and eternal repose in His bosom.
            </p>
            <div className="flex items-center justify-center gap-3 my-10" aria-hidden="true">
              <div className="h-px w-16 bg-brand-gold/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
              <div className="h-px w-16 bg-brand-gold/50" />
            </div>
            <p className="font-display text-xl sm:text-2xl text-brand-gold italic">
              Adieu, {FULL_NAME}
            </p>
            <p className="text-white/40 text-xs tracking-wide mt-3">
              B.Sc., PGD, M.Sc., PhD; MNSBMB, MSBCTN, MWASOT
            </p>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
