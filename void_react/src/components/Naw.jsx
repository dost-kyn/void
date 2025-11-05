import React from 'react'

import '../css/Style.css'
import { Link } from 'react-router-dom'

export default function Naw() {
  return (
    <>
        <div className="naw">
            <div className="naw_container">
                <div className="logo">
                    <img src="../src/uploads/logo.svg" alt="" className="logo_img" />
                </div>
                <div className="naw_links">
                    <Link to={'/'} className='naw_link'>
                        <img src="../src/uploads/posts.svg" alt="" className="naw_link_img" />
                    </Link>
                    <Link to={'/'} className='naw_link'>
                        <img src="../src/uploads/posts.svg" alt="" className="naw_link_img" />
                    </Link>
                    <Link to={'/'} className='naw_link'>
                        <img src="../src/uploads/posts.svg" alt="" className="naw_link_img" />
                    </Link>
                    <Link to={'/'} className='naw_link'>
                        <img src="../src/uploads/posts.svg" alt="" className="naw_link_img" />
                    </Link>
                </div>

            </div>
        </div>
    </>
  )
}
