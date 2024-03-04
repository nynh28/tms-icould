import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    CalendarIcon,
    ChartBarIcon,
    FolderIcon,
    HomeIcon,
    InboxIcon,
    MenuIcon,
    SortAscendingIcon,
    UsersIcon,
    XIcon,
} from "@heroicons/react/outline";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Collapse, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Tooltip } from "@mui/material";
import { FaCog, FaInfoCircle, FaTruckLoading, FaCommentDollar, FaBox, FaChartLine, FaMapMarkerAlt, FaTruck, FaRegPaperPlane, FaMapMarkedAlt, FaThLarge, FaUser, FaClipboardCheck } from "react-icons/fa";
import { HiOutlineDocumentReport, HiOutlineUserGroup } from "react-icons/hi";
import { TbCurrentLocation } from "react-icons/tb";
import { FaChevronRight } from "react-icons/fa";
import PerfectScrollbar from "react-perfect-scrollbar";

const navigation = [
    { name: "Dashboard", href: "dashboard", icon: FaChartLine, current: false },
    // { name: "Planning", href: "planning", icon: FaTruck, current: false },
    { name: "Delivery Order", href: "unassign-do", icon: FaTruck, current: false },
    // { name: "Map Job Ship DO", href: "map-job", icon: FaMapMarkedAlt, current: false },
    { name: "Tracking Shipment Order", href: "tracking-shipment", icon: FaMapMarkedAlt, current: false },
    // { name: "Working", href: "working", icon: HomeIcon, current: false },
    // { name: "Check In", href: "checkin", icon: FaMapMarkerAlt, current: false },
    // { name: "Shipment Order Job", href: "shipment-order-job", icon: FaTruck, current: false },
    { name: "Approved Shipment", href: "approved-shipment", icon: FaRegPaperPlane, current: false },
    { name: "Closed Shipment", href: "closed-shipment", icon: FaClipboardCheck, current: false },
    // { name: "Staff", href: "staff", icon: HiOutlineUserGroup, current: false },
    { name: "Expense", href: "expense", icon: FaCommentDollar, current: false },
    {
        name: "Reports", href: "reports", icon: HiOutlineDocumentReport, current: false, children: [
            { name: "Shipment", href: "shipment", icon: HiOutlineDocumentReport, current: false },
            { name: "Staff", href: "staff" },
            { name: "Expenses", href: "expen-report" },
        ]
    },
    // { name: "Delivery Type (1010)", href: "delivery-type", icon: FaTruckLoading, current: false },
    { name: "Site Location", href: "site-location", icon: TbCurrentLocation, current: false },
    { name: "User", href: "user", icon: FaUser, current: false },
    {
        name: "Master Data", href: "master-data", icon: FaCog, current: false, children: [
            { name: "Driver", href: "driver" },
            { name: "Truck", href: "truck" },
            // {name : "Truck Type", href: "master-data/truck-type"},
            // {name: "Delivery Status", href: "master-data/delivery-status"},
            { name: "IDSender", href: "sender" },
            { name: "IDPickup", href: "pickup" },
            { name: "Area", href: "area" },
            { name: "Document Type", href: "document-type" },
            { name: "Delivery Type", href: "delivery-type" },
            { name: "Type Of Cargo", href: "type-of-cargo" },
            { name: "Unit", href: "unit" },
            { name: "Calculation Order", href: "calculation-order" },
            { name: "Staff", href: "staff" },
            { name: "Delivery Ship To", href: "delivery-ship-to" },
            { name: "Company", href: "company" },
            { name: "Truck Type", href: "truck-type" },
            { name: "Role", href: "role" },

        ]
    },
    // { name: "Delivery Order", href: "#", icon: FolderIcon, current: false },
    // { name: "Shipment Tracking", href: "order-tracking", icon: InboxIcon, current: false },
    // { name: "Reports", href: "report", icon: ChartBarIcon, current: false },
];

const toggleSideBar = (e) => {
    console.log(e)

    // let openSub = document.getElementsByClassName('sub-sidebar')
    let submenu = e.target.nextSibling
    // console.log(submenu, submenu.className)
    if (submenu) {

        if (submenu.className.includes('h-auto')) {
            submenu.className = submenu.className.replace('h-auto', 'h-[0]')
        } else {
            submenu.className = submenu.className.replace('h-[0]', 'h-auto')
        }

    }
}

const secondNavigation = [
    { name: "About", href: "about", icon: FaInfoCircle, current: false },
    { name: "App Gallery", href: "gallery", icon: FaThLarge, current: false },

]


function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const Sidebar = ({ sidebarOpen }) => {
    const location = useLocation();
    const { t } = useTranslation();
    const [showSub, setShowSub] = useState('')
    // const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        // <Collapse>
        <div className="h-full overflow-x-hidden">
            <PerfectScrollbar>
                {/* <List  sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {navigation.map((item, index) => {
                                            const current = location.pathname.includes(item.href);

                    return (
                        <ListItemButton>
                        <ListItemIcon>
                        <item.icon className={(current ? 'text-primary-900 bg-primary-100' : 'text-[#0000008a]'  ) +" w-[21px] h-[21px] min-w-[21px] z-10"}></item.icon>
                        </ListItemIcon>
                        <ListItemText primary="Sent mail" />
                      </ListItemButton>
                    )
                })}
            </List> */}
                <ul className="h-full overflow-x-hidden">
                    {navigation.map((item, index) => {
                        // console.log(location.pathname.includes(item.href), item.href, location.pathname)
                        const current = location.pathname.includes(item.href);
                        return (
                            <li className="relative" key={index}>
                                <Tooltip title={item.name} placement="right-start" arrow>
                                    <>
                                        <Link className={classNames(
                                            "text-center px-2 flex py-2 rounded-2xl cursor-pointer ",
                                            current
                                                ? "bg-primary-100 text-primary-900"
                                                : "hover:bg-primary-100 hover:text-primary-900",
                                        )} to={item.href}
                                            onClick={(e) => {
                                                if (showSub == item.href) {
                                                    setShowSub('')
                                                } else {
                                                    setShowSub(item.href)

                                                }}}>
                                        <item.icon className={(current ? 'text-primary-900 bg-primary-100' : 'text-[#0000008a]'  ) +" w-[21px] h-[21px] min-w-[21px] z-10"}></item.icon>
                                        <span className="ml-2 whitespace-nowrap">
                                            {item.name}
                                        </span>
                                    </Link>
                                    {item.children && (
                                        <span className="absolute top-[9px] text-primary-600 right-[10px] pl-[40px] z-1" onClick={(e) => {
                                            if (showSub == item.href) {
                                                setShowSub('')
                                            } else {
                                                setShowSub(item.href)

                                            }
                                            // toggleSideBar(e)
                                        }}>
                                            <FaChevronRight className={(showSub == item.href ? 'rotate-90' : 'rotate-0') + " origin-center w-4 h-4 transition-all cursor-pointer"} />
                                            {/* {(showSub ? <FaChevronRight className={showSub && 'rotate-45 '+" origin-center w-5 h-5 transition-all"} onClick={() => setShowSub(!showSub)}/> : <UsersIcon className="w-5 h-5" onClick={() => setShowSub(true)}/>)} */}
                                        </span>
                                    )}
                                </>
                            </Tooltip>
                                {
                            item.children && (
                                <ul className={(showSub == item.href ? 'h-auto' : 'h-[0]') + " sub-sidebar transition-all duration-[500ms] overflow-hidden"}>
                                    {item.children.map((sub, subIndex) => {
                                        const listPath = location.pathname.split('/')
                                        const currentSub = listPath.includes(sub.href);
                                        return (
                                            <li key={subIndex}>
                                                <Tooltip title={sub.name} placement="right-start" arrow>
                                                    <Link className={classNames(
                                                        "text-center px-2 ml-[35px] text-[13px] flex py-2 rounded-2xl cursor-pointer ",
                                                        currentSub
                                                            ? "bg-primary-100 text-primary-900"
                                                            : "hover:bg-primary-100 hover:text-primary-900",
                                                    )} to={item.href + "/" + sub.href}>
                                                        <span className="ml-2 whitespace-nowrap">
                                                            {sub.name}
                                                        </span>
                                                    </Link>
                                                </Tooltip>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )
                        }
                            </li>
                )
                    })}
            </ul>
        </PerfectScrollbar>
            {
        secondNavigation && secondNavigation.length > 100 && (
            <>
                <Divider className="mb-2 mt-2" />
                <ul className="overflow-hidden">
                    {secondNavigation.map((item, index) => {
                        // console.log(location.pathname.includes(item.href), item.href, location.pathname)
                        const current = location.pathname.includes(item.href);
                        return (
                            <li key={index}>
                                <Tooltip title={'item.name'} placement="right-start" arrow>

                                    <Link className={classNames(
                                        "text-center px-2 flex mb-2  py-2 rounded-2xl cursor-pointer ",
                                        current
                                            ? "bg-primary-100 text-primary-900"
                                            : "hover:bg-primary-100 hover:text-primary-900",
                                    )} to={item.href}>
                                        <item.icon className="w-[21px] h-[21px] min-w-[21px] text-[#0000008a]"></item.icon>
                                        <span className="ml-3 whitespace-nowrap">
                                            {item.name}
                                        </span>
                                    </Link>
                                </Tooltip>
                            </li>
                        )
                    })}
                </ul>
            </>
        )
    }
        </div >
        // </div>
        // </Collapse>
    );
};

export default Sidebar;
