import Komga from "@/components/apps/komga";
import Kavita from "@/components/apps/Kavita";

const ConnectedApps = () => {
  return (
    <div className="flex flex-col animate-fadein">
      <div className="flex flex-col py-4 mb-4">
        <h2 className="text-3xl text-gray-100 font-bold">
          Connected Applications
        </h2>
        <p className=" text-gray-400">Manage connected applications</p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <Kavita />
        <Komga />
      </div>
    </div>
  );
};

export default ConnectedApps;
