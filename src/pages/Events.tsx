import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MapPin, Users } from "lucide-react";
import { CreateEventModal } from "@/components/modals/CreateEventModal";
import { EventRegistrationModal } from "@/components/modals/EventRegistrationModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Events = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:user_id (name, avatar_url),
          event_registrations (id)
        `)
        .order("date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-sage-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-sage-800">Events</h1>
            <CreateEventModal />
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-sage-500" />
            <Input placeholder="Search events..." className="pl-10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <EventCardSkeleton key={index} />
              ))
            ) : (
              events?.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-sage-200" />
                  <div className="p-4">
                    <div className="flex items-center space-x-2 text-sage-600 text-sm mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(event.date), "PPP • p")}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <p className="text-sage-600 text-sm mb-4">
                      {event.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-sage-500 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{event.event_registrations.length} attending</span>
                      </div>
                    </div>
                    <EventRegistrationModal />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const EventCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-4">
      <Skeleton className="h-4 w-32 mb-2" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-16 w-full mb-4" />
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

export default Events;