import React, { useState } from 'react'

export const FilterBar = ({ onFilterChange }) => {
    const [typeSelected, setTypeSelected] = useState({
        all: false,
        // Aquí agregarías más géneros si los quieres predeterminado
    });

    const handleCheckbox = (e) => {
        const { name, checked } = e.target;

        if (name === 'all') {
            const updatedSelection = Object.fromEntries(
                Object.entries(typeSelected).map(([key]) => [key, key === 'all' ? checked : false])
            );

            setTypeSelected(updatedSelection);
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach((checkbox) => {
                if (checkbox !== e.target && checkbox.name !== 'all') {
                    checkbox.checked = false;
                }
            });

            if (checked) {
                // Si 'Todos' está marcado, mostrar todos los géneros.
                onFilterChange('all');
            }
        } else {
            const updatedSelection = { ...typeSelected, [name]: checked };

            if (checked) {
                updatedSelection['all'] = false;
                const allCheckbox = document.getElementById('all');
                if (allCheckbox) {
                    allCheckbox.checked = false;
                }
            }

            setTypeSelected(updatedSelection);

            const updatedTypes = Object.keys(updatedSelection).filter((key) => updatedSelection[key]);
            if (updatedTypes.includes('all')) {
                onFilterChange('all');
            } else {
                onFilterChange(name); // Pasar el nombre del género seleccionado
            }
        }
    };

    return (
        <div className="filter-container">
            <h4 className='font-bold text-white'>Filter By Genre:</h4>

            <div className='group-type'>
                <input
                    type='checkbox'
                    onChange={handleCheckbox}
                    name='all'
                    id='all'
                />
                <label htmlFor='all' className='text-white '>All</label>
            </div>

            <div className='group-type'>
                <input
                    type='checkbox'
                    onChange={handleCheckbox}
                    name='action'
                    id='action'
                />
                <label htmlFor='action' className='text-red-400'>Action</label>
            </div>
            <div className='group-type'>
                <input
                    type='checkbox'
                    onChange={handleCheckbox}
                    name='comedy'
                    id='comedy'
                />
                <label htmlFor='comedy' className='text-green-400'>Comedy</label>
            </div>
            <div className='group-type'>
                <input
                    type='checkbox'
                    onChange={handleCheckbox}
                    name='drama'
                    id='drama'
                />
                <label htmlFor='drama' className='text-blue-400'>Drama</label>
            </div>
            {/* Agrega más géneros si lo deseas */}
        </div>
    )
};
