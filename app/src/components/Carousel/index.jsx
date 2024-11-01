import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Overview = () => (
    <div>
        <h2>Bin Status Overview</h2>
        <p>Hiển thị mức độ đầy của thùng rác, trạng thái kết nối,...</p>
    </div>
);

const History = () => (
    <div>
        <h2>Bin Collection History</h2>
        <p>Hiển thị lịch sử thu gom rác, số lần thùng rác đã đầy,...</p>
    </div>
);

const CarouselComponent = () => {
    return (
        <Carousel
            showArrows={true}
            showStatus={false}
            showIndicators={true}
            infiniteLoop={true}
            emulateTouch={true}
            showThumbs={false}
        >
            <div>
                <Overview />
            </div>
            <div>
                <History />
            </div>
        </Carousel>
    );
}

export default CarouselComponent;
