import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "./api/axios.js";
import updateUserProfile from "./redux/actions/updateUserProfile.js";
import updateCart from "./redux/actions/updateCart.js";
import updateFavorite from "./redux/actions/updateFavorite.js";
import Layout from "./Layout.jsx";
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import UserLayout from "./pages/User/UserLayout.jsx";
import AuthLayout from "./pages/Auth/AuthLayout.jsx";

import Home from "./pages/Home.jsx";
import Cart from "./pages/User/Cart/Cart.jsx";
import Checkout from "./pages/User/Cart/Checkout.jsx";
import Favorite from "./pages/User/Favorite.jsx";
import Login from "./pages/Auth/Login.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";
import Profile from "./pages/User/Profile.jsx";
import Ordered from "./pages/User/Ordered.jsx";
import AllProducts from "./pages/Products/AllProducts/AllProducts.jsx";
import ProductDetail from "./pages/Products/ProductDetail/ProductDetail.jsx";

import Dashboard from "./pages/Admin/Dashboard.jsx";
import CreateProduct from "./pages/Admin/CreateProduct.jsx";
import ManageProducts from "./pages/Admin/ManageProducts.jsx";
import ManageUsers from "./pages/Admin/ManageUsers.jsx";
import ManageOrders from "./pages/Admin/ManageOrders.jsx";
import UpdateProduct from "./pages/Admin/UpdateProduct.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		axios
			.get("user")
			.then((res) => {
				localStorage.setItem("user", JSON.stringify(res.data));
				dispatch(updateUserProfile(res.data));
				const cart = {};
				const favorite = {};
				res.data.cart.forEach((e) => (cart[e] = true));
				res.data.favorite.forEach((e) => (favorite[e] = true));
				dispatch(updateCart(cart));
				dispatch(updateFavorite(favorite));
			})
			.catch((err) => {
				console.error(err);
				localStorage.removeItem("user");
				dispatch(updateUserProfile({}));
				dispatch(updateCart({}));
				dispatch(updateFavorite({}));
			});
	}, []);
	return (
		<Routes>
			<Route
				path='/'
				element={<Layout />}>
				<Route
					index
					element={<Navigate to='/home' />}></Route>
				<Route
					path='home'
					element={<Home />}></Route>
				<Route
					path='auth'
					element={<AuthLayout />}>
					<Route
						path='login'
						element={<Login />}></Route>
					<Route
						path='signup'
						element={<SignUp />}></Route>
				</Route>
				<Route
					path='user'
					element={<UserLayout />}>
					<Route
						path='cart'
						element={<Cart />}></Route>
					<Route
						path='favorite'
						element={<Favorite />}></Route>
					<Route
						path='profile'
						element={<Profile />}></Route>
					<Route
						path='ordered'
						element={<Ordered />}></Route>
					<Route
						path='checkout'
						element={<Checkout />}></Route>
				</Route>
				<Route
					path='admin'
					element={<AdminLayout />}>
					<Route
						path='statistical'
						element={<Dashboard />}></Route>
					<Route
						path='orders'
						element={<ManageOrders />}></Route>
					<Route
						path='users'
						element={<ManageUsers />}></Route>
					<Route path='products'>
						<Route
							index
							element={<ManageProducts />}></Route>
						<Route
							path='create'
							element={<CreateProduct />}></Route>
						<Route
							path=':id'
							element={<UpdateProduct />}></Route>
					</Route>
				</Route>
				<Route path='products'>
					<Route
						index
						element={<AllProducts />}></Route>
					<Route
						path=':id'
						element={<ProductDetail />}></Route>
				</Route>
				<Route
					path='*'
					element={<NotFound />}></Route>
			</Route>
		</Routes>
	);
}

export default App;
