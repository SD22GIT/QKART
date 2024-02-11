import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
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
  console.log("Inside generateCartItemsFrom");
  console.log(cartData);
  console.log(productsData);
  const items = [];
  for (let i = 0; i < cartData.length; ++i) {
    const searchObject = productsData.find(
      (product) => product._id === cartData[i].productId
    );
    items.push({ ...searchObject, qty: cartData[i].qty });
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
  let sum = 0;

  for (let i = 0; i < items.length; ++i) {
    sum = sum + items[i].cost * items[i].qty;
  }

  return sum;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {
  let total = 0;

  for (let i = 0; i < items.length; ++i) {
    total = total + 1 * items[i].qty;
  }

  return total;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
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
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 *
 */
const ItemQuantity = ({ value, handleAdd, handleDelete }) => {
  console.log("Inside ItemQuantity");
  // const [qty,setQty] = useState(0);
  // useEffect(()=>{setQty(value.qty)},[qty]);
  return (
    <Stack direction="row" alignItems="center">
      <IconButton
        size="small"
        color="primary"
        id="minus"
        onClick={(event) => {
          handleDelete(value);
        }}
      >
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value.qty}
      </Box>
      <IconButton
        size="small"
        color="primary"
        id="add"
        onClick={(event) => {
          handleAdd(value);
        }}
      >
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
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 *
 */
const Cart = ({ isReadOnly, products, items = [], handleQuantity }) => {
  console.log("Cart Component");
  console.log(isReadOnly);
  console.log(products);
  console.log(items);
  const history = useHistory();
  // const [value,setValue] = useState(1);
  const [totalCartItems, setTotalCartItems] = useState(0);
  let cartDataItems = items;
  console.log(cartDataItems);
  useEffect(() => {
    setTotalCartItems(cartDataItems.length);
  }, [totalCartItems]);
  // const [cartDataItems, setcartDataItems] = useState([]);
  // useEffect(()=>{cartDataItems=generateCartItemsFrom(items,products);}, [cartDataItems] )

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

  if (!isReadOnly) {
    return (
      <>
        <Box className="cart">
          {cartDataItems.map((object) => (
            <Box
              display="flex"
              alignItems="flex-start"
              padding="1rem"
              key={object._id}
            >
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
                <Box
                  onClick={(event) => {
                    console.log("Click Here inside box");
                    console.log(object);
                    if (object.qty === 0) {
                      let index = -1;
                      for (let i = 0; i < cartDataItems.length; ++i) {
                        if (cartDataItems[i].id === object._id) {
                          index = i;
                          break;
                        }
                      }

                      if (index > -1) {
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
                  <ItemQuantity
                    value={object}
                    handleAdd={handleQuantity.handleQuantityAdd}
                    handleDelete={handleQuantity.handleQuantityDelete}
                    // Add required props by checking implementation
                  />
                  <Box padding="0.5rem" fontWeight="700">
                    ${object.cost}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}

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
              onClick={(event) => {
                console.log("checkout clicked");
                history.push("/checkout");
              }}
            >
              Checkout
            </Button>
          </Box>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Box className="cart">
          {cartDataItems.map((object) => (
            <Box
              display="flex"
              alignItems="flex-start"
              padding="1rem"
              key={object._id}
            >
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
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  padding="0.5rem"
                  fontWeight="700"
                >
                  <Box>Qty: {object.qty}</Box>
                  <Box>${object.cost}</Box>
                </Box>
              </Box>
            </Box>
          ))}

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
        </Box>
        <Box className="cart">
          <Box color="#3C3C3C" alignSelf="center"   fontWeight="700"
              fontSize="1.5rem"  padding="1rem">Order Details</Box>
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Products
            </Box>
            <Box
              color="#3C3C3C"
              alignSelf="center"
            >
              {getTotalItems(items)}
            </Box>
          </Box>
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Subtotal
            </Box>
            <Box
              color="#3C3C3C"
              alignSelf="center"
            >
              ${getTotalCartValue(cartDataItems)}
            </Box>
          </Box>
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Shipping Charges
            </Box>
            <Box
              color="#3C3C3C"
              alignSelf="center"
            >
              ${0}
            </Box>
          </Box>
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center"   fontWeight="700"
              fontSize="1.5rem">
              Total
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
        </Box>
      </>
    );
  }
};

export default Cart;
