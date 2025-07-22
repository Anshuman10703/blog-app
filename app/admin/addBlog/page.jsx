'use client'
import { assets } from '@/Assets/assets'
import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'react-toastify' // Make sure toast is imported if you use it

const Page = () => { // Renamed from 'page' to 'Page' for convention, though 'page' works

    const [image,setImage] = useState(null); // Changed from 'false' to 'null' for correct URL.createObjectURL behavior
    const [data,setData] = useState({
        title:"",
        description:"",
        category:"Startup",
        author:"Anshuman",
        authorImg:"/author_img.png" // Assuming this is a local path or publicly accessible URL
    })

    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}));
        console.log(data); // For debugging, remove in production
    }

    const onSubmitHandler = async (e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('title',data.title);
        formData.append('description',data.description);
        formData.append('category',data.category);
        formData.append('author',data.author);
        formData.append('authorImg',data.authorImg);
        
        // Only append image if a file is selected
        if (image) {
            formData.append('image',image); // 'image' here is the File object
        } else {
            // Optional: Show an error or prevent submission if image is mandatory
            toast.error("Please upload an image.");
            return;
        }

        try {
            const response = await axios.post('/api/blog', formData, {
                // IMPORTANT: Set Content-Type for file uploads
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.success) {
                toast.success(response.data.msg);
                setImage(null); // Reset image state to null
                setData({ // Reset form data
                    title:"",
                    description:"",
                    category:"Startup",
                    author:"Anshuman",
                    authorImg:"/author_img.png"
                });
            } else {
                toast.error(response.data.msg || "Error adding blog.");
            }
        } catch (error) {
            console.error("Error submitting blog:", error);
            toast.error("An error occurred while adding the blog.");
        }
    }

  return (
    <>
      <form onSubmit={onSubmitHandler} className='pt-5 px-5 sm:pt-12 sm:pl-16' encType="multipart/form-data"> {/* ADDED encType */}
        <p className='text-xl'>Upload thumbnail</p>
        <label htmlFor="image">
            {/* Corrected src: URL.createObjectURL(image) will only run if image is a File object */}
            <Image className='mt-4' src={image ? URL.createObjectURL(image) : assets.upload_area} width={140} height={70} alt='Upload Area'/>
        </label>
        <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden required accept="image/*" /> {/* Added accept="image/*" */}
        
        <p className='text-xl mt-4'>Blog title</p>
        <input name='title' onChange={onChangeHandler} value={data.title} className='w-full sm:w-[500px] mt-4 px-4 py-3 border' type="text" placeholder='Type here' required />
        
        <p className='text-xl mt-4'>Blog Description</p>
        <textarea name='description' onChange={onChangeHandler} value={data.description} className='w-full sm:w-[500px] mt-4 px-4 py-3 border' type="text" placeholder='write content here' rows={6} required />
        
        <p className='text-xl mt-4'>Blog category</p>
        <select name="category" onChange={onChangeHandler} value={data.category} className='w-40 mt-4 px-4 py-3 border text-gray-500'>
            <option value="Startup">Startup</option>
            <option value="Technology">Technology</option>
            <option value="Lifestyle">Lifestyle</option>
        </select>
        <br />
        <button type="submit" className='mt-8 w-40 h-12 bg-black text-white'>ADD</button>
      </form>
    </>
  )
}

export default Page