import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./index.css"

function InfiniteScrollComponent() {
  const [data, setData] = useState([]);
  const loadingRef = useRef(false);
  const pageRef = useRef(1);

  useEffect(() => {
    // Fetch initial data
    fetchData();

    // Add event listener for scroll
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  const fetchData = async () => {
    if (!loadingRef.current) {
      try {
        loadingRef.current = true;
        const response = await axios.get(
          `https://dummyjson.com/products?page=${pageRef.current}&limit=10`
        );
        const { data: { products = [] } = {} } = response;
        setData((prevData) => [...prevData, ...products]);
        pageRef.current += 1;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        loadingRef.current = false;
      }
    }
  };

  const handleScroll = () => {
    const scrollPosition =
      window.innerHeight + document.documentElement.scrollTop;
    const totalHeight = document.documentElement.offsetHeight;

    if (
      (Math.floor(scrollPosition) === Math.round(totalHeight) ||
        Math.ceil(scrollPosition) === Math.round(totalHeight)) &&
      !loadingRef.current
    ) {
      fetchData();
    }
  };
  if (loadingRef.current) {
    console.log("---------------------");
  }
  return (
    <>
     <p className="infiniteText">Infinite Scrolling</p>
    <div className="grid" >
     
      {data.map((item, index) => (
        <div  key={index} style={{boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px", width:'500px'}}>
          
          <img src={item.thumbnail} alt="image" style={{height:"300px", width:"100%"}} />
          <p className="title">{item.title}</p>
          <div className="pricegrid
          "><p style={{fontWeight:"500"}}>₹{item.price}</p>
          <p style={{color:"green"}}>{item.discountPercentage}% off</p></div>
          <div className="rating">
            <button>{item.rating} <span style={{fontSize:"17px"}}>&#9733;</span></button>
            <p>({item.stock})</p>
          </div>
        </div>
      
      ))}
      {loadingRef.current && <p>Loading...</p>}
    </div>
    </>
  );

}

export default InfiniteScrollComponent;
