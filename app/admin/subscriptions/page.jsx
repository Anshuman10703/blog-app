// app/admin/subscriptions/page.jsx
"use client"; // <--- ADD THIS LINE AT THE VERY TOP

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SubsTableItem from '@/Components/AdminComponents/SubsTableItem';

const SubscriptionsPage = () => {
    // Initialize 'emails' as an empty array
    const [emails, setEmails] = useState([]);

    const fetchEmails = async () => {
        try {
            const response = await axios.get('/api/email');
            if (response.data && Array.isArray(response.data.subscriptions)) {
                setEmails(response.data.subscriptions);
            } else {
                console.error("API response for emails is not an array:", response.data);
                setEmails([]);
            }
        } catch (error) {
            console.error("Error fetching emails:", error);
            setEmails([]);
        }
    };

    const deleteEmail = async (emailToDelete) => { // Renamed mongoId to emailToDelete for clarity
        try {
            const response = await axios.delete('/api/email', { data: { email: emailToDelete } });
            if (response.data.success) {
                // Refresh the list after successful deletion
                await fetchEmails();
            } else {
                // Optionally show an error toast here if deletion wasn't successful
                console.error("Failed to delete email:", response.data.msg);
            }
        } catch (error) {
            console.error("Error deleting email:", error);
            // Optionally show an error toast here for network/server error
        }
    };


    useEffect(() => {
        fetchEmails(); // Fetch emails when the component mounts
    }, []);

    return (
        <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
            <h1>All Subscriptions</h1>
            <div className='relative overflow-x-auto mt-4 sm:mt-12'>
                <table className='w-full text-sm text-gray-500'>
                    <thead className='text-xs text-left text-gray-700 uppercase bg-gray-50'>
                        <tr>
                            <th scope='col' className='px-6 py-3'>
                                Email
                            </th>
                            <th scope='col' className='hidden sm:block px-6 py-3'>
                                Date
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {emails.length > 0 ? (
                            emails.map((item, index) => {
                                // Ensure item.email is passed, as it's your partition key for deletion
                                return <SubsTableItem key={index} mongoId={item.email} deleteEmail={deleteEmail} email={item.email} date={item.date} />;
                            })
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center">No subscriptions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubscriptionsPage;