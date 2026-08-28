"use client";

import Link from "next/link";
import { Oswald, Plus_Jakarta_Sans } from "next/font/google";
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Flame,
    Heart,
    MapPin,
    Menu,
    Music,
    Search,
    ShieldCheck,
    Sparkles,
    Ticket,
    Users,
    X,
    Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

/* ---------------------------------------------------------
   FONTS — condensed poster display + clean body sans
--------------------------------------------------------- */
const display = Oswald({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
    variable: "--font-display",
});

const body = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-body",
});

/* ---------------------------------------------------------
   DATA
--------------------------------------------------------- */
const categories = [
    { name: "Semua", icon: Sparkles, count: `${4}+ Event` },
    { name: "Concert", icon: Music, count: "120+ Event" },
    { name: "Music Festival", icon: Sparkles, count: "80+ Event" },
    { name: "K-Pop", icon: Users, count: "45+ Event" },
    { name: "Rock", icon: Music, count: "35+ Event" },
    { name: "Jazz", icon: Music, count: "25+ Event" },
];

const events = [
    {
        id: 1,
        title: "Sound of Summer",
        category: "Music Festival",
        date: "22 Agustus 2026",
        location: "Jakarta International Stadium",
        city: "Jakarta",
        price: 350000,
        soldPercent: 68,
        trending: true,
        image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85",
    },
    {
        id: 2,
        title: "Nusantara Music Fest",
        category: "Music Festival",
        date: "29 Agustus 2026",
        location: "Gelora Bung Karno",
        city: "Jakarta",
        price: 275000,
        soldPercent: 41,
        trending: false,
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=85",
    },
    {
        id: 3,
        title: "Midnight Symphony",
        category: "Concert",
        date: "5 September 2026",
        location: "The Kasablanka",
        city: "Jakarta",
        price: 450000,
        soldPercent: 87,
        trending: true,
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=85",
    },
    {
        id: 4,
        title: "Rock Revolution",
        category: "Rock",
        date: "12 September 2026",
        location: "ICE BSD City",
        city: "Tangerang",
        price: 500000,
        soldPercent: 23,
        trending: false,
        image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=85",
    },
];

function formatCurrency(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
}

/* ---------------------------------------------------------
   SMALL HOOKS — scroll reveal, count-up, scroll position
--------------------------------------------------------- */
function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return [ref, visible];
}

function useCountUp(target, active, duration = 1400) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!active) return;
        let raf;
        let start;

        const step = (timestamp) => {
            if (start === undefined) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setValue(Math.floor(progress * target));
            if (progress < 1) raf = requestAnimationFrame(step);
        };

        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [active, target, duration]);

    return value;
}

function Reveal({ children, className = "", delay = 0 }) {
    const [ref, visible] = useReveal();
    return (
        <div
            ref={ref}
            style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
            className={`transition-all duration-700 ease-out ${
                visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            } ${className}`}
        >
            {children}
        </div>
    );
}

/* ---------------------------------------------------------
   TICKET-STUB PERFORATION — the signature visual element
--------------------------------------------------------- */
function TicketNotch({ side }) {
    return (
        <span
            aria-hidden="true"
            className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white ${
                side === "left" ? "-left-2.5" : "-right-2.5"
            }`}
        />
    );
}

export default function LandingPage() {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [query, setQuery] = useState("");
    const [saved, setSaved] = useState(new Set());

    const [statsRef, statsVisible] = useReveal();
    const eventCount = useCountUp(100, statsVisible);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const matchesCategory =
                activeCategory === "Semua" || event.category === activeCategory;
            const matchesQuery =
                query.trim() === "" ||
                event.title.toLowerCase().includes(query.toLowerCase()) ||
                event.city.toLowerCase().includes(query.toLowerCase());
            return matchesCategory && matchesQuery;
        });
    }, [activeCategory, query]);

    function toggleSaved(id) {
        setSaved((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    return (
        <main
            className={`${display.variable} ${body.variable} min-h-screen bg-[#F8F1E7] text-[#1E1E1E]`}
            style={{ fontFamily: "var(--font-body)" }}
        >
            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .animate-marquee { animation: marquee 26s linear infinite; }
                .animate-marquee:hover { animation-play-state: paused; }
                @media (prefers-reduced-motion: reduce) {
                    .animate-marquee { animation: none; }
                }
                .font-display { font-family: var(--font-display); }
            `}</style>

            {/* NAVBAR */}
            <header
                className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? "bg-[#5B0F18]/95 shadow-lg shadow-black/10 backdrop-blur-xl"
                        : "bg-transparent"
                }`}
            >
                <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
                    <Link
                        href="/"
                        className="font-display text-2xl font-bold tracking-tight text-white"
                    >
                        Eventify
                    </Link>

                    <div className="hidden items-center gap-8 md:flex">
                        <a
                            href="#events"
                            className="text-sm font-medium text-white/75 transition hover:text-white"
                        >
                            Event
                        </a>
                        <a
                            href="#categories"
                            className="text-sm font-medium text-white/75 transition hover:text-white"
                        >
                            Kategori
                        </a>
                        <a
                            href="#about"
                            className="text-sm font-medium text-white/75 transition hover:text-white"
                        >
                            Tentang Kami
                        </a>
                    </div>

                    <div className="hidden items-center gap-3 md:flex">
                        <Link
                            href="/login"
                            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            Masuk
                        </Link>
                        <Link
                            href="/register"
                            className="group relative overflow-hidden rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#5B0F18] transition hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            Daftar
                        </Link>
                    </div>

                    <button
                        onClick={() => setMobileMenu(!mobileMenu)}
                        aria-label="Buka menu"
                        className="rounded-xl p-2 text-white md:hidden"
                    >
                        {mobileMenu ? <X size={25} /> : <Menu size={25} />}
                    </button>
                </nav>

                {mobileMenu && (
                    <div className="mx-5 rounded-2xl border border-white/10 bg-[#5B0F18]/95 p-4 backdrop-blur-xl md:hidden">
                        <div className="flex flex-col gap-1">
                            <a
                                href="#events"
                                onClick={() => setMobileMenu(false)}
                                className="rounded-xl px-4 py-3 text-white hover:bg-white/10"
                            >
                                Event
                            </a>
                            <a
                                href="#categories"
                                onClick={() => setMobileMenu(false)}
                                className="rounded-xl px-4 py-3 text-white hover:bg-white/10"
                            >
                                Kategori
                            </a>
                            <a
                                href="#about"
                                onClick={() => setMobileMenu(false)}
                                className="rounded-xl px-4 py-3 text-white hover:bg-white/10"
                            >
                                Tentang Kami
                            </a>

                            <div className="my-2 h-px bg-white/10" />

                            <Link href="/login" className="rounded-xl px-4 py-3 text-white hover:bg-white/10">
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-xl bg-white px-4 py-3 text-center font-bold text-[#5B0F18]"
                            >
                                Daftar
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* HERO */}
            <section className="relative min-h-[760px] overflow-hidden bg-[#5B0F18]">
                <div
                    className="absolute inset-0 scale-110 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=2200&q=85')",
                    }}
                />
                <div className="absolute inset-0 bg-[#5B0F18]/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#5B0F18] via-[#5B0F18]/80 to-transparent" />

                <div className="relative mx-auto flex min-h-[700px] max-w-7xl items-center px-5 pb-28 pt-32 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur animate-[fadeUp_0.6s_ease-out]">
                            <Sparkles size={16} className="text-[#D4A537]" />
                            Temukan event favoritmu
                        </div>

                        <h1 className="font-display text-5xl font-semibold uppercase leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-8xl">
                            Rasakan
                            <span className="block text-[#D8A7A7]">momen</span>
                            yang tak terlupakan.
                        </h1>

                        <p className="mt-7 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                            Temukan konser, festival, dan berbagai event menarik di
                            kotamu. Pesan tiket dengan mudah dan nikmati setiap
                            momennya bersama Eventify.
                        </p>

                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/customer/event"
                                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-bold text-[#5B0F18] transition hover:-translate-y-0.5 hover:bg-[#F8F1E7] hover:shadow-xl"
                            >
                                Jelajahi Event
                                <ArrowRight
                                    size={19}
                                    className="transition group-hover:translate-x-1"
                                />
                            </Link>
                            <a
                                href="#events"
                                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/15"
                            >
                                Event Terpopuler
                            </a>
                        </div>
                    </div>
                </div>

                {/* SEARCH */}
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="mx-auto max-w-7xl px-5 lg:px-8">
                        <div className="rounded-t-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl sm:p-5">
                            <div className="flex flex-col gap-3 md:flex-row">
                                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-5 py-4 transition focus-within:ring-2 focus-within:ring-[#D4A537]">
                                    <Search size={21} className="text-[#7A1F2B]" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Cari konser, festival, atau kota..."
                                        className="w-full bg-transparent text-sm outline-none placeholder:text-[#1E1E1E]/40"
                                    />
                                </div>
                                <a
                                    href="#events"
                                    className="flex items-center justify-center rounded-2xl bg-[#7A1F2B] px-8 py-4 text-center font-bold text-white transition hover:bg-[#5B0F18]"
                                >
                                    Cari Event
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MARQUEE TICKER — signature "departure board" strip */}
            <div className="overflow-hidden border-y border-[#D4A537]/30 bg-[#1E1E1E] py-3">
                <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
                    {[...events, ...events].map((event, i) => (
                        <span
                            key={`${event.id}-${i}`}
                            className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wide text-white/80"
                        >
                            <Ticket size={14} className="text-[#D4A537]" />
                            {event.title}
                            <span className="text-white/30">— {event.city}</span>
                            <span className="mx-4 text-[#D4A537]">•</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* CATEGORY */}
            <section id="categories" className="py-20">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <Reveal className="mb-10 flex items-end justify-between">
                        <div>
                            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#7A1F2B]">
                                Explore
                            </p>
                            <h2 className="font-display text-3xl font-semibold uppercase tracking-tight sm:text-4xl">
                                Cari berdasarkan kategori
                            </h2>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {categories.map((category, i) => {
                            const Icon = category.icon;
                            const isActive = activeCategory === category.name;

                            return (
                                <Reveal key={category.name} delay={i * 60}>
                                    <button
                                        onClick={() => setActiveCategory(category.name)}
                                        aria-pressed={isActive}
                                        className={`group w-full rounded-3xl border p-5 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                                            isActive
                                                ? "border-[#5B0F18] bg-[#5B0F18] text-white shadow-lg"
                                                : "border-[#D8A7A7]/40 bg-white text-[#1E1E1E]"
                                        }`}
                                    >
                                        <div
                                            className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl transition ${
                                                isActive
                                                    ? "bg-[#D4A537] text-[#5B0F18]"
                                                    : "bg-[#D8A7A7]/25 text-[#5B0F18] group-hover:bg-[#5B0F18] group-hover:text-white"
                                            }`}
                                        >
                                            <Icon size={23} />
                                        </div>
                                        <p className="font-bold">{category.name}</p>
                                        <p
                                            className={`mt-1 text-xs ${
                                                isActive ? "text-white/60" : "text-black/45"
                                            }`}
                                        >
                                            {category.count}
                                        </p>
                                    </button>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* EVENTS */}
            <section id="events" className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <Reveal className="mb-10 flex items-end justify-between gap-5">
                        <div>
                            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#7A1F2B]">
                                Jangan Lewatkan
                            </p>
                            <h2 className="font-display text-3xl font-semibold uppercase tracking-tight sm:text-4xl">
                                Event pilihan minggu ini
                            </h2>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
                                {filteredEvents.length > 0
                                    ? `Menampilkan ${filteredEvents.length} event yang sedang ramai.`
                                    : "Temukan event yang sedang ramai dan jangan sampai kehabisan tiket."}
                            </p>
                        </div>
                        <Link
                            href="/customer/event"
                            className="hidden shrink-0 items-center gap-2 text-sm font-bold text-[#5B0F18] sm:flex"
                        >
                            Lihat Semua
                            <ArrowRight size={17} />
                        </Link>
                    </Reveal>

                    {filteredEvents.length === 0 ? (
                        <Reveal className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-[#D8A7A7]/50 py-20 text-center">
                            <Ticket size={32} className="text-[#D8A7A7]" />
                            <p className="font-bold">Belum ada event yang cocok</p>
                            <p className="max-w-sm text-sm text-black/45">
                                Coba kata kunci lain atau lihat semua kategori yang
                                tersedia.
                            </p>
                            <button
                                onClick={() => {
                                    setActiveCategory("Semua");
                                    setQuery("");
                                }}
                                className="rounded-xl bg-[#5B0F18] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#7A1F2B]"
                            >
                                Reset pencarian
                            </button>
                        </Reveal>
                    ) : (
                        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                            {filteredEvents.map((event, i) => {
                                const isSaved = saved.has(event.id);
                                const isAlmostSoldOut = event.soldPercent >= 75;

                                return (
                                    <Reveal key={event.id} delay={i * 80}>
                                        <div className="group relative overflow-hidden rounded-3xl border border-[#D8A7A7]/30 bg-[#FDFAF3] transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
                                            <Link href={`/customer/event/${event.id}`}>
                                                <div className="relative aspect-[16/10] overflow-hidden">
                                                    <img
                                                        src={event.image}
                                                        alt={event.title}
                                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                    />
                                                    <span className="absolute left-4 top-4 rounded-full bg-[#F8F1E7]/95 px-3 py-1.5 text-xs font-bold text-[#5B0F18]">
                                                        {event.category}
                                                    </span>
                                                    {event.trending && (
                                                        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#D4A537] px-3 py-1.5 text-xs font-bold text-[#5B0F18]">
                                                            <Flame size={13} />
                                                            Trending
                                                        </span>
                                                    )}
                                                </div>
                                            </Link>

                                            {/* wishlist toggle */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleSaved(event.id);
                                                }}
                                                aria-label={
                                                    isSaved
                                                        ? "Hapus dari tersimpan"
                                                        : "Simpan event"
                                                }
                                                className="absolute right-4 top-[38%] z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#5B0F18] shadow-md transition hover:scale-110"
                                            >
                                                <Heart
                                                    size={16}
                                                    className={isSaved ? "fill-[#7A1F2B] text-[#7A1F2B]" : ""}
                                                />
                                            </button>

                                            {/* perforated ticket seam */}
                                            <div className="relative mx-5 border-t border-dashed border-[#D8A7A7]/60">
                                                <TicketNotch side="left" />
                                                <TicketNotch side="right" />
                                            </div>

                                            <Link href={`/customer/event/${event.id}`} className="block p-5 pt-4">
                                                <h3 className="line-clamp-1 font-display text-lg font-semibold uppercase tracking-tight">
                                                    {event.title}
                                                </h3>

                                                <div className="mt-4 space-y-2.5">
                                                    <div className="flex items-center gap-2 text-sm text-black/55">
                                                        <CalendarDays size={16} className="text-[#7A1F2B]" />
                                                        {event.date}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-black/55">
                                                        <MapPin size={16} className="text-[#7A1F2B]" />
                                                        <span className="line-clamp-1">{event.location}</span>
                                                    </div>
                                                </div>

                                                {isAlmostSoldOut && (
                                                    <div className="mt-4">
                                                        <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                                                            <span className="flex items-center gap-1 text-[#7A1F2B]">
                                                                <Flame size={12} />
                                                                Tiket hampir habis
                                                            </span>
                                                            <span className="text-black/40">
                                                                {event.soldPercent}% terjual
                                                            </span>
                                                        </div>
                                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#D8A7A7]/25">
                                                            <div
                                                                className="h-full rounded-full bg-gradient-to-r from-[#D4A537] to-[#7A1F2B] transition-all duration-700"
                                                                style={{ width: `${event.soldPercent}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="mt-5 flex items-end justify-between border-t border-[#D8A7A7]/20 pt-4">
                                                    <div>
                                                        <p className="text-xs text-black/40">Mulai dari</p>
                                                        <p className="font-black text-[#5B0F18]">
                                                            {formatCurrency(event.price)}
                                                        </p>
                                                    </div>
                                                    <span className="rounded-xl bg-[#5B0F18] px-4 py-2 text-xs font-bold text-white transition group-hover:bg-[#7A1F2B]">
                                                        Detail
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* WHY EVENTIFY */}
            <section id="about" className="py-20">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="grid items-center gap-14 lg:grid-cols-2">
                        <Reveal>
                            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#7A1F2B]">
                                Kenapa Eventify?
                            </p>
                            <h2 className="font-display text-4xl font-semibold uppercase leading-tight tracking-tight sm:text-5xl">
                                Semua event favoritmu,
                                <span className="text-[#7A1F2B]"> dalam satu tempat.</span>
                            </h2>
                            <p className="mt-6 max-w-xl leading-7 text-black/55">
                                Eventify membantu kamu menemukan event, membeli tiket,
                                dan menyimpan tiket digital dengan pengalaman yang
                                sederhana.
                            </p>

                            <div className="mt-8 space-y-4">
                                {[
                                    "Pembelian tiket mudah dan cepat",
                                    "Tiket digital tersimpan otomatis",
                                    "Pembayaran aman dan terpercaya",
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-3">
                                        <CheckCircle2 size={21} className="shrink-0 text-[#7A1F2B]" />
                                        <span className="font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </Reveal>

                        <div ref={statsRef} className="grid grid-cols-2 gap-4">
                            <Reveal delay={0}>
                                <div className="rounded-3xl bg-[#5B0F18] p-7 text-white">
                                    <Ticket size={28} className="text-[#D4A537]" />
                                    <p className="mt-12 font-display text-3xl font-semibold">
                                        {eventCount}+
                                    </p>
                                    <p className="mt-1 text-sm text-white/55">Event tersedia</p>
                                </div>
                            </Reveal>
                            <Reveal delay={100}>
                                <div className="mt-8 rounded-3xl bg-[#D8A7A7] p-7 text-[#5B0F18]">
                                    <ShieldCheck size={28} />
                                    <p className="mt-12 font-display text-3xl font-semibold">Aman</p>
                                    <p className="mt-1 text-sm opacity-60">Transaksi terpercaya</p>
                                </div>
                            </Reveal>
                            <Reveal delay={200}>
                                <div className="-mt-8 rounded-3xl bg-white p-7 shadow-sm">
                                    <Zap size={28} className="text-[#7A1F2B]" />
                                    <p className="mt-12 font-display text-3xl font-semibold">Fast</p>
                                    <p className="mt-1 text-sm text-black/45">Proses pembelian</p>
                                </div>
                            </Reveal>
                            <Reveal delay={300}>
                                <div className="rounded-3xl bg-[#7A1F2B] p-7 text-white">
                                    <CheckCircle2 size={28} />
                                    <p className="mt-12 font-display text-3xl font-semibold">Digital</p>
                                    <p className="mt-1 text-sm text-white/55">
                                        Tiket langsung tersimpan
                                    </p>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative overflow-hidden bg-[#5B0F18] py-24">
                <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#D4A537]/10 blur-3xl" />
                <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#D8A7A7]/10 blur-3xl" />

                <Reveal className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4A537]">
                        Ready?
                    </p>
                    <h2 className="mt-4 font-display text-4xl font-semibold uppercase tracking-tight text-white sm:text-6xl">
                        Waktunya membuat momen
                        <span className="text-[#D8A7A7]"> tak terlupakan.</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/55">
                        Cari event favoritmu dan dapatkan tiketnya sebelum kehabisan.
                    </p>
                    <Link
                        href="/customer/event"
                        className="group mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 font-bold text-[#5B0F18] transition hover:-translate-y-0.5 hover:bg-[#F8F1E7] hover:shadow-xl"
                    >
                        Mulai Jelajahi Event
                        <ArrowRight size={19} className="transition group-hover:translate-x-1" />
                    </Link>
                </Reveal>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#1E1E1E] py-12 text-white">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="grid gap-10 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <h3 className="font-display text-2xl font-semibold">Eventify</h3>
                            <p className="mt-4 max-w-md text-sm leading-6 text-white/45">
                                Platform pemesanan tiket event yang membantu kamu
                                menemukan pengalaman terbaik dan membuat setiap momen
                                menjadi lebih berarti.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold">Eventify</h4>
                            <div className="mt-4 space-y-3 text-sm text-white/45">
                                <a href="#events" className="block hover:text-white">
                                    Event
                                </a>
                                <a href="#categories" className="block hover:text-white">
                                    Kategori
                                </a>
                                <a href="#about" className="block hover:text-white">
                                    Tentang Kami
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold">Akun</h4>
                            <div className="mt-4 space-y-3 text-sm text-white/45">
                                <Link href="/login" className="block hover:text-white">
                                    Masuk
                                </Link>
                                <Link href="/register" className="block hover:text-white">
                                    Daftar
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/35">
                        © 2026 Eventify. All rights reserved.
                    </div>
                </div>
            </footer>
        </main>
    );
}