import React, { useEffect, useState } from 'react'
import '../css/Screensaver.css'
import { useNavigate } from 'react-router-dom';

export default function Screensaver() {
    const navigate = useNavigate()
    const [stars, setStars] = useState([])

    useEffect(() => {
        // Создаем звезды
        const createStars = () => {
            const newStars = [];
            for (let i = 0; i < 15; i++) {
                newStars.push({
                    id: i,
                    size: Math.random() * 3 + 1, // Размер от 1px до 4px
                    top: Math.random() * 100, // Позиция по вертикали
                    delay: Math.random() * 7, // Задержка от 0 до 7 секунд
                    duration: Math.random() * 2 + 1 // Длительность от 1 до 3 секунд
                });
            }
            setStars(newStars);
        }

        createStars();

        const timer = setTimeout(() => {
            navigate('/authorization') 
        }, 8000)

        return () => clearTimeout(timer)
    }, [navigate])

    return (
        <>
            <div className="body">
                <div className="Screensaver">
                    <div className="sc_content">
                        <div className="sc_logo">
                            <img className='sc_logo_img' src="../src/uploads/logo_light.svg" alt="" />
                        </div>
                        <h1 className='sc_logo_title'>VOID</h1>
                        <p className='sc_text'>Приветствуем вас на <span className='sc_text_logo'>VOID</span> — вашем корабле в цифровой вселенной!</p>
                        
                        {/* Шкала загрузки с звездами */}
                        <div className="loading_container">
                            <div className="loading_bar">
                                <div className="loading_progress">
                                    <div className="stars_container">
                                        {stars.map(star => (
                                            <div
                                                key={star.id}
                                                className="star"
                                                style={{
                                                    width: `${star.size}px`,
                                                    height: `${star.size}px`,
                                                    top: `${star.top}%`,
                                                    left: '0%',
                                                    animation: `starFly ${star.duration}s linear ${star.delay}s forwards`,
                                                    boxShadow: `0 0 ${star.size * 2}px ${star.size}px rgba(38, 31, 87, 0.5)`
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}