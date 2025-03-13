import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authUser';
import { LogOut, Menu, Search } from "lucide-react";
import { useContentStore } from '../store/content';
const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileMenu, setIsMobileMenu] = useState(false)
    const { contentType, setContentType } = useContentStore();
    const { user, logout } = useAuthStore();
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)

        }
    }, []);

    const dropdownRef = useRef(null);
    const toggleMenuMobile = () => setIsMobileMenu(!isMobileMenu);
 





    return (
        <header className=' text-white bg-black   flex   
        md:flex-row lg:flex-row xl:flex-row   md:justify-between xl:justify-between items-center  h-20 '>
            <div className='w-[1500px] mx-auto z-50 flex justify-between gap-10 bg-black  h-full'>
                <section className='flex items-center gap-6   '>
                    <Link to={"/"}>
                        <img className='w-16 h-16    cursor-pointer' src="/logoMov.png" alt="" />
                    </Link>
                    <div className='md:hidden lg:hidden xl:hidden'>
                        <Menu className='size-6 cursor-pointer' onClick={toggleMenuMobile} />
                    </div>


                    {/* Menu Desktop */}
                    <li className='gap-2 sm:hidden md:flex lg:flex xl:flex list-none'>
                        <Link to={"/"} className='hover:underline' >
                            Movies
                        </Link>
                        <Link to={"/"} className='hover:underline' >
                            Tv Show
                        </Link>
                        <Link to={"/history"} className='hover:underline'>
                            History
                        </Link>
                        <Link to={"/favorite"} className='hover:underline'>
                            Favorite
                        </Link>
                        <Link to={"/category"} className='hover:underline'>
                            Categories
                        </Link>
                    </li>


                </section>
                <article className='items-center gap-3 sm:flex md:flex lg:flex xl:flex '>
                    <Link to={"/search"} >
                        <Search className='size-6 cursor-pointer' />
                    </Link>


                    {
                        user ? (
                            <div className="relative" ref={dropdownRef}>

                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="flex items-center rounded-xl
                                     shadow-white bg-[#59273F] px-3 py-2 hover:bg-[#8C3063]
                                      cursor-pointer gap-2"
                                >
                                    <img className="w-8 h-8 rounded-full" src={user.image} alt={user.image} />
                                    <span className="text-lg">{user.username}</span>
                                </button>



                                {isOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">

                                                Perfil
                                            </Link>
                                            <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">

                                                Configuración
                                            </Link>
                                            <button
                                                onClick={logout}
                                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                            >

                                                Cerrar sesión
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login">
                                <section className="flex rounded-xl items-center shadow-white bg-[#59273F] px-3 h-fit py-2 mt-1 hover:bg-[#8C3063] cursor-pointer gap-2">
                                    <img className="w-8 h-8 rounded-full" src="/avatar1.png" alt="" />
                                    <span className="text-lg">Sign in</span>
                                </section>
                            </Link>
                        )
                    }
                    {/*End Menu Desktop */}

                </article>
            </div>



            <article className={`transition-all duration-500 transform ${isMobileMenu ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                } flex-col absolute w-full sm:flex md:hidden lg:hidden xl:hidden mt-60 z-40 bg-black rounded`}>
                {/* Menu Mobile */}
                {
                    isMobileMenu && (
                        <>
                            <Link
                                onClick={toggleMenuMobile}
                                to={"/"} className='block hover:underline p-2'>
                                Movies

                            </Link>
                            <Link
                                onClick={toggleMenuMobile}
                                to={"/"} className='block hover:underline p-2'>
                                Tv Show

                            </Link>
                            <Link
                                onClick={toggleMenuMobile}
                                to={"/"} className='block hover:underline p-2'>
                                History

                            </Link>
                            <Link
                                onClick={toggleMenuMobile}
                                to={"/"} className='block hover:underline p-2'>
                                Favorites

                            </Link>
                        </>
                    )
                }


                {/*End Menu Mobile */}

            </article>


        </header>
    )
}

export default Header