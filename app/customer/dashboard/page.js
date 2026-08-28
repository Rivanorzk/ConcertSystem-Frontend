"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  ChevronRight,
  Compass,
  RefreshCw,
  Search,
  TicketX,
} from "lucide-react";

import CategoryFilter from "@/components/categoryFilter";
import TicketCard from "@/components/ticketCard";
import QuickAction from "@/components/quickAction";
import LoadingSpinner from "@/components/loadingSpinner";

import { getEvents } from "@/services/eventService";
import { getCategories } from "@/services/categoryService";
import { getMyTickets } from "@/services/ticketService";

import useAuth from "@/hooks/useAuth";
import { useSearch } from "@/contexts/searchContext";

// Warna aksen bergiliran untuk lencana kategori — tetap dari palet Eventify
const BADGE_STYLES = [
  { bg: "bg-[#D8A7A7]/20", text: "text-[#7A1F2B]" },
  { bg: "bg-[#D4A537]/20", text: "text-[#B4841F]" },
  { bg: "bg-[#5B0F18]/10", text: "text-[#5B0F18]" },
];

function initialsOf(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "EV";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { search, setSearch } = useSearch();

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState("All");

  /* =========================
     CHECK ROLE
  ========================= */

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role?.toLowerCase() !== "customer") {
      switch (user.role?.toLowerCase()) {
        case "admin":
          router.replace("/admin/dashboard");
          break;
        case "organizer":
          router.replace("/organizer/dashboard");
          break;
        default:
          router.replace("/login");
      }
    }
  }, [user, authLoading, router]);

  /* =========================
     LOAD DASHBOARD
  ========================= */

  useEffect(() => {
    if (authLoading || !user) return;
    if (user.role?.toLowerCase() !== "customer") return;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const [eventsResponse, categoriesResponse, ticketsResponse] = await Promise.all([
          getEvents(),
          getCategories(),
          getMyTickets(),
        ]);

        const eventsData = eventsResponse?.data || eventsResponse || [];
        const categoriesData = categoriesResponse?.data || categoriesResponse || [];
        const ticketsData = ticketsResponse?.data || ticketsResponse || [];

        setEvents(Array.isArray(eventsData) ? eventsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setTickets(Array.isArray(ticketsData) ? ticketsData : []);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        setError("Gagal memuat data dashboard. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user, authLoading]);

  /* =========================
     FILTER + SORT EVENTS
  ========================= */

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const categoryMatch =
        activeCategory === "All" ||
        String(event.category_id) === String(activeCategory);

      const keyword = search?.toLowerCase().trim() || "";
      const searchMatch =
        !keyword ||
        (event.title?.toLowerCase() || "").includes(keyword) ||
        (event.location?.toLowerCase() || "").includes(keyword);

      return categoryMatch && searchMatch;
    });
  }, [events, activeCategory, search]);

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort(
      (a, b) => new Date(a.event_date) - new Date(b.event_date)
    );
  }, [filteredEvents]);

  const ongoingEvents = sortedEvents.slice(0, 4);
  const upcomingEvents = sortedEvents.slice(4, 8);

  /* =========================
     AUTH LOADING
  ========================= */

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F1E7]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#D8A7A7] border-t-[#5B0F18]" />
          <p className="text-sm font-medium text-[#7A1F2B]">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.role?.toLowerCase() !== "customer") {
    return null;
  }

  if (loading) {
    return (
      <div className="py-16">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-[#E8B8B8] bg-[#FFF4F4] px-8 py-16 text-center animate-fade-up">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7A1F2B]/10 text-[#7A1F2B]">
          <AlertTriangle size={22} />
        </div>
        <div>
          <h3 className="font-bold text-[#1E1E1E]">Something went wrong</h3>
          <p className="mt-1 max-w-sm text-sm text-[#737373]">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="group inline-flex items-center gap-2 rounded-xl bg-[#5B0F18] px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#7A1F2B]"
        >
          <RefreshCw size={16} className="transition-transform duration-500 group-hover:rotate-180" />
          Try Again
        </button>
        <style jsx>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up { animation: fadeUp 0.5s ease-out forwards; }
        `}</style>
      </div>
    );
  }

  /* =========================
     PAGE CONTENT
  ========================= */

  return (
    <div className="space-y-6">
      {/* TOP BAR */}
      <div className="flex flex-col gap-4 animate-fade-up md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[#1E1E1E]">
          Dashboard
        </h1>

        <div className="flex flex-1 items-center gap-3 md:justify-end">
          <div className="flex w-full max-w-xs items-center gap-2 rounded-xl border border-[#E5D6D0] bg-white px-4 py-2.5 transition focus-within:ring-2 focus-within:ring-[#D4A537]">
            <Search size={16} className="shrink-0 text-[#A68C8C]" />
            <input
              type="text"
              value={search || ""}
              onChange={(e) => setSearch?.(e.target.value)}
              placeholder="Search event or anything"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#A68C8C]"
            />
          </div>

          <Link
            href="/customer/event"
            className="hidden shrink-0 items-center gap-2 rounded-xl bg-[#5B0F18] px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#7A1F2B] sm:inline-flex"
          >
            <Compass size={16} />
            Explore Events
          </Link>

          <button
            type="button"
            aria-label="Notifikasi"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E5D6D0] bg-white text-[#7A1F2B] transition hover:bg-[#F8F1E7]"
          >
            <Bell size={17} />
            {tickets.length > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#D4A537]" />
            )}
          </button>

          <div className="flex shrink-0 items-center gap-2.5 rounded-xl border border-[#E5D6D0] bg-white px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5B0F18] text-[10px] font-bold text-white">
              {initialsOf(user?.username || user?.name || "User")}
            </div>
            <span className="hidden text-sm font-semibold text-[#1E1E1E] sm:inline">
              {user?.username || user?.name || "Akun"}
            </span>
          </div>
        </div>
      </div>

      {/* STAT / CATEGORY CARDS */}
      {categories.length > 0 && (
        <div
          className="grid gap-4 animate-fade-up sm:grid-cols-2 lg:grid-cols-3"
          style={{ animationDelay: "60ms" }}
        >
          {categories.slice(0, 3).map((category, index) => {
            const style = BADGE_STYLES[index % BADGE_STYLES.length];
            const count = events.filter(
              (event) => String(event.category_id) === String(category.id)
            ).length;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(String(category.id))}
                className={`flex items-center gap-4 rounded-2xl border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                  String(activeCategory) === String(category.id)
                    ? "border-[#5B0F18]"
                    : "border-[#E5D6D0]"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${style.bg} ${style.text}`}
                >
                  {initialsOf(category.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold text-[#1E1E1E]">
                    {category.name}
                  </p>
                  <p className="text-xs text-[#8C7777]">
                    <span className="font-semibold text-[#7A1F2B]">{count}</span>{" "}
                    event tersedia
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {activeCategory !== "All" && (
        <div className="animate-fade-up">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      )}

      {/* MAIN GRID */}
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* ONGOING EVENT */}
          <section
            className="rounded-3xl border border-[#E5D6D0] bg-white p-5 animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-[#1E1E1E]">Ongoing Event</h2>
              <Link
                href="/customer/event"
                className="flex items-center gap-1 text-xs font-semibold text-[#7A1F2B] hover:text-[#5B0F18]"
              >
                Lihat semua
                <ChevronRight size={14} />
              </Link>
            </div>

            {ongoingEvents.length === 0 ? (
              <EmptyRow text="Belum ada event tersedia." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {ongoingEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/customer/event/${event.id}`}
                    className="group overflow-hidden rounded-2xl border border-[#F0E5DE] transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-[#F0E5DE]">
                      <img
                        src={event.poster}
                        alt={event.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-1 text-sm font-bold text-[#1E1E1E]">
                        {event.title}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8C7777]">
                        <CalendarDays size={13} className="shrink-0 text-[#7A1F2B]" />
                        <span className="truncate">
                          {event.event_date}
                          {event.start_time ? `, ${event.start_time}` : ""}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* UPCOMING EVENT */}
          <section
            className="rounded-3xl border border-[#E5D6D0] bg-white p-5 animate-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-[#1E1E1E]">Upcoming Event</h2>
              <Link
                href="/customer/event"
                className="flex items-center gap-1 text-xs font-semibold text-[#7A1F2B] hover:text-[#5B0F18]"
              >
                Lihat semua
                <ChevronRight size={14} />
              </Link>
            </div>

            {upcomingEvents.length === 0 ? (
              <EmptyRow text="Belum ada event mendatang." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/customer/event/${event.id}`}
                    className="rounded-2xl border border-[#F0E5DE] p-4 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <span className="inline-block rounded-full bg-[#D8A7A7]/20 px-3 py-1 text-xs font-semibold text-[#7A1F2B]">
                      {event.event_date}
                    </span>
                    <p className="mt-3 line-clamp-1 text-sm font-bold text-[#1E1E1E]">
                      {event.title}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[#8C7777]">
                      <CalendarDays size={13} className="shrink-0 text-[#7A1F2B]" />
                      <span className="truncate">{event.start_time || "-"}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div
            className="rounded-3xl border border-[#E5D6D0] bg-white p-5 animate-fade-up"
            style={{ animationDelay: "220ms" }}
          >
            <h2 className="mb-4 font-bold text-[#1E1E1E]">Tiket Kamu</h2>

            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#E5D6D0] py-8 text-center">
                  <p className="text-sm font-medium text-[#8C7777]">
                    No upcoming tickets
                  </p>
                  <p className="mt-1 text-xs text-[#A68C8C]">
                    Book an event to see your tickets here
                  </p>
                </div>
              ) : (
                tickets
                  .slice(0, 3)
                  .map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
              )}
            </div>
          </div>

          <div
            className="rounded-3xl border border-[#E5D6D0] bg-white p-5 animate-fade-up"
            style={{ animationDelay: "280ms" }}
          >
            <QuickAction />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          opacity: 0;
          animation: fadeUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

function EmptyRow({ text }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E5D6D0] py-10 text-center">
      <TicketX size={22} className="text-[#D8A7A7]" />
      <p className="text-sm font-medium text-[#8C7777]">{text}</p>
    </div>
  );
}