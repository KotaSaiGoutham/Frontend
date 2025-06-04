import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FlashPlayer.css";

const bannerImages = [
    "/intro-banner.jpeg",
    "/intro-banner2.jpg",
    "/intro-banner3.jpg",
    "/intro-banner4.jpg",
    "/intro-banner5.jpg",

];

const FlashBanner = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    dots: true,
                },
            },
        ],
    };

    return (
        <section className="flash-banner">
            <Slider {...settings}>
                {bannerImages.map((src, index) => (
                    <div key={index} className="slide-wrapper">
                        <img
                            src={src}
                            alt={`Banner ${index + 1}`}
                            className="banner-img"
                        />
                    </div>
                ))}
            </Slider>
        </section>
    );
};

export default FlashBanner;
