import { Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { SMALL_IMG_BASE_URL } from '../hook/constants';
import axios from 'axios';
import { formatDate } from '../hook/FormatDate';




const HistoryPage = () => {

    const [searchHistory, setSearchHistory] = useState([]);
  

    useEffect(() => {
        const getSearchHistory = async () => {
            try {
                const res = await axios.get(`/api/search/historial`);
                const uniqueHistory = HistoricClean(res.data.content);
                setSearchHistory(uniqueHistory);
            } catch (error) {
                setSearchHistory([]);
            }
        };
        getSearchHistory();
    }, []);

    const HistoricClean = (Historial) => {
        const clean = [...searchHistory];
        Historial.forEach((newItem) => {
            const existingIndex = clean.findIndex((item) => item.title === newItem.title);
            if (existingIndex !== -1) {
                // Update the date if already exists
                clean[existingIndex].createdAt = newItem.createdAt;
            } else {
                // Add the new item if it doesn't exist
                clean.push(newItem);
            }
        });
        return clean;
    };

    const handleDelete = async (item) => {
        try {
            await axios.delete(`/api/search/historial/${item.id}`);
            setSearchHistory(searchHistory.filter((element) => element.id !== item.id));
        } catch (error) {
            toast.error("Failed to delete search item");
        }
    };

    if (searchHistory?.length === 0) {
        return (
            <div className='bg-black min-h-screen text-white'>

                <div className='max-w-6xl mx-auto px-4 py-8'>
                    <h1 className='text-3xl font-bold mb-8'>Search History</h1>
                    <div className='flex justify-center items-center h-96'>
                        <p className='text-xl'>No search history found</p>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className='bg-black text-white min-h-screen'>
		

			<div className='max-w-6xl mx-auto px-4 py-8'>
				<h1 className='text-3xl font-bold mb-8'>Search History</h1>
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4'>
					{searchHistory?.map((item) => (
						<div key={item.id} className='bg-gray-800 p-4 rounded flex items-start'>
							<img
								src={SMALL_IMG_BASE_URL + item.image}
								alt='History image'
								className='size-16 rounded-full object-cover mr-4'
							/>
							<div className='flex flex-col'>
								<span className='text-white text-lg'>{item.title}</span>
								<span className='text-gray-400 text-sm'>{formatDate(item.createdAt)}</span>
							</div>

							<span
								className={`py-1 px-3 min-w-20 text-center rounded-full text-sm  ml-auto ${
									item.searchType === "movie"
										? "bg-red-600"
										: item.searchType === "tv"
										? "bg-blue-600"
										: "bg-green-600"
								}`}
							>
								{item.searchType[0].toUpperCase() + item.searchType.slice(1)}
							</span>
							<Trash
								className='size-5 ml-4 cursor-pointer hover:fill-red-600 hover:text-red-600'
								onClick={() => handleDelete(item)}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
    )
}

export default HistoryPage