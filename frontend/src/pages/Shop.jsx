import React, { Suspense, lazy } from "react";
import Hero from "./Hero";
import HotDeals from "./HotDeals";
import BeiYangu from "./BieYangu";
import Offers from "../components/offers/Offer";
import Popular from "../components/popular/Popular";
import RecentlyViewedItems from "./RecentViewed";
import ToastifyWrapper from "./Toastify";
import { LoadingProvider } from "../components/loadingstate/LoadingState";

// Lazy-loaded components
const LazyMyPocket = lazy(() => import("./MyPocket"));
const LazyNew = lazy(() => import("../components/NewColections/NewCollection"));
const LazyNews = lazy(() => import("../components/NewsLatter/NewsLatter"));
const LazyFeatures = lazy(() => import("../components/Features/Features"));
const LazyFAQ = lazy(() => import("../components/Faq/Faq"));
const LazyAll = lazy(() => import("./All"));
const LazyBestVitronTvs = lazy(() => import("./BestVitron"));
const LazyBestPowerbanks = lazy(() => import("./BestOrimoPowerBanks"));
const LazyBestJblSpeakers = lazy(() => import("./BestJbl"));
const LazyBestHpLaptops = lazy(() => import("./BestHp"));

const Shop = () => {
  return (
    <div>
      {/* Priority Content (Render immediately) */}
      <Hero />
      <HotDeals />
      <BeiYangu />

      {/* Lazy loaded section just below the fold */}
      <Suspense fallback={<div style={{ padding: '1rem' }}>Loading Smart Deals...</div>}>
        <LazyMyPocket />
      </Suspense>

      {/* Static offers + popular sections */}
      <Offers />
      <Popular />

      {/* Lazy-loaded components inside loading provider */}
      <LoadingProvider>
        <Suspense fallback={<div style={{ padding: '1rem' }}>Loading Vitron TVs...</div>}>
          <LazyBestVitronTvs />
        </Suspense>

        <Suspense fallback={<div style={{ padding: '1rem' }}>Loading Orimo Powerbanks...</div>}>
          <LazyBestPowerbanks />
        </Suspense>

        <Suspense fallback={<div style={{ padding: '1rem' }}>Loading JBL Speakers...</div>}>
          <LazyBestJblSpeakers />
        </Suspense>

        <Suspense fallback={<div style={{ padding: '1rem' }}>Loading HP Laptops...</div>}>
          <LazyBestHpLaptops />
        </Suspense>

        <Suspense fallback={<div style={{ padding: '1rem' }}>Loading New Arrivals...</div>}>
          <LazyNew />
        </Suspense>

        <Suspense fallback={<div style={{ padding: '1rem' }}>Loading All Products...</div>}>
          <LazyAll />
        </Suspense>

        <RecentlyViewedItems />

        <Suspense fallback={<div style={{ padding: '1rem' }}>Loading Newsletter...</div>}>
          <LazyNews />
        </Suspense>

        <Suspense fallback={<div style={{ padding: '1rem' }}>Loading Features...</div>}>
          <LazyFeatures />
        </Suspense>

        <Suspense fallback={<div style={{ padding: '1rem' }}>Loading FAQs...</div>}>
          <LazyFAQ />
        </Suspense>
      </LoadingProvider>

      <ToastifyWrapper />
    </div>
  );
};

export default Shop;
