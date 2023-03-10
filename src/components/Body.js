import RestaurantCard from "./RestaurantCard";
import { restaurantList } from "../Constants";
import { useState, useEffect } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";

function filterData(searchInput, allRestaurants) {
    const filterData = allRestaurants.filter((restaurant) => 
        restaurant?.data?.name?.toLowerCase().includes(searchInput.toLowerCase())
    );
    return filterData;

}

const Body = () => {

    const [searchInput, setSearchInput] = useState("");
    const [allRestaurants, setAllRestaurants] = useState([]);
    
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    useEffect(() => {
        // API call
        getRestaurants(); 
    }, [])

    async function getRestaurants() {
        const data = await fetch(
          "https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9351929&lng=77.62448069999999&page_type=DESKTOP_WEB_LISTING"
        );
        const json = await data.json();
        setAllRestaurants(json?.data?.cards[2]?.data?.data?.cards);
        
        setFilteredRestaurants(json?.data?.cards[2]?.data?.data?.cards);
    }

    if(!allRestaurants) return null;


    // if(filteredRestaurants?.length===0) {
    //     return (
    //         <h1>Try to modify your search!</h1>
    //     )
    // }

   return allRestaurants?.length===0 ? <Shimmer /> : (
        <>
        <div className="search-container">
            <input 
                type="text" 
                className="search-input"
                placeholder="Search"
                value={searchInput}
                onChange={(e) => {
                    setSearchInput(e.target.value);
                }}
            />
            <button 
                className="search-btn"
                onClick={() => {
                    const data = filterData(searchInput, allRestaurants);
                    setFilteredRestaurants(data);
                }}
            >Search</button>

        </div>
        <div className="restaurant-list">
            {
                filteredRestaurants.map((restaurant) => {
                       return (<Link to={"/restaurant/"+restaurant.data.id}><RestaurantCard {...restaurant.data} key={restaurant.data.id} /></Link>)
                }

                )
            }
        </div>
        </>
    )
    
};

export default Body;