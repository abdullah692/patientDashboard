import React from 'react'

const Button = ({ b1, b2, classname, cancle, submitHandle }) => {
  return (
    <div className={`${classname}`}>
      <button
        type="button"
        className="rounded-lg py-2 px-5 border border-black hover:bg-gray-200"
        onClick={cancle}
      >
        {b2}
      </button>
      <button
        type="submit"
        onClick={submitHandle}
        className={`rounded-lg bg-gradient-to-r border border-sea-green text-white from-sea-green to-dashboard-green hover:from-dashboard-green hover:to-[#10967f] flex items-center justify-center site py-2 px-7 ml-4`}
      >
        {b1}
      </button>
    </div>
  )
}

export default Button
