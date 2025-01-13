import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ProductPage.css';

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
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="img-container">
            <img src={product.image} alt={product.title} className="img-fluid" />
          </div>
        </div>
        <div className="col-md-6 d-flex flex-column text-start">
          <h1>{product.title}</h1>
          <p className="text-muted">{product.category}</p>
          <p>{product.description}</p>
          <p className="h4">${product.price}</p>
          <p>Available: {product.stock}</p> {/* Wyświetl dostępność produktu */}
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity:</label>
            <input
              id="quantity"
              type="number"
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              min="1"
              max={product.stock}
            />
          </div>
          <button className="btn btn-primary w-100 mb-3 ms-0 mt-0" onClick={handleAddToCart}>Add to Cart</button>
          {error && <p className="text-danger">{error}</p>}
          {loggedInUser === "admin" && ( // Tylko admin może zarządzać liczebnością produktów
            <div className="mt-4">
              <h4>Manage Stock</h4>
              <div className="mb-3">
                <label htmlFor="newStock" className="form-label">New Stock:</label>
                <input
                  id="newStock"
                  type="number"
                  className="form-control"
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value))}
                  min="0"
                />
              </div>
              <button className="btn btn-secondary w-100 ms-0 mt-0" onClick={handleUpdateStock}>Update Stock</button>
            </div>
          )}
        </div>
      </div>
      <hr className="my-4" />
      <div className="mt-5 text-start">
        <h2>Reviews</h2>
        {reviews[product.id] && reviews[product.id].length > 0 ? (
          reviews[product.id].map((review, index) => (
            <div key={index} className="card mb-3">
              <div className="card-body">
                <h5>{review.title}</h5>
                <p>Rating: {review.rating} stars</p>
                <p>{review.content}</p>
                <p className="text-muted">By: {review.username}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet</p>
        )}
        {loggedInUser ? (
          <>
          <hr className="my-4" />
          <div className="mt-4">
            <h4>Leave a Review</h4>
            <div className="mb-3">
              <label htmlFor="rating" className="form-label">Rating:</label>
              <select
                id="rating"
                className="form-select"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>
                    {star} star{star > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control w-100"
                placeholder="Review title"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Review content"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100" onClick={handleAddReview}>Submit Review</button>
            {error && <p className="text-danger">{error}</p>}
          </div>
          </>
        ) : (
          <p>You must be logged in to leave a review</p>
        )}
      </div>
      <button className="btn btn-secondary mt-4" onClick={() => navigate("/")}>Back to Store</button>
    </div>
  );
};

export default ProductPage;