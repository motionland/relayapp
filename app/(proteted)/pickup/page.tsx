import DekstopFooter from "@/components/dektop-footer";
import PickupViewDesktop from "@/components/pickup/pickup/pickup-view-dekstop";
import PickupViewMobile from "@/components/pickup/pickup/pickup-view-mobile";


const Scan = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-md sm:max-w-xl dm:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto">
        <div className="block md:hidden">
          <PickupViewMobile />
        </div>
        <div className="hidden md:block">
          <DekstopFooter />
          <PickupViewDesktop />
        </div>
      </div>
    </div>
  );
};

export default Scan;
