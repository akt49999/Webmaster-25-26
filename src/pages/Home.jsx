import React from 'react';
import Hero from '../components/Hero';
import PopularCategories from '../components/PopularCategories';
import EventsStrip from '../components/EventsStrip';
import HighlightSpotlight from '../components/HighlightSpotlight';
import ResourceForm from '../components/ResourceForm';
import GuestInfoToast from '../components/GuestInfoToast';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import MovingHomeStrip from '../components/moving_home_strip';

export default function Home() {
  useScrollAnimation();
  return (
    <>
      <GuestInfoToast />
      <MovingHomeStrip />
      <Hero />
      <PopularCategories />
      <EventsStrip />
      <HighlightSpotlight />
      <ResourceForm />
    </>
  );
}
