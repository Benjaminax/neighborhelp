import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Check, CreditCard, LockKeyhole, Search, ShieldCheck, Smartphone } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import heroVideo from './assets/Royalty-Free 4K Drone Footage City Traffic No Copyright - MK PixelSquad (1080p).mp4'

type Provider = {
  name: string
  service: string
  category: string
  area: string
  rating: string
  jobs: string
  price: string
  initials: string
  color: string
  image: string
  distance: number
  priceValue: number
  verified?: boolean
}

const categories = ['All services', 'Home repairs', 'Tutoring', 'Tech help', 'Creative', 'Errands']

const portraitUrl = (index: number) => {
  const gender = index % 2 === 0 ? 'men' : 'women'
  const photoNumber = (index % 50) + 1
  return `https://randomuser.me/api/portraits/${gender}/${photoNumber}.jpg`
}

const providers: Provider[] = [
  { name: 'Kwame Mensah', service: 'Laptop repair & setup', category: 'Tech help', area: 'East Legon', rating: '4.9', jobs: '84 jobs', price: 'From GH₵80', initials: 'KM', color: '#b9d8a5', image: portraitUrl(0), distance: 2.4, priceValue: 80, verified: true },
  { name: 'Ama Owusu', service: 'Maths & science tutoring', category: 'Tutoring', area: 'Madina', rating: '5.0', jobs: '47 jobs', price: 'From GH₵60/hr', initials: 'AO', color: '#e5b7a3', image: portraitUrl(1), distance: 7.8, priceValue: 60, verified: true },
  { name: 'Kojo Fixes', service: 'Plumbing & home repairs', category: 'Home repairs', area: 'Osu', rating: '4.8', jobs: '126 jobs', price: 'From GH₵100', initials: 'KF', color: '#b8c2dd', image: portraitUrl(2), distance: 3.1, priceValue: 100, verified: true },
  { name: 'Nana Yaa Studio', service: 'Design & photography', category: 'Creative', area: 'Cantonments', rating: '4.9', jobs: '39 jobs', price: 'From GH₵150', initials: 'NY', color: '#d9c394', image: portraitUrl(3), distance: 4.6, priceValue: 150, verified: false },
]
const generatedNames = ['Esi Boateng', 'Yaw Asante', 'Abena Kusi', 'Fiifi Addo', 'Akosua Darko', 'Mawuli Tetteh', 'Adwoa Mensima', 'Kofi Nartey', 'Mabel Quaye', 'Sena Ahiable', 'Nii Lantey', 'Efua Sarpong', 'Kweku Armah', 'Dede Nortey', 'Selorm Kpodo', 'Naa Dedei', 'Tetteh Ofori', 'Yaa Serwaa', 'Ato Mensah', 'Mina Amponsah', 'Nii Abbey', 'Portia Badu', 'Kobby Annan', 'Linda Agyeman', 'Seth Asamoah', 'Mavis Osei', 'Elikem Dzidzor', 'Rita Lamptey', 'Nana Kofi', 'Joana Baah', 'Kelvin Osei', 'Priscilla Aryee', 'Micheal Quarshie', 'Belinda Tetteh', 'Emmanuel Koomson', 'Grace Amoah', 'Richmond Osei', 'Sandra Nkrumah', 'Thomas Laryea', 'Gloria Eshun', 'Isaac Abbey', 'Patience Arhin', 'Daniel Tettey', 'Juliet Aidoo', 'Martin Yeboah', 'Rosemary Addai']
const generatedServices = [
  ['Laptop repair & setup', 'Tech help', 'From GH₵80'],
  ['Maths & science tutoring', 'Tutoring', 'From GH₵60/hr'],
  ['Plumbing & home repairs', 'Home repairs', 'From GH₵100'],
  ['Design & photography', 'Creative', 'From GH₵150'],
  ['Grocery & delivery runs', 'Errands', 'From GH₵40'],
]
const generatedAreas = ['Labone', 'Airport Residential', 'Ashaley Botwe', 'Adenta', 'Spintex', 'Dansoman', 'Teshie', 'Achimota', 'Dzorwulu', 'Kokomlemle', 'Roman Ridge', 'Legon']
const generatedColors = ['#c5d6b9', '#e7c0ae', '#b9c5df', '#ddc99c', '#d5b9d7']
const generatedProviders: Provider[] = Array.from({ length: 46 }, (_, index) => {
  const name = generatedNames[index]
  const [service, category, price] = generatedServices[index % generatedServices.length]
  return {
    name,
    service,
    category,
    area: generatedAreas[index % generatedAreas.length],
    rating: (4.7 + (index % 4) / 10).toFixed(1),
    jobs: `${28 + (index * 13) % 150} jobs`,
    price,
    initials: name.split(' ').map((part) => part[0]).join(''),
    color: generatedColors[index % generatedColors.length],
    image: portraitUrl(index + 4),
    distance: Number((1.8 + (index * 1.7) % 15).toFixed(1)),
    priceValue: Number(price.match(/\d+/)?.[0] ?? 100),
    verified: index % 3 !== 1,
  }
})

providers.push(...generatedProviders)

const providerSlug = (provider: Provider) => provider.name
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

const profileHistoryByCategory: Record<string, string[]> = {
  'Home repairs': ['Kitchen tap repair', 'Furniture assembly', 'Home maintenance visit'],
  Tutoring: ['Weekly maths session', 'Exam preparation lesson', 'Study plan check-in'],
  'Tech help': ['Device setup and support', 'Wi-Fi troubleshooting', 'Laptop tune-up'],
  Creative: ['Small business brand update', 'Product photography session', 'Social media design pack'],
  Errands: ['Market shopping and delivery', 'Neighborhood pickup', 'Same-day local errand'],
}

const profileQuotesByCategory: Record<string, string[]> = {
  'Home repairs': ['Explained the options clearly and left everything tidy.', 'The work was completed just as we agreed.', 'Friendly, punctual and easy to coordinate with.'],
  Tutoring: ['Patient and encouraging throughout the lesson.', 'Made a difficult topic feel much easier to understand.', 'Clear plan, thoughtful teaching and great communication.'],
  'Tech help': ['Solved the problem and showed me how to avoid it next time.', 'Quick to respond and careful with my device.', 'Clear explanation and a smooth setup from start to finish.'],
  Creative: ['Listened closely and delivered work that fit the brief.', 'Thoughtful ideas and a polished final result.', 'Easy to work with and kept me updated along the way.'],
  Errands: ['Kept me updated and handled everything carefully.', 'Reliable help when I needed an extra pair of hands.', 'Quick, considerate and right on time.'],
}

const reviews = [
  { quote: 'I found a designer down the road who understood exactly what I needed.', name: 'Esther A.', detail: 'Cantonments · Brand design', initials: 'EA' },
  { quote: 'The plumber arrived on time, explained everything clearly and fixed the leak in one visit.', name: 'Kofi B.', detail: 'Osu · Home repairs', initials: 'KB' },
  { quote: 'Finding a patient maths tutor for my daughter used to be stressful. NeighborHelp made it simple.', name: 'Adwoa M.', detail: 'Madina · Tutoring', initials: 'AM' },
]

const faqs = [
  ['How do I find the right helper?', 'Search by service or location, compare profiles and reviews, then choose the person who feels right for your task.'],
  ['Are helpers verified?', 'We review provider information and highlight verified profiles. You can also see ratings, completed jobs and service details before reaching out.'],
  ['How does payment work?', 'Agree on the scope and price directly with your helper before the work begins. We recommend keeping all details clear in writing.'],
  ['Can I become a helper?', 'Yes. If you have a useful skill and want to serve people around Accra, choose Become a helper to get started.'],
]

function Logo() {
  return <a href="/" aria-label="neighborhelp home" className="brand-mark flex items-center text-lg font-normal tracking-[-0.025em]"><span>neighborhelp<span className="logo-dot">.</span></span></a>
}

function LocalHelpersStat({ count, animate = true }: { count: number; animate?: boolean }) {
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    if (!animate) {
      setDisplayCount(0)
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayCount(count)
      return
    }

    const duration = 1000
    let frameId = 0
    let startTime: number | undefined
    const updateCount = (time: number) => {
      startTime ??= time
      const progress = Math.min((time - startTime) / duration, 1)
      setDisplayCount(Math.floor(progress * count))
      if (progress < 1) frameId = window.requestAnimationFrame(updateCount)
    }

    frameId = window.requestAnimationFrame(updateCount)
    return () => window.cancelAnimationFrame(frameId)
  }, [animate, count])

  return (
    <div className="hero-local-stat absolute bottom-48 right-0 z-30 text-white drop-shadow-lg sm:bottom-52" aria-label={`${count} local helpers around Accra`}>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <p className="text-3xl font-medium leading-none tracking-tight tabular-nums sm:text-4xl">{displayCount}<span>+</span></p>
        <svg className="hero-stat-arrow h-5 w-5 shrink-0 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 19 19 5m0 0H9m10-0v10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.14em] text-white/75 sm:text-[10px] sm:tracking-[0.16em]">Local helpers</p>
    </div>
  )
}

function CurvedPageTransition() {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    const updateCurve = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.5), 1)
      const viewportWidth = window.innerWidth
      const isMobile = viewportWidth < 768
      const curveAmplitude = isMobile ? 120 : viewportWidth < 1024 ? 200 : 320
      const minimumCurve = isMobile ? 36 : 0
      const curveHeight = minimumCurve + curveAmplitude * (1 - progress)
      path.setAttribute('d', `M0,0 Q800,${curveHeight} 1600,0 L1600,100 L0,100 Z`)
    }

    window.addEventListener('scroll', updateCurve, { passive: true })
    window.addEventListener('resize', updateCurve)
    updateCurve()

    return () => {
      window.removeEventListener('scroll', updateCurve)
      window.removeEventListener('resize', updateCurve)
    }
  }, [])

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-16 w-full md:h-28 lg:h-40">
      <svg className="block h-full w-full" viewBox="0 0 1600 100" preserveAspectRatio="none" aria-hidden="true">
        <path ref={pathRef} fill="#f1f1ef" d="M0,0 Q800,320 1600,0 L1600,100 L0,100 Z" />
      </svg>
    </div>
  )
}

const mapWorkers = [
  { name: 'Kwame', service: 'Tech help', area: 'East Legon', coordinates: [5.633, -0.16] as [number, number] },
  { name: 'Ama', service: 'Tutoring', area: 'Madina', coordinates: [5.682, -0.17] as [number, number] },
  { name: 'Kojo', service: 'Home repairs', area: 'Osu', coordinates: [5.56, -0.18] as [number, number] },
  { name: 'Nana Yaa', service: 'Creative', area: 'Cantonments', coordinates: [5.578, -0.17] as [number, number] },
  { name: 'Esi', service: 'Errands', area: 'Labone', coordinates: [5.573, -0.19] as [number, number] },
  { name: 'Yaw', service: 'Home repairs', area: 'Ashaley Botwe', coordinates: [5.659, -0.112] as [number, number] },
  { name: 'Abena', service: 'Tutoring', area: 'Adenta', coordinates: [5.713, -0.16] as [number, number] },
  { name: 'Fiifi', service: 'Tech help', area: 'Airport Residential', coordinates: [5.615, -0.185] as [number, number] },
  { name: 'Akosua', service: 'Creative', area: 'Spintex', coordinates: [5.625, -0.105] as [number, number] },
  { name: 'Mawuli', service: 'Errands', area: 'Dansoman', coordinates: [5.56, -0.255] as [number, number] },
]

const mapStartingPoint: L.LatLngExpression = [5.6037, -0.187]

function LiveAccraMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const currentLocationMarkerRef = useRef<L.CircleMarker | null>(null)
  const locationAccuracyCircleRef = useRef<L.Circle | null>(null)
  const locationWatchIdRef = useRef<number | null>(null)
  const locationTimeoutRef = useRef<number | null>(null)
  const bestLocationAccuracyRef = useRef(Number.POSITIVE_INFINITY)
  const [locationMessage, setLocationMessage] = useState('')

  const stopLocationTracking = () => {
    if (locationWatchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(locationWatchIdRef.current)
      locationWatchIdRef.current = null
    }
    if (locationTimeoutRef.current !== null) {
      window.clearTimeout(locationTimeoutRef.current)
      locationTimeoutRef.current = null
    }
  }

  useEffect(() => {
    if (!mapRef.current) return

    const map = L.map(mapRef.current, { scrollWheelZoom: false }).setView(mapStartingPoint, 12)
    leafletMapRef.current = map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    mapWorkers.forEach((worker) => {
      const icon = L.divIcon({
        className: 'worker-map-marker',
        html: `<span class="worker-map-dot"></span><span class="worker-map-label"><strong>${worker.name} · ${worker.service}</strong><small>${worker.area}</small></span>`,
        iconAnchor: [8, 8],
      })
      L.marker(worker.coordinates, { icon, title: `${worker.name} — ${worker.service}` }).addTo(map)
    })

    return () => {
      stopLocationTracking()
      leafletMapRef.current = null
      currentLocationMarkerRef.current = null
      locationAccuracyCircleRef.current = null
      map.remove()
    }
  }, [])

  const recenterMap = () => {
    stopLocationTracking()
    leafletMapRef.current?.setView(mapStartingPoint, 12, { animate: true })
    currentLocationMarkerRef.current?.remove()
    currentLocationMarkerRef.current = null
    locationAccuracyCircleRef.current?.remove()
    locationAccuracyCircleRef.current = null
    setLocationMessage('')
  }

  const showCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Device location is unavailable in this browser.')
      return
    }

    stopLocationTracking()
    bestLocationAccuracyRef.current = Number.POSITIVE_INFINITY
    currentLocationMarkerRef.current?.remove()
    currentLocationMarkerRef.current = null
    locationAccuracyCircleRef.current?.remove()
    locationAccuracyCircleRef.current = null
    setLocationMessage('Requesting a precise location from your device…')
    locationWatchIdRef.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        if (locationWatchIdRef.current === null || coords.accuracy >= bestLocationAccuracyRef.current) return
        const map = leafletMapRef.current
        if (!map) return

        bestLocationAccuracyRef.current = coords.accuracy
        const position: L.LatLngExpression = [coords.latitude, coords.longitude]
        const zoom = coords.accuracy <= 50 ? 16 : coords.accuracy <= 150 ? 15 : 14
        map.setView(position, zoom, { animate: true })
        currentLocationMarkerRef.current?.remove()
        locationAccuracyCircleRef.current?.remove()
        currentLocationMarkerRef.current = L.circleMarker(position, {
          radius: 8,
          color: '#fff',
          weight: 3,
          fillColor: '#2563eb',
          fillOpacity: 1,
        }).addTo(map)
        locationAccuracyCircleRef.current = L.circle(position, {
          radius: coords.accuracy,
          color: '#2563eb',
          weight: 1,
          fillColor: '#2563eb',
          fillOpacity: 0.12,
        }).addTo(map)
        if (coords.accuracy <= 25) {
          stopLocationTracking()
          setLocationMessage(`Precise device location found (approximately ±${Math.round(coords.accuracy)} m).`)
        } else {
          setLocationMessage(`Improving device location… currently accurate to approximately ±${Math.round(coords.accuracy)} m.`)
        }
      },
      (error) => {
        if (locationWatchIdRef.current === null) return
        stopLocationTracking()
        if (error.code === error.PERMISSION_DENIED) {
          setLocationMessage('Location access was denied. Allow it in your browser settings and try again.')
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationMessage('Your device could not determine a location. Please try again.')
        } else {
          setLocationMessage('The device location request timed out. Please try again.')
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    )
    locationTimeoutRef.current = window.setTimeout(() => {
      stopLocationTracking()
      setLocationMessage(
        Number.isFinite(bestLocationAccuracyRef.current)
          ? `Best device location found (approximately ±${Math.round(bestLocationAccuracyRef.current)} m).`
          : 'Your device could not determine a location. Please try again.',
      )
    }, 20000)
  }

  return (
    <>
      <div ref={mapRef} className="absolute inset-0" aria-label="Live map showing NeighborHelp workers around Accra" />
      <div className="absolute right-4 top-4 z-[1000] flex flex-col items-end gap-2">
        <button type="button" onClick={recenterMap} className="bg-paper px-3 py-2 text-xs font-semibold text-black shadow-md transition hover:bg-white">Recenter</button>
        <button type="button" onClick={showCurrentLocation} className="bg-black px-3 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-black/80">Use my device location</button>
        {locationMessage && <p className="max-w-56 bg-paper px-3 py-2 text-xs text-black shadow-md" role="status" aria-live="polite">{locationMessage}</p>}
      </div>
    </>
  )
}

type ScrollRevealLinesProps = {
  lines: string[]
  className?: string
  delay?: number
  lineClassNames?: string[]
  animated?: boolean
}

function ScrollRevealLines({ lines, className = '', delay = 0, lineClassNames = [], animated = false }: ScrollRevealLinesProps) {
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
    }, { threshold: 0.2 })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {lines.map((line, index) => (
        <span
          className="scroll-reveal-line"
          key={`${line}-${index}`}
        >
          <span
            className={`${animated ? 'scroll-reveal-line-content' : ''} ${lineClassNames[index] ?? ''} ${animated && visible ? 'is-visible' : ''}`}
            style={animated ? { transitionDelay: `${delay + index * 140}ms` } : undefined}
          >
            {line}
          </span>
        </span>
      ))}
    </div>
  )
}

type DetailPageProps = {
  pathname: string
}

const detailPages: Record<string, { eyebrow: string; title: string; intro: string }> = {
  '/find-help': {
    eyebrow: 'Find help in Accra',
    title: 'The right person is closer than you think.',
    intro: 'Browse trusted local providers by service, neighborhood and budget. NeighborHelp makes everyday support feel simple, personal and nearby.',
  },
  '/reviews': {
    eyebrow: 'Neighbor stories',
    title: 'Good work travels by word of mouth.',
    intro: 'Read honest experiences from people across Accra who found reliable help for projects both big and small.',
  },
  '/how-it-works': {
    eyebrow: 'Simple by design',
    title: 'From need to done, without the runaround.',
    intro: 'A clear process helps you spend less time searching and more time getting things done with someone you can trust.',
  },
  '/become-a-helper': {
    eyebrow: 'For skilled neighbors',
    title: 'Turn what you know into your next opportunity.',
    intro: 'Share your skills with people around Accra, build a reputation and earn on your own terms.',
  },
  '/contact': {
    eyebrow: 'Contact NeighborHelp',
    title: 'Let’s make local help easier together.',
    intro: 'Have a question, partnership idea or need help finding the right service? Send us a note and our team will get back to you.',
  },
  '/payment-methods': {
    eyebrow: 'Payment methods',
    title: 'Pay your neighbor, securely.',
    intro: 'Settle up for a local service through Paystack’s secure checkout using a card or mobile money.',
  },
  '/about': {
    eyebrow: 'About NeighborHelp',
    title: 'A better way to show up for one another.',
    intro: 'We are building a trusted local network where useful skills, everyday support and stronger neighborhoods can grow together.',
  },
  '/safety': {
    eyebrow: 'Trust & safety',
    title: 'Confidence comes with every connection.',
    intro: 'Clear profiles, community reviews and thoughtful communication help neighbors make informed decisions before work begins.',
  },
}

const pageHighlights: Record<string, { kicker: string; metric: string; title: string; detail: string; points: string[] }> = {
  '/find-help': {
    kicker: 'The local directory',
    metric: '50',
    title: 'local helper profiles',
    detail: 'A few of the many skills available around Accra.',
    points: ['Compare useful details', 'Choose what works for you'],
  },
  '/reviews': {
    kicker: 'A little neighborly trust',
    metric: '4.9/5',
    title: 'average community rating',
    detail: 'Real experiences help the next neighbor choose with confidence.',
    points: ['Stories from local jobs', 'Practical, firsthand feedback'],
  },
  '/how-it-works': {
    kicker: 'A straightforward process',
    metric: '03',
    title: 'steps to get started',
    detail: 'From describing the task to connecting with a nearby provider.',
    points: ['Browse and compare', 'Agree on the details directly'],
  },
  '/become-a-helper': {
    kicker: 'Make your skill visible',
    metric: 'Your next client',
    title: 'could be right around the corner.',
    detail: 'Share what you do and let nearby people discover your work.',
    points: ['Introduce your service', 'Build trust one job at a time'],
  },
  '/contact': {
    kicker: 'We’re nearby',
    metric: 'Accra',
    title: 'local by nature',
    detail: 'Questions about finding a helper or joining the network? Send us a note.',
    points: ['hello@neighborhelp.co', 'Mon–Fri · 9:00–17:00'],
  },
  '/payment-methods': {
    kicker: 'Payments powered by Paystack',
    metric: 'GHS',
    title: 'choose how you pay.',
    detail: 'Your payment details are entered in Paystack checkout, not stored in NeighborHelp.',
    points: ['Cards and mobile money', 'Secure hosted checkout'],
  },
  '/about': {
    kicker: 'A neighborhood-first idea',
    metric: 'Close by',
    title: 'help starts with people.',
    detail: 'Useful skills are already in our communities. We make them easier to find.',
    points: ['Designed around local discovery', 'Built to support real people'],
  },
  '/safety': {
    kicker: 'Make an informed choice',
    metric: 'Your pace',
    title: 'your decision, your connection.',
    detail: 'Take time to review the details, ask questions and agree on expectations.',
    points: ['Read profile details and reviews', 'Confirm scope and price before work'],
  },
}

const pageContent: Record<string, {
  eyebrow: string
  title: string
  intro: string
  cards: Array<{ title: string; body: string }>
  note?: string
  faqs: Array<[string, string]>
}> = {
  '/find-help': {
    eyebrow: 'A better way to compare',
    title: 'Start with what matters to you.',
    intro: 'Every task is different. Use the details in each listing to find someone whose service, location and starting price fit your needs.',
    cards: [
      { title: 'Match the service', body: 'Read the service description and share the specific task you need help with before agreeing to a job.' },
      { title: 'Check the location', body: 'Choose a neighborhood and distance that make sense for your schedule and the work involved.' },
      { title: 'Agree on the details', body: 'Confirm scope, timing and final price directly with the helper before work begins.' },
    ],
    faqs: [
      ['How do I search for a particular task?', 'Use the search box for a provider name, service or neighborhood, or select a category to narrow the directory.'],
      ['Are the prices final quotes?', 'No. Listed prices are starting prices. Confirm the full scope and agreed price with the helper directly.'],
      ['What if no one matches my search?', 'Clear the search and category filters, then try a broader service term or a nearby neighborhood.'],
    ],
  },
  '/reviews': {
    eyebrow: 'Thoughtful feedback',
    title: 'A useful review helps the next neighbor.',
    intro: 'Specific, respectful feedback gives people a clearer idea of what working together can be like.',
    cards: [
      { title: 'Keep it firsthand', body: 'Share what you directly experienced, rather than repeating information you cannot confirm.' },
      { title: 'Be specific', body: 'Mention the service, communication or outcome that helped you make your decision.' },
      { title: 'Respect privacy', body: 'Leave out personal contact details, private conversations and information that identifies someone else.' },
    ],
    note: 'The stories shown in this design are sample prototype content. A live service should publish only authentic reviews with permission.',
    faqs: [
      ['Who can leave a review?', 'A production marketplace should accept reviews only from people who completed a real service interaction.'],
      ['What makes feedback helpful?', 'Describe the job and your experience clearly, fairly and without private or identifying details.'],
      ['Are the stories on this page real?', 'No. The displayed quotes are illustrative content for this design prototype and are not verified customer testimonials.'],
    ],
  },
  '/how-it-works': {
    eyebrow: 'A clear conversation',
    title: 'What happens after you reach out?',
    intro: 'An introduction is the start of a conversation, not an automatic booking. Take a moment to align on the important details.',
    cards: [
      { title: 'Describe the task', body: 'Share what needs doing, where the work is and any details that affect the service.' },
      { title: 'Agree on scope and price', body: 'Confirm what is included, when it will happen and the final price before you proceed.' },
      { title: 'Choose how to continue', body: 'Only move forward when you are comfortable with the plan and know how you will stay in touch.' },
    ],
    note: 'NeighborHelp is an introduction concept. This prototype does not process payments, confirm bookings or send messages.',
    faqs: [
      ['Does sending a request confirm a booking?', 'No. A request is only an introduction. Confirm availability, details and price directly with the helper.'],
      ['How do I agree on the price?', 'Discuss the work and any extra costs before it begins, then keep your agreement clear in writing.'],
      ['Does NeighborHelp take payment?', 'No payment flow is included in this prototype. The concept leaves payment arrangements between the two neighbors.'],
    ],
  },
  '/become-a-helper': {
    eyebrow: 'A strong first introduction',
    title: 'Make it easy for neighbors to understand your work.',
    intro: 'A clear service description and realistic expectations help people decide whether your skills are right for their task.',
    cards: [
      { title: 'Describe your service', body: 'Say what you do, what kinds of jobs you take on and what is outside your scope.' },
      { title: 'Set clear expectations', body: 'Be ready to discuss availability, location, starting price and any materials the job needs.' },
      { title: 'Build trust over time', body: 'Communicate clearly, agree on the details before work and invite honest feedback after a completed job.' },
    ],
    note: 'A listing does not guarantee work or income. The application form is a visual prototype and does not save submissions.',
    faqs: [
      ['Who can apply to become a helper?', 'Anyone with a useful skill or local service can express interest. A real launch would define eligibility and verification steps.'],
      ['Does joining guarantee customers?', 'No. A profile can help people discover your service, but it cannot promise enquiries or income.'],
      ['What information should I prepare?', 'Start with your name, service, neighborhood and a reliable way for the team to follow up.'],
    ],
  },
  '/contact': {
    eyebrow: 'Help us point you in the right direction',
    title: 'A little context helps us help.',
    intro: 'Tell us what you need, which service or neighborhood is involved and how we can follow up.',
    cards: [
      { title: 'Finding a helper', body: 'Include the kind of task, your neighborhood and any timing or access details that matter.' },
      { title: 'Joining the network', body: 'Tell us about your skill, the area you serve and the best way to reach you.' },
      { title: 'Something else?', body: 'For partnerships or general questions, choose the closest topic and add a short note.' },
    ],
    note: 'This prototype shows form feedback but does not send or store messages. For a real enquiry, use hello@neighborhelp.co.',
    faqs: [
      ['How do I reach the NeighborHelp team?', 'Email hello@neighborhelp.co or use the form on this page to prepare a message.'],
      ['What should I include in my message?', 'A short description of your question, relevant service or neighborhood, and a way to follow up.'],
      ['Does this prototype deliver my message?', 'No. It demonstrates the form interaction only; no message is transmitted or stored.'],
    ],
  },
  '/payment-methods': {
    eyebrow: 'Keep payments ready',
    title: 'A saved method makes the next job easier.',
    intro: 'Choose a default option for hourly work, one-off projects or recurring local support, and keep it updated as your needs change.',
    cards: [
      { title: 'Add a card', body: 'Save your preferred debit or credit card for faster repeat work and cleaner follow-through on agreed jobs.' },
      { title: 'Set a backup option', body: 'Keep a second fallback method ready if the first choice is unavailable or you want a different payout option.' },
      { title: 'Review before paying', body: 'See the amount, timing and recipient before confirming so everyone is aligned before money changes hands.' },
    ],
    note: 'This payment form is a prototype only. It does not save, transmit or store real payment data.',
    faqs: [
      ['Can I use more than one payment method?', 'A production version could support multiple methods, including card and mobile money options for different situations.'],
      ['Do neighbors pay before the work starts?', 'Payment timing is usually negotiated directly between both neighbors. The form is just a way to store a preferred option.'],
      ['What happens if I need to remove a method?', 'You could update or delete a saved method from profile settings any time in a live product.'],
    ],
  },
  '/about': {
    eyebrow: 'A practical local network',
    title: 'Useful skills already live in our neighborhoods.',
    intro: 'NeighborHelp is designed to make those skills easier to discover and everyday support easier to share.',
    cards: [
      { title: 'Make local visible', body: 'Help residents find services nearby instead of searching across disconnected channels.' },
      { title: 'Make comparison clearer', body: 'Put service, location, ratings and starting prices in one place before a conversation begins.' },
      { title: 'Keep people in control', body: 'Neighbors decide whether to connect, what work to agree on and how to proceed.' },
    ],
    note: 'NeighborHelp is a product concept. Its assumptions and usefulness should be tested with Accra residents and providers.',
    faqs: [
      ['Where does NeighborHelp operate?', 'This design is centered on Accra, Ghana, and illustrates a neighborhood-based services directory.'],
      ['What services can people discover?', 'The prototype includes home repairs, tutoring, tech help, creative services and errands.'],
      ['Is NeighborHelp a live marketplace?', 'No. This is a front-end product prototype with sample content and non-persistent form interactions.'],
    ],
  },
  '/safety': {
    eyebrow: 'A thoughtful checklist',
    title: 'Before the work begins, get on the same page.',
    intro: 'Profiles and reviews can help you compare. A clear conversation helps both neighbors understand the plan.',
    cards: [
      { title: 'Talk through the work', body: 'Agree on the task, timing, location, materials and any extra costs before confirming.' },
      { title: 'Keep a clear record', body: 'Write down the scope and price so both sides can refer to the same expectations.' },
      { title: 'Trust your judgment', body: 'Ask questions and pause if something feels unclear. Continue only when the plan feels comfortable.' },
    ],
    note: 'A profile, review or verification label is not a guarantee of safety or work quality. Use your judgment and agree on details directly.',
    faqs: [
      ['Does a profile mean a provider is guaranteed?', 'No. Profiles and reviews are information to consider, not a guarantee of identity, safety or work quality.'],
      ['What should we agree before work starts?', 'Confirm the job scope, timing, final price, materials and how you will communicate if plans change.'],
      ['What if I feel uncomfortable?', 'You can pause or decline the connection. Do not proceed until your questions are answered and the plan feels right.'],
    ],
  },
}

function DetailContentSection({ pathname }: { pathname: string }) {
  const content = pageContent[pathname]
  if (!content) return null

  const darkSection = pathname === '/how-it-works' || pathname === '/safety'
  const featuredSection = pathname === '/become-a-helper'

  return (
    <>
      <section className={`detail-content-section ${darkSection ? 'detail-content-dark' : ''} ${featuredSection ? 'detail-content-lime' : ''}`}>
        <div className="mx-auto max-w-[1260px] px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
          <div className="mb-9 grid gap-5 border-b border-current/10 pb-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div><p className="eyebrow">{content.eyebrow}</p><h2 className="mt-4 max-w-xl text-4xl font-medium leading-[0.98] tracking-[-0.035em] sm:text-5xl">{content.title}</h2></div>
            <p className="max-w-xl text-sm leading-relaxed opacity-65 lg:justify-self-end">{content.intro}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {content.cards.map((card, index) => (
              <article className="detail-content-card" key={card.title}>
                <span className="text-[10px] uppercase tracking-[0.16em] opacity-50">0{index + 1} / 03</span>
                <h3 className="mt-10 text-xl font-medium tracking-[-0.02em]">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-65">{card.body}</p>
              </article>
            ))}
          </div>
          {content.note && <p className="mt-6 max-w-4xl border-l-2 border-current/25 pl-4 text-xs leading-relaxed opacity-65">{content.note}</p>}
        </div>
      </section>
      <section className="bg-[#e7e6e1]">
        <div className="mx-auto grid max-w-[1260px] gap-10 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-[0.65fr_1.35fr] lg:px-16">
          <div><p className="eyebrow">Good to know</p><h2 className="mt-4 max-w-sm text-4xl font-medium leading-[0.98] tracking-[-0.035em] sm:text-5xl">A few common questions.</h2><a className="mt-6 inline-flex items-center gap-2 text-sm font-medium underline decoration-black/25 underline-offset-4 hover:decoration-black" href="/contact">Still need help? Contact us <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></a></div>
          <div className="border-t border-black/15">
            {content.faqs.map(([question, answer]) => (
              <details className="group border-b border-black/15 py-5" key={question}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-medium sm:text-lg">{question}<span className="text-2xl font-normal transition-transform group-open:rotate-45">+</span></summary>
                <p className="max-w-2xl pt-4 text-sm leading-relaxed text-black/60">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function DetailFooter() {
  const [subscribed, setSubscribed] = useState(false)

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1260px] px-5 py-14 sm:px-10 lg:px-16">
        <div className="grid gap-10 border-b border-white/15 pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <div>
            <p className="eyebrow text-lime">The neighbor network</p>
            <h2 className="mt-5 max-w-lg text-5xl font-medium leading-[0.9] tracking-[-0.035em] sm:text-7xl">Good things<br /><span className="text-lime">start nearby.</span></h2>
          </div>
          <div className="self-end">
            <p className="mb-4 text-sm font-medium">Get local stories and useful updates</p>
            <form className="footer-newsletter-form flex flex-col gap-3 border-b border-white/40 pb-3 sm:flex-row sm:items-center" onSubmit={(event) => { event.preventDefault(); setSubscribed(true) }}>
              <input className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/45" type="email" name="email" autoComplete="email" placeholder="Your email address" aria-label="Your email address" required />
              <button className="button-lime w-fit inline-flex items-center justify-center gap-1.5" type="submit">{subscribed ? <>Thanks <Check className="h-4 w-4 shrink-0" /></> : <>Subscribe <ArrowUpRight className="h-4 w-4 shrink-0" /></>}</button>
            </form>
            <p className="mt-3 min-h-5 text-xs text-lime" aria-live="polite">{subscribed ? 'Thanks for your interest. This prototype does not save email addresses.' : ''}</p>
          </div>
        </div>
        <div className="detail-footer-links-grid grid grid-cols-2 gap-x-6 gap-y-9 py-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-5 max-w-xs text-xs leading-relaxed text-white/40">A local marketplace for useful skills, trusted help and stronger neighborhoods.</p>
          </div>
          <div className="footer-link-group"><p className="footer-heading">Explore</p><div className="footer-links"><a href="/" className="inline-flex items-center gap-1">Home <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a><a href="/find-help" className="inline-flex items-center gap-1">Find help <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a><a href="/reviews" className="inline-flex items-center gap-1">Reviews <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a></div></div>
          <div className="footer-link-group"><p className="footer-heading">Learn & join</p><div className="footer-links"><a href="/how-it-works" className="inline-flex items-center gap-1">How it works <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a><a href="/become-a-helper" className="inline-flex items-center gap-1">Become a helper <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a><a href="/payment-methods" className="inline-flex items-center gap-1">Payment methods <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a><a href="/about" className="inline-flex items-center gap-1">About NeighborHelp <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a><a href="/safety" className="inline-flex items-center gap-1">Trust & safety <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a></div></div>
          <div className="footer-link-group"><p className="footer-heading">Contact</p><div className="footer-links"><a href="/contact" className="inline-flex items-center gap-1">Contact us <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a><a href="mailto:hello@neighborhelp.co">hello@neighborhelp.co</a><span>Accra, Ghana</span><span>Mon–Fri · 9:00–17:00</span></div></div>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-white/15 pt-6 text-[10px] text-white/40 sm:flex-row"><span>© 2025 NeighborHelp Accra.</span><span>Made for the neighborhood.</span></div>
      </div>
    </footer>
  )
}

function PaymentCheckout() {
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('100.00')
  const [description, setDescription] = useState('')
  const [channel, setChannel] = useState<'card' | 'mobile_money'>('card')
  const [status, setStatus] = useState<{ kind: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [isOpeningCheckout, setIsOpeningCheckout] = useState(false)
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY?.trim()

  const startCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus(null)
    if (!publicKey) {
      setStatus({ kind: 'error', message: 'Payments are not configured yet. Add a Paystack test public key to .env.local to enable checkout.' })
      return
    }

    const amountInPesewas = Math.round(Number(amount) * 100)
    if (!Number.isSafeInteger(amountInPesewas) || amountInPesewas < 1) {
      setStatus({ kind: 'error', message: 'Enter an amount of at least GH₵0.01.' })
      return
    }

    setIsOpeningCheckout(true)
    try {
      const { default: PaystackPop } = await import('@paystack/inline-js')
      const paystack = new PaystackPop()
      paystack.newTransaction({
        key: publicKey,
        email,
        amount: amountInPesewas,
        currency: 'GHS',
        channels: [channel],
        metadata: {
          platform: 'NeighborHelp',
          description: description.trim() || 'Payment for local service',
        },
        onSuccess: (transaction) => setStatus({
          kind: 'success',
          message: `Checkout completed with reference ${transaction.reference}. Verify this payment on your server before confirming the job.`,
        }),
        onCancel: () => setStatus({ kind: 'info', message: 'Checkout was closed before the payment was completed.' }),
        onError: (error) => setStatus({ kind: 'error', message: `Paystack could not start checkout: ${error.message}` }),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected checkout error occurred.'
      setStatus({ kind: 'error', message: `Paystack could not start checkout: ${message}` })
    } finally {
      setIsOpeningCheckout(false)
    }
  }

  return (
    <section id="payment-form" className="bg-[#f2f1ee]">
      <div className="mx-auto max-w-[1260px] px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <form className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.07)] sm:p-9" onSubmit={startCheckout}>
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45">Secure checkout · Ghana</p>
                <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] sm:text-4xl">Pay for a local service.</h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-black/55">Enter the amount you agreed with your helper. Your card or mobile money details are entered securely in Paystack checkout.</p>
              </div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lime text-black"><ShieldCheck className="h-6 w-6" aria-hidden="true" /></span>
            </div>

            <div className="grid gap-5">
              <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-black/55" htmlFor="checkout-amount">
                Amount to pay
                <span className="flex items-center border-b border-black/20 focus-within:border-black">
                  <span className="pr-3 text-base font-medium text-black">GH₵</span>
                  <input id="checkout-amount" name="amount" type="number" min="0.01" step="0.01" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} className="w-full bg-transparent py-3 text-2xl font-medium text-black outline-none" required />
                </span>
              </label>
              <div className="flex flex-wrap gap-2" aria-label="Suggested amounts">
                {['50.00', '100.00', '250.00'].map((suggestedAmount) => (
                  <button key={suggestedAmount} type="button" onClick={() => setAmount(suggestedAmount)} className={`border px-3 py-2 text-xs transition ${amount === suggestedAmount ? 'border-black bg-black text-white' : 'border-black/15 text-black/65 hover:border-black'}`}>GH₵{suggestedAmount}</button>
                ))}
              </div>

              <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-black/55" htmlFor="checkout-email">
                Receipt email
                <input id="checkout-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="border-b border-black/20 bg-transparent px-0 py-3 text-base font-normal normal-case tracking-normal text-black outline-none placeholder:text-black/35 focus:border-black" required />
              </label>

              <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-black/55" htmlFor="checkout-description">
                What is this payment for? <span className="font-normal normal-case tracking-normal text-black/40">Optional</span>
                <input id="checkout-description" name="description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="e.g. Sink repair in Osu" className="border-b border-black/20 bg-transparent px-0 py-3 text-base font-normal normal-case tracking-normal text-black outline-none placeholder:text-black/35 focus:border-black" />
              </label>
            </div>

            <fieldset className="mt-8">
              <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-black/55">Choose a payment method</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {([
                  { id: 'card', label: 'Card', description: 'Visa, Mastercard and more', Icon: CreditCard },
                  { id: 'mobile_money', label: 'Mobile money', description: 'Pay with your wallet', Icon: Smartphone },
                ] as const).map(({ id, label, description: methodDescription, Icon }) => (
                  <button key={id} type="button" aria-pressed={channel === id} onClick={() => setChannel(id)} className={`flex items-center gap-3 border p-4 text-left transition ${channel === id ? 'border-black bg-[#f5f5f2]' : 'border-black/10 hover:border-black/35'}`}>
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${channel === id ? 'bg-black text-white' : 'bg-black/5 text-black/65'}`}><Icon className="h-4 w-4" aria-hidden="true" /></span>
                    <span><span className="block text-sm font-semibold text-black">{label}</span><span className="mt-1 block text-[11px] text-black/50">{methodDescription}</span></span>
                    <span className={`ml-auto h-4 w-4 shrink-0 rounded-full border ${channel === id ? 'border-[5px] border-black' : 'border-black/25'}`} />
                  </button>
                ))}
              </div>
            </fieldset>

            <button type="submit" disabled={isOpeningCheckout} className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-white transition hover:bg-black/80 disabled:cursor-wait disabled:opacity-70">
              {isOpeningCheckout ? 'Opening secure checkout…' : 'Continue to secure checkout'} <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </button>
            {status && <p className={`mt-4 border p-4 text-xs leading-relaxed ${status.kind === 'success' ? 'border-green-900/15 bg-green-50 text-green-900' : status.kind === 'error' ? 'border-red-900/15 bg-red-50 text-red-900' : 'border-black/10 bg-[#f7f6f2] text-black/70'}`} role="status" aria-live="polite">{status.message}</p>}
            {!publicKey && <p className="mt-4 text-xs leading-relaxed text-black/55">Checkout is not connected yet. Set <code className="rounded bg-black/5 px-1 py-0.5">VITE_PAYSTACK_PUBLIC_KEY</code> in your local environment to enable Paystack.</p>}
          </form>

          <aside className="overflow-hidden rounded-3xl bg-[#151515] p-6 text-white sm:p-9">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div><p className="text-[10px] uppercase tracking-[0.16em] text-white/45">Payment summary</p><p className="mt-2 text-sm text-white/75">{description.trim() || 'Local service payment'}</p></div>
              <LockKeyhole className="h-5 w-5 text-lime" aria-hidden="true" />
            </div>
            <div className="py-8">
              <p className="text-xs uppercase tracking-[0.14em] text-white/45">Total today</p>
              <p className="mt-3 text-5xl font-medium tracking-[-0.05em]">GH₵{Number(amount || 0).toFixed(2)}</p>
              <p className="mt-3 text-xs text-white/45">Any applicable fees are shown in Paystack checkout.</p>
            </div>
            <div className="space-y-4 border-t border-white/10 pt-6 text-xs">
              <p className="flex items-center gap-3"><Check className="h-4 w-4 text-lime" aria-hidden="true" />Payment details go directly to Paystack</p>
              <p className="flex items-center gap-3"><Check className="h-4 w-4 text-lime" aria-hidden="true" />Choose card or mobile money</p>
              <p className="flex items-center gap-3"><Check className="h-4 w-4 text-lime" aria-hidden="true" />NeighborHelp does not store card details</p>
            </div>
            <p className="mt-8 border-l border-lime/60 pl-4 text-[11px] leading-relaxed text-white/50">Prototype notice: the browser success callback is not payment verification. A production service must verify each transaction with Paystack on a trusted server before marking work paid.</p>
          </aside>
        </div>
      </div>
    </section>
  )
}

function HelperProfilePage({ provider }: { provider: Provider }) {
  const providerIndex = providers.indexOf(provider)
  const totalJobs = Number.parseInt(provider.jobs, 10) || 0
  const fiveStar = 78 + (providerIndex % 13)
  const remainder = 100 - fiveStar
  const fourStar = Math.round(remainder * 0.6)
  const threeStar = Math.round(remainder * 0.25)
  const twoStar = Math.round(remainder * 0.1)
  const oneStar = remainder - fourStar - threeStar - twoStar
  const ratingBreakdown = [fiveStar, fourStar, threeStar, twoStar, oneStar]
  const history = profileHistoryByCategory[provider.category] ?? ['Local service visit', 'Neighbor support session', 'Follow-up service']
  const quotes = profileQuotesByCategory[provider.category] ?? profileQuotesByCategory['Home repairs']

  return (
    <main className="min-h-screen bg-[#f1f1ef] text-ink">
      <header className="flex items-center justify-between border-b border-black/10 px-5 py-5 sm:px-10 lg:px-16">
        <Logo />
        <a href="/find-help" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/65 transition hover:text-black"><span aria-hidden="true">←</span> All helpers</a>
      </header>
      <section className="bg-[#151515] text-white">
        <div className="mx-auto grid max-w-[1260px] gap-8 px-5 py-10 sm:px-10 sm:py-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-14 lg:px-16">
          <div className="relative aspect-[1.2] overflow-hidden rounded-2xl bg-white/10 sm:aspect-[1.45] lg:aspect-square">
            <img src={provider.image} alt={`${provider.name}`} className="h-full w-full object-cover" />
            <span className="absolute bottom-4 left-4 bg-white px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-black">{provider.area}, Accra</span>
          </div>
          <div>
            <a href="/find-help" className="text-[10px] uppercase tracking-[0.16em] text-white/45 hover:text-white">Find help <span aria-hidden="true">/</span> {provider.category}</a>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-medium tracking-[-0.05em] sm:text-6xl">{provider.name}</h1>
              {provider.verified && <span className="inline-flex items-center gap-1 rounded-full bg-lime px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-black"><ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />Verified</span>}
            </div>
            <p className="mt-3 text-sm text-white/60">{provider.service} <span aria-hidden="true">·</span> {provider.area}</p>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/65">{provider.name} offers {provider.service.toLowerCase()} in {provider.area} and nearby neighborhoods. Review the service details, sample work history and community feedback before getting in touch.</p>
            <div className="mt-8 grid grid-cols-3 gap-3 border-y border-white/10 py-5">
              <div><p className="text-2xl font-medium">★ {provider.rating}</p><p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/40">Sample rating</p></div>
              <div><p className="text-2xl font-medium">{totalJobs}</p><p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/40">Sample jobs</p></div>
              <div><p className="text-xl font-medium">{provider.price.replace('From ', '')}</p><p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/40">Starting price</p></div>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={`/contact?helper=${encodeURIComponent(provider.name)}`} className="inline-flex items-center gap-2 bg-lime px-5 py-4 text-xs font-semibold uppercase tracking-wide text-black transition hover:bg-white">Contact {provider.name.split(' ')[0]} <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></a>
              <a href="/payment-methods" className="inline-flex items-center gap-2 border border-white/20 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white">Payment options</a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1260px] gap-10 px-5 py-14 sm:px-10 sm:py-16 lg:grid-cols-[1fr_0.8fr] lg:gap-16 lg:px-16">
        <div>
          <div className="flex items-end justify-between gap-4 border-b border-black/15 pb-5">
            <div><p className="eyebrow">Recent activity · demo</p><h2 className="mt-3 text-3xl font-medium tracking-[-0.04em]">Work history</h2></div>
            <span className="text-xs text-black/45">{totalJobs} sample jobs</span>
          </div>
          <div className="divide-y divide-black/10">
            {history.map((item, index) => (
              <article key={item} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-lime text-xs font-semibold">0{index + 1}</span>
                <div><h3 className="text-sm font-medium">{item}</h3><p className="mt-1 text-xs text-black/50">{provider.category} <span aria-hidden="true">·</span> {provider.area}</p></div>
                <span className="text-right text-[9px] uppercase tracking-[0.1em] text-black/40">{['Recent', 'Last month', 'Earlier'][index]}</span>
              </article>
            ))}
          </div>
          <p className="mt-4 border-l-2 border-black/15 pl-4 text-xs leading-relaxed text-black/50">Work history shown here is illustrative demo content, not verified transaction history.</p>
        </div>

        <aside className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
          <p className="eyebrow">Sample profile insights</p>
          <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em]">At a glance.</h2>
          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="bg-[#f2f1ee] p-4"><p className="text-2xl font-medium">{34 + (providerIndex % 29)}%</p><p className="mt-1 text-[9px] uppercase tracking-[0.11em] text-black/45">Repeat clients · demo</p></div>
            <div className="bg-[#f2f1ee] p-4"><p className="text-2xl font-medium">{1 + (providerIndex % 5)} hrs</p><p className="mt-1 text-[9px] uppercase tracking-[0.11em] text-black/45">Reply time · demo</p></div>
          </div>
          <div className="mt-7">
            <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Rating breakdown</h3><span className="text-[9px] uppercase tracking-[0.1em] text-black/40">Illustrative</span></div>
            <div className="mt-4 space-y-2.5">
              {ratingBreakdown.map((percent, index) => (
                <div key={index} className="grid grid-cols-[2rem_1fr_2rem] items-center gap-3 text-xs">
                  <span className="text-black/55">{5 - index} ★</span>
                  <div className="h-1.5 overflow-hidden rounded-full bg-black/5"><div className="h-full rounded-full bg-black" style={{ width: `${percent}%` }} /></div>
                  <span className="text-right text-black/45">{percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="bg-[#e7e6e1]">
        <div className="mx-auto max-w-[1260px] px-5 py-14 sm:px-10 sm:py-16 lg:px-16">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-black/15 pb-5">
            <div><p className="eyebrow">Community notes · demo</p><h2 className="mt-3 text-3xl font-medium tracking-[-0.04em]">What neighbors say.</h2></div>
            <div className="text-sm"><span className="font-medium">★ {provider.rating}</span><span className="ml-2 text-black/50">Illustrative sample rating</span></div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {quotes.map((quote, index) => (
              <article key={quote} className="flex min-h-48 flex-col justify-between border border-black/10 bg-white/75 p-5">
                <p className="text-lg leading-snug">“{quote}”</p>
                <div className="mt-8 flex items-center justify-between gap-3 border-t border-black/10 pt-4 text-xs">
                  <span className="font-medium">{['A neighbor', 'Local client', 'Repeat client'][index]}</span>
                  <span className="text-black/45">{['Recent', 'A few weeks ago', 'Earlier this year'][index]}</span>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 text-[10px] leading-relaxed text-black/45">These comments are sample content for the prototype; they are not real customer reviews.</p>
        </div>
      </section>
      <DetailFooter />
    </main>
  )
}

function PaymentMethodsPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="flex items-center justify-between border-b border-black/10 px-5 py-5 sm:px-10 lg:px-16">
        <Logo />
        <a href="/" className="text-xs font-medium text-black/60 transition hover:text-black">Back to home</a>
      </header>
      <section className="bg-lime">
        <div className="mx-auto max-w-[1260px] px-5 py-12 sm:px-10 sm:py-16 lg:px-16">
          <p className="eyebrow">Paystack checkout · Ghana</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-medium leading-[0.95] tracking-[-0.05em] sm:text-7xl">Pay your neighbor, securely.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-black/65 sm:text-base">Choose an amount and pay for agreed local work with a card or mobile money. Payment details are handled by Paystack checkout.</p>
        </div>
      </section>
      <PaymentCheckout />
      <DetailFooter />
    </main>
  )
}

function DetailPage({ pathname }: DetailPageProps) {
  const pageNotFound = !detailPages[pathname]
  const page = detailPages[pathname] ?? {
    eyebrow: '404 · Page not found',
    title: 'This page isn’t here.',
    intro: 'The link may be out of date. Browse local helpers or return to the home page.',
  }
  const highlight = pageHighlights[pathname]
  const primaryAction = pathname === '/become-a-helper'
    ? { href: '#helper-application', label: 'Start your application' }
    : pathname === '/contact'
      ? { href: 'mailto:hello@neighborhelp.co', label: 'Email our team' }
      : pathname === '/payment-methods'
        ? { href: '#payment-form', label: 'Add a payment method' }
        : pathname === '/find-help'
          ? { href: '#helper-directory', label: 'Browse local helpers' }
          : { href: '/find-help', label: 'Find a helper' }
  const secondaryAction = pathname === '/become-a-helper'
    ? { href: '/how-it-works', label: 'See how it works' }
    : pathname === '/contact'
      ? { href: '/find-help', label: 'Browse the directory' }
      : pathname === '/payment-methods'
        ? { href: '/how-it-works', label: 'See how it works' }
        : pathname === '/find-help'
          ? { href: '/how-it-works', label: 'How NeighborHelp works' }
          : { href: '/contact', label: 'Talk to our team' }
  const contactHelper = pathname === '/contact' ? new URLSearchParams(window.location.search).get('helper') : null
  const [menuOpen, setMenuOpen] = useState(false)
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [isNavScrolled, setIsNavScrolled] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [paymentSaved, setPaymentSaved] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile-money'>('card')
  const [directorySearch, setDirectorySearch] = useState('')
  const [directoryCategory, setDirectoryCategory] = useState(() => new URLSearchParams(window.location.search).get('category') ?? 'All services')
  const [directorySort, setDirectorySort] = useState('nearest')
  const [directoryView, setDirectoryView] = useState<'grid' | 'list'>('grid')
  const handleBack = () => {
    const referrer = document.referrer
    if (referrer && new URL(referrer).origin === window.location.origin) {
      window.history.back()
      return
    }
    window.location.assign('/')
  }
  useEffect(() => {
    let hideTimeout: number | undefined
    const updateNavigation = () => {
      const isScrolled = window.scrollY > 40
      setIsNavScrolled(isScrolled)
      setIsNavVisible(true)
      window.clearTimeout(hideTimeout)
      if (isScrolled && !menuOpen) {
        hideTimeout = window.setTimeout(() => setIsNavVisible(false), 5000)
      }
    }

    window.addEventListener('scroll', updateNavigation, { passive: true })
    updateNavigation()
    return () => {
      window.removeEventListener('scroll', updateNavigation)
      window.clearTimeout(hideTimeout)
    }
  }, [menuOpen])

  const directoryProviders = useMemo(() => providers
    .filter((provider) => {
      const query = directorySearch.toLowerCase().trim()
      const matchesCategory = directoryCategory === 'All services' || provider.category === directoryCategory
      const matchesSearch = !query || `${provider.name} ${provider.service} ${provider.area}`.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
    .sort((first, second) => {
      if (directorySort === 'price') return first.priceValue - second.priceValue
      if (directorySort === 'rating') return Number(second.rating) - Number(first.rating)
      if (directorySort === 'experience') return Number(second.jobs.split(' ')[0]) - Number(first.jobs.split(' ')[0])
      return first.distance - second.distance
    }), [directoryCategory, directorySearch, directorySort])

  return (
    <main className="min-h-screen bg-paper text-ink">
      <nav className={`site-nav mx-auto flex w-[calc(100%-32px)] max-w-[1380px] items-center justify-between py-5 sm:w-[calc(100%-64px)]${isNavVisible || !isNavScrolled || menuOpen ? '' : ' is-idle-hidden'}`}>
        <Logo />
        <div id="detail-nav-menu" className={`detail-nav-menu mobile-nav-panel ${menuOpen ? 'is-open' : 'is-closed'} absolute left-4 right-4 top-16 z-30 flex flex-col gap-5 rounded-xl bg-paper p-5 shadow-xl xl:static xl:flex-row xl:items-center xl:gap-8 xl:bg-transparent xl:p-0 xl:shadow-none`}>
          <a href="/find-help" className="nav-link">Find help</a>
          <a href="/reviews" className="nav-link">Reviews</a>
          <a href="/how-it-works" className="nav-link">How it works</a>
          <a href="/become-a-helper" className="nav-link">Become a helper</a>
          <a href="/payment-methods" className="nav-link">Payment methods</a>
          <a href="/contact" className="nav-link">Contact</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="detail-back-button" type="button" onClick={handleBack}>
            <svg aria-hidden="true" height={16} width={16} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
              <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z" />
            </svg>
            <span>Back</span>
          </button>
          <button
            className={`detail-burger burger xl:hidden ${menuOpen ? 'is-open' : ''}`}
            type="button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            aria-controls="detail-nav-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <section className={`detail-hero ${pathname === '/how-it-works' || pathname === '/safety' ? 'detail-hero-dark' : ''} ${pathname === '/become-a-helper' ? 'detail-hero-lime' : ''}`}>
        <div className="mx-auto grid max-w-[1260px] items-end gap-12 px-5 pb-20 pt-20 sm:px-10 sm:pb-24 sm:pt-28 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:px-16">
          <div>
            <div className="mb-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-black/45">
              <a href="/" className="transition hover:text-black">Home</a>
              <span aria-hidden="true">/</span>
              <span>{page.eyebrow}</span>
            </div>
            <h1 className="max-w-4xl text-5xl font-medium leading-[0.92] tracking-[-0.045em] sm:text-7xl lg:text-8xl">{page.title}</h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-black/60 sm:text-lg">{page.intro}</p>
            {highlight && (
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a className="button-dark inline-flex items-center gap-3" href={primaryAction.href}>{primaryAction.label}<ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></a>
                <a className="text-sm font-medium text-black/65 underline decoration-black/20 underline-offset-4 transition hover:text-black hover:decoration-black" href={secondaryAction.href}>{secondaryAction.label}</a>
              </div>
            )}
          </div>
          {highlight && (
            <aside className="detail-hero-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-lime">{highlight.kicker}</p>
                  <p className="mt-7 text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl">{highlight.metric}</p>
                  <h2 className="mt-3 max-w-xs text-xl font-medium leading-tight text-white">{highlight.title}</h2>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lime text-black" aria-hidden="true"><ArrowUpRight className="h-6 w-6 stroke-[2.5]" /></span>
              </div>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">{highlight.detail}</p>
              <div className="mt-8 border-t border-white/15 pt-5">
                {highlight.points.map((point) => <p className="flex items-center gap-3 py-2 text-xs text-white/75" key={point}><span className="h-1.5 w-1.5 rounded-full bg-lime" />{point}</p>)}
              </div>
            </aside>
          )}
        </div>
      </section>

      {pageNotFound && (
        <section className="mx-auto max-w-[1260px] px-5 pb-24 sm:px-10 lg:px-16">
          <div className="border border-black/10 bg-white p-8 sm:p-12">
            <p className="text-sm text-black/60">Choose where you’d like to continue.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a className="button-dark inline-block" href="/find-help">Browse helpers</a>
              <a className="inline-block border border-black/20 px-5 py-3 text-xs font-semibold uppercase tracking-wide" href="/">Back home</a>
            </div>
          </div>
        </section>
      )}

      {pathname === '/find-help' && (
        <section id="helper-directory" className="bg-[#f2f1ee] text-[#111]">
          <div className="mx-auto max-w-[1260px] px-5 py-20 sm:px-10 lg:px-16">
            <div className="mb-8 flex flex-wrap gap-2">
              {categories.slice(1).map((category) => (
                <button
                  onClick={() => setDirectoryCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${directoryCategory === category ? 'border-black bg-black text-white' : 'border-black/15 bg-white text-black/70 hover:border-black hover:text-black'}`}
                  key={category}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="mb-10 grid gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_auto_auto]">
              <input value={directorySearch} onChange={(event) => setDirectorySearch(event.target.value)} className="min-w-0 border-b border-black/10 bg-transparent px-0 py-3 text-sm text-black outline-none placeholder:text-black/45" placeholder="Search name, service or neighborhood" />
              <select value={directoryCategory} onChange={(event) => setDirectoryCategory(event.target.value)} className="border-b border-black/10 bg-white px-0 py-3 text-sm text-black outline-none"><option>All services</option>{categories.slice(1).map((category) => <option key={category}>{category}</option>)}</select>
              <select value={directorySort} onChange={(event) => setDirectorySort(event.target.value)} className="border-b border-black/10 bg-white px-0 py-3 text-sm text-black outline-none"><option value="nearest">Nearest first</option><option value="price">Lowest price</option><option value="rating">Highest rated</option><option value="experience">Most experience</option></select>
              <div className="helper-view-toggle flex items-center gap-1">
                <button className={`view-toggle ${directoryView === 'grid' ? 'is-active' : ''}`} onClick={() => setDirectoryView('grid')} aria-label="Show grid view">Grid</button>
                <button className={`view-toggle ${directoryView === 'list' ? 'is-active' : ''}`} onClick={() => setDirectoryView('list')} aria-label="Show list view">List</button>
              </div>
            </div>
            <p className="mb-5 text-xs text-black/55" role="status" aria-live="polite">{directoryProviders.length} helpers found · sorted by {directorySort === 'nearest' ? 'distance' : directorySort}</p>
            <div className={`helper-results-grid grid gap-3 ${directoryView === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-4' : ''}`}>
              {directoryProviders.map((provider) => (
                <article className={`helper-result-card overflow-hidden border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-black ${directoryView === 'list' ? 'flex flex-col sm:flex-row sm:items-center sm:gap-5' : ''}`} key={provider.name}>
                  {directoryView === 'grid' && (
                    <div className="helper-result-photo profile-image relative mb-5 overflow-hidden rounded-xl" style={{ backgroundColor: provider.color, height: '220px', backgroundPosition: 'center', backgroundSize: 'cover' }}>
                      <img className="absolute inset-0 h-full w-full object-cover" src={provider.image} alt={`${provider.name} profile`} />
                      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-xs font-medium text-black shadow-sm">{provider.initials}</span>
                        <span className="rounded-full bg-white/90 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-black">{provider.area}</span>
                      </div>
                    </div>
                  )}
                  <div className={`helper-result-primary ${directoryView === 'list' ? 'flex items-center justify-between gap-3' : ''}`}>
                    <div className={`flex min-w-0 items-center gap-3 ${directoryView === 'list' ? '' : 'justify-between'}`}>
                      {directoryView === 'list' && (
                        <span className="helper-result-avatar grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-medium text-black" style={{ backgroundColor: provider.color }}>{provider.initials}</span>
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-medium tracking-[-0.02em]"><a className="hover:underline" href={`/helpers/${providerSlug(provider)}`}>{provider.name}</a></h3>
                        <p className="mt-1 text-xs text-black/60">{provider.service}</p>
                        <p className="helper-result-area-mobile mt-1 text-[10px] text-black/45">{provider.area}</p>
                      </div>
                    </div>
                    {directoryView === 'list' && (
                      <span className="helper-result-area-chip rounded-full border border-black/10 bg-[#f7f6f2] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-black/60">{provider.area}</span>
                    )}
                  </div>
                  <div className="helper-result-metadata mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-4 text-xs">
                    <span>★ {provider.rating} · {provider.jobs}</span>
                    <span>{provider.distance} km · {provider.price}</span>
                  </div>
                  <a href={`/helpers/${providerSlug(provider)}`} className="helper-result-action mt-4 inline-flex w-full items-center justify-center gap-1 border border-black/15 bg-black px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black/80 sm:w-fit">Contact helper <ArrowUpRight className="h-3.5 w-3.5 shrink-0" /></a>
                </article>
              ))}
              {!directoryProviders.length && (
                <div className="col-span-full border border-dashed border-black/20 bg-white/70 px-6 py-14 text-center" role="status">
                  <h2 className="text-2xl font-medium">No helpers found</h2>
                  <p className="mt-2 text-sm text-black/55">Try a different name, service or neighborhood, or clear your filters.</p>
                  <button className="mt-5 border border-black/20 px-4 py-3 text-xs font-semibold uppercase tracking-wide transition hover:bg-black hover:text-white" onClick={() => { setDirectorySearch(''); setDirectoryCategory('All services') }}>Clear search and filters</button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}


      {pathname === '/reviews' && (
        <section className="bg-[#deded8]">
          <div className="mx-auto max-w-[1260px] px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-6 border-b border-black/15 pb-6">
              <div><p className="eyebrow">From around the neighborhood</p><h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">Good work. Good people.</h2></div>
              <a className="inline-flex items-center gap-1 text-sm font-medium underline decoration-black/25 underline-offset-4 hover:decoration-black" href="/find-help">Find your neighbor <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></a>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, index) => (
                <article className={`review-card ${index === 1 ? 'review-card-featured' : ''}`} key={review.name}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm tracking-[0.16em] text-[#71811b]" aria-label="5 out of 5 stars">★★★★★</span>
                    <span className="rounded-full border border-black/10 px-3 py-1 text-[9px] uppercase tracking-[0.14em] text-black/55">Neighbor story</span>
                  </div>
                  <p className="mt-10 text-2xl font-medium leading-[1.04] tracking-[-0.025em]">“{review.quote}”</p>
                  <div className="mt-12 flex items-center gap-3 border-t border-black/10 pt-5 text-xs">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-white">{review.initials}</span>
                    <span className="font-medium">{review.name}<br /><span className="font-normal text-black/50">{review.detail}</span></span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {pathname === '/how-it-works' && (
        <section className="bg-charcoal text-white">
          <div className="mx-auto max-w-[1260px] px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
            <div className="mb-10 max-w-xl"><p className="eyebrow text-lime">Three simple steps</p><h2 className="mt-4 text-4xl font-medium leading-[0.98] tracking-[-0.035em] sm:text-5xl">Good help should feel easy to find.</h2></div>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ['01', 'Tell us what you need', 'Search by service, location or the kind of help you are looking for.', <Search key="1" className="h-5 w-5" />],
                ['02', 'Choose your neighbor', 'Compare profiles, reviews, prices and location before you decide.', <ArrowUpRight key="2" className="h-5 w-5" />],
                ['03', 'Request an introduction', 'Share a short note, agree on scope and price directly, then review the work together.', <Check key="3" className="h-5 w-5" />],
              ].map(([number, title, description, icon]) => (
                <article className="process-card" key={number as string}>
                  <div className="flex items-start justify-between"><span className="text-xs text-lime">{number as string} / 03</span><span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-lime" aria-hidden="true">{icon as React.ReactNode}</span></div>
                  <h3 className="mt-12 text-2xl font-medium leading-tight tracking-[-0.025em]">{title as string}</h3>
                  <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">{description as string}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 flex flex-col justify-between gap-5 border-t border-white/15 pt-7 sm:flex-row sm:items-center">
              <p className="max-w-lg text-sm leading-relaxed text-white/55">No complicated booking steps. Have a clear conversation and make sure the details feel right to both sides.</p>
              <a className="inline-flex w-fit items-center gap-2 bg-lime px-5 py-4 text-xs font-semibold uppercase tracking-wide text-black transition hover:bg-white" href="/find-help">Meet local helpers <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></a>
            </div>
          </div>
        </section>
      )}

      {pathname === '/become-a-helper' && <section id="helper-application" className="bg-lime"><div className="mx-auto max-w-[1260px] px-5 py-16 sm:px-10 sm:py-20 lg:px-16"><div className="mb-10 max-w-xl"><p className="eyebrow">Start with the basics</p><h2 className="mt-3 text-4xl font-medium leading-[0.98] tracking-[-0.035em] sm:text-5xl">Tell us what you bring.</h2><p className="mt-4 text-sm leading-relaxed text-black/65">Share a few details. This prototype won’t submit or store your information.</p></div><div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><aside className="border-t border-black/15 pt-5"><p className="text-xs uppercase tracking-[0.14em] text-black/55">A good first profile includes</p><ul className="mt-5 space-y-4 text-sm"><li className="flex gap-3"><span>01</span><span>A clear service you can provide</span></li><li className="flex gap-3"><span>02</span><span>The neighborhood you work in</span></li><li className="flex gap-3"><span>03</span><span>A way for neighbors to reach you</span></li></ul></aside><form className="helper-application-form" onSubmit={(event) => { event.preventDefault(); setFormSubmitted(true) }}><label className="sr-only" htmlFor="helper-name">Your name</label><input id="helper-name" name="name" autoComplete="name" className="w-full border-b border-black/40 bg-transparent px-0 py-4 outline-none placeholder:text-black/50" placeholder="Your name" required /><label className="sr-only" htmlFor="helper-skill">What can you help with?</label><input id="helper-skill" name="skill" className="w-full border-b border-black/40 bg-transparent px-0 py-4 outline-none placeholder:text-black/50" placeholder="What can you help with?" required /><label className="sr-only" htmlFor="helper-area">Your neighborhood</label><input id="helper-area" name="area" className="w-full border-b border-black/40 bg-transparent px-0 py-4 outline-none placeholder:text-black/50" placeholder="Your neighborhood" required /><label className="sr-only" htmlFor="helper-email">Your email</label><input id="helper-email" name="email" type="email" autoComplete="email" className="w-full border-b border-black/40 bg-transparent px-0 py-4 outline-none placeholder:text-black/50" placeholder="Your email address" required /><div className="flex flex-wrap items-center gap-5 pt-4"><button className="inline-flex items-center gap-2 bg-black px-6 py-4 text-xs font-semibold text-white transition hover:bg-black/75" type="submit">Start your application <ArrowUpRight className="h-4 w-4 shrink-0" /></button><p className="min-h-5 text-sm text-black/75" aria-live="polite">{formSubmitted ? 'Thanks. This prototype does not send or store applications.' : ''}</p></div></form></div></div></section>}
      {pathname === '/payment-methods' && <section id="payment-form" className="bg-[#f2f1ee]"><div className="mx-auto max-w-[1260px] px-5 py-20 sm:px-10 lg:px-16"><div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20"><div><p className="eyebrow">Secure and simple</p><h2 className="mt-4 max-w-sm text-4xl font-medium leading-[0.98] tracking-[-0.035em] sm:text-5xl">Add a payment method.</h2><p className="mt-5 max-w-sm text-sm leading-relaxed text-black/60">Choose the option that fits how you prefer to pay for trusted local work.</p><div className="mt-8 space-y-3 rounded-2xl border border-black/10 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs uppercase tracking-[0.14em] text-black/50">Accepted</span><span className="rounded-full bg-lime px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-black">Local support</span></div><ul className="space-y-3 text-sm text-black/70"><li className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-black" />Debit or credit card</li><li className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-black" />Mobile money</li><li className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-black" />Saved backup method</li></ul></div></div><form className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8" onSubmit={(event) => { event.preventDefault(); setPaymentSaved(true) }}><div className="mb-6 flex flex-wrap gap-2"><button type="button" onClick={() => setPaymentMethod('card')} className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${paymentMethod === 'card' ? 'border-black bg-black text-white' : 'border-black/15 bg-transparent text-black/70'}`}>Card</button><button type="button" onClick={() => setPaymentMethod('mobile-money')} className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${paymentMethod === 'mobile-money' ? 'border-black bg-black text-white' : 'border-black/15 bg-transparent text-black/70'}`}>Mobile money</button></div>{paymentMethod === 'card' ? (<div className="grid gap-5"><label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55"><span>Name on card</span><input className="border-b border-black/20 bg-transparent px-0 py-3 text-base text-black outline-none placeholder:text-black/40" placeholder="Ada Mensah" required /></label><label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55"><span>Card number</span><input className="border-b border-black/20 bg-transparent px-0 py-3 text-base text-black outline-none placeholder:text-black/40" inputMode="numeric" placeholder="1234 5678 9012 3456" required /></label><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55"><span>Expiry</span><input className="border-b border-black/20 bg-transparent px-0 py-3 text-base text-black outline-none placeholder:text-black/40" placeholder="MM / YY" required /></label><label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55"><span>CVV</span><input className="border-b border-black/20 bg-transparent px-0 py-3 text-base text-black outline-none placeholder:text-black/40" inputMode="numeric" placeholder="123" required /></label></div></div>) : (<div className="grid gap-5"><label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55"><span>Mobile money name</span><input className="border-b border-black/20 bg-transparent px-0 py-3 text-base text-black outline-none placeholder:text-black/40" placeholder="Kofi Mensah" required /></label><label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55"><span>Wallet number</span><input className="border-b border-black/20 bg-transparent px-0 py-3 text-base text-black outline-none placeholder:text-black/40" inputMode="numeric" placeholder="024 123 4567" required /></label><label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55"><span>Network</span><select className="border-b border-black/20 bg-transparent px-0 py-3 text-base text-black outline-none"><option value="">Choose a network</option><option>MTN Mobile Money</option><option>Telecel Cash</option><option>AirtelTigo Money</option></select></label></div>)}<div className="mt-8 flex flex-wrap items-center gap-5"><button className="inline-flex items-center gap-2 bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black/80" type="submit">Add payment method <ArrowUpRight className="h-4 w-4 shrink-0" /></button><p className="min-h-5 text-sm text-black/75" aria-live="polite">{paymentSaved ? 'Payment method saved. This prototype does not store real card information.' : 'No payment is processed in this demo.'}</p></div></form></div></div></section>}
      {pathname === '/contact' && <section className="bg-charcoal text-white"><div className="mx-auto max-w-[1260px] px-5 py-20 sm:px-10 lg:px-16"><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]"><div><p className="eyebrow text-lime">We’re here to help</p><h2 className="mt-5 max-w-sm text-5xl font-medium leading-[0.9] sm:text-7xl">{contactHelper ? `Contact ${contactHelper}.` : 'Say hello.'}</h2><div className="mt-10 space-y-3 text-sm text-white/60"><p>{contactHelper ? `Send an introduction request for ${contactHelper}.` : 'Have a question or partnership idea? Send us a note.'}</p><p>hello@neighborhelp.co</p><p>Accra, Ghana · Mon–Fri, 9:00–17:00</p></div></div><form className="contact-form grid gap-5" onSubmit={(event) => { event.preventDefault(); setFormSubmitted(true) }}><label className="sr-only" htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" className="border-b border-white/30 bg-transparent px-0 py-4 text-white outline-none placeholder:text-white/45" placeholder="Your name" required /><label className="sr-only" htmlFor="contact-email">Email address</label><input id="contact-email" name="email" autoComplete="email" className="border-b border-white/30 bg-transparent px-0 py-4 text-white outline-none placeholder:text-white/45" type="email" placeholder="Email address" required /><label className="sr-only" htmlFor="contact-topic">What can we help with?</label><select id="contact-topic" name="topic" className="border-b border-white/30 bg-charcoal px-0 py-4 text-white/70 outline-none" defaultValue={contactHelper ? 'Finding a helper' : ''} required><option value="" disabled>What can we help with?</option><option>Finding a helper</option><option>Becoming a helper</option><option>Partnerships</option></select><label className="sr-only" htmlFor="contact-message">Tell us a little more</label><textarea id="contact-message" name="message" className="border-b border-white/30 bg-transparent px-0 py-4 text-white outline-none placeholder:text-white/45" placeholder={contactHelper ? `What do you need help with from ${contactHelper}?` : 'Tell us a little more'} rows={4} required /><button className="mt-3 inline-flex w-fit items-center gap-2 bg-lime px-6 py-4 text-xs font-semibold text-black transition hover:bg-white" type="submit">Send message <ArrowUpRight className="h-4 w-4 shrink-0" /></button><p className="min-h-5 text-sm text-lime" aria-live="polite">{formSubmitted ? 'Thanks. This prototype does not send or store messages.' : ''}</p></form></div></div></section>}
      {(pathname === '/about' || pathname === '/safety') && (
        <section className="bg-charcoal text-white">
          <div className="mx-auto max-w-[1260px] px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
              <div>
                <p className="eyebrow text-lime">{pathname === '/about' ? 'What guides us' : 'Before you connect'}</p>
                <h2 className="mt-4 max-w-sm text-4xl font-medium leading-[0.98] tracking-[-0.035em] sm:text-5xl">{pathname === '/about' ? 'Built around everyday neighborhood life.' : 'A few thoughtful steps go a long way.'}</h2>
                <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">{pathname === '/about' ? 'We want useful local skills to be easier to find and easier to share.' : 'Use the details on each profile to make a choice that feels informed and comfortable.'}</p>
              </div>
              <div className="grid gap-px border border-white/15 bg-white/15 md:grid-cols-3">
                {(pathname === '/about'
                  ? [['01', 'Local first', 'NeighborHelp is designed around how people already ask for and share help in Accra.'], ['02', 'Useful by default', 'We focus on practical services that make home and everyday life easier.'], ['03', 'Built together', 'The best local network is shaped by the people who use it.']]
                  : [['01', 'Review the details', 'Look over services, ratings, location and starting prices before deciding.'], ['02', 'Agree clearly', 'Talk through the scope, timing and price before work begins.'], ['03', 'Be respectful', 'Set shared expectations and keep communication clear on both sides.']]
                ).map(([number, title, description]) => (
                  <article className="bg-charcoal p-6 sm:p-7" key={number}>
                    <span className="text-xs text-lime">{number} / 03</span>
                    <h3 className="mt-10 text-xl font-medium leading-tight">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/50">{description}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="mt-10 flex flex-col justify-between gap-5 border-t border-white/15 pt-7 sm:flex-row sm:items-center">
              <p className="max-w-lg text-sm leading-relaxed text-white/55">{pathname === '/about' ? 'Good help is personal. NeighborHelp is a starting point for neighbors to meet and work together.' : 'NeighborHelp is an introduction point, not a guarantee. Trust your judgment and only proceed when the plan feels right.'}</p>
              <a className="inline-flex w-fit items-center gap-2 border border-white/25 px-5 py-4 text-xs font-semibold uppercase tracking-wide transition hover:border-lime hover:text-lime" href={pathname === '/about' ? '/find-help' : '/how-it-works'}>{pathname === '/about' ? 'Explore the directory' : 'See how it works'} <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></a>
            </div>
          </div>
        </section>
      )}
      <DetailContentSection pathname={pathname} />
      <DetailFooter />
    </main>
  )
}

type AccountRole = 'hire' | 'work'
type AccountMode = 'signup' | 'signin'

type DashboardUser = {
  role: AccountRole
  name: string
  email: string
}

function AccountPage({ onDashboard }: { onDashboard: (role: AccountRole, name: string, email: string) => void }) {
  const [role, setRole] = useState<AccountRole | null>(() => {
    const requestedRole = new URLSearchParams(window.location.search).get('role')
    return requestedRole === 'hire' || requestedRole === 'work' ? requestedRole : null
  })
  const [mode, setMode] = useState<AccountMode>('signup')
  const [status, setStatus] = useState('')

  const submitCredentials = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!role) return

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()
    const enteredName = String(formData.get('name') ?? '').trim()
    const name = enteredName || email.split('@')[0] || 'Neighbor'
    onDashboard(role, name, email)
  }

  return (
    <main className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="flex items-center justify-between border-b border-black/10 px-5 py-5 sm:px-10 lg:px-16">
        <Logo />
        <a href="/" className="text-xs font-medium text-black/60 transition hover:text-black">Back to home</a>
      </header>
      <section className="mx-auto grid w-full max-w-[1100px] flex-1 items-center gap-12 px-5 py-12 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-16">
        <div>
          <p className="eyebrow">Your neighborhood starts here</p>
          <h1 className="mt-5 max-w-lg text-5xl font-medium leading-[0.92] tracking-[-0.045em] sm:text-7xl">Good people, close by.</h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-black/60 sm:text-base">Create an account to find trusted local help or offer your skills to people nearby.</p>
          <p className="mt-8 border-l-2 border-lime pl-4 text-xs leading-relaxed text-black/55">Demo access only: submitting opens a sample dashboard. No account is created, and passwords are never saved or sent.</p>
        </div>

        <div className="border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-black/50">I’m here to</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2" role="group" aria-label="Choose how you want to use NeighborHelp">
            <button type="button" aria-pressed={role === 'hire'} onClick={() => { setRole('hire'); setStatus('') }} className={`border p-4 text-left transition ${role === 'hire' ? 'border-black bg-black text-white' : 'border-black/15 hover:border-black'}`}>
              <span className="block text-sm font-semibold">Hire someone</span>
              <span className={`mt-1 block text-xs ${role === 'hire' ? 'text-white/65' : 'text-black/55'}`}>Find help for a task</span>
            </button>
            <button type="button" aria-pressed={role === 'work'} onClick={() => { setRole('work'); setStatus('') }} className={`border p-4 text-left transition ${role === 'work' ? 'border-black bg-black text-white' : 'border-black/15 hover:border-black'}`}>
              <span className="block text-sm font-semibold">Find work</span>
              <span className={`mt-1 block text-xs ${role === 'work' ? 'text-white/65' : 'text-black/55'}`}>Offer your skills locally</span>
            </button>
          </div>

          {role && (
            <>
              <div className="mt-7 grid grid-cols-2 border-b border-black/10" role="tablist" aria-label="Account access">
                <button type="button" role="tab" aria-selected={mode === 'signup'} onClick={() => { setMode('signup'); setStatus('') }} className={`border-b-2 py-3 text-sm font-medium transition ${mode === 'signup' ? 'border-black text-black' : 'border-transparent text-black/45'}`}>Create account</button>
                <button type="button" role="tab" aria-selected={mode === 'signin'} onClick={() => { setMode('signin'); setStatus('') }} className={`border-b-2 py-3 text-sm font-medium transition ${mode === 'signin' ? 'border-black text-black' : 'border-transparent text-black/45'}`}>Sign in</button>
              </div>

              <form className="mt-6 grid gap-4" onSubmit={submitCredentials}>
                {mode === 'signup' && (
                  <label className="grid gap-2 text-xs font-medium" htmlFor="account-name">
                    Your name
                    <input id="account-name" name="name" autoComplete="name" required className="border border-black/15 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black" placeholder="Enter your name" />
                  </label>
                )}
                <label className="grid gap-2 text-xs font-medium" htmlFor="account-email">
                  Email
                  <input id="account-email" name="email" type="email" autoComplete="email" required className="border border-black/15 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black" placeholder="Enter your email" />
                </label>
                <label className="grid gap-2 text-xs font-medium" htmlFor="account-password">
                  Password
                  <input id="account-password" name="password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={mode === 'signup' ? 8 : undefined} required className="border border-black/15 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black" placeholder={mode === 'signup' ? 'Create a password (8+ characters)' : 'Enter your password'} />
                </label>
                {mode === 'signin' && <button type="button" onClick={() => setStatus('Password recovery will be available when account authentication is connected.')} className="justify-self-end text-xs text-black/55 underline underline-offset-4 hover:text-black">Forgot password?</button>}
                <button type="submit" className="mt-2 inline-flex items-center justify-center gap-2 bg-black px-5 py-4 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-black/75">{mode === 'signup' ? 'Create account' : 'Sign in'} <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></button>
                {status && <p className="text-xs leading-relaxed text-black/65" role="status" aria-live="polite">{status}</p>}
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

const workerServiceOptions: Record<string, string[]> = {
  'Home repairs': ['Plumbing', 'Electrical work', 'Furniture assembly', 'Painting'],
  Tutoring: ['Maths tutoring', 'Science tutoring', 'Reading support', 'Exam preparation'],
  'Tech help': ['Laptop repair', 'Phone setup', 'Wi-Fi troubleshooting', 'Software lessons'],
  Creative: ['Graphic design', 'Photography', 'Social media content', 'Brand identity'],
  Errands: ['Grocery shopping', 'Local delivery', 'Pickup and drop-off', 'Queue assistance'],
}

type DemoJob = {
  id: number
  title: string
  category: string
  service: string
  area: string
  budget: string
  schedule: string
  posted: string
  client: string
  description: string
}

const demoJobs: DemoJob[] = [
  { id: 1, title: 'Fix a leaking kitchen sink', category: 'Home repairs', service: 'Plumbing', area: 'Osu', budget: 'GH₵180–250', schedule: 'Today · Flexible', posted: '18 min ago', client: 'Ama K.', description: 'The kitchen sink is leaking under the cabinet. Please inspect the pipe, explain what needs fixing and bring common replacement fittings if possible.' },
  { id: 2, title: 'Maths revision for a secondary student', category: 'Tutoring', service: 'Maths tutoring', area: 'Madina', budget: 'GH₵100–150 / session', schedule: 'This week · 2 sessions', posted: '42 min ago', client: 'Esi A.', description: 'Looking for patient, in-person support with fractions, algebra and exam practice for a secondary school student.' },
  { id: 3, title: 'Set up a home Wi-Fi router', category: 'Tech help', service: 'Wi-Fi troubleshooting', area: 'East Legon', budget: 'GH₵120–200', schedule: 'Tomorrow afternoon', posted: '1 hr ago', client: 'Kofi D.', description: 'Connect a new router, secure the network and make sure two laptops and three phones can connect reliably.' },
  { id: 4, title: 'Take photos for a small business', category: 'Creative', service: 'Photography', area: 'Cantonments', budget: 'GH₵350–500', schedule: 'Saturday morning', posted: '2 hrs ago', client: 'Nana B.', description: 'Need a short product and workspace photo session for a local food business. Please include a link to a few sample shots.' },
  { id: 5, title: 'Assemble a wardrobe and desk', category: 'Home repairs', service: 'Furniture assembly', area: 'Spintex', budget: 'GH₵200–300', schedule: 'This weekend', posted: '3 hrs ago', client: 'Yaw T.', description: 'Assemble one flat-pack wardrobe and a compact desk. The items are already delivered; basic tools may be needed.' },
  { id: 6, title: 'Pick up groceries and deliver', category: 'Errands', service: 'Grocery shopping', area: 'Labone', budget: 'GH₵60–100 + shopping', schedule: 'Today · Before 6pm', posted: '4 hrs ago', client: 'Mabel Q.', description: 'Shop from a nearby market using a short list, keep the receipt and deliver the bags to an apartment in Labone.' },
  { id: 7, title: 'Design a clean event flyer', category: 'Creative', service: 'Graphic design', area: 'Airport Residential', budget: 'GH₵250–400', schedule: 'Within 3 days', posted: '5 hrs ago', client: 'Selorm P.', description: 'Create one digital flyer for a community workshop. The client has the event copy and logo ready and would like two revision rounds.' },
  { id: 8, title: 'Replace a faulty wall light', category: 'Home repairs', service: 'Electrical work', area: 'Adenta', budget: 'GH₵150–220', schedule: 'Tomorrow · Morning', posted: 'Yesterday', client: 'Ato M.', description: 'A wall light stopped working. Please check the fitting and wiring safely and let the client know if additional parts are required.' },
]

function DashboardPage({ user }: { user: DashboardUser | null }) {
  const role = user?.role ?? (window.location.pathname.endsWith('/work') ? 'work' : 'hire')
  const isWorker = role === 'work'
  const name = user?.name ?? 'Neighbor'
  const [serviceCategory, setServiceCategory] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [workArea, setWorkArea] = useState('')
  const [rate, setRate] = useState('')
  const [bio, setBio] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoStatus, setPhotoStatus] = useState('')
  const photoObjectUrl = useRef<string | null>(null)
  const [experience, setExperience] = useState('')
  const [serviceRadius, setServiceRadius] = useState('')
  const [workMode, setWorkMode] = useState('')
  const [typicalAvailability, setTypicalAvailability] = useState('')
  const [languages, setLanguages] = useState<string[]>([])
  const [portfolioPhotos, setPortfolioPhotos] = useState<{ url: string; name: string }[]>([])
  const [portfolioStatus, setPortfolioStatus] = useState('')
  const portfolioObjectUrls = useRef<string[]>([])
  const [available, setAvailable] = useState(true)
  const [jobFilter, setJobFilter] = useState('All services')
  const [appliedJobs, setAppliedJobs] = useState<number[]>([])
  const [profileStatus, setProfileStatus] = useState('')
  const [jobStatus, setJobStatus] = useState('')
  const [hireCategory, setHireCategory] = useState('All services')
  const [hireArea, setHireArea] = useState('All areas')
  const [savedHelpers, setSavedHelpers] = useState<string[]>([])

  const profileFields = [
    serviceCategory, serviceType, workArea, rate, bio, photoUrl, experience,
    serviceRadius, workMode, typicalAvailability, languages.length > 0,
  ]
  const profileCompletion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100)
  const matchingJobs = useMemo(
    () => demoJobs.filter((job) => jobFilter === 'All services' || job.category === jobFilter),
    [jobFilter],
  )
  const matchingHelpers = useMemo(
    () => providers.filter((provider) =>
      (hireCategory === 'All services' || provider.category === hireCategory)
      && (hireArea === 'All areas' || provider.area === hireArea),
    ).slice(0, 6),
    [hireArea, hireCategory],
  )

  const saveDemoProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setProfileStatus('Profile preview updated for this session. It has not been saved to an account.')
  }

  useEffect(() => () => {
    if (photoObjectUrl.current) URL.revokeObjectURL(photoObjectUrl.current)
    portfolioObjectUrls.current.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setPhotoStatus('Choose an image file to use as your profile photo.')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoStatus('That image is larger than 5 MB. Choose a smaller photo.')
      event.target.value = ''
      return
    }

    if (photoObjectUrl.current) URL.revokeObjectURL(photoObjectUrl.current)
    const nextPhotoUrl = URL.createObjectURL(file)
    photoObjectUrl.current = nextPhotoUrl
    setPhotoUrl(nextPhotoUrl)
    setPhotoStatus('Photo ready for preview. It stays on this device and is not uploaded.')
    setProfileStatus('')
    event.target.value = ''
  }

  const removeProfilePhoto = () => {
    if (photoObjectUrl.current) URL.revokeObjectURL(photoObjectUrl.current)
    photoObjectUrl.current = null
    setPhotoUrl('')
    setPhotoStatus('Profile photo removed from this preview.')
    setProfileStatus('')
  }

  const handlePortfolioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (!files.length) return

    const remainingSlots = 4 - portfolioPhotos.length
    if (remainingSlots <= 0) {
      setPortfolioStatus('You can add up to 4 portfolio images.')
      return
    }

    const validFiles = files.filter((file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024)
    if (validFiles.length !== files.length) {
      setPortfolioStatus('Some files were skipped. Choose image files up to 5 MB each.')
    } else if (files.length > remainingSlots) {
      setPortfolioStatus(`Only ${remainingSlots} more ${remainingSlots === 1 ? 'image can' : 'images can'} be added (4 maximum).`)
    } else {
      setPortfolioStatus('')
    }

    const acceptedFiles = validFiles.slice(0, remainingSlots)
    const newPhotos = acceptedFiles.map((file) => {
      const url = URL.createObjectURL(file)
      portfolioObjectUrls.current.push(url)
      return { url, name: file.name }
    })
    if (newPhotos.length) {
      setPortfolioPhotos((current) => [...current, ...newPhotos])
      setProfileStatus('')
    }
  }

  const removePortfolioPhoto = (url: string) => {
    URL.revokeObjectURL(url)
    portfolioObjectUrls.current = portfolioObjectUrls.current.filter((photoUrl) => photoUrl !== url)
    setPortfolioPhotos((current) => current.filter((photo) => photo.url !== url))
    setPortfolioStatus('')
    setProfileStatus('')
  }

  const expressInterest = (job: DemoJob) => {
    if (appliedJobs.includes(job.id)) return
    setAppliedJobs((current) => [...current, job.id])
    setJobStatus(`Your interest in “${job.title}” is recorded in this demo session only.`)
  }

  if (!isWorker) {
    const areas = [...new Set(providers.map((provider) => provider.area))].sort()
    return (
      <main className="min-h-screen bg-[#f1f1ef] text-ink">
        <header className="flex items-center justify-between border-b border-black/10 bg-paper px-5 py-5 sm:px-10 lg:px-16">
          <Logo />
          <div className="flex items-center gap-4">
            {user && <span className="hidden text-xs text-black/55 sm:inline">{user.email}</span>}
            <a href="/" className="text-xs font-medium text-black/60 transition hover:text-black">Back to home</a>
          </div>
        </header>
        <section className="mx-auto max-w-[1260px] px-5 py-8 sm:px-10 sm:py-12 lg:px-16">
          <div className="bg-[#151515] p-6 text-white sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.16em] text-lime">Hiring dashboard · Demo</p>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
              <div>
                <h1 className="text-4xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-6xl">Welcome, {name}</h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">Find trusted local people for the tasks and projects you need help with.</p>
              </div>
              <a href="/find-help" className="inline-flex items-center gap-2 bg-lime px-5 py-4 text-xs font-semibold text-black transition hover:bg-white">Browse all helpers <ArrowUpRight className="h-4 w-4 shrink-0" /></a>
            </div>
            <div className="mt-8 grid grid-cols-2 border-t border-white/15 pt-5 sm:grid-cols-3">
              <div><p className="text-2xl font-medium">{providers.length}</p><p className="mt-1 text-[10px] uppercase tracking-wide text-white/45">Local profiles · sample</p></div>
              <div><p className="text-2xl font-medium">{savedHelpers.length}</p><p className="mt-1 text-[10px] uppercase tracking-wide text-white/45">Saved this session</p></div>
              <div className="col-span-2 mt-4 sm:col-span-1 sm:mt-0"><p className="text-2xl font-medium">Accra</p><p className="mt-1 text-[10px] uppercase tracking-wide text-white/45">Your local network</p></div>
            </div>
          </div>

          <div className="mt-5 border-l-2 border-lime bg-white px-5 py-4 text-xs leading-relaxed text-black/55" role="note">
            Demo workspace: account authentication and saved helpers are not connected. Profiles and counts shown here are sample content.
          </div>

          <section className="mt-10" aria-labelledby="helper-matches-heading">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="eyebrow">A good place to start</p>
                <h2 id="helper-matches-heading" className="mt-3 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">Helpers for your next task</h2>
              </div>
              <a href="/how-it-works" className="inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-4">How hiring works <ArrowUpRight className="h-3.5 w-3.5 shrink-0" /></a>
            </div>
            <div className="mt-5 grid gap-3 border border-black/10 bg-white p-4 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-medium" htmlFor="hire-service-filter">
                What do you need?
                <select id="hire-service-filter" value={hireCategory} onChange={(event) => setHireCategory(event.target.value)} className="border border-black/15 bg-paper px-3 py-3 text-sm font-normal outline-none focus:border-black">
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-xs font-medium" htmlFor="hire-area-filter">
                Neighborhood
                <select id="hire-area-filter" value={hireArea} onChange={(event) => setHireArea(event.target.value)} className="border border-black/15 bg-paper px-3 py-3 text-sm font-normal outline-none focus:border-black">
                  <option>All areas</option>
                  {areas.map((area) => <option key={area}>{area}</option>)}
                </select>
              </label>
            </div>
            <p className="mt-4 text-xs text-black/50" role="status" aria-live="polite">{matchingHelpers.length} sample {matchingHelpers.length === 1 ? 'helper' : 'helpers'} match your filters.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {matchingHelpers.map((helper) => {
                const isSaved = savedHelpers.includes(helper.name)
                return (
                  <article className="border border-black/10 bg-white p-5 transition hover:border-black/30" key={helper.name}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.13em] text-black/45">{helper.category} · {helper.area}</p>
                        <h3 className="mt-2 text-xl font-medium"><a className="hover:underline" href={`/helpers/${providerSlug(helper)}`}>{helper.name}</a></h3>
                        <p className="mt-1 text-sm text-black/60">{helper.service}</p>
                      </div>
                      {helper.verified && <span className="bg-lime px-2 py-1 text-[9px] font-semibold uppercase">Verified</span>}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-black/10 pt-4 text-xs text-black/55">
                      <span>★ {helper.rating} · {helper.jobs}</span><span>{helper.price}</span><span>{helper.distance} km away</span>
                    </div>
                    <div className="mt-5 flex gap-2">
                      <a href={`/helpers/${providerSlug(helper)}`} className="inline-flex flex-1 items-center justify-center border border-black/15 px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wide transition hover:border-black">View profile</a>
                      <a href={`/contact?helper=${encodeURIComponent(helper.name)}`} className="flex-1 inline-flex items-center justify-center gap-1 bg-black px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-white transition hover:bg-black/75">Contact <ArrowUpRight className="h-3.5 w-3.5 shrink-0" /></a>
                      <button type="button" aria-pressed={isSaved} onClick={() => setSavedHelpers((current) => isSaved ? current.filter((nameToRemove) => nameToRemove !== helper.name) : [...current, helper.name])} className="inline-flex items-center gap-1 border border-black/15 px-3 py-3 text-[10px] font-semibold transition hover:border-black" aria-label={`${isSaved ? 'Remove saved' : 'Save'} ${helper.name}`}>
                        {isSaved ? <>Saved <Check className="h-3.5 w-3.5 shrink-0" /></> : 'Save'}
                      </button>
                    </div>
                  </article>
                )
              })}
              {!matchingHelpers.length && <p className="border border-dashed border-black/20 bg-white p-8 text-sm text-black/55 sm:col-span-2 lg:col-span-3">No sample profiles match both filters. Try a different service or neighborhood.</p>}
            </div>
          </section>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f1f1ef] text-ink">
      <header className="flex items-center justify-between border-b border-black/10 bg-paper px-5 py-5 sm:px-10 lg:px-16">
        <Logo />
        <div className="flex items-center gap-4">
          {user && <span className="hidden text-xs text-black/55 sm:inline">{user.email}</span>}
          <a href="/" className="text-xs font-medium text-black/60 transition hover:text-black">Back to home</a>
        </div>
      </header>
      <section className="mx-auto max-w-[1260px] px-5 py-8 sm:px-10 sm:py-12 lg:px-16">
        <div className="overflow-hidden bg-[#151515] text-white">
          <div className="flex flex-wrap items-end justify-between gap-6 p-6 sm:p-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-lime">Worker dashboard · Demo</p>
              <h1 className="mt-5 text-4xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-6xl">Your work, closer.</h1>
              <p className="mt-4 text-sm text-white/60">Welcome, {name}. Build your profile and find work that fits your skills.</p>
            </div>
            <div className="flex items-center gap-3 border border-white/15 px-4 py-3">
              <span className={`h-2.5 w-2.5 rounded-full ${available ? 'bg-lime' : 'bg-white/30'}`} />
              <div>
                <p className="text-xs font-medium">{available ? 'Available for work' : 'Not taking work'}</p>
                <p className="mt-1 text-[10px] text-white/45">Demo availability</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={available}
                aria-label="Toggle availability"
                onClick={() => setAvailable((current) => !current)}
                className={`ml-2 flex h-6 w-11 items-center rounded-full p-1 transition ${available ? 'bg-lime' : 'bg-white/20'}`}
              >
                <span className={`h-4 w-4 rounded-full bg-black transition-transform ${available ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
            {[
              ['Profile complete', `${profileCompletion}%`],
              ['Matching jobs', String(matchingJobs.length)],
              ['Interest sent', String(appliedJobs.length)],
              ['Profile views', '24'],
            ].map(([label, value]) => (
              <div className="border-r border-white/10 px-5 py-5 last:border-r-0 sm:px-8" key={label}>
                <p className="text-2xl font-medium tabular-nums text-white sm:text-3xl">{value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/45">{label}{label === 'Profile views' ? ' · sample' : ''}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 border-l-2 border-lime bg-white px-5 py-4 text-xs leading-relaxed text-black/55" role="note">
          Demo workspace: authentication, job requests and profile saving are not connected. Sample listings are illustrative and no client will receive your actions.
        </div>

        <div className="mt-8 grid items-start gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="border border-black/10 bg-white p-5 sm:p-8" aria-labelledby="worker-profile-heading">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Get discovered</p>
                <h2 id="worker-profile-heading" className="mt-3 text-3xl font-medium tracking-[-0.035em]">Build your work profile</h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-black/55">Choose the jobs you can take on. Your selections help match you with relevant demo requests.</p>
              </div>
              <span className="border border-black/10 px-3 py-2 text-xs font-semibold tabular-nums">{profileCompletion}% complete</span>
            </div>
            <div className="mt-5 h-1.5 overflow-hidden bg-black/5"><div className="h-full bg-lime transition-all" style={{ width: `${profileCompletion}%` }} /></div>

            <form className="mt-7 grid gap-4 sm:grid-cols-2" onSubmit={saveDemoProfile}>
              <div className="grid gap-2 text-xs font-medium sm:col-span-2">
                <label htmlFor="worker-photo">Profile photo</label>
                <div className="flex flex-wrap items-center gap-4">
                  {photoUrl ? (
                    <img src={photoUrl} alt={`${name} profile preview`} className="h-16 w-16 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden="true" className="grid h-16 w-16 place-items-center rounded-full bg-black text-sm font-medium text-white">
                      {name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div className="grid gap-2">
                    <input id="worker-photo" type="file" accept="image/*" onChange={handlePhotoChange} className="max-w-full text-xs file:mr-3 file:border-0 file:bg-black file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white" />
                    <span className="text-[10px] font-normal text-black/45">Choose an image up to 5 MB. It will only appear in this on-device preview.</span>
                    {photoStatus && <p className="text-xs font-normal text-black/60" role={photoStatus.startsWith('Choose') || photoStatus.startsWith('That image') ? 'alert' : 'status'} aria-live="polite">{photoStatus}</p>}
                    {photoUrl && <button type="button" onClick={removeProfilePhoto} className="justify-self-start text-[10px] font-semibold underline underline-offset-4">Remove photo</button>}
                  </div>
                </div>
              </div>
              <label className="grid gap-2 text-xs font-medium" htmlFor="worker-service-category">
                Main service
                <select id="worker-service-category" value={serviceCategory} onChange={(event) => { setServiceCategory(event.target.value); setServiceType(''); setProfileStatus('') }} required className="w-full border border-black/15 bg-paper px-3 py-3 text-sm font-normal outline-none focus:border-black">
                  <option value="">Choose a service</option>
                  {categories.slice(1).map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-xs font-medium" htmlFor="worker-service-type">
                Jobs you can do
                <select id="worker-service-type" value={serviceType} onChange={(event) => { setServiceType(event.target.value); setProfileStatus('') }} required disabled={!serviceCategory} className="w-full border border-black/15 bg-paper px-3 py-3 text-sm font-normal outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">{serviceCategory ? 'Choose the work you do' : 'Choose a main service first'}</option>
                  {(workerServiceOptions[serviceCategory] ?? []).map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-xs font-medium" htmlFor="worker-area">
                Neighborhood you serve
                <select id="worker-area" value={workArea} onChange={(event) => { setWorkArea(event.target.value); setProfileStatus('') }} required className="w-full border border-black/15 bg-paper px-3 py-3 text-sm font-normal outline-none focus:border-black">
                  <option value="">Choose an area</option>
                  {['Osu', 'East Legon', 'Madina', 'Cantonments', ...generatedAreas].filter((area, index, allAreas) => allAreas.indexOf(area) === index).map((area) => <option key={area}>{area}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-xs font-medium" htmlFor="worker-rate">
                Starting rate (GH₵)
                <input id="worker-rate" type="number" min="1" step="1" value={rate} onChange={(event) => { setRate(event.target.value); setProfileStatus('') }} required className="w-full border border-black/15 bg-paper px-3 py-3 text-sm font-normal outline-none focus:border-black" placeholder="e.g. 150" />
              </label>
              <label className="grid gap-2 text-xs font-medium" htmlFor="worker-experience">
                Relevant experience
                <select id="worker-experience" value={experience} onChange={(event) => { setExperience(event.target.value); setProfileStatus('') }} className="w-full border border-black/15 bg-paper px-3 py-3 text-sm font-normal outline-none focus:border-black">
                  <option value="">Choose experience level</option>
                  <option>New to this work</option>
                  <option>Less than 1 year</option>
                  <option>1–2 years</option>
                  <option>3–5 years</option>
                  <option>6–10 years</option>
                  <option>More than 10 years</option>
                </select>
              </label>
              <label className="grid gap-2 text-xs font-medium" htmlFor="worker-radius">
                Areas you can travel
                <select id="worker-radius" value={serviceRadius} onChange={(event) => { setServiceRadius(event.target.value); setProfileStatus('') }} className="w-full border border-black/15 bg-paper px-3 py-3 text-sm font-normal outline-none focus:border-black">
                  <option value="">Choose a travel range</option>
                  <option>Within my neighborhood</option>
                  <option>Up to 5 km</option>
                  <option>Up to 10 km</option>
                  <option>Up to 20 km</option>
                  <option>Anywhere in Greater Accra</option>
                </select>
              </label>
              <label className="grid gap-2 text-xs font-medium" htmlFor="worker-work-mode">
                How you work
                <select id="worker-work-mode" value={workMode} onChange={(event) => { setWorkMode(event.target.value); setProfileStatus('') }} className="w-full border border-black/15 bg-paper px-3 py-3 text-sm font-normal outline-none focus:border-black">
                  <option value="">Choose a work arrangement</option>
                  <option>At the client’s location</option>
                  <option>Remote / online</option>
                  <option>Either in-person or remote</option>
                </select>
              </label>
              <label className="grid gap-2 text-xs font-medium" htmlFor="worker-schedule">
                Typical availability
                <select id="worker-schedule" value={typicalAvailability} onChange={(event) => { setTypicalAvailability(event.target.value); setProfileStatus('') }} className="w-full border border-black/15 bg-paper px-3 py-3 text-sm font-normal outline-none focus:border-black">
                  <option value="">Choose your usual schedule</option>
                  <option>Weekday mornings</option>
                  <option>Weekday afternoons</option>
                  <option>Weekday evenings</option>
                  <option>Weekends</option>
                  <option>Flexible — discuss with me</option>
                </select>
              </label>
              <fieldset className="grid gap-3 border border-black/10 p-4 sm:col-span-2">
                <legend className="px-1 text-xs font-medium">Languages you can work in</legend>
                <div className="flex flex-wrap gap-x-5 gap-y-3">
                  {['English', 'Twi', 'Ga', 'Ewe', 'Hausa'].map((language) => (
                    <label key={language} className="flex items-center gap-2 text-xs font-normal">
                      <input
                        type="checkbox"
                        checked={languages.includes(language)}
                        onChange={() => {
                          setLanguages((current) => current.includes(language)
                            ? current.filter((item) => item !== language)
                            : [...current, language])
                          setProfileStatus('')
                        }}
                        className="accent-black"
                      />
                      {language}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="grid gap-2 text-xs font-medium sm:col-span-2" htmlFor="worker-bio">
                Short introduction
                <textarea id="worker-bio" rows={3} maxLength={240} value={bio} onChange={(event) => { setBio(event.target.value); setProfileStatus('') }} required className="w-full resize-y border border-black/15 bg-paper px-3 py-3 text-sm font-normal outline-none focus:border-black" placeholder="Share your experience, what you bring, and when you’re available." />
                <span className="text-right text-[10px] font-normal text-black/40">{bio.length}/240</span>
              </label>
              <div className="grid gap-3 border border-black/10 p-4 sm:col-span-2">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <label htmlFor="worker-portfolio" className="text-xs font-medium">Portfolio photos <span className="font-normal text-black/45">(optional)</span></label>
                    <p className="mt-1 text-[10px] font-normal text-black/45">Show examples of your work. Up to 4 images, 5 MB each; kept on this device.</p>
                  </div>
                  <span className="text-[10px] text-black/45">{portfolioPhotos.length}/4 added</span>
                </div>
                <input id="worker-portfolio" type="file" accept="image/*" multiple disabled={portfolioPhotos.length >= 4} onChange={handlePortfolioChange} className="max-w-full text-xs file:mr-3 file:border-0 file:bg-black file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white disabled:opacity-50" />
                {portfolioStatus && <p className="text-xs text-black/60" role="alert" aria-live="polite">{portfolioStatus}</p>}
                {portfolioPhotos.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {portfolioPhotos.map((photo) => (
                      <figure key={photo.url} className="relative">
                        <img src={photo.url} alt={`Portfolio example: ${photo.name}`} className="h-24 w-full object-cover" />
                        <button type="button" onClick={() => removePortfolioPhoto(photo.url)} className="mt-1 text-left text-[10px] font-medium underline underline-offset-4">Remove {photo.name}</button>
                      </figure>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                <button type="submit" className="inline-flex items-center gap-2 bg-black px-5 py-4 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-black/75">Update profile preview <ArrowUpRight className="h-4 w-4 shrink-0" /></button>
                {profileStatus && <p className="text-xs text-black/55" role="status" aria-live="polite">{profileStatus}</p>}
              </div>
            </form>
          </section>

          <aside className="bg-lime p-5 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-black/55">How clients see you</p>
                <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em]">{name}</h2>
              </div>
              {photoUrl ? (
                <img src={photoUrl} alt={`${name} profile photo`} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <span className="grid h-12 w-12 place-items-center rounded-full bg-black text-sm font-medium text-white">{name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <p className="mt-5 text-sm font-medium">{serviceType || 'Your skill will appear here'}</p>
            <p className="mt-1 text-xs text-black/60">{serviceCategory || 'Choose a service'}{workArea ? ` · ${workArea}` : ''}</p>
            <p className="mt-5 min-h-12 text-xs leading-relaxed text-black/65">{bio || 'Add a short introduction so people know what you can help with.'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {experience && <span className="bg-white/70 px-2 py-1 text-[10px]">{experience}</span>}
              {workMode && <span className="bg-white/70 px-2 py-1 text-[10px]">{workMode}</span>}
              {serviceRadius && <span className="bg-white/70 px-2 py-1 text-[10px]">{serviceRadius}</span>}
            </div>
            {typicalAvailability && <p className="mt-3 text-xs text-black/60">Usually available: {typicalAvailability}</p>}
            {languages.length > 0 && <p className="mt-2 text-xs text-black/60">Languages: {languages.join(', ')}</p>}
            <div className="mt-5 flex items-center justify-between border-t border-black/15 pt-4 text-xs">
              <span className="text-black/55">Starting rate</span>
              <strong>{rate ? `GH₵${rate}` : 'Not set'}</strong>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-black/55">Availability</span>
              <strong>{available ? 'Open to requests' : 'Currently unavailable'}</strong>
            </div>
            {portfolioPhotos.length > 0 && (
              <div className="mt-5 border-t border-black/15 pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-black/55">Work examples</p>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {portfolioPhotos.map((photo) => <img key={photo.url} src={photo.url} alt={`Work example: ${photo.name}`} className="aspect-square w-full object-cover" />)}
                </div>
              </div>
            )}
            <a href="/safety" className="mt-6 inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-4">Profile and safety tips <ArrowUpRight className="h-3.5 w-3.5 shrink-0" /></a>
          </aside>
        </div>

        <section className="mt-12" aria-labelledby="demo-jobs-heading">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-black/15 pb-5">
            <div>
              <p className="eyebrow">Explore opportunities</p>
              <h2 id="demo-jobs-heading" className="mt-3 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">Jobs you could take on</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/55">Review the scope, timing and budget, then mark the opportunities you’d be interested in.</p>
            </div>
            <label className="grid gap-2 text-xs font-medium" htmlFor="demo-job-filter">
              Filter by service
              <select id="demo-job-filter" value={jobFilter} onChange={(event) => setJobFilter(event.target.value)} className="min-w-48 border border-black/15 bg-white px-3 py-3 text-sm font-normal outline-none focus:border-black">
                <option>All services</option>
                {categories.slice(1).map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {matchingJobs.map((job) => {
              const isInterested = appliedJobs.includes(job.id)
              return (
                <article className="border border-black/10 bg-white p-5 transition hover:border-black/30 sm:p-6" key={job.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.13em] text-black/45">{job.category} · {job.service}</p>
                      <h3 className="mt-2 text-xl font-medium leading-tight tracking-[-0.02em]">{job.title}</h3>
                    </div>
                    <span className="bg-[#f1f1ef] px-3 py-2 text-xs font-semibold">{job.budget}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-black/55">
                    <span>⌖ {job.area}</span><span>◷ {job.schedule}</span><span>{job.posted}</span>
                  </div>
                  <details className="mt-4 border-t border-black/10 pt-3">
                    <summary className="cursor-pointer text-xs font-semibold">View job details</summary>
                    <p className="mt-3 text-sm leading-relaxed text-black/60">{job.description}</p>
                    <p className="mt-3 text-xs text-black/45">Posted by {job.client} · Demo client</p>
                  </details>
                  <button type="button" disabled={isInterested} onClick={() => expressInterest(job)} className={`mt-5 w-full inline-flex items-center justify-center gap-1 px-4 py-3 text-xs font-semibold transition sm:w-auto ${isInterested ? 'border border-black/15 bg-paper text-black/45' : 'bg-black text-white hover:bg-black/75'}`}>
                    {isInterested ? <>Interest noted <Check className="h-4 w-4 shrink-0" /></> : <>I’m interested <ArrowUpRight className="h-4 w-4 shrink-0" /></>}
                  </button>
                </article>
              )
            })}
            {!matchingJobs.length && <p className="border border-dashed border-black/20 bg-white p-8 text-sm text-black/55 md:col-span-2">No sample jobs match this filter yet. Try another service.</p>}
          </div>
          {jobStatus && <p className="mt-4 text-xs text-black/55" role="status" aria-live="polite">{jobStatus}</p>}
        </section>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-6">
          <p className="text-xs text-black/45">Everything here is a local demo preview and resets when you leave this page.</p>
          <a href="/how-it-works" className="inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-4">How NeighborHelp works <ArrowUpRight className="h-3.5 w-3.5 shrink-0" /></a>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  const [showHomeSplash, setShowHomeSplash] = useState(() => (
    window.location.pathname === '/'
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ))
  const [menuOpen, setMenuOpen] = useState(false)
  const [isNavScrolled, setIsNavScrolled] = useState(() => window.scrollY > 40)
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [category, setCategory] = useState('All services')
  const [search, setSearch] = useState('')
  const [providerView, setProviderView] = useState<'grid' | 'list'>('grid')
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)
  const [dashboardUser, setDashboardUser] = useState<DashboardUser | null>(null)
  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (pathname !== '/') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShowHomeSplash(false)
      return
    }

    setShowHomeSplash(true)
    const splashTimeout = window.setTimeout(() => setShowHomeSplash(false), 2650)
    return () => window.clearTimeout(splashTimeout)
  }, [pathname])

  useEffect(() => {
    if (pathname !== '/') return

    let hideTimeout: number | undefined
    const updateNavigation = () => {
      const isScrolled = window.scrollY > 40
      setIsNavScrolled(isScrolled)
      setIsNavVisible(true)
      window.clearTimeout(hideTimeout)
      if (isScrolled && !menuOpen) {
        hideTimeout = window.setTimeout(() => setIsNavVisible(false), 5000)
      }
    }

    window.addEventListener('scroll', updateNavigation, { passive: true })
    updateNavigation()
    return () => {
      window.removeEventListener('scroll', updateNavigation)
      window.clearTimeout(hideTimeout)
    }
  }, [pathname, menuOpen])

  useEffect(() => {
    if (pathname !== '/') return

    const clearSearch = () => setSearch('')
    window.addEventListener('scroll', clearSearch, { passive: true })
    return () => window.removeEventListener('scroll', clearSearch)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) setSearch('')
  }, [menuOpen])

  const filteredProviders = useMemo(() => providers.filter((provider) => {
    const matchesCategory = category === 'All services' || provider.category === category
    const query = search.toLowerCase()
    return matchesCategory && (!query || `${provider.name} ${provider.service} ${provider.area}`.toLowerCase().includes(query))
  }), [category, search])

  if (pathname === '/account') {
    return <AccountPage onDashboard={(role, name, email) => {
      setDashboardUser({ role, name, email })
      const dashboardPath = `/dashboard/${role}`
      window.history.pushState({}, '', dashboardPath)
      setPathname(dashboardPath)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }} />
  }
  if (pathname === '/dashboard/hire' || pathname === '/dashboard/work') return <DashboardPage user={dashboardUser} />
  if (pathname === '/payment-methods') return <PaymentMethodsPage />
  if (pathname.startsWith('/helpers/')) {
    const slug = pathname.slice('/helpers/'.length).replace(/\/+$/, '')
    const provider = providers.find((candidate) => providerSlug(candidate) === slug)
    if (provider) return <HelperProfilePage provider={provider} />
  }
  if (pathname !== '/') return <DetailPage pathname={pathname} />

  return (
    <>
      {showHomeSplash && (
        <div className="home-splash" aria-hidden="true">
          <svg className="home-splash-surface" viewBox="0 0 1600 1000" preserveAspectRatio="none">
            <path d="M0 0H1600V900H0Z" />
            <path className="home-splash-curve" d="M0 900Q800 1100 1600 900L1600 900H0Z" />
          </svg>
          <span className="home-splash-logo">neighborhelp<span>.</span></span>
        </div>
      )}
      <main className="min-h-screen overflow-hidden bg-paper text-ink">
      <nav className={`site-nav site-nav-overlay mx-auto flex items-center justify-between py-4 text-white sm:py-5${isNavScrolled ? ' is-scrolled' : ''}${isNavVisible || !isNavScrolled || menuOpen ? '' : ' is-idle-hidden'}`}>
        <Logo />
        <div id="home-nav-menu" className={`nav-menu mobile-nav-panel ${menuOpen ? 'is-open' : 'is-closed'} absolute left-5 right-5 top-16 z-30 flex flex-col gap-5 rounded-xl bg-paper p-5 shadow-xl xl:static xl:flex-row xl:items-center xl:gap-8 xl:bg-transparent xl:p-0 xl:shadow-none`}>
          <a href="/find-help" className="nav-link">Find help</a>
          <a href="/reviews" className="nav-link">Reviews</a>
          <a href="/how-it-works" className="nav-link">How it works</a>
          <a href="/become-a-helper" className="nav-link">Become a helper</a>
          <a className="nav-start inline-flex items-center gap-1" href="/account">Get started <ArrowUpRight className="h-3.5 w-3.5 shrink-0" /></a>
          <form className="nav-search" onSubmit={(event) => { event.preventDefault(); setMenuOpen(false); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }) }}>
            <div className="nav-search-field">
              <input id="nav-search-input" name="q" type="search" autoComplete="on" value={search} onChange={(event) => setSearch(event.target.value)} required />
              <label htmlFor="nav-search-input">What do you need help with?</label>
              <span />
            </div>
            <button type="submit" className="inline-flex items-center gap-1">Find help <ArrowUpRight className="h-3.5 w-3.5 shrink-0" /></button>
          </form>
        </div>
        <button
          className={`burger xl:hidden ${menuOpen ? 'is-open' : ''}`}
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="home-nav-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <section className="video-hero relative min-h-[118vh] overflow-hidden text-white">
        <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline>
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="video-overlay absolute inset-0" />
        <div className={`hero-content relative z-10 mx-auto flex min-h-[118vh] flex-col justify-start pb-8 pt-36 sm:pb-12 sm:pt-44${showHomeSplash ? ' home-hero-animations-pending' : ' hero-animation-ready'}`}>
          <div className="flex items-start justify-between text-xs uppercase tracking-[0.18em] text-white/65"><ScrollRevealLines lines={['Accra, Ghana']} animated /><ScrollRevealLines lines={['Local help, made easy']} delay={140} animated /></div>
          <div className="mt-20 max-w-4xl sm:mt-24 lg:mt-20">
            <ScrollRevealLines lines={['Good people, close by']} className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-lime" animated />
            <ScrollRevealLines lines={['Get things done.', 'Together.']} className="max-w-[95vw] text-[3.35rem] font-semibold leading-[0.88] tracking-[-0.04em] sm:max-w-2xl sm:text-6xl lg:text-[6.25rem]" animated />
            <ScrollRevealLines lines={['Find trusted people in your neighborhood', 'for the jobs, skills and everyday help you need.']} className="mt-7 max-w-md text-sm leading-relaxed text-white/75" delay={140} animated />
          </div>
          <LocalHelpersStat count={providers.length} animate={!showHomeSplash} />
        </div>
        <CurvedPageTransition />
      </section>

      <section id="services" className="mx-auto max-w-[1260px] px-5 py-24 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink pb-8">
          <div>
            <ScrollRevealLines lines={['Explore your neighborhood']} className="eyebrow" animated />
            <ScrollRevealLines lines={['Find a helping hand.']} className="mt-4 text-5xl font-medium leading-[0.9] tracking-[-0.035em] sm:text-7xl" animated />
          </div>
          <ScrollRevealLines lines={['From quick fixes to big projects,', 'discover skilled people around Accra', 'ready to help.']} className="max-w-xs text-sm leading-relaxed text-black/55" delay={180} animated />
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="service-category-filters flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter helpers by service">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap border px-4 py-3 text-xs transition ${category === item ? 'border-black bg-black text-white' : 'border-black/20 hover:border-black'}`}>{item}</button>)}</div>
          <div className="helper-view-toggle flex shrink-0 items-center gap-1"><button className={`view-toggle ${providerView === 'grid' ? 'is-active' : ''}`} onClick={() => setProviderView('grid')} aria-label="Show grid view">Grid</button><button className={`view-toggle ${providerView === 'list' ? 'is-active' : ''}`} onClick={() => setProviderView('list')} aria-label="Show list view">List</button></div>
        </div>
        <div className={`helper-results-grid mt-8 grid gap-3 ${providerView === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-4' : ''}`}>
          {filteredProviders.slice(0, 4).map((provider) => (
            <article className={`helper-result-card group border border-black/15 bg-white/90 p-4 shadow-sm transition hover:-translate-y-1 hover:border-black ${providerView === 'list' ? 'flex flex-col sm:flex-row sm:items-center sm:gap-5' : ''}`} key={provider.name}>
              {providerView === 'grid' && (
                <div className="helper-result-photo relative mb-5 aspect-[1.05] overflow-hidden rounded-xl">
                  <img className="h-full w-full object-cover" src={provider.image} alt={`${provider.name} profile`} />
                  <span className="absolute bottom-3 right-3 bg-white px-2 py-1 text-[10px]">{provider.area}</span>
                </div>
              )}
              <div className="helper-result-primary flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {providerView === 'list' && <span className="helper-result-avatar grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-medium text-black" style={{ backgroundColor: provider.color }}>{provider.initials}</span>}
                  <div className="min-w-0">
                    <h3 className="text-lg font-medium tracking-[-0.02em]">{provider.name}</h3>
                    <p className="mt-1 text-xs text-black/55">{provider.service}</p>
                    <p className="helper-result-area-mobile mt-1 text-[10px] text-black/45">{provider.area}</p>
                  </div>
                </div>
                {provider.verified && <span className="text-lime bg-black px-2 py-1 text-[9px] uppercase">Verified</span>}
              </div>
              <div className="helper-result-metadata mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-4 text-xs">
                <span>★ {provider.rating} · {provider.jobs}</span>
                <span className="font-medium">{provider.distance} km · {provider.price}</span>
              </div>
              <a href={`/helpers/${providerSlug(provider)}`} className="helper-result-action btn-31 mt-4 inline-flex w-full whitespace-nowrap sm:w-fit"><span className="text-container"><span className="text inline-flex items-center gap-1 whitespace-nowrap">View profile <ArrowUpRight className="h-3.5 w-3.5 shrink-0" /></span></span></a>
            </article>
          ))}
          {!filteredProviders.length && <div className="col-span-full border border-dashed border-black/30 px-6 py-16 text-center"><p className="text-xl font-medium">No helpers found</p><p className="mt-2 text-sm text-black/55">Try another search or browse all services.</p><button className="mt-5 text-xs underline" onClick={() => { setCategory('All services'); setSearch('') }}>Clear filters</button></div>}
        </div>
        {filteredProviders.length > 4 && <div className="mt-10 text-center"><a href="/find-help" className="btn-more-profiles inline-flex items-center gap-2">View all 50 helpers <ArrowUpRight className="h-4 w-4 shrink-0" /></a></div>}
      </section>

      <section className="border-y border-black/10 bg-white/35">
        <div className="mx-auto grid max-w-[1260px] grid-cols-2 px-5 py-10 sm:px-10 md:grid-cols-4 lg:px-16">
          {[['2,400+', 'neighbors connected'], ['4.9/5', 'average rating'], ['18', 'Accra neighborhoods'], ['92%', 'would recommend us']].map(([value, label]) => (
            <div className="border-r border-black/10 px-4 first:pl-0 last:border-r-0 sm:px-8" key={label}>
              <p className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">{value}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-black/50">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1260px] px-5 py-24 sm:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <p className="eyebrow">Live across Accra</p>
            <h2 className="mt-4 max-w-md text-5xl font-medium leading-[0.9] tracking-[-0.035em] sm:text-7xl">Help is already happening nearby.</h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-black/55">Explore Accra and discover the neighborhoods where NeighborHelp connects people with useful local skills.</p>
          </div>
          <div className="relative min-h-[360px] overflow-hidden border border-black/15 bg-[#d8d8d1] sm:min-h-[460px]">
            <LiveAccraMap />
            <div className="pointer-events-none absolute left-4 top-4 bg-paper/90 px-3 py-2 text-[10px] uppercase tracking-[0.14em]">Accra, Ghana · Live map</div>
          </div>
        </div>
      </section>

      <section id="reviews" className="mx-auto max-w-[1260px] px-5 py-24 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-ink pb-8">
          <div>
            <p className="eyebrow">What neighbors say</p>
            <h2 className="mt-4 max-w-xl text-5xl font-medium leading-[0.9] tracking-[-0.035em] sm:text-7xl">Real help from real people.</h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-black/55">Every connection starts with a local need and ends with one more neighbor who feels supported.</p>
        </div>
        <div className="mt-8 grid gap-3 lg:grid-cols-3">
          {reviews.map((review) => (
            <article className="flex min-h-[280px] flex-col justify-between border border-black/15 bg-[#deded8] p-7" key={review.name}>
              <div>
                <div className="text-[#b8860b] text-lg tracking-[0.2em]">★★★★★</div>
                <p className="mt-8 text-2xl font-medium leading-[1.02] tracking-[-0.025em]">“{review.quote}”</p>
              </div>
              <div className="mt-10 flex items-center gap-3 text-xs">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-white">{review.initials}</span>
                <span>{review.name}<br /><span className="text-black/50">{review.detail}</span></span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-charcoal text-white"><div className="mx-auto max-w-[1260px] px-5 py-24 sm:px-10 lg:px-16"><div className="flex flex-wrap justify-between gap-8"><div><ScrollRevealLines lines={['Simple by design']} className="eyebrow text-lime" /><ScrollRevealLines lines={['Help is closer than', 'you think.']} className="mt-4 max-w-lg text-5xl font-medium leading-[0.9] tracking-[-0.035em] sm:text-7xl" /></div><ScrollRevealLines lines={['A safer, simpler way to exchange skills', 'and support the people in your community.']} className="max-w-xs self-end text-sm leading-relaxed text-white/50" delay={140} /></div><div className="mt-20 grid gap-0 border-t border-white/15 md:grid-cols-3">{[['01', 'Tell us what you need', 'Search by service, location or the kind of help you are looking for.'], ['02', 'Choose your neighbor', 'Compare profiles, reviews, prices and availability before you decide.'], ['03', 'Get it done', 'Book securely, chat directly and leave a review when the job is complete.']].map(([number, title, description]) => <div className="border-b border-white/15 py-8 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0" key={number}><ScrollRevealLines lines={[number]} className="text-xs text-lime" /><ScrollRevealLines lines={[title]} className="mt-14 text-2xl tracking-[-0.02em]" delay={140} /><ScrollRevealLines lines={[description]} className="mt-4 max-w-xs text-sm leading-relaxed text-white/50" delay={280} /></div>)}</div></div></section>

      <section id="become-a-helper" className="mx-auto grid max-w-[1260px] gap-3 px-5 py-24 sm:px-10 lg:grid-cols-2 lg:px-16"><div className="bg-lime p-8 sm:p-12"><ScrollRevealLines lines={['For skilled neighbors']} className="eyebrow text-black/60" /><ScrollRevealLines lines={['Your skills can take', 'you further.']} className="mt-16 max-w-md text-5xl font-medium leading-[0.9] tracking-[-0.035em] sm:text-7xl" /><ScrollRevealLines lines={['Earn on your own terms, grow your reputation', 'and make a real difference in your community.']} className="mt-8 max-w-sm text-sm leading-relaxed text-black/65" delay={140} /><a href="/become-a-helper" className="mt-10 inline-flex items-center gap-2 border border-black px-5 py-4 text-xs font-semibold transition hover:bg-black hover:text-white">Become a helper <ArrowUpRight className="h-4 w-4 shrink-0" /></a></div><div className="flex min-h-[440px] flex-col justify-between bg-[#deded8] p-8 sm:p-12"><ScrollRevealLines lines={['A community that shows up']} className="eyebrow" /><div><ScrollRevealLines lines={['“I found a designer down the road', 'who understood exactly what I needed.”']} className="max-w-md text-4xl font-medium leading-[0.95] tracking-[-0.035em] sm:text-6xl" /><div className="mt-10 flex items-center gap-3 text-xs"><span className="grid h-10 w-10 place-items-center rounded-full bg-black text-white">EA</span><ScrollRevealLines lines={['Esther A.', 'NeighborHelp member']} /></div></div></div></section>

      <section className="bg-[#deded8]">
        <div className="mx-auto max-w-[1260px] px-5 py-24 sm:px-10 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="eyebrow">Good to know</p>
              <h2 className="mt-4 max-w-sm text-5xl font-medium leading-[0.9] tracking-[-0.035em] sm:text-7xl">Questions, answered.</h2>
            </div>
            <div className="border-t border-black/20">
              {faqs.map(([question, answer]) => (
                <details className="group border-b border-black/20 py-5" key={question}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium tracking-[-0.02em]">
                    {question}
                    <span className="text-2xl font-normal transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-xl pt-4 text-sm leading-relaxed text-black/60">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1260px] px-5 py-20 sm:px-10 sm:py-24 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow">One neighborhood, two ways to connect</p>
            <h2 className="mt-4 max-w-md text-4xl font-medium leading-[0.95] tracking-[-0.035em] sm:text-6xl">A little help can go both ways.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <a href="/find-help" className="home-path-card">
              <span className="text-[10px] uppercase tracking-[0.16em] text-black/45">For residents</span>
              <h3 className="mt-8 text-2xl font-medium tracking-[-0.025em]">Find someone nearby.</h3>
              <p className="mt-3 text-sm leading-relaxed text-black/60">Browse local services, compare the details and choose how to reach out.</p>
              <span className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">Explore helpers <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></span>
            </a>
            <a href="/become-a-helper" className="home-path-card home-path-card-lime">
              <span className="text-[10px] uppercase tracking-[0.16em] text-black/55">For skilled neighbors</span>
              <h3 className="mt-8 text-2xl font-medium tracking-[-0.025em]">Share what you do.</h3>
              <p className="mt-3 text-sm leading-relaxed text-black/65">Introduce your service to people looking for useful skills around Accra.</p>
              <span className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">Join the network <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></span>
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white">
        <div className="mx-auto max-w-[1260px] px-5 sm:px-10 lg:px-16">
          <section className="grid gap-10 border-b border-white/15 py-16 sm:py-20 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
            <div>
              <ScrollRevealLines lines={['The neighbor network']} className="eyebrow text-lime" />
              <ScrollRevealLines lines={['Good things', 'start nearby.']} lineClassNames={['', 'text-lime']} className="mt-5 max-w-xl text-5xl font-medium leading-[0.9] tracking-[-0.035em] sm:text-7xl" />
            </div>
            <div className="self-end">
              <ScrollRevealLines lines={['Get local stories and useful updates']} className="mb-4 text-sm font-medium" />
              <form className="subscribe-form flex flex-row items-center gap-2 border-b border-white/45" onSubmit={(event) => { event.preventDefault(); setNewsletterSubmitted(true) }}>
                <div className="subscribe-field">
                  <input id="footer-email" name="email" type="email" aria-label="Your email address" required />
                  <label htmlFor="footer-email">Your email address</label>
                  <span className="subscribe-underline" />
                </div>
                <button className="button-lime subscribe-button shrink-0 self-center inline-flex items-center justify-center gap-1.5" type="submit">{newsletterSubmitted ? 'Thanks' : 'Subscribe'} <ArrowUpRight className="subscribe-arrow h-4 w-4 shrink-0" /></button>
              </form>
              <p className="mt-3 min-h-5 text-xs text-lime" aria-live="polite">{newsletterSubmitted ? 'This prototype does not save email addresses.' : ''}</p>
            </div>
          </section>
          <section className="detail-footer-links-grid grid grid-cols-2 gap-x-6 gap-y-9 py-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div className="col-span-2 lg:col-span-1"><Logo /><ScrollRevealLines lines={['A local marketplace for useful skills,', 'trusted help and stronger neighborhoods.']} className="mt-5 max-w-xs text-xs leading-relaxed text-white/40" /></div>
            <div className="footer-link-group"><p className="footer-heading">Explore</p><div className="footer-links"><a href="/" className="inline-flex items-center gap-1">Home <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a><a href="/find-help" className="inline-flex items-center gap-1">Find help <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a><a href="/reviews" className="inline-flex items-center gap-1">Neighbor stories <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a></div></div>
            <div className="footer-link-group"><p className="footer-heading">Learn & join</p><div className="footer-links"><a href="/how-it-works" className="inline-flex items-center gap-1">How it works <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a><a href="/become-a-helper" className="inline-flex items-center gap-1">Become a helper <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a><a href="/about" className="inline-flex items-center gap-1">About NeighborHelp <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a><a href="/safety" className="inline-flex items-center gap-1">Trust & safety <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a></div></div>
            <div className="footer-link-group"><p className="footer-heading">Contact</p><div className="footer-links"><a href="/contact" className="inline-flex items-center gap-1">Contact us <ArrowUpRight className="h-3.5 w-3.5 opacity-70 shrink-0" /></a><a href="mailto:hello@neighborhelp.co">hello@neighborhelp.co</a><span>Accra, Ghana</span><span>Mon–Fri · 9:00–17:00</span></div></div>
          </section>
          <div className="flex flex-col justify-between gap-4 border-t border-white/15 py-7 text-[10px] text-white/40 sm:flex-row"><ScrollRevealLines lines={['© 2025 NeighborHelp Accra.']} /><ScrollRevealLines lines={['Made for the neighborhood.']} /></div>
        </div>
      </footer>

      </main>
    </>
  )
}

export default App
