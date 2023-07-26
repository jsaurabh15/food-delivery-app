import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Card from '../components/Card'


export default function Home() {

    const getRandomImageUrl = (query) => {
        const width = 900;
        const height = 700;
        const apiKey = 'mLfzY4I7M0uTpaZiYIffblkHpNjhNwcPNvW4Qd4h-Oc';

        return `https://api.unsplash.com/search/photos?client_id=${apiKey}&query=${query}&orientation=landscape&w=${width}&h=${height}`;
    };

    const fetchRandomImage = async (query) => {
        const response = await fetch(getRandomImageUrl(query));
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const imageUrl = data.results[randomIndex].urls.regular;

        return imageUrl;
    };

    const [carouselImages, setCarouselImages] = useState(['', '', '']);

    useEffect(() => {
        const fetchRandomImages = async () => {
            const images = await Promise.all([
                fetchRandomImage('burger'),
                fetchRandomImage('pizza'),
                fetchRandomImage('french fries')
            ]);
            setCarouselImages(images);
        };

        fetchRandomImages();
        // eslint-disable-next-line
    }, []);

    const [foodCategory, setFoodCategory] = useState([]);
    const [foodItem, setFoodItem] = useState([]);
    const [search, setSearch] = useState("");


    const loadFoodItems = async () => {
        let response = await fetch("http://localhost:4000/api/foodData", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        });

        response = await response.json();

        setFoodItem(response[0]);
        setFoodCategory(response[1]);
        // console.log(response);
    }


    useEffect(() => {
        loadFoodItems()
    }, [])


    return (
        <div>
            <div><Navbar /></div>
            <div>
                <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" style={{ objectFit: "contain !important" }}>
                    <div className="carousel-inner" id="carousel">
                        <div className='carousel-caption' style={{ "zIndex": "10" }}>
                            <div className="d-flex justify-content-center">
                                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"  value={search} onChange={(e) => {setSearch(e.target.value)}}/>
                                {/* <button className="btn btn-outline-success text-white bg-success" type="submit" >Search</button> */}
                            </div>
                        </div>
                        {carouselImages.map((imageUrl, index) => (
                            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                                <img src={imageUrl} className="d-block w-100" alt={`Slide ${index + 1}`} style={{ filter: "brightness(40%" }} />
                            </div>
                        ))}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
            <div className='container'>

                {
                    foodCategory !== []
                        ? foodCategory.map((data) => {
                            return (
                                <div className='row mb-3'>
                                    <div key={data._id} className='fs-3 m-3'>
                                        {data.CategoryName}
                                    </div>
                                    <hr />
                                    {
                                        foodItem !== []
                                            ? foodItem.filter((item) => (item.CategoryName === data.CategoryName) &&  (item.name.toLowerCase().includes(search))).map(filterItems => {
                                                return (
                                                    <div key={filterItems._id} className='col-12 col-md-6 col-lg-3'>
                                                        <Card
                                                            foodItem = {filterItems}
                                                            options={filterItems.options[0]}
                                                           

                                                        />
                                                    </div>
                                                )
                                            }) : <div>No such data found</div>
                                    }

                                </div>

                            )
                        })
                        : ""
                }
            </div>
            <div><Footer /></div>
        </div>
    )
}
