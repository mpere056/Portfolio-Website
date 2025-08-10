"use client";
import Image from 'next/image'
import Link from 'next/link'

export default function NavHomeIcon() {
  return (
    <div className="fixed top-5 left-5 z-50">
      <Link href="/">
        <Image
          src="/images/me_logo.png"
          alt="Home"
          width={55}
          height={55}
          className="rounded-md shadow hover:opacity-90 transition-opacity"
          priority
        />
      </Link>
    </div>
  )
}


