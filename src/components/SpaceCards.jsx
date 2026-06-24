import React from "react";

import {
  DraggableCardBody,
  DraggableCardContainer,
} from "./ui/draggable-card";

export default function SpaceCards() {
  const items = [
    {
      title: "Galaxy",
      image:
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2400&auto=format&fit=crop",
    },

    {
      title: "Astronaut",
      image:
        "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2400&auto=format&fit=crop",
    },

    {
      title: "Nebula",
      image:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=2400&auto=format&fit=crop",
    },

    {
      title: "Moon",
      image:
        "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?q=80&w=2400&auto=format&fit=crop",
    },

    {
      title: "Stars",
      image:
        "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2400&auto=format&fit=crop",
    },

    {
      title: "Universe",
      image:
        "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=2400&auto=format&fit=crop",
    },
  ];

  return (
    <DraggableCardContainer className="relative z-10 w-full px-10 py-24">

      <div className="text-center mb-20">
        <h2 className="text-5xl font-bold text-white">
          Explore The Cosmos
        </h2>

        <p className="mt-4 text-lg text-gray-400">
          Drag the cards and experience futuristic space visuals.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-16">

        {items.map((item) => (
          <DraggableCardBody key={item.title}>

            <img
              src={item.image}
              alt={item.title}
              className="pointer-events-none relative z-10 h-80 w-80 rounded-xl object-cover"
            />

            <h3 className="mt-4 text-center text-2xl font-bold text-white">
              {item.title}
            </h3>

          </DraggableCardBody>
        ))}

      </div>
    </DraggableCardContainer>
  );
}