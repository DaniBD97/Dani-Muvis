import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuthStore } from '../store/authUser';
import toast from 'react-hot-toast';

const SignUp = () => {
  const { searchParams } = new URL(document.location)
  const emailValue = searchParams.get("email")
  const containerRef = useRef(null);
  const navite = useNavigate();
  const [formState, setFormState] = useState({
    email: emailValue || "",
    username: "",
    password: "",
  });

  const { signup } = useAuthStore();

  const handleRegister = (e) => {
    const { id, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  console.log(formState);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Opcional: Validar que todos los campos estén llenos antes de enviar
    if (!formState.email || !formState.username || !formState.password) {
      toast.error("All fields are required");
      return;
    }
  
    // Llamar al hook de signup con los datos del formulario
    await signup({
      email: formState.email,
      username: formState.username,
      password: formState.password,
    });
    navite("/")
  };





  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
      );
    });

    return () => ctx.revert();
  }, []);





  return (
    <div className="hero-bg items-center bg-black mx-auto justify-center flex p-2">
      <section ref={containerRef} className='flex'>
        <section className="h-fit mt-12">
          <img src="./palomo.webp" alt="" />
        </section>
        <article className="flex justify-center items-center">
          <section className="w-full mt-20 mx-3 p-8 space-y-6 bg-black rounded-lg shadow-2xl">
            <article className="flex flex-col text-center">
              <h1 className="text-center text-[#7e1b14] text-[50px] font-bold">
                Join the Cinema
              </h1>
              <span className="text-white text-[20px]">
                Discover a world of incredible movies
              </span>
            </article>

            <form onSubmit={handleSubmit} className='space-y-4 text-white'>
              <section>
                <label htmlFor="email" className='text-lg font-semibold  block'>Email</label>
                { /* Input Email */}
                <input className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent
       focus:outline-none focus:ring'
                  type="email"
                  placeholder='you@example.com'
                  id='email'
                  value={formState.email}
                  onChange={handleRegister}
                />


              </section>
              <section>
                <label htmlFor="username" className='text-lg font-semibold text-white block'>Name</label>
                { /* Input Name */}
                <input type="text" className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent
       focus:outline-none focus:ring'
                  placeholder='Dani Dev'
                  id='username'
                  value={formState.username}
                  onChange={handleRegister}
                />


              </section>
              <section>
                <label htmlFor="password" className='text-lg font-semibold text-white block'>Password</label>
                { /* Input Password */}
                <input type="password" className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent
       focus:outline-none focus:ring'
                  placeholder='********'
                  id='password'
                  value={formState.password}
                  onChange={handleRegister}
                />


              </section>
              <div className='flex flex-col gap-2'>
                <button className=' float-end bg-[#7e1b14] hover:bg-[#a1362e] py-2 text-white font-semibold rounded-md '>
                  Continue
                </button>
                <div className='text-white text-center'>Already a Member? <span className='text-[#a1362e]'><Link to={'/login'}>Sign In</Link></span></div>


              </div>

            </form>
          </section>
        </article>
      </section>

    </div>
  );
};

export default SignUp;
