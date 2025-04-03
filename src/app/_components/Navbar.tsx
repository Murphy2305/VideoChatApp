"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { ModeToggle } from "@/components/Mode/ModeToggle";

const Navbar = () => {
    const { userId } = useAuth();
    const router = useRouter();

    return (
        <header className="bg-white  dark:bg-gray-900 border-b border-gray-700">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-1 md:flex md:items-center md:gap-12">
                        <a className="block transition-transform hover:scale-105" href="/">
                            <Image 
                                src={"/logo.png"} 
                                alt="logo" 
                                width={60} 
                                height={60} 
                                className="rounded-md mt-2  hover:ring-gray-400 dark:ring-gray-700 dark:hover:ring-gray-600"
                            />
                        </a>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-4">
                        {!userId ? (
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    className="group bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2 rounded-xl dark:text-gray-300 dark:border-indigo-500 dark:hover:bg-indigo-800"
                                    onClick={() => router.push("/sign-in")}
                                >
                                    <LogIn className="w-4 h-4 text-gray-300 group-hover:text-gray-200 dark:text-gray-400 dark:group-hover:text-gray-200" />
                                    Sign In
                                </Button>

                                <div className="hidden sm:flex">
                                    <Button
                                        variant="outline"
                                        className="group bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2 rounded-xl dark:text-gray-300 dark:border-indigo-500 dark:hover:bg-indigo-800"
                                        onClick={() => router.push("/sign-up")}
                                    >
                                        <UserPlus className="w-4 h-4 text-gray-300 group-hover:text-gray-200 dark:text-gray-400 dark:group-hover:text-gray-200" />
                                        Sign Up
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-200 rounded-full p-1 dark:bg-gray-800">
                                <UserButton 
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: "ring-1 ring-gray-300 hover:ring-gray-400 dark:ring-gray-700 dark:hover:ring-gray-600",
                                        },
                                    }}
                                />
                            </div>
                        )}

                        {/* <ModeToggle /> */}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
