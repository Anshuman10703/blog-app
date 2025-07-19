import { blog_data } from '@/Assets/assets' // Consider if blog_data is still needed if fetching from DB
import React, { useEffect, useState } from 'react'
import BlogItem from './BlogItem'
import axios from 'axios';

const BlogList = () => {

    const [menu,setMenu] = useState("All");
    const [blogs,setBlogs] = useState([]); // Initialized as empty array

    const fetchBlogs = async () =>{
      try {
        const response = await axios.get('/api/blog');
        setBlogs(response.data.blogs);
        console.log("Blogs fetched:", response.data.blogs); // Important for debugging data structure
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]); // Ensure blogs is an array on error
      }
    }

    useEffect(()=>{
      fetchBlogs();
    },[menu]) // Added 'menu' to dependency array to refetch when category changes

  return (
    <div>
      <div className='flex justify-center gap-6 my-10'>
        <button onClick={()=>setMenu('All')} className={menu==="All"?'bg-black text-white py-1 px-4 rounded-sm':""}>All</button>
        <button onClick={()=>setMenu('Technology')} className={menu==="Technology"?'bg-black text-white py-1 px-4 rounded-sm':""}>Technology</button>
        <button onClick={()=>setMenu('Startup')} className={menu==="Startup"?'bg-black text-white py-1 px-4 rounded-sm':""}>Startup</button>
        <button onClick={()=>setMenu('Lifestyle')} className={menu==="Lifestyle"?'bg-black text-white py-1 px-4 rounded-sm':""}>Lifestyle</button>
      </div>
      <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24'>
        {/* Conditional check for 'blogs' array and its content before mapping */}
        {Array.isArray(blogs) && blogs.length > 0 ? (
            blogs.filter((item)=> menu==="All"?true:item.category===menu).map((item,index)=>{
                return <BlogItem
                           key={index}
                           id={item.id} // CORRECTED: Changed from item._id to item.id for DynamoDB
                           image={item.image}
                           title={item.title}
                           description={item.description} // Pass the description prop
                           category={item.category}
                       />
            })
        ) : (
            <p className='text-center w-full'>No blogs found.</p> // Message if no blogs
        )}
      </div>
    </div>
  )
}

export default BlogList