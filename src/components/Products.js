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
import Cart, {generateCartItemsFrom} from "./Cart";


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * @typedef {Object} Product - Data on product available to buy
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products =   () => {
  const { enqueueSnackbar } = useSnackbar();
  const [data,setData] = useState({});
  const [cartData,setCartData] = useState([]);
  const [debouncerTimer, setDebouncerTimer] = useState(0);
  let [isApiCallCompleted,setIsApiCallCompleted]=useState(false);
  let productCards;

  const handleQuantityDelete = (cartItem)=>{
    console.log("Inside Handle Quantity Delete");
    let i=0;
    for(;i<cartData.length;++i)
    {
      if(cartData[i].productId === cartItem._id)
      {
        cartData[i].qty = cartData[i].qty-1;
        break;
      }
    }
    
    let finalQty = cartData[i].qty;
    if(cartData[i].qty===0)
    {
      cartData.splice(i, 1);
      finalQty=0;
    }

    let data = {
      productId:cartItem._id,qty:finalQty
    };
    const token = localStorage.getItem("token");
    let configHeader = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
    axios.post(`${config.endpoint}/cart`, data, configHeader).then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    setCartData([...cartData]);
  }

  const handleQuantityAdd = (cartItem)=>{
    console.log("Inside Handle Quantity Add");
    let i=0;
    for(;i<cartData.length;++i)
    {
      if(cartData[i].productId === cartItem._id)
      {
        cartData[i].qty = cartData[i].qty+1;
        break;
      }
    }
    let data = {
      productId:cartItem._id,qty:cartData[i].qty
    };
    const token = localStorage.getItem("token");
    let configHeader = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
    console.log(config.endpoint);
    axios.post(`${config.endpoint}/cart`, data, configHeader).then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    setCartData([...cartData]);
  }

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
   const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    console.log("button clicked");
    if(!localStorage.getItem("username"))
    {
    enqueueSnackbar("Login to add an item to the Cart",{
      variant: 'error'
    });
    return;
     }

     if(isItemInCart(items,productId))
     {
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{
        variant: 'error'
      });
      return;
     }

    console.log(cartData);
    cartData.push({productId:productId,qty:qty});
    console.log(cartData);
    console.log(token);
    console.log(items);
    console.log(products);
    console.log(productId);
    console.log(qty);
    let data = {
      productId:productId,qty:qty
    };
    console.log(token);
    let configHeader = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
    console.log(config.endpoint);
    axios.post(`${config.endpoint}/cart`, data, configHeader).then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    setCartData([...cartData]);
    console.log("setted");
  };

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
 useEffect(()=>{fetchCart(localStorage.getItem("token"));},[]);

 if(data.length>0)
 {
  productCards= <Grid container spacing={2} pt={2} pl={1} pr={1} pb={2}>{data.map((object) => <Grid item xs={6} md={3} key={object._id}> <ProductCard product={object} cartItems={cartData} products={data} handleAddToCart={addToCart}/></Grid>)}</Grid>
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

  


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    console.log("Inside Fetch Cart");
    console.log(config.endpoint);
    if (!token) return;
    let response;
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
    let url = `${config.endpoint}/cart`;
    response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }});
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
    setCartData(response.data);
    return response.data;
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {

    for(let i=0;i<items.length;++i)
    {
      if(items[i].productId===productId)
      {
        return true;
      }
    }

    return false;
  };


  let username = localStorage.getItem("username");
  let page=productCards;
  if(username)
  {
    const items = generateCartItemsFrom(cartData,data);
     page = <Grid container spacing={2}><Grid item md={9} xs={12}>{productCards}</Grid>
   <Grid item md={3} xs={12}><Cart products={data} items={items} handleQuantity={{handleQuantityDelete:handleQuantityDelete,
                                                                                                      handleQuantityAdd:handleQuantityAdd}}/></Grid>
</Grid>
};
   
  return (
    <div>
      <Header children={searchBarJSX} hasHiddenAuthButtons={"false"}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
       
      </Header>
 
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
          {page}
      <Footer />
    </div>
  );
};

export default Products;
