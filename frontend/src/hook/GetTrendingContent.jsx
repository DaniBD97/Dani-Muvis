import React, { useEffect, useState } from 'react';
import { useContentStore } from '../store/content';
import axios from 'axios';

const GetTrendingContent = () => {
    const [trendingContent, setTrendingContent] = useState(null);
    const { contentType } = useContentStore();

    useEffect(() => {
        const fetchTrendingContent = async () => {
            try {
                const res = await axios.get(`/api/${contentType}/trending`);
                setTrendingContent(res.data.content);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.warn("Usuario no autenticado: no se puede obtener contenido trending.");
                } else {
                    console.error("Error al obtener contenido trending:", error);
                }
            }
        };

        fetchTrendingContent();
    }, [contentType]);

    return { trendingContent };
};

export default GetTrendingContent;
