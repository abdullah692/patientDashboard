import React from 'react'

function CancelButton({ setCurrent, current }) {

  const handleCancel = () => {
    setCurrent(0)
  }
  return (
    <div>
      <button
        className="relative border-2 border-slate-300 px-8 py-1 rounded-md mt-2 text-[#464D59] z-[9999] "
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  )
}

export default CancelButton
