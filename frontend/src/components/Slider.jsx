import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SMALL_IMG_BASE_URL } from "../hook/constants";
import { useContentStore } from "../store/content";
import toast from "react-hot-toast";

const Slider = ({ category }) => {
	const { contentType } = useContentStore();
	const [content, setContent] = useState([]);
	const [showArrows, setShowArrows] = useState(false);

	const sliderRef = useRef(null);
	const isDragging = useRef(false);
	const startX = useRef(0);
	const scrollLeft = useRef(0);
	const dragThreshold = useRef(5); // Umbral de distancia para considerar un arrastre

	const formattedCategoryName =
		category.replaceAll("_", " ")[0].toUpperCase() + category.replaceAll("_", " ").slice(1);
	const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";

	useEffect(() => {
		const getContent = async () => {
			const res = await axios.get(`/api/${contentType}/${category}`);
			setContent(res.data.content);
		};

		getContent();
	}, [contentType, category]);


	const handleAddToHistory = async () => {

	};

	// Controladores para el desplazamiento
	const handleMouseDown = (e) => {
		e.preventDefault();
		isDragging.current = false; // Reinicia el estado de arrastre
		startX.current = e.pageX - sliderRef.current.offsetLeft;
		scrollLeft.current = sliderRef.current.scrollLeft;
		sliderRef.current.style.cursor = "grabbing";
	};

	const handleMouseMove = (e) => {
		if (!startX.current) return;
		const x = e.pageX - sliderRef.current.offsetLeft;
		const distance = Math.abs(x - startX.current);

		// Si el movimiento supera el umbral, marcamos como arrastre
		if (distance > dragThreshold.current) {
			isDragging.current = true;
		}

		if (isDragging.current) {
			e.preventDefault();
			const walk = (x - startX.current) * 1.5; // Ajusta la sensibilidad
			sliderRef.current.scrollLeft = scrollLeft.current - walk;
		}
	};

	const handleMouseUpOrLeave = () => {
		startX.current = null;
		sliderRef.current.style.cursor = "grab";
	};

	const handleClick = async (e, item) => {
		// Si se ha estado arrastrando, prevenir el enlace y salir de la función
		if (isDragging.current) {
			e.preventDefault();
			isDragging.current = false;
			return;
		}
	
		try {
			const historyItem = {
				id: item.id,
				image: item.poster_path,
				title: item.title || item.name,
				searchType: contentType
			};
	
			const response = await axios.post('/api/search/history', historyItem);
	
			if (response.data.success) {
				toast.success("Added to history!");
			}
		} catch (error) {
			console.error('Error adding to history:', error);
			toast.error("Failed to add to history");
		}
	};
	const scrollLeftHandler = () => {
		if (sliderRef.current) {
			sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
		}
	};
	const scrollRightHandler = () => {
		sliderRef.current.scrollBy({
			left: sliderRef.current.offsetWidth,
			behavior: "smooth"
		});
	};


	return (
		<div
			className='bg-black text-white relative px-5 md:px-20  '
			onMouseEnter={() => setShowArrows(true)}
			onMouseLeave={() => setShowArrows(false)}
		>
			<h2 className='mb-4 text-2xl font-bold'>
				{formattedCategoryName} {formattedContentType}
			</h2>

			<div
				className='flex space-x-4 overflow-x-hidden scroll-smooth'
				ref={sliderRef}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUpOrLeave}
				onMouseLeave={handleMouseUpOrLeave}
			>
				{content.map((item) => (
					<Link
						to={`/watch/${item.id}`}
						className='min-w-[250px] relative group'
						key={item.id}
						onClick={(e) => handleClick(e, item)} 
					>
						<div className='rounded-lg overflow-hidden'>
							<img
								src={SMALL_IMG_BASE_URL + item.backdrop_path}
								alt='Movie image'
								className='transition-transform duration-300 ease-in-out group-hover:scale-125'
								draggable="false"
							/>
						</div>
						<p className='mt-2 text-center'>{item.title || item.name}</p>
					</Link>
				))}
			</div>

			{showArrows && (
				<>
					<button
						className='absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            '
						onClick={scrollLeftHandler}
					>
						<ChevronLeft size={24} />
					</button>

					<button
						className='absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            '
						onClick={scrollRightHandler}
					>
						<ChevronRight size={24} />
					</button>
				</>
			)}
		</div>
	);
};

export default Slider;