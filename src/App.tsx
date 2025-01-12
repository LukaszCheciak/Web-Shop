import React, { useEffect, useState } from "react";
import axios from "axios";
import { Route, Link, Routes } from "react-router-dom";
import Cart from "./Cart";
import Login from "./Login";
import UserProfile from "./UserProfile";
import ProductPage from "./ProductPage";
import "./App.css";

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

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.setItem("lastCart", JSON.stringify(cartItems)); // Zapisz koszyk w localStorage
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    setCartItems([]); // Resetuj koszyk
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="login-panel">
          {loggedInUser ? (
            <>
              <span>Welcome, {loggedInUser}</span>
              <Link to="/profile">
                <button>Profile</button>
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}
        </div>
        <h1>Simple Online Store</h1>
        <Link to="/cart">
          <button>Cart ({totalItems})</button>
        </Link>
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
