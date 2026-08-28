"use client";

import { useEffect, useState } from "react";

import CategoryFilter from "@/components/categoryFilter";
import EventGrid from "@/components/eventGrid";
import SectionHeader from "@/components/sectionHeader";
import LoadingSpinner from "@/components/loadingSpinner";
import EmptyState from "@/components/emptyState";

import { getEvents } from "@/services/eventService";
import { getCategories } from "@/services/categoryService";

import { useSearch } from "@/contexts/searchContext";

export default function CustomerEventPage() {
  const { search } = useSearch();

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [eventsResponse, categoriesResponse] = await Promise.all([
          getEvents(),
          getCategories(),
        ]);

        const eventsData = eventsResponse?.data || eventsResponse || [];
        const categoriesData =
          categoriesResponse?.data || categoriesResponse || [];

        setEvents(Array.isArray(eventsData) ? eventsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (err) {
        console.error("Failed to load events:", err);
        setError("Gagal memuat daftar event. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredEvents = events.filter((event) => {
    if (!event.category_id) return false;

    const categoryMatch =
      activeCategory === "All" ||
      String(event.category_id) === String(activeCategory);

    const keyword = search.toLowerCase().trim();
    const searchMatch =
      !keyword ||
      (event.title?.toLowerCase() || "").includes(keyword) ||
      (event.location?.toLowerCase() || "").includes(keyword);

    return categoryMatch && searchMatch;
  });

  return (
    <div>
      <SectionHeader
        title="Explore Events"
        description="Discover and book events that match your interests"
      />

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      <div className="mt-8">
        {loading ? (
          <LoadingSpinner text="Loading events..." />
        ) : error ? (
          <EmptyState title="Something went wrong" description={error} />
        ) : (
          <EventGrid
            events={filteredEvents}
            favorites={favorites}
            columns={4}
            onFavorite={(event) => {
              setFavorites((current) =>
                current.includes(event.id)
                  ? current.filter((id) => id !== event.id)
                  : [...current, event.id]
              );
            }}
          />
        )}
      </div>
    </div>
  );
}