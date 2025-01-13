import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from "axios";
import { Route, Link, Routes, useNavigate } from "react-router-dom";
import Cart from "./Cart";
import Login from "./Login";
import UserProfile from "./UserProfile";
import ProductPage from "./ProductPage";
import "./App.css";
import logo from "./assets/logo.png";
import cart from "./assets/cart.png";
import user from "./assets/user.png";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
}

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

interface ShippingInfo {
  address: string;
  city: string;
  postalCode: string;
}

interface Review {
  username: string;
  rating: number;
  title: string;
  content: string;
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [savedCarts, setSavedCarts] = useState<CartItem[][]>(() => {
    const savedCarts = localStorage.getItem("savedCarts");
    return savedCarts ? JSON.parse(savedCarts) : [];
  });
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(() => {
    const savedShippingInfo = localStorage.getItem("shippingInfo");
    return savedShippingInfo
      ? JSON.parse(savedShippingInfo)
      : { address: "", city: "", postalCode: "" };
  });
  const [reviews, setReviews] = useState<{ [productId: number]: Review[] }>(
    () => {
      const savedReviews = localStorage.getItem("reviews");
      return savedReviews ? JSON.parse(savedReviews) : {};
    }
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<string | null>(
    localStorage.getItem("loggedInUser")
  );
  const [orders, setOrders] = useState<{ [username: string]: any[] }>(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : {};
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => {
        const productsWithStock = response.data.map((product: Product) => ({
          ...product,
          stock: 5,
        }));
        setProducts(productsWithStock);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("savedCarts", JSON.stringify(savedCarts));
  }, [savedCarts]);

  useEffect(() => {
    localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
  }, [shippingInfo]);

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const decreaseQuantity = (id: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === id);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prevItems.filter((item) => item.id !== id);
      }
    });
  };

  const saveCart = () => {
    setSavedCarts((prevCarts) => [...prevCarts, cartItems]);
  };

  const loadCart = (cart: CartItem[]) => {
    setCartItems(cart);
  };

  const updateShippingInfo = (info: ShippingInfo) => {
    setShippingInfo(info);
  };

  const addReview = (productId: number, review: Review) => {
    setReviews((prevReviews) => {
      const productReviews = prevReviews[productId] || [];
      return { ...prevReviews, [productId]: [...productReviews, review] };
    });
  };

  const updateProductStock = (productId: number, newStock: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, stock: newStock } : product
      )
    );
  };

  const placeOrder = () => {
    if (!loggedInUser) return;

    const newOrder = {
      date: new Date().toISOString(),
      items: cartItems,
      shippingInfo,
    };

    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        const cartItem = cartItems.find((item) => item.id === product.id);
        if (cartItem) {
          return { ...product, stock: product.stock - cartItem.quantity };
        }
        return product;
      })
    );

    setOrders((prevOrders) => ({
      ...prevOrders,
      [loggedInUser]: [...(prevOrders[loggedInUser] || []), newOrder],
    }));

    setCartItems([]);
  };

  const handleLogout = () => {
    localStorage.setItem("lastCart", JSON.stringify(cartItems)); // Save cart in localStorage
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    setCartItems([]); // Reset cart
    navigate("/login");
  };

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link to="/" className="d-flex flex-row align-items-center">
            <img src={logo} className="navbar-img mx-3" alt="logo" />
            <div className="brand">SimpleStore</div>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <span
            className="collapse navbar-collapse flex-grow-0"
            id="navbarSupportedContent"
          >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-none d-lg-flex">
              <li className="nav-item">
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="cart-tooltip">Cart</Tooltip>}
                  >
                    <Link
                      to="/cart"
                      className="d-flex flex-row align-items-center"
                    >
                      <img src={cart} className="navbar-img" alt="cart" />
                      <div className="cart-badge">{totalItems}</div>
                    </Link>
                  </OverlayTrigger>
              </li>
              <li className="nav-item d-flex flex-row align-items-center">
                {loggedInUser ? (
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="profile-tooltip">Profile</Tooltip>}
                  >
                    <Link
                      to="/profile"
                      className="d-flex align-items-center"
                    >
                      <img src={user} className="navbar-img" alt="user" />
                    </Link>
                  </OverlayTrigger>
                ) : (
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="login-tooltip">Login</Tooltip>}
                  >
                    <Link to="/login">
                      <img src={user} className="navbar-img me-2" alt="login" />
                    </Link>
                  </OverlayTrigger>
                )}
              </li>
            </ul>
            <ul className="navbar-nav d-lg-none">
            <li className="nav-item">
              <Link to="/cart" className="nav-link d-flex flex-row align-items-center">
                <img src={cart} className="navbar-img" alt="cart" />
                <span className="ms-2 align-self-center">Cart</span>
              </Link>
            </li>
            <li className="nav-item">
              {loggedInUser ? (
                <Link to="/profile" className="nav-link d-flex flex-row align-items-center">
                  <img src={user} className="navbar-img" alt="user" />
                  <span className="ms-2 align-self-center">Profile</span>
                </Link>
              ) : (
                <Link to="/login" className="nav-link d-flex flex-row align-items-center">
                  <img src={user} className="navbar-img" alt="login" />
                  <span className="ms-2 align-self-center">Login</span>
                </Link>
              )}
            </li>
          </ul>
          </span>
        </div>
      </nav>
      <main className="container mt-4">
        <Routes>
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                decreaseQuantity={decreaseQuantity}
                saveCart={saveCart}
                loggedInUser={loggedInUser}
                placeOrder={placeOrder} // Przekaż funkcję realizacji zamówienia
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                setLoggedInUser={setLoggedInUser}
                setCartItems={setCartItems}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <UserProfile
                username={loggedInUser!}
                savedCarts={savedCarts}
                updateShippingInfo={updateShippingInfo}
                shippingInfo={shippingInfo}
                loadCart={loadCart}
                orders={orders} // Przekaż zamówienia
                handleLogout={handleLogout} // Przekaż funkcję wylogowania          
                />
            }
          />
          <Route
            path="/product/:productId"
            element={
              <ProductPage
                products={products}
                loggedInUser={loggedInUser}
                addReview={addReview}
                reviews={reviews}
                updateProductStock={updateProductStock}
                addToCart={addToCart} // Przekaż funkcję dodawania do koszyka
              />
            }
          />
          <Route
            path="/"
            element={
              <>
                <div className="search-bar mb-4">
                  <input
                    type="text"
                    className="form-control w-100"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {loading ? (
                  <p>Loading products...</p>
                ) : (
                  <div className="row">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="col-md-4 mb-4">
                        <div className="card h-100">
                          <div className="card-img-container">
                            <img
                              src={product.image}
                              className="card-img-top img-fluid p-3"
                              alt={product.title}
                            />
                          </div>
                          <div className="card-divider"></div>
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{product.title}</h5>
                            <p className="card-text">{product.description}</p>
                            <div className="mt-auto">
                            <p className="card-text h5">${product.price}</p>
                              <Link
                                to={`/product/${product.id}`}
                                className="btn btn-primary w-100 mb-2"
                              >
                                View Product
                              </Link>
                              <button
                                className="btn btn-secondary w-100 ms-0 mt-0"
                                onClick={() => addToCart(product, 1)}
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;