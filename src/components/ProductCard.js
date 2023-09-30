import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia component="img"
        alt={product.name}
        image={product.image}>
      </CardMedia>

      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography sx={{ fontWeight: 900 }}>${product.cost}</Typography>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>

      <CardActions>
      <Button style={{"width":"100%"}} variant="contained"><AddShoppingCartOutlined></AddShoppingCartOutlined>ADD TO CART</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
