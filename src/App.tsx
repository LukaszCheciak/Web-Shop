import React, { useEffect, useState } from "react";
import axios from "./axiosInstance.ts";
import { Route, Link, Routes } from "react-router-dom";
import Cart from "./Cart";
import Login from "./Login";
import UserProfile from "./UserProfile";
import ProductPage from "./ProductPage";
import "./App.css";
import Register from "./Register.tsx";

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
  id: number;
  username: string;
  rating: number;
  title: string;
  content: string;
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<{ [username: string]: any[] }>(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : {};
  });

  useEffect(() => {
    axios
      .get("/products/")
      .then((response) => {
        const productsWithStock = response.data;
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
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const loggedInUser = () => {
    return sessionStorage.getItem("user");
  }

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

  const updateProductStock = (productId: number, newStock: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, stock: newStock } : product
      )
    );
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const placeOrder = () => {
    if (!loggedInUser()) return;

    axios
      .post("/orders/", { items: cartItems, total: totalPrice })
      .then((response) => {
        console.log("Order placed:", response);
      }
    );

    setCartItems([]);
  };

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.setItem("lastCart", JSON.stringify(cartItems));
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setCartItems([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="login-panel">
          {loggedInUser() ? (
              <>
                <span>Welcome, {loggedInUser()}</span>
                <Link to="/profile">
                  <button>Profile</button>
                </Link>
                <button onClick={handleLogout}>Logout</button>
              </>
          ) : (
              <>
                <Link to="/login">
                  <button>Login</button>
                </Link>
                <Link to="/register">
                  <button>Register</button>
                </Link>
              </>
          )}
        </div>
        <h1>Simple Online Store</h1>
        {loggedInUser() ? (
          <Link to="/cart">
            <button>Cart ({totalItems})</button>
          </Link>
        ) : null}
      </header>
      <main>
        <Routes>
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                decreaseQuantity={decreaseQuantity}
                saveCart={saveCart}
                loggedInUser={loggedInUser()}
                placeOrder={placeOrder}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login/>
            }
          />
          <Route
            path="/register"
            element={
              <Register/>
            }
          />
          <Route
            path="/profile"
            element={
              <UserProfile
                username={loggedInUser()}
                savedCarts={savedCarts}
                updateShippingInfo={updateShippingInfo}
                shippingInfo={shippingInfo}
                loadCart={loadCart}
                orders={orders}
              />
            }
          />
          <Route
            path="/product/:productId"
            element={
              <ProductPage
                products={products}
                loggedInUser={loggedInUser()}
                updateProductStock={updateProductStock}
                addToCart={addToCart} // Przekaż funkcję dodawania do koszyka
              />
            }
          />
          <Route
            path="/"
            element={
              <>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {loading ? (
                  <p>Loading products...</p>
                ) : (
                  <div className="product-list">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.title} />
                        <h2>{product.title}</h2>
                        <p>{product.description}</p>
                        <p>${product.price}</p>
                        <Link to={`/product/${product.id}`}>
                          <button>View Product</button>
                        </Link>
                        <button onClick={() => addToCart(product, 1)}>
                          Add to Cart
                        </button>
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
