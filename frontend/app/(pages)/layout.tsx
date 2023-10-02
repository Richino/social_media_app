"use client";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useEffect, useContext, useState } from "react";
import Bottomnav from "../../components/home/bottomnav";
import Nav from "../../components/home/nav";
import Sidenav from "../../components/home/sidenav";
import { App } from "../context";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import Post from "../../components/common/post";
import axios from "axios";
import Create from "../../components/common/createPost";
import EditAvatar from "../../components/common/editAvatar";
import MobileSearch from "../../components/common/mobileSearch";
import List from "../../components/common/list";
import Error from "../../components/common/error";
import Settings from "../../components/common/settings";
import Logout from "../../components/common/logout";

export default function Layout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const ref = useRef<HTMLDivElement>(null);
	const {
		post,
		setPost,
		user,
		setUser,
		createPost,
		userPost,
		isLogoutOpen,
		changeProfile,
		mobileNav,
		setNotifications,
		notifications,
		list,
		bottomNavOffset,
		settings,
		isErrorOpen,
	} = useContext(App);
	const instance = axios.create({
		baseURL: process.env.url,
		withCredentials: true,
	});

	useEffect(() => {
		const searchInput = document.getElementById("search") as HTMLInputElement;
		if (searchInput) searchInput.value = "";
		ref.current?.scrollTo({ top: 0 });
		nprogress.done();
		setPost(false);
		const fetchData = async () => {
			await instance
				.get("/app")
				.then((res) => {
               console.log(res)
					setNotifications({ ...notifications, loading: false, data: res.data.notifications });
					setUser({ ...user, loading: false, user: res.data.user, feed: res.data.feeds });
				})
				.catch(() => {
               console.log(1)
					setUser({ ...user, loading: false, user: null });
					if (pathname !== "/register") return router.push("/login");
				});
		};
		fetchData();
	}, [pathname, bottomNavOffset]);

	return (!user?.loading && user.user) || pathname === "/login" || pathname === "/register" ? (
		<div
			ref={ref}
			className={`main  w-screen  overflow-hidden  phone:max-h-[${bottomNavOffset}px]  phone:h-[${bottomNavOffset}px] phone:w-full tablet:flex tablet:phone:block`}>
			{pathname === "/login" || pathname === "/register" ? null : <Nav />}
			{pathname === "/login" || pathname === "/register" ? null : <Sidenav />}
			{createPost && <Create />}
			{changeProfile && <EditAvatar />}
			{mobileNav && <MobileSearch />}
			{post && (
				<Post
					fullname={userPost.fullname}
					usernameOrText={userPost.username}
					avatar={userPost.avatar}
					post={userPost.imageUrl}
					author={userPost.author}
					id={userPost._id}
				/>
			)}
			{isLogoutOpen && <Logout />}
			{list.open && <List />}
			{children}
			{pathname === "/login" || pathname === "/register" ? null : <Bottomnav />}
			{settings.isSettingOpen && <Settings />}
			{isErrorOpen && <Error />}
		</div>
	) : (
		<div className={`relative grid h-full w-full place-items-center text-2xl dark:bg-neutral-950 phone:h-[${bottomNavOffset}px] `}>
			<div className="circle"> </div>
		</div>
	);
}
