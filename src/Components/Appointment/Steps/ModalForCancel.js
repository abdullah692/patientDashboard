import { useDispatch } from "react-redux";
import Modals from "../../Modals/Modals";
import { resetEveryThingFromAppointment } from "../../../Slices/Appointment.slice";
import { removeAllDataFromPatientSlice } from "../../../Slices/Patient.slice";

const ModalForCancel = ({ isOpen, closeModal, handleCancel }) => {
    const dispatch = useDispatch();

    const handleCancelAny = () => {
        dispatch(removeAllDataFromPatientSlice());
        dispatch(resetEveryThingFromAppointment());
        closeModal();
        handleCancel();
    }

    return(
        <Modals
            open={isOpen} 
            title="Do you want to cancel ?"
            footer={[
            <div className='flex gap-x-4 justify-end pt-4'>
                <button onClick={closeModal} className="rounded-lg py-2 px-5 border-0 text-red-600 hover:bg-red-600 hover:text-white">
                    No
                </button>
                <button onClick={handleCancelAny}
                    className={`rounded-lg bg-gradient-to-r border border-sea-green text-white from-sea-green to-dashboard-green hover:from-dashboard-green hover:to-[#10967f] flex items-center justify-center site py-2 px-5`}
                    >
                    Yes
                </button>
            </div>

        ]}
        onOk={()=>{}}
        onCancel={closeModal}
        width={580}
        >

        </Modals>
    )
}

export default ModalForCancel;