/* This example requires Tailwind CSS v2.0+ */
import { Menu, Popover, Transition } from "@headlessui/react";
import { BellIcon, ChevronRightIcon, MenuIcon, SearchIcon, XIcon } from "@heroicons/react/outline";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { DropdownLanguage } from ".";
import navigationData from "../data/navigation.json";
import userNavigationData from "../data/user_navigation.json";
import { logout } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import { Button, ButtonGroup, FilledInput, Tooltip } from '@mui/material';
import { RiMenuLine } from "react-icons/ri";
import { TbRefresh } from "react-icons/tb";
import { MdArrowDropDown } from "react-icons/md";


function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const Navbar = ({ sidebarOpen, toggleSidebar }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <>
            <div>
                <Popover as="nav" className="border-b border-gray-200 bg-white">
                    {({ open }) => (
                        <>
                            <div className="flex mr-3">
                                <div className="w-[50px] text-center">
                                    <button className="h-full">
                                        <RiMenuLine className="text-danger w-[25px] h-[25px]" onClick={() => toggleSidebar(!sidebarOpen)} />
                                    </button>
                                </div>
                                <div className="flex-1 px-3 flex h-16 items-center justify-between">
                                    <div className="flex ">
                                        <div className="flex flex-shrink-0 items-center ">
                                            <Link to="dashboard" className="gap-[15px] flex">
                                                {/* <img
                                                    className="block h-8 w-auto"
                                                    src="/images/wareflex-logo-main.png"
                                                    alt="logo"
                                                /> */}
                                                <img
                                                    className="block h-8 w-auto"
                                                    src="/images/fsimage.png"
                                                    alt="logo"
                                                />
                                                <h6 className="text-[16px] items-center flex">RTT TMS</h6>
                                            </Link>
                                        </div>
                                        {/* <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-4">
                                            {navigationData.filter(i => !i.hidden).map((item) => {
                                                const current = location?.pathname.includes(item.href);
                                                return (
                                                    <Link
                                                        key={item.name}
                                                        to={item.href}
                                                        className={classNames(
                                                            current
                                                                ? "border-primary-500 text-gray-900"
                                                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                                            "inline-flex items-center border-b-2 px-1 pt-1 font-medium "
                                                        )}
                                                        aria-current={current ? "page" : undefined}
                                                    >
                                                        {t(item.name)}
                                                    </Link>
                                                );
                                            })}
                                        </div> */}
                                    </div>
                                    <div className="searchSection w-1/4 ">
                                        <div className="w-[24] relative flex items-center justify-center h-[40px]">
                                            <SearchIcon className="absolute h-6 w-6 mr-4 left-[8px] top-[10px] text-[#666]" aria-hidden="true" />
                                            <input type="search" placeholder="Search Dashboard" className="text-[#666] overflow-hidden rounded-[8px] h-[40px] pl-[40px] pr-3 flex-1 bg-transparent outline-none border-0 bg-[#f7f7f7] shadow focus:bg-[#fff] focus:shadow-2xl" />
                                        </div>
                                    </div>
                                    <div className="hidden space-x-3 sm:ml-6 sm:flex sm:items-center">
                                        <div className="border rounded-[6px] border-[#0000003b] flex relative">
                                            <Tooltip title={'Sync'} placement="bottom-start" arrow>

                                                <button className="p-[5px] border-0 h-[30px] w-[30px] outline-none transition-all duration-[400ms] overflow-hidden border-[#0000003b] hover:bg-[#f1f1f1]">
                                                    <TbRefresh className="m-auto"/>
                                                </button>
                                            </Tooltip>

                                            <Menu as="div" className="">
                                                <div>
                                                    <Tooltip title={'View app status'} placement="bottom-start" arrow>
                                                        {/* <button className="p-2 border-0 h-[30px] w-[30px] outline-none border-l transition-all duration-[400ms] overflow-hidden border-[#0000003b] hover:bg-[#f1f1f1]">
                                                        
                                                    </button> */}
                                                        <Menu.Button className="p-[5px] border-0 h-[30px] w-[30px] outline-none border-l transition-all duration-[400ms] overflow-hidden border-[#0000003b] hover:bg-[#f1f1f1]">
                                                            <MdArrowDropDown className="w-[20px] h-[20px]" />
                                                        </Menu.Button>
                                                    </Tooltip>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-200"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 mt-2 w-[250px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        <Menu.Item className="bg-primary-100 px-2 py-3 text-[12px]">
                                                            <p>Last Sync: 18 phút trước</p>
                                                        </Menu.Item>
                                                        {userNavigationData.map((item) => (
                                                            <Menu.Item key={item.name}>
                                                                {({ active }) =>
                                                                    item.onClick ? (
                                                                        <div
                                                                            className={classNames(
                                                                                active ? "bg-gray-100" : "",
                                                                                "text-gray-70 block cursor-pointer px-4 py-2"
                                                                            )}
                                                                            onClick={handleLogout}
                                                                        >
                                                                            {t(item.name)}
                                                                        </div>
                                                                    ) : (
                                                                        <Link
                                                                            to={item.href}
                                                                            className={classNames(
                                                                                active ? "bg-gray-100" : "",
                                                                                "flex items-center px-4 py-2 text-gray-700"
                                                                            )}
                                                                        >
                                                                            <TbRefresh />
                                                                            <span className="ml-2">

                                                                            {t(item.name)}
                                                                            </span>
                                                                        </Link>
                                                                    )
                                                                }
                                                            </Menu.Item>
                                                        ))}
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>

                                        </div>

                                        <DropdownLanguage />
                                        {/* <button
                                            type="button"
                                            className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                        >
                                            <BellIcon className="h-5 w-5" aria-hidden="true" />
                                        </button> */}

                                        {/* Profile dropdown */}
                                        <Menu as="div" className="relative z-10 ml-3">
                                            <div>
                                                <Menu.Button className="flex max-w-xs items-center gap-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 px-2">
                                                    <img
                                                        className="h-8 w-8 rounded-full"
                                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                        alt=""
                                                    />
                                                    {/* <span className="">{user?.fullName}</span> */}
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {userNavigationData.map((item) => (
                                                        <Menu.Item key={item.name}>
                                                            {({ active }) =>
                                                                item.onClick ? (
                                                                    <div
                                                                        className={classNames(
                                                                            active ? "bg-gray-100" : "",
                                                                            "text-gray-70 block cursor-pointer px-4 py-2"
                                                                        )}
                                                                        onClick={handleLogout}
                                                                    >
                                                                        {t(item.name)}
                                                                    </div>
                                                                ) : (
                                                                    <Link
                                                                        to={item.href}
                                                                        className={classNames(
                                                                            active ? "bg-gray-100" : "",
                                                                            "block px-4 py-2 text-gray-700"
                                                                        )}
                                                                    >
                                                                        {t(item.name)}
                                                                    </Link>
                                                                )
                                                            }
                                                        </Menu.Item>
                                                    ))}
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>

                                    <div className="-mr-2 flex items-center gap-2 sm:hidden">
                                        {/* Mobile menu button */}
                                        <DropdownLanguage />
                                        <button
                                            type="button"
                                            className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                        >
                                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                        <Popover.Button className="inline-flex items-center justify-center rounded-full bg-white p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                                            {open ? (
                                                <XIcon className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <MenuIcon
                                                    className="block h-6 w-6"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </Popover.Button>
                                    </div>
                                </div>
                            </div>

                            <Transition.Root as={Fragment}>
                                <div className="lg:hidden">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="duration-150 ease-out"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="duration-150 ease-in"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Popover.Overlay className="fixed inset-0 z-20 bg-black bg-opacity-25" />
                                    </Transition.Child>

                                    <Transition.Child
                                        as={Fragment}
                                        enter="duration-150 ease-out"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="duration-150 ease-in"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <Popover.Panel
                                            focus
                                            className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition"
                                        >
                                            {({ close }) => (
                                                <div className="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                                    <div className="pt-3 pb-2">
                                                        <div className="flex items-center justify-between px-4">
                                                            <div>
                                                                <img
                                                                    className="h-8 w-auto"
                                                                    src="/images/logo-color.svg"
                                                                    alt="logo"
                                                                />
                                                            </div>
                                                            <div className="-mr-2">
                                                                <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                                                                    <XIcon
                                                                        className="h-6 w-6"
                                                                        aria-hidden="true"
                                                                    />
                                                                </Popover.Button>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 space-y-1 px-2">
                                                            {navigationData.map((item) => {
                                                                const current =
                                                                    location?.pathname === item.href;
                                                                return (
                                                                    <Link
                                                                        key={item.name}
                                                                        to={item.href}
                                                                        onClick={() => close()}
                                                                        className={classNames(
                                                                            current
                                                                                ? "text-primary-500"
                                                                                : "border-transparent text-gray-900 hover:bg-gray-100 hover:text-gray-800",
                                                                            "block rounded-md px-3 py-2 text-base font-medium"
                                                                        )}
                                                                    >
                                                                        {t(item.name)}
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="pt-4 pb-2 ">
                                                        <div className="flex items-center px-5">
                                                            <div className="flex-shrink-0">
                                                                <img
                                                                    className="h-10 w-10 rounded-full"
                                                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div className="ml-3 min-w-0 flex-1">
                                                                <div className="truncate text-base font-light text-gray-800">
                                                                    {user.name}
                                                                </div>
                                                                <div className="truncate font-light text-gray-500">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                                            >
                                                                <BellIcon
                                                                    className="h-6 w-6"
                                                                    aria-hidden="true"
                                                                />
                                                            </button>
                                                        </div>
                                                        <div className="mt-3 space-y-1 px-2">
                                                            {userNavigationData.map((item) =>
                                                                item.onClick ? (
                                                                    <div
                                                                        key={item.name}
                                                                        onClick={() => dispatch(logout())}
                                                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                                                                    >
                                                                        {t(item.name)}
                                                                    </div>
                                                                ) : (
                                                                    <Link
                                                                        key={item.name}
                                                                        to={item.href}
                                                                        onClick={() => close()}
                                                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                                                                    >
                                                                        {t(item.name)}
                                                                    </Link>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Popover.Panel>
                                    </Transition.Child>
                                </div>
                            </Transition.Root>
                        </>
                    )}
                </Popover>
            </div>
        </>
    );
};

export default Navbar;
