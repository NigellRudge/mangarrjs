import Icon from "@/components/Icon";
import { useState } from "react";
import Image from "next/image";
import KavitaModal from "@/components/modals/KavitaModal";

const Kavita = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <div className="mb-4 flex flex-col  xl:max-w-[33vw]">
        <div className="flex gap-2 ">
          <div className="w-8 aspect-square relative">
            <Image
              fill
              className="w-full h-full object-cover"
              src="/logos/kavita-logo.svg"
              alt={`kavita logo`}
            />
          </div>
          <h4 className="text-2xl text-gray-200 font-bold">
            Kavita Integration
          </h4>
        </div>
        <span className="text-sm text-gray-400 font-semibold">
          Connected Kavita Instance. These credentials will be used to connect
          to and ping the configured instace
        </span>
        <div className="flex h-32 w-full mt-4 rounded-lg grow-0 border-dashed border border-gray-500 bg-base-200 items-center justify-center">
          <button
            className="btn btn-outline hover:btn-primary transition-all text-gray-200"
            onClick={() => setIsModalOpen(true)}
          >
            <Icon name="plus" />
            <span className="">Add Kavita Instance</span>
          </button>
        </div>
      </div>

      <KavitaModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Kavita;
