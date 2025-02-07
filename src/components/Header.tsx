"use client";

import { Search, ShoppingCartIcon, X, CircleUserRound } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from './ui/navigation-menu';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CardContext';
import { usePathname } from 'next/navigation';
import { useUser as useClerkUser, UserButton } from '@clerk/nextjs';
import { useRouter } from "next/navigation";

const components = [
    {
        title: "T-Shirts",
        href: "/category?search=t-shirts",
        description: "T-shirts are versatile and stylish, making them a staple in every wardrobe.",
    },
    {
        title: "Casual",
        href: "/category?search=casual",
        description: "Casual wear is comfortable and relaxed, perfect for everyday wear.",
    },
    {
        title: "Gym",
        href: "/category?search=gym",
        description: "Gym wear is designed to be comfortable and breathable, making it perfect for workouts.",
    },
];

export default function Header() {
    const [activeLink, setActiveLink] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const { cartItems } = useCart(); // Access cart items from context
    const [searchQuery, setSearchQuery] = useState(""); // State to store user input
    const router = useRouter(); // Use router for navigation

    const handleSearch = () => {
        if (searchQuery.trim() !== "") {
            // Redirect to category page with the search query
            router.push(`/category?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleKeyPress = (e: { key: string; }) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // Calculate the total number of items in the cart
    const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);
    const { isSignedIn } = useClerkUser();
    const pathname = usePathname();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSearchOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: { target: any; }) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClick = (link: React.SetStateAction<string>) => {
        setActiveLink(link);
        setIsMenuOpen(false);
    };

    return (
        <header className="flex flex-col items-center justify-center font-sans not-italic border-b-2">
            {/* Top Header */}
            {!isSignedIn && (
                <div className="w-full bg-[#000000] pr-[12px] sm:pr-[9.444vw] pt-[9px] pb-[9px] md:pb-[10px] text-white flex items-center justify-center md:justify-end">
                    <div className="flex flex-row items-center justify-between p-0 pl-[12px] gap-[15px] md:w-[59.653vw]">
                        <div className="flex flex-row items-center p-0 gap-[8px] w-full text-[10px] sm:text-[14px]">
                            <h1 className="font-normal text-[#FAFAFA]">
                                Sign up and get 20% off to your first order.
                            </h1>
                            <Link href={"/dashboard"} className="font-semibold leading-[24px] underline">
                                Sign Up Now
                            </Link>
                        </div>
                        <X className="flex cursor-pointer" onClick={() => setIsVisible(false)} />
                    </div>
                </div>
            )}

            {/* Menu Header */}
            <nav className="flex flex-row items-center justify-between px-[16px] p-0 gap-[16px] w-full md:max-w-[1240px] min-h-[41px] my-[23px] md:mt-[24px] md:mb-[31px]">
                {/* Hamburger Button */}
                <button
                    className="block md:hidden text-[20px] dark:text-white"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    aria-label="Toggle navigation menu"
                >
                    ☰
                </button>

                <h1 className="absolute left-[48px] md:static font-bold text-[25.2px] lg:text-[32px] leading-[24px] tracking-[0.03em] text-[#000000]">
                    SHOP.CO
                </h1>

                {/* Navigation Links */}
                <div
                    className={`${isMenuOpen ? "flex" : "hidden"
                        } overflow-x-clip sm:overflow-visible absolute md:static left-0 top-[130px] w-full md:w-[321px] flex-col md:flex-row md:flex justify-center px-2 sm:px-0 pb-2 sm:pb-0 sm:items-center gap-[24px] bg-white md:bg-transparent font-normal text-[16px] leading-[24px] text-start sm:text-center text-nowrap text-[#000000]`}
                >
                    <NavigationMenu>
                        <NavigationMenuItem className="list-none">
                            <NavigationMenuTrigger className="h-fit py-0 focus:bg-transparent font-normal text-[16px] leading-[24px] text-center text-[#000000]">
                                Shop
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    {components.map((component) => (
                                        <ListItem
                                            className='text-start sm:text-center text-wrap'
                                            key={component.title}
                                            title={component.title}
                                            href={component.href}
                                        >
                                            {component.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenu>

                    <Link
                        href="/#top_selling"
                        id="l2"
                        onClick={() => handleClick("#l2")}
                        className={`${activeLink === "#l2" ? "border-b-2 border-[solid] border-[#7D8184]" : ""
                            } px-4 sm:px-0`}
                    >
                        On Sale
                    </Link>

                    <Link
                        href="/#new_arrival"
                        id="l3"
                        onClick={() => handleClick("#l3")}
                        className={`${activeLink === "#l3" ? "border-b-2 border-[solid] border-[#7D8184]" : ""
                            } px-4 sm:px-0`}
                    >
                        New Arrivals
                    </Link>

                    <Link
                        href="/#brand"
                        id="l4"
                        onClick={() => handleClick("#l4")}
                        className={`${activeLink === "#l4" ? "border-b-2 border-[solid] border-[#7D8184]" : ""
                            } px-4 sm:px-0`}
                    >
                        Brands
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="hidden lg:flex justify-center items-center relative max-w-[577px] h-[48px]">
                    <Search size={24} className="relative left-[40px] cursor-pointer" onClick={handleSearch} />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
                        onKeyDown={handleKeyPress}
                        className="flex flex-row justify-between items-center pl-[52px] gap-[10px] w-[40.069vw] h-full bg-[#F5F5F5] rounded-full"
                    />
                </div>

                {/* Mobile Search Bar */}
                {isSearchOpen && (
                    <div
                        ref={searchRef}
                        className="absolute top-[130px] left-0 w-full bg-white shadow-md p-4 z-30"
                    >
                        <div className="flex items-center w-full h-[40px] px-2 bg-gray-100 rounded-full">
                            <Search size={24} className="relative left-[10px] cursor-pointer" onClick={handleSearch}/>
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
                                onKeyDown={handleKeyPress}
                                className="flex flex-row justify-between items-center pl-[52px] gap-[10px] w-full h-full bg-[#F5F5F5] rounded-full focus:outline-none"
                            />
                        </div>
                    </div>
                )}

                {/* Icons */}
                <div className="flex flex-row justify-center items-center p-0 gap-[12px] md:gap-[14px]">
                    <button
                        className="lg:hidden text-[#000000] hover:text-gray-700"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        title="Search"
                    >
                        <Search size={24} />
                    </button>

                    <Link href="/cart" title="checkout" className="snipcart-checkout relative">
                        {/* Badge showing the number of items in the cart */}
                        {totalItems > 0 && (
                            <span className="snipcart-items-count absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full shadow-md">
                                {totalItems}
                            </span>
                        )}
                        <ShoppingCartIcon className="w-6 h-6 text-black" />
                    </Link>

                    {/* Conditional rendering based on the current path */}
                    {pathname === '/dashboard' && isSignedIn ? (
                        // Show UserButton only on the dashboard page
                        <UserButton afterSignOutUrl="/" />
                    ) : (
                        // Show default icon for other pages
                        <Link href="/dashboard" title="Go to Dashboard">
                            <CircleUserRound />
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}

interface ListItemProps {
    className?: string;
    title: string;
    children: React.ReactNode;
    href: string;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});

ListItem.displayName = "ListItem";
