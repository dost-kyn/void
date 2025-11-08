import React, { useEffect } from 'react'
import '../css/Screensaver.css'
import { useNavigate  } from 'react-router-dom';

export default function Screensaver() {
    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/authorization') 
        }, 10000) // 1000 мс = 1 секунда. тут 10 сек

        // Очистка таймера при размонтировании компонента
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
                    </div>
                </div>
            </div>
        </>
    )
}
