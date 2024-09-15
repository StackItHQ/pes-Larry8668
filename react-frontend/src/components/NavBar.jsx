"use client";
import React from "react";
import { motion } from "framer-motion";
import NavDropDown from "./NavDropDown";

const routes = [
  {
    name: "Home",
    key: "home",
    href: "/#",
  },
  {
    name: "About",
    key: "about",
    href: "/#",
  },
  {
    name: "Contact",
    key: "contact",
    href: "/#",
  },
];

const NavBar = () => {
  return (
    <motion.div
      className="bg-transparent backdrop-blur-md sticky top-5 left-0 w-[90%] md:w-full text-black shadow-xl rounded-xl z-[1100]"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div className="flex justify-between items-center px-4 md:px-8 h-12 md:h-20">
        <Link className="text-md md:text-2xl font-bold" href={"/"}>
          Logo
        </Link>
        <div className="md:flex justify-center items-center gap-4 hidden">
          {routes.map((route) => (
            <Link key={route.key} href={route.href}>
              {route.name}
            </Link>
          ))}
        </div>
        <NavDropDown routes={routes} />
      </div>
    </motion.div>
  );
};

export default NavBar;