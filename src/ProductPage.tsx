import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
}

interface Review {
  username: string;
  rating: number;
  title: string;
  content: string;
}

interface ProductPageProps {
  products: Product[];
  loggedInUser: string | null;
  addReview: (productId: number, review: Review) => void;
  reviews: { [productId: number]: Review[] };
  updateProductStock: (productId: number, newStock: number) => void;
  addToCart: (product: Product, quantity: number) => void; // Dodaj funkcję do dodawania do koszyka
}

const ProductPage: React.FC<ProductPageProps> = ({
  products,
  loggedInUser,
  addReview,
  reviews,
  updateProductStock,
  addToCart,
}) => {
  const { productId } = useParams<{ productId: string }>();
  const product = products.find((p) => p.id === parseInt(productId!));
  const [rating, setRating] = useState(1);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1); // Dodaj stan dla ilości produktu
  const [newStock, setNewStock] = useState(product?.stock || 0); // Dodaj stan dla nowej liczebności produktów
  const navigate = useNavigate();

  if (!product) {
    return <p>Product not found</p>;
  }

  const handleAddReview = () => {
    if (!loggedInUser) {
      setError("You must be logged in to leave a review");
      return;
    }
    if (reviewTitle.trim() === "" || reviewContent.trim() === "") {
      setError("Title and content are required");
      return;
    }
    const newReview: Review = {
      username: loggedInUser,
      rating,
      title: reviewTitle,
      content: reviewContent,
    };
    addReview(product.id, newReview);
    setRating(1);
    setReviewTitle("");
    setReviewContent("");
    setError("");
  };

  const handleUpdateStock = () => {
    updateProductStock(product.id, newStock);
  };

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      setError("Quantity exceeds available stock");
      return;
    }
    addToCart(product, quantity);
    setError("");
  };

  return (
    <div>
      <h1>{product.title}</h1>
      <p>Price: ${product.price}</p>
      <p>{product.description}</p>
      <p>Available: {product.stock}</p> {/* Wyświetl dostępność produktu */}
      <h2>Reviews</h2>
      {reviews[product.id] && reviews[product.id].length > 0 ? (
        reviews[product.id].map((review, index) => (
          <div key={index}>
            <h3>{review.title}</h3>
            <p>Rating: {review.rating} stars</p>
            <p>{review.content}</p>
            <p>By: {review.username}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet</p>
      )}
      {loggedInUser ? (
        <div>
          <h2>Leave a Review</h2>
          <label htmlFor="rating">Rating:</label>
          <select
            id="rating"
            aria-label="Rating"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} star{star > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Review title"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
          />
          <textarea
            placeholder="Review content"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          />
          <button onClick={handleAddReview}>Submit Review</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <p>You must be logged in to leave a review</p>
      )}
      <div>
        <h2>Add to Cart</h2>
        <label htmlFor="quantity">Quantity:</label>
        <input
          id="quantity"
          type="number"
          aria-label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min="1"
          max={product.stock}
        />
        <button onClick={handleAddToCart}>Add to Cart</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      {loggedInUser === "admin" && ( // Tylko admin może zarządzać liczebnością produktów
        <div>
          <h2>Manage Stock</h2>
          <label htmlFor="newStock">New Stock:</label>
          <input
            id="newStock"
            type="number"
            aria-label="New Stock"
            value={newStock}
            onChange={(e) => setNewStock(parseInt(e.target.value))}
            min="0"
          />
          <button onClick={handleUpdateStock}>Update Stock</button>
        </div>
      )}
      <button onClick={() => navigate("/")}>Back to Store</button>
    </div>
  );
};

export default ProductPage;
