import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [data,setData] = useState({});
  const [debouncerTimer, setDebouncerTimer] = useState(0)
  let [isApiCallCompleted,setIsApiCallCompleted]=useState(false);
  let productCards;

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async (searchKey) => {
    let response;
    try
    {
    setIsApiCallCompleted(false);
    let url;
    // console.log("hre");
    // console.log(searchKey);
    if(searchKey==="")
    {
    url = `${config.endpoint}/products`;
    }
    else
    {
    url = `${config.endpoint}/products/search?value=${searchKey}`
    }
    response = await axios.get(url);
    setData(response.data);
    }
    catch(error)
    {
      if(error.response && error.response.status===404)
      {
        setData({});
      }
      else
      {
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{
          variant: 'error'
        })
      }
      return {};
    }
    finally
    {
       setIsApiCallCompleted(true);
    }

    return response.data;
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    return performAPICall(text);
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {

    if(debouncerTimer!==0)
    {
      clearTimeout(debouncerTimer);
    }

    const newTimer = setTimeout(()=>{performSearch(event.target.value)},debounceTimeout);
    setDebouncerTimer(newTimer);

  };

  const handleValueChange = (e)=>{
    debounceSearch(e,500);
  };


 useEffect(()=>{performAPICall("");},[]);

 if(data.length>0)
 {
  productCards= <Grid container spacing={2} pt={2} pl={1} pr={1} pb={2}>{data.map((object) => <Grid item xs={6} md={3} key={object._id}> <ProductCard product={object} /></Grid>)}</Grid>
 }
 else
 {
  if(!isApiCallCompleted)
  {
  productCards = <Box  display="flex"
  justifyContent="center"
  alignItems="center"  sx={{flexDirection:"column"}}>Loading Products<CircularProgress m="auto"></CircularProgress></Box>
  }
  else
  {
  productCards = <Box  display="flex"
  justifyContent="center"
  alignItems="center"><Box><SentimentDissatisfied/></Box><Box>No products found</Box></Box>
  }
 }
 
 let searchBarJSX = <TextField  className="search-desktop"
 InputProps={{
   endAdornment: (
     <InputAdornment position="end">
       <Search color="primary" />
     </InputAdornment>
   ),
 }}
 placeholder="Search for items/categories"
 name="search"
 onChange = {(e)=> handleValueChange(e)}
/>;

  return (
    <div>
      <Header children={searchBarJSX} hasHiddenAuthButtons={"false"}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
       
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
       <Grid container>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
       </Grid>
          {productCards}
      <Footer />
    </div>
  );
};

export default Products;
