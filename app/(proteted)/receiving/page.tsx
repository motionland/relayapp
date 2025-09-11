import DekstopFooter from "@/components/dektop-footer";
import ReceivingViewDekstop from "@/components/receiving/receiving-view-dekstop";
import ReceivingViewMobile from "@/components/receiving/receiving-view-mobile";

const Scan = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-md sm:max-w-xl dm:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto">
        <div className="block md:hidden">
          <ReceivingViewMobile />
        </div>
        <div className="hidden md:block">
          <DekstopFooter />
          <ReceivingViewDekstop />
        </div>
      </div>
    </div>
  );
};

export default Scan;
