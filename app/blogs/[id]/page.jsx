// app/blogs/[id]/page.jsx
"use client"; // Mark as client component as it uses useState and useEffect

import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Import any other components needed for displaying a single blog (e.g., Header, Footer)
// import Header from '@/Components/Header';
// import Footer from '@/Components/Footer';

// Component name changed from 'page' to 'Page' (uppercase)
const Page = ({ params }) => { // Next.js passes route params as 'params' prop in app router
    const { id } = params; // Destructure the 'id' from the params object

    const [blogData, setBlogData] = useState(null); // State to hold the single blog post data

    const fetchBlogData = async () => {
        if (!id) return; // Don't fetch if ID is not available yet

        try {
            // Adjust this API endpoint if you have a specific one for fetching single blog posts
            // For now, assuming /api/blog?id=X fetches a single blog by ID
            const response = await axios.get(`/api/blog?id=${id}`);
            if (response.data && response.data.blog) { // Assuming your API returns { blog: singleObject }
                setBlogData(response.data.blog);
            } else {
                console.error("Blog data not found or invalid response:", response.data);
                setBlogData(null);
            }
        } catch (error) {
            console.error("Error fetching single blog post:", error);
            setBlogData(null);
        }
    };

    useEffect(() => {
        fetchBlogData();
    }, [id, fetchBlogData]); // Add 'id' and 'fetchBlogData' to dependency array.
                            // 'fetchBlogData' should ideally be memoized if complex,
                            // but for simplicity, adding it here.

    if (!blogData) {
        return (
            <div>
                {/* <Header /> */}
                <p className="text-center text-xl mt-20">Loading blog post or Blog not found...</p>
                {/* <Footer /> */}
            </div>
        );
    }

    // Render the blog post content once loaded
    return (
        <div>
            {/* <Header /> */}
            <div className="container mx-auto p-5">
                <h1 className="text-4xl font-bold mb-4">{blogData.title}</h1>
                <p className="text-gray-600 mb-6">By {blogData.author} on {new Date(blogData.date).toDateString()}</p>
                {blogData.image && (
                    <Image
                        src={blogData.image}
                        alt={blogData.title || 'Blog Image'}
                        width={800} // Adjust as needed
                        height={400} // Adjust as needed
                        className="w-full h-auto object-cover mb-6 rounded-lg shadow-md"
                    />
                )}
                <div className="prose lg:prose-xl max-w-none" dangerouslySetInnerHTML={{ __html: blogData.description }}></div>
                {/* Add more blog details as needed */}
            </div>
            {/* <Footer /> */}
        </div>
    );
};

// Export component name changed to 'Page'
export default Page;