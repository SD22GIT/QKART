import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState , useEffect} from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

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

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */


/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  console.log("generateCartItemsFrom");
  console.log(cartData);
  console.log(productsData);
  const items = [];
  for(let i=0;i<cartData.length;++i)
  {
    const searchObject= productsData.find((product) => product._id===cartData[i].productId);
    items.push({...searchObject,"qty": cartData[i].qty});
  }

  return items;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let sum=0;

  for(let i=0;i<items.length;++i)
  {
    sum = sum + (items[i].cost * items[i].qty);
  }

  return sum;
};


/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
}) => {
   console.log("Inside Item QTY");
   console.log(handleAdd);
  // const [qty,setQty] = useState(0);
  // useEffect(()=>{setQty(value.qty)},[qty]);
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" id="minus" onClick={(event)=>{handleDelete(value);}}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value.qty}
      </Box>
      <IconButton size="small" color="primary" id="add" onClick={(event)=>{handleAdd(value);}}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * 
 */
const Cart = ({
  products,
  items = [],
  handleQuantity,
}) => {
  const history = useHistory();
  console.log("Cart");
  console.log(products);
  console.log(items);
  // const [value,setValue] = useState(1);
const [totalCartItems, setTotalCartItems] = useState(0);
  let cartDataItems = generateCartItemsFrom(items,products);
  useEffect(()=>{setTotalCartItems(cartDataItems.length)},[totalCartItems]);
  // const [cartDataItems, setcartDataItems] = useState([]);
  // useEffect(()=>{cartDataItems=generateCartItemsFrom(items,products);}, [cartDataItems] )
  
  const addValue = (value)=>{
    console.log("Add Value");
    value.qty=value.qty+1;

    console.log(value);
  };

  const deleteValue = (value)=>{
    console.log("Delete Value");
    value.qty=value.qty-1;
    console.log(value);
  };

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {cartDataItems.map((object)=><Box display="flex" alignItems="flex-start" padding="1rem" key={object._id}>
    <Box className="image-container">
        <img
            // Add product image
            src={object.image}
            // Add product name as alt eext
            alt={object.category}
            width="100%"
            height="100%"
        />
    </Box>
    <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="6rem"
        paddingX="1rem"
    >
        <div>{object.name}</div>
        <Box onClick={(event)=>{console.log("Click Here inside box");
        console.log(object);
        if(object.qty===0)
        {
         let index=-1;
         for(let i=0;i<cartDataItems.length;++i)
         {
          if(cartDataItems[i].id==object._id)
          {
            index=i;
            break;
          }
         }

         if(index>-1)
         {
          cartDataItems = cartDataItems.splice(index, 1);
          setTotalCartItems(cartDataItems.length);
         }
        }
        // const item = cartDataItems.find((item)=>{return item._id===object._id});
        // console.log(item);
        // item.qty = item.qty+1;
        // console.log(event);
        console.log(cartDataItems);
        
      }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
        <ItemQuantity value={object} handleAdd={handleQuantity.handleQuantityAdd} handleDelete={handleQuantity.handleQuantityDelete}
        // Add required props by checking implementation
        />
        <Box padding="0.5rem" fontWeight="700">
            ${object.cost}
        </Box>
        </Box>
    </Box>
</Box>)}
         
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(cartDataItems)}
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={(event)=>{console.log("checkout clicked");history.push('/checkout');}}
          >
            Checkout
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Cart;
