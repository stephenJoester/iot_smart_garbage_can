import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const Swipe = ({children}) => {
  return (
    <div className='h-full mb-5'>
        <Swiper
            cssMode={true}
            preventClicks={false}
            preventClicksPropagation={false}
            simulateTouch={false}
            touchStartForcePreventDefault={false}
            pagination={{ clickable: true }} 
            modules={[Pagination]}
            className='h-full'   
        >
            {React.Children.map(children, (child, index) => (
                <SwiperSlide key={index}>
                    {child}
                </SwiperSlide>
            ))}
        </Swiper>
    </div>
  )
}

export default Swipe