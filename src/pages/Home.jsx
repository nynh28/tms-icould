import React, { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    BellIcon,
    CogIcon,
    CreditCardIcon,
    FlagIcon,
    LinkIcon,
    UsersIcon,
    LocationMarkerIcon,
    StarIcon,
} from "@heroicons/react/outline";
import { FiUser } from "react-icons/fi";
import { BsTruck } from "react-icons/bs";
import { BiBarChartSquare } from "react-icons/bi";
import { HiUserGroup } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ROLES } from "../constants/constants";
import { Divider } from "@mui/material";

const navigation = [
    // { name: "profile", href: "profile", icon: FiUser },
    // { name: "settings", href: "#!", icon: CogIcon },
    // {
    //   name: "notification",
    //   href: "#!",
    //   icon: BellIcon,
    // },
    // {
    //   name: "paymentOfServices",
    //   href: "#!",
    //   icon: CreditCardIcon,
    // },
    // { name: "language", href: "#!", icon: FlagIcon },
    // { name: "link", href: "#!", icon: LinkIcon },
    {
        name: "dashboard",
        href: "dashboard",
        icon: BiBarChartSquare,
        role: [ROLES.Carrier, ROLES.Admin],
    },

    { name: "Company", href: "companys", icon: UsersIcon, role: [ROLES.Admin] },
    {
        name: "Site DC Management",
        href: "branch",
        icon: UsersIcon,
        role: [ROLES.Company, ROLES.Admin],
    },
    {
        name: "User Management",
        href: "user",
        icon: UsersIcon,
        role: [ROLES.Company, ROLES.Admin],
    },
    {
        name: "Role Management",
        href: "user",
        icon: UsersIcon,
        role: [ROLES.Company, ROLES.Admin],
    },
];
const secondaryNavigation = [

    {
        name: "masterData",
        href: "master-data",
        icon: BsTruck,
        role: [ROLES.Carrier, ROLES.Admin, ROLES.Company],
        children: [
            {
                name: "trucks",
                href: "trucks",
                icon: BsTruck,
                role: [ROLES.Carrier, ROLES.Admin, ROLES.Company],
            }, 
            {
                name: "Car characteristics",
                href: "type",
                icon: BsTruck,
                role: [ROLES.Carrier, ROLES.Admin, ROLES.Company],
            }, 
            {
                name: "drivers",
                href: "drivers",
                icon: FiUser,
                role: [ROLES.Carrier, ROLES.Admin, ROLES.Company],
            },
            {
                name: "Staff",
                href: "staff",
                icon: UsersIcon,
                role: [ROLES.Company, ROLES.Admin],
            },
            {
                name: "Delivery Status",
                href: "delivery-status",
                icon: UsersIcon,
                role: [ROLES.Company, ROLES.Admin],
            },
            {
                name: "Delivery Type",
                href: "delivery-type",
                icon: UsersIcon,
                role: [ROLES.Company, ROLES.Admin],
            },
            {
                name: "Document Type",
                href: "document-type",
                icon: UsersIcon,
                role: [ROLES.Company, ROLES.Admin],
            },
            {
                name: "ID Pickup",
                href: "pickup",
                icon: UsersIcon,
                role: [ROLES.Company, ROLES.Admin],
            },
            {
                name: "ID Sender",
                href: "sender",
                icon: UsersIcon,
                role: [ROLES.Company, ROLES.Admin],
            },
            {
                name: "ID Area",
                href: "area",
                icon: UsersIcon,
                role: [ROLES.Company, ROLES.Admin],
            },
            {
                name: "Type of Cargo",
                href: "area",
                icon: UsersIcon,
                role: [ROLES.Company, ROLES.Admin],
            },
            {
                name: "Unit",
                href: "area",
                icon: UsersIcon,
                role: [ROLES.Company, ROLES.Admin],
            },
        ]
    },

    //   {
    //     name: "Staff",
    //     href: "staff",
    //     icon: UsersIcon,
    //     role: [ROLES.Company, ROLES.Admin],
    //   },
    //   {
    //     name: "Delivery Status",
    //     href: "delivery-status",
    //     icon: UsersIcon,
    //     role: [ROLES.Company, ROLES.Admin],
    //   },
    //   {
    //     name: "Delivery Type",
    //     href: "delivery-type",
    //     icon: UsersIcon,
    //     role: [ROLES.Company, ROLES.Admin],
    //   },
    //   {
    //     name: "Document Type",
    //     href: "document-type",
    //     icon: UsersIcon,
    //     role: [ROLES.Company, ROLES.Admin],
    //   },
    //   {
    //     name: "ID Pickup",
    //     href: "pickup",
    //     icon: UsersIcon,
    //     role: [ROLES.Company, ROLES.Admin],
    //   },
    //   {
    //     name: "ID Sender",
    //     href: "sender",
    //     icon: UsersIcon,
    //     role: [ROLES.Company, ROLES.Admin],
    //   },
    //   {
    //     name: "ID Site DC",
    //     href: "site",
    //     icon: UsersIcon,
    //     role: [ROLES.Company, ROLES.Admin],
    //   },
    // {
    //   name: "salesOrder",
    //   href: "sales-order",
    //   icon: UsersIcon,
    //   role: [ROLES.Company, ROLES.Admin, ROLES.Carrier],
    // },
    // {
    //   name: "customers",
    //   href: "customers",
    //   icon: UsersIcon,
    //   role: [ROLES.Company, ROLES.Admin, ROLES.Carrier],
    // },
    // {
    //   name: "devices",
    //   href: "devices",
    //   icon: UsersIcon,
    //   role: [ROLES.Company, ROLES.Admin, ROLES.Carrier],
    // },
    // {
    //   name: "areas",
    //   href: "areas",
    //   icon: UsersIcon,
    //   role: [ROLES.Company, ROLES.Carrier],
    // },

    // {
    //   name: "chargeFee",
    //   href: "charge-fee",
    //   icon: UsersIcon,
    //   role: [ROLES.Company, ROLES.Carrier],
    // },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const Home = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const role = user?.role;

    return (
        <>
            <div className="flex h-full">
                {/* <nav
                    className="w-80 flex-shrink-0 overflow-y-auto"
                    aria-label="Sidebar"
                >
                    <div className="">
                        <div className="space-y-1 px-2">
                            {navigation.map((item, index) => {
                                const current = "/home/" + item.href === location.pathname;
                                return (
                                    <Link
                                        key={index}
                                        to={item.href}
                                        className={classNames(
                                            current
                                                ? "bg-white text-primary-500"
                                                : "hover:bg-white hover:text-primary-500",
                                            "group flex items-center rounded-md px-2 py-2 text-base"
                                        )}
                                        aria-current={item.current ? "page" : undefined}
                                    >
                                        <item.icon
                                            className={classNames(
                                                item.current
                                                    ? "text-primary-500"
                                                    : "text-gray-400 group-hover:text-primary-500",
                                                "mr-4 h-6 w-6 flex-shrink-0"
                                            )}
                                            aria-hidden="true"
                                        />
                                        {t(item.name)}

                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <Divider className="w-[90%] m-auto py-1" />
                    <div className="space-y-1 px-2">
                        {secondaryNavigation
                            .filter((x) => x.role.indexOf(role) > -1)
                            .map((item, index) => {
                                const current = "/home/" + item.href === location.pathname;
                                return (
                                    <div key={index + 1}>
                                        <Link
                                            to={item.href}
                                            className={classNames(
                                                current ? "bg-white text-primary-500" : "",
                                                "group flex items-center rounded-md px-2 py-2 text-base hover:bg-white hover:text-primary-500"
                                            )}
                                        >
                                            <item.icon
                                                className={classNames(
                                                    current
                                                        ? "text-primary-500"
                                                        : "text-gray-400 group-hover:text-primary-500",
                                                    "mr-2 h-5 w-5 flex-shrink-0"
                                                )}
                                                aria-hidden="true"
                                            />
                                            {t(item.name)}
                                        </Link>
                                        {item.children && (
                                            <div className="pl-[30px]">
                                                {item.children.map((subItem, subIndex) => {
                                                    const currentSub = "/home/" + subItem.href === location.pathname;

                                                    return (
                                                        <Link
                                                            key={index + '_' + subIndex}
                                                            to={subItem.href}
                                                            className={classNames(
                                                                currentSub
                                                                    ? "bg-white text-primary-500"
                                                                    : "hover:bg-white hover:text-primary-500",
                                                                "group flex items-center rounded-md px-2 py-2 text-base"
                                                            )}
                                                        >
                                                            {t(subItem.name)} {currentSub}
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>

                </nav> */}
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default Home;
