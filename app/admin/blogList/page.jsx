// app/admin/blogList/page.jsx
"use client"; // Mark as client component as it uses useState and useEffect

import React, { useEffect, useState } from 'react';
import BlogItem from '@/Components/BlogItem'; // Adjusted path to use '@/Components' as per your project
import axios from 'axios';

// Component name changed from 'page' to 'Page' (uppercase)
const Page = () => {
    const [menu, setMenu] = useState("All");
    const [blogs, setBlogs] = useState([]); // Initialized as empty array

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('/api/blog');
            if (response.data && Array.isArray(response.data.blogs)) {
                setBlogs(response.data.blogs);
                console.log("Blogs fetched:", response.data.blogs);
            } else {
                console.error("API response for blogs is not an array:", response.data);
                setBlogs([]); // Ensure blogs is an array on unexpected response
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
            setBlogs([]); // Ensure blogs is an array on error
        }
    };

    // This function would be used for deleting blogs if implemented in this list
    const deleteBlog = async (blogId) => {
        try {
            const response = await axios.delete('/api/blog', { data: { id: blogId } }); // Send ID in body for DELETE
            if (response.data.success) {
                // Optionally show a toast notification
                await fetchBlogs(); // Refresh the list after deletion
            } else {
                console.error("Failed to delete blog:", response.data.msg);
                // Optionally show an error toast
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
            // Optionally show an error toast
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [menu]); // Added 'menu' to dependency array to refetch when category changes

    return (
        <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
            <h1>Blog List</h1>
            <div className='flex justify-center gap-6 my-10'>
                <button onClick={() => setMenu('All')} className={menu === "All" ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>All</button>
                <button onClick={() => setMenu('Technology')} className={menu === "Technology" ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>Technology</button>
                <button onClick={() => setMenu('Startup')} className={menu === "Startup" ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>Startup</button>
                <button onClick={() => setMenu('Lifestyle')} className={menu === "Lifestyle" ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>Lifestyle</button>
            </div>
            <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24'>
                {Array.isArray(blogs) && blogs.length > 0 ? (
                    blogs.filter((item) => menu === "All" ? true : item.category === menu).map((item, index) => {
                        return <BlogItem
                                   key={index}
                                   id={item.id} // Ensure 'id' is used for DynamoDB
                                   image={item.image}
                                   title={item.title}
                                   description={item.description}
                                   category={item.category}
                                   // If you add delete functionality to BlogItem, pass deleteBlog here
                                   deleteBlog={deleteBlog} // Example of passing delete handler
                               />;
                    })
                ) : (
                    <p className='text-center w-full'>No blogs found.</p> // Message if no blogs
                )}
            </div>
        </div>
    );
};

// Export component name changed to 'Page'
export default Page;