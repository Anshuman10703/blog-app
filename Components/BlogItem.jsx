import { assets, blog_data } from '@/Assets/assets' // Consider if blog_data is still needed
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogItem = ({title,description,category,image,id}) => {

  // --- ADD THIS DEBUG LOG HERE ---
  console.log("BlogItem received ID:", id); // <--- ADD THIS LINE
  // --- END DEBUG LOG ---

  return (
    <div className='max-w-[330px] sm:max-w-[300px] bg-white border border-black transition-all hover:shadow-[-7px_7px_0px_#000000]'>
      <Link href={`/blogs/${id}`}>
      {/* Ensure Image component src is correctly handled */}
      <Image src={image} alt={title || 'Blog Image'} width={400} height={400} className='border-b border-black' />
      </Link>
      <p className='ml-5 mt-5 px-1 inline-block bg-black text-white text-sm'>{category}</p>
      <div className="p-5">
        <h5 className='mb-2 text-lg font-medium tracking-tight text-gray-900'>{title}</h5>
        {/* CORRECTED: Added safety check for 'description' before slicing */}
        <p className='mb-3 text-sm tracking-tight text-gray-700' dangerouslySetInnerHTML={{"__html":description ? description.slice(0,120) : ''}}></p>
        <Link href={`/blogs/${id}`} className='inline-flex items-center py-2 font-semibold text-center'>
            Read more <Image src={assets.arrow} className='ml-2' alt='' width={12} />
        </Link>
      </div>
    </div>
  )
}

export default BlogItem