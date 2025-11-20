import WorkStep from '@/components/Home/WorkStep/WorkStep'
import React from 'react'

const AllworkSteps = () => {

    return (
        <div className='px-8 mb-12'>
            <h2 className='text-4xl font-bold text-[#03373D] py-8 '>How It Works</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                <WorkStep title="Booking Pick & Drop" description='From personal packages to business shipments — we deliver on time, every time.'></WorkStep>
                <WorkStep title='Cash On Delivery' description='From personal packages to business shipments — we deliver on time, every time.'></WorkStep>
                <WorkStep title='Delivery Hub' description='From personal packages to business shipments — we deliver on time, every time.'></WorkStep>
                <WorkStep title='Booking SME & Corporate' description='From personal packages to business shipments — we deliver on time, every time.'></WorkStep>

            </div>


        </div>
    )
}

export default AllworkSteps