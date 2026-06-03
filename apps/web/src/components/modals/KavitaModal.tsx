import Icon from "@/components/shared/Icon";
import BaseModal from "@/components/modals/BaseModal";

const KavitaModel = ({
  isOpen,
  closeModal,
}: {
  isOpen?: boolean;
  closeModal: () => void;
}) => {
  return (
    <BaseModal isOpen={isOpen} onCancelClick={() => closeModal()}>
      <form
        action=""
        className="bg-base-100 border-gray-600 rounded-lg w-full border"
      >
        <div className="flex flex-col md:max-w-[90vw] w-[450px]">
          <div className="flex flex-col px-4 py-2 border-b border-gray-600">
            <h4 className="text-lg text-gray-300 font-bold">Kavita</h4>
            <p className="text-sm text-gray-400 font-semibold">
              Kavita Instance Settings
            </p>
          </div>
          <div className="flex flex-col  gap-4 ">
            <div className="flex flex-col gap-2 p-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-md text-gray-300">
                  Application URL
                </legend>

                <input
                  type="text"
                  className="input text-gray-200 bg-base-200 placeholder-gray-400 w-full"
                  placeholder="IP address"
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend text-md text-gray-300">
                  Api Key
                </legend>

                <input
                  type="text"
                  className="input text-gray-200 bg-base-200 placeholder-gray-400 w-full"
                  placeholder="api key"
                />
              </fieldset>
            </div>
            <div className="flex flex-row gap-4 justify-end border-t border-gray-600 px-4 py-3">
              <button
                type="button"
                onClick={() => closeModal()}
                className="btn bg-red-500 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-secondary text-ra flex flex-row ga-2 rounded-xl"
              >
                Test
              </button>
              <button
                type="button"
                className="btn btn-primary rounded-xl text-ra flex flex-row ga-2"
              >
                <Icon name="save" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default KavitaModel;
