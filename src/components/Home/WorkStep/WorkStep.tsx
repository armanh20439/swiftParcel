import React from 'react'
import bookIcon from '@/assets/bookingIcon.png'
import Image from 'next/image'
import { AllItemWork } from '@/type'




const WorkStep = ({ title, description }: AllItemWork) => {
    return (


        <div className="max-w-sm p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition duration-300 ">
            {/* Icon */}
            <div className=" w-12 h-12  mb-4 bg-gray-100 rounded-full">
                <Image src={bookIcon} alt='Bookin Icon' />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-[#03373D]  mb-2">
                {title}
            </h3>

            {/* Description */}
            <p className="text-[#606060] text-sm">
                {description}
            </p>
        </div>


    )
}

export default WorkStep