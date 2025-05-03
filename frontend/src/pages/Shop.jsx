import React, { Suspense, lazy } from "react";
import Hero from "./Hero";
import Popular from "../components/popular/Popular";
import Offers from "../components/offers/Offer";
import ToastifyWrapper from "./Toastify"; // We'll create this wrapper
import HotDeals from "./HotDeals";
import BeiYangu from "./BieYangu";
import RecentlyViewedItems from "./RecentViewed";
import { LoadingProvider } from "../components/loadingstate/LoadingState";

// Lazy load less critical or lower in the viewport components
const LazyNew = lazy(() => import("../components/NewColections/NewCollection"));
const LazyNews = lazy(() => import("../components/NewsLatter/NewsLatter"));
const LazyFeatures = lazy(() => import("../components/Features/Features"));
const LazyFAQ = lazy(() => import("../components/Faq/Faq"));
const LazyAll = lazy(() => import("./All"));
const LazyMyPocket = lazy(() => import("./MyPocket"));
const LazyBestVitronTvs = lazy(() => import("./BestVitron"));
const LazyBestPowerbanks = lazy(() => import("./BestOrimoPowerBanks"));
const LazyBestJblSpeakers = lazy(() => import("./BestJbl"));
const LazyBestHpLaptops = lazy(() => import("./BestHp"));



const Shop = () => {
  return (
    <div>
  
      <Hero />
      <HotDeals />
      <BeiYangu />
      <LazyMyPocket />
      <Offers />
      <Popular />
     <LoadingProvider>
        <LazyBestVitronTvs />
        <LazyBestPowerbanks />
        <LazyBestJblSpeakers />
        <LazyBestHpLaptops />
        <LazyNew />
        <LazyAll />
        <RecentlyViewedItems/>
        <LazyNews />
        <LazyFeatures />
        <LazyFAQ />
        </LoadingProvider>
      
      <ToastifyWrapper />
    
    </div>
  );
};

export default Shop;
