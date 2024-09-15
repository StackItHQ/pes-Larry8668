import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { RxHamburgerMenu } from "react-icons/rx";
import useRouter from "react-router-dom";

const NavDropDown = ({ routes }) => {
  const router = useRouter();

  const handleAction = (key) => {
    const route = routes.find((route) => route.key === key);
    alert(`Navigating to ${route.name}`);
    router.push(route.href);
  };

  return (
    <div className="md:hidden">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" className="text-2xl">
            <RxHamburgerMenu />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Action event example"
          onAction={(key) => handleAction(key)}
          className="bg-white rounded-xl shadow-xl p-2 w-40 border border-gray-200"
        >
          {routes.map((route) => (
            <DropdownItem key={route.key}>{route.name}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default NavDropDown;
