import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../FirebaseConfig'; // Ensure this points to your Firebase configuration
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EditVolunteerModal: React.FC<{ isOpen: boolean; onClose: () => void; fetchData: () => void; volunteerData: any; }> = ({ isOpen, onClose, fetchData, volunteerData }) => {
    const [formData, setFormData] = useState({
        name: '',
        shortDescription: '',
        fullDescription: '',
        image: '',
        currentVolunteeredUser: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen && volunteerData) {
            setFormData(volunteerData);
        }
    }, [isOpen, volunteerData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let imageUrl = formData.image;
            if (imageFile) {
                const imageRef = ref(storage, `volunteers/${imageFile.name}`);
                await uploadBytes(imageRef, imageFile);
                imageUrl = await getDownloadURL(imageRef);
            }

            await updateDoc(doc(db, 'Volunteers', volunteerData.id), {
                ...formData,
                image: imageUrl,
            });
            fetchData();
            onClose();
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="relative bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg w-full mx-auto overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-100">Edit Volunteer</h3>
                    <button 
                        type="button" 
                        className="text-gray-400 hover:bg-gray-600 hover:text-gray-100 rounded-lg text-sm p-1.5" 
                        onClick={onClose}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 mb-4 grid-cols-1">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-100">Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                id="name" 
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="Type volunteer name" 
                                required 
                                value={formData.name} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div>
                            <label htmlFor="shortDescription" className="block mb-2 text-sm font-medium text-gray-100">Short Description</label>
                            <input 
                                type="text" 
                                name="shortDescription" 
                                id="shortDescription" 
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="Type short description" 
                                required 
                                value={formData.shortDescription} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div>
                            <label htmlFor="fullDescription" className="block mb-2 text-sm font-medium text-gray-100">Full Description</label>
                            <textarea 
                                name="fullDescription" 
                                id="fullDescription" 
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="Type full description" 
                                required 
                                value={formData.fullDescription} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div>
                            <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-100">Image</label>
                            <input 
                                type="file" 
                                name="image" 
                                id="image" 
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                onChange={handleImageChange} 
                            />
                        </div>
                        {/* <div>
                            <label htmlFor="currentVolunteeredUser" className="block mb-2 text-sm font-medium text-gray-100">Current Volunteered User</label>
                            <input 
                                type="text" 
                                name="currentVolunteeredUser" 
                                id="currentVolunteeredUser" 
                                className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                placeholder="Type current volunteered user" 
                                value={formData.currentVolunteeredUser} 
                                onChange={handleChange} 
                            />
                        </div> */}
                    </div>
                    <button 
                        type="submit" 
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Update volunteer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditVolunteerModal;
