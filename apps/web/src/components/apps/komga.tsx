import Image from "next/image";
import Icon from "@/components/shared/Icon";
import { useState } from "react";
import KomgaModal from "@/components/modals/KomgaModal";

const Komga = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col xl:max-w-[33vw]">
        <div className="mb-4 flex flex-col gap-0">
          <div className="flex gap-2 ">
            <div className="w-8 aspect-square relative">
              <Image
                fill
                className="w-full h-full object-cover"
                src="/logos/komga-logo.svg"
                alt={`kavita logo`}
              />
            </div>
            <h4 className="text-2xl text-gray-200 font-bold">
              Komga Integration
            </h4>
          </div>
          <span className="text-sm text-gray-400 font-semibold">
            Connected Komga Instance. These credentials will be used to connect
            to and ping the configured instace
          </span>
          <div className="flex h-32 w-full mt-4 rounded-lg grow-0 border-dashed border border-gray-500 bg-base-200 items-center justify-center">
            <button
              className="btn btn-outline hover:btn-primary transition-all text-gray-200"
              onClick={() => setIsModalOpen(true)}
            >
              <Icon name="plus" />
              <span className="">Add Komga Instance</span>
            </button>
          </div>
        </div>
      </div>
      <KomgaModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Komga;
