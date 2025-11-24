import React from 'react'
import logo from "@/assets/logo.png"
import Image from 'next/image'
import Link from 'next/link'

const BrandLogo = () => {
  return (
    <Link href="/">
      <div className='flex items-end'>
        <Image className='mb-2' src={logo} width={37.05} height={48} alt='brand logo' />
        <p className=' band_logo text-3xl -ml-2'>SwiftParcel</p>
      </div>
    </Link>
  )
}

export default BrandLogo