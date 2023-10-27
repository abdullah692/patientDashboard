import { ClipLoader } from 'react-spinners'

const FullPageLoader = ({ isShow }) => {
  return (
    <div style={{ display: isShow ? 'block' : 'none' }} className="fixed top-0 left-0 z-[999999] w-screen h-screen bg-gray-400/70">
        <div className="flex justify-center items-center  w-screen h-screen">
        <ClipLoader
            cssOverride={{ display: "block", marginLeft: "1rem", borderColor: "green",}}
            color={"white"}
            loading={true}
            size={30}
        />
        </div>
    </div>
  )
}

export default FullPageLoader