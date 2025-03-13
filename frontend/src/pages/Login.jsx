import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuthStore } from '../store/authUser';

const Login = () => {
  const containerRef = useRef(null);
  const [formState, setFormState] = useState({

    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login, isLogin } = useAuthStore();

  const handleLogin = (e) => {
    const { id, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    await login({
      email: formState.email,
      password: formState.password,
    });

    navigate("/")
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <article className="hero-bg items-center">
      <section ref={containerRef} className="p-28">
        <div className="w-[600px] flex flex-col  mx-auto  p-8 space-y-6 bg-black rounded-lg shadow-2xl">
          <section className="mx-auto flex flex-col rounded-full">
            <img
              className="rounded-full object-cover mx-auto h-36 w-36"
              src="./palomo.webp"
              alt=""
            />
            <span className="text-white font-semibold text-lg mt-4">
              Enter your credentials to access the cinema
            </span>
          </section>

          <form onSubmit={formSubmit} className="space-y-4 text-white">
            <section>
              <label
                htmlFor="email"
                className="text-lg font-semibold block"
              >
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent focus:outline-none focus:ring"
                placeholder="you@example.com"
                id="email"
                value={formState.email}
                onChange={handleLogin}
              />
            </section>

            <section>
              <label
                htmlFor="password"
                className="text-lg font-semibold text-white block"
              >
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent focus:outline-none focus:ring"
                placeholder="********"
                id="password"
                value={formState.password}
                onChange={handleLogin}
              />
            </section>
            <div className="flex flex-col gap-2">
              <button className="float-end bg-[#7e1b14] hover:bg-[#a1362e] py-2 text-white font-semibold rounded-md">
                {isLogin ? "Loading..." : "Continue"}
              </button>
              <div className="text-white text-center">
                You don't have an account??{' '}
                <span className="text-[#a1362e]">
                  <Link to={'/signup'}>Sign Up</Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </section>
    </article>
  );
};

export default Login;
