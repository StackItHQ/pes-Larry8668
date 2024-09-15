import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { RxHamburgerMenu } from "react-icons/rx";

const NavDropDown = ({ routes }) => {
  return (
    <div className="md:hidden">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" className="text-2xl">
            <RxHamburgerMenu />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Navigation Menu"
          className="bg-white rounded-xl shadow-xl p-2 w-40 border border-gray-200"
        >
          {routes.map((route) => (
            <DropdownItem key={route.key}>
              <a
                className="block p-2 cursor-pointer hover:bg-gray-100"
                href={route.href} // Direct link to the route
              >
                {route.name}
              </a>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default NavDropDown;
