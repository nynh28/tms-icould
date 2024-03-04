import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { AiOutlineExpandAlt } from "react-icons/ai";
import { IoFilterOutline } from "react-icons/io5";
// import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import GridLayout from "react-grid-layout";
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import PerfectScrollbar from "react-perfect-scrollbar";

import { Bar, Doughnut, Pie } from "react-chartjs-2";
import { dashboardJobWeek, vDashboard, dashBoardJobCompany, dashBoardJobCarrier } from "../api";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import "../themes/styles/home.css";
import { t } from "i18next";
import iconCarrier from "/images/icon/Icon-Carrier.svg";
import iconDriver from "/images/icon/Icon-Driver.svg";
import iconFleets from "/images/icon/Icon-Fleets.svg";
import iconTrucks from "/images/icon/Icon-Trucks.svg";
import { Breadcrumbs } from "../components";
import { HomeIcon } from "@heroicons/react/outline";
import { Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";
import FilterRightBar from "../components/FilterRightBar";
import FormDisplay from "../components/FormDisplay";
import RGL, { WidthProvider, Responsive } from "react-grid-layout";
import { useRef } from "react";
import { useCallback } from "react";
import { useLazyDashboardDeliveryOrderQuery, useLazyDashboardDeliveryOrderSiteDCQuery, useLazyDashboardShipmentQuery, useLazyDashboardTotalQuery, useLazyDashboardTruckQuery } from "../services/apiSlice";
import dayjs from "dayjs";
import FilterTimeDashboard from "../components/Dashboard/FilterApprovedShipment";
import LoadingLayout from "../components/Loading";
import { deliveryOrderStatus2, deliveryOrderStatusObject2, shipmentStatus, shipmentStatusObject } from "../constants/constants";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const ResponsiveGridLayout = WidthProvider(Responsive);

function throttle(f, delay) {
    let timer = 0;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => f.apply(this, args), delay);
    }
}

const _debounce = function (ms, fn) {
    var timer;
    return function () {
        clearTimeout(timer);
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this);
        timer = setTimeout(fn.bind.apply(fn, args), ms);
    };
};

export const Dashboard = () => {

    const [labels, setlabels] = useState();
    const [open, setOpen] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [dataChart, setdataChart] = useState();
    const [triggleFiter, setTriggleFiter] = useState(false)
    const [openFilter, setOpenFilter] = useState(false);
    const [typeFilter, setTypeFilter] = useState(0);
    const [filterShipment, setFilterShipment] = useState({
        dateFrom: dayjs().subtract(1, 'months'),
        dateTo: dayjs(),
    })
    const [filterDeliveryOrder, setFilterDeliveryOrder] = useState({
        dateFrom: dayjs().subtract(1, 'months'),
        dateTo: dayjs(),
    })
    const [filterDOBySite, setFilterDOBySite] = useState({
        dateFrom: dayjs().subtract(1, 'months'),
        dateTo: dayjs(),
    })

    const [fetchTotal, { data: dataTotal }] = useLazyDashboardTotalQuery()
    const [fetchShipment, { data: dataPlanStatus, isFetching: fetchingShipment, isSuccess: successShipment, isError: errorShipment }] = useLazyDashboardShipmentQuery()
    // const [fetchTruck, { data: dataTruck, isFetching: fetchingTruck, isSuccess: successTruck, isError: errorTruck }] = useLazyDashboardTruckQuery()
    const [fetchDeliveryOrder, { data: dataDO, isFetching: fetchingDeliveryOrder, isSuccess: successDeliveryOrder, isError: errorDeliveryOrder }] = useLazyDashboardDeliveryOrderQuery()
    const [fetchDeliveryOrderSiteDC, { data: dataDOSite, isFetching: fetchingDeliveryOrderSite, isSuccess: successDeliveryOrderSite, isError: errorDeliveryOrderSite }] = useLazyDashboardDeliveryOrderSiteDCQuery()

    useEffect(_ => {
        fetchTotal()
    }, [])

    const [height, setHeight] = useState(null)
    const [heightPie, setHeightPie] = useState(null)
    const [heightBar, setHeightBar] = useState(null)
    const dataTotalOrder = {
        labels: [t('Late Delivery'), t('on Time Delivery'), t('Unassign Delivery')],
        datasets: [
            {
                label: 'Count',
                data: Object.values(dataDO || {}),
                // borderColor: ["#BEBEBE", "#377EF0", "#14E21C"],
                backgroundColor: "#1f77b4",
                // pointBackgroundColor: "rgba(255,206,86,0.2)",
            },
        ],
    };


    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                title: {
                    display: false
                },
                grid: {
                    drawBorder: false,
                    color: 'rgba(24,123,200,.4)',
                    lineWidth: 0.5,

                },
                ticks: {
                    precision: 0,
                    maxTicksLimit: 8


                }
            },
            x: {

                position: 'right',
                title: {
                    display: false,
                    // text: 'Plan status',
                    // align: 'end'
                },
                grid: {
                    color: 'rgba(24,123,200,.4)',
                    drawBorder: false,
                    lineWidth: 2,
                    borderDashOffset: 1,
                    display: false,
                },
            }
        },
        plugins: {

            datalabels: {
                // formatter: (value, ctx) => {
                //     let sum = 0;
                //     let dataArr = ctx.chart.data.datasets[0].data;
                //     dataArr.map(data => {
                //         sum += data;
                //     });
                //     let percentage = (value*100 / sum).toFixed(2)+"%";
                //     return value;
                // },
                color: '#fff',
            },
            legend: {
                display: false
            }
        }
    };

    const onGenerateDataDoughnut = () => {
        if (dataPlanStatus) {
            let values = Object.keys(shipmentStatusObject).map(i => {

                return dataPlanStatus[i] ? dataPlanStatus[i] : 0
            })
            return values
        }
        return [0, 0, 0, 0, 0, 0, 0]

    }
    const onGenerateDataDoughnut2 = () => {
        if (dataDO) {
            // console.log(dataDO)
            let values = Object.keys(dataDO).map(i => {

                return dataDO[i] ? dataDO[i] : 0
            })
            // console.log(values)
            return values
        }
        return [0, 0, 0, 0, 0, 0]

    }

    const dataDoughnutPlanStatus = {
        labels: [...Object.values(shipmentStatusObject) || []],
        datasets: [
            {
                // label: 'Count',
                data: onGenerateDataDoughnut(),
                borderColor: [...shipmentStatus.map(i => i.color)],
                backgroundColor: [...shipmentStatus.map(i => i.color)],
                pointBackgroundColor: "rgba(255,206,86,0.2)",
            },
        ],
    }
    const dataDoughnutDOStatus = {
        labels: [...Object.values(deliveryOrderStatusObject2) || []],
        datasets: [
            {
                // label: 'Count',
                data: onGenerateDataDoughnut2(),
                borderColor: [...deliveryOrderStatus2.map(i => i.color)],
                backgroundColor: [...deliveryOrderStatus2.map(i => i.color)],
                pointBackgroundColor: "rgba(255,206,86,0.2)",
            },
        ],
    }

    const dataPieChart = {
        labels: Object.keys(dataDOSite || {}),
        datasets: [
            {
                data: Object.values(dataDOSite || {}),
                backgroundColor: "#1f77b4",
                // borderColor: ["#BEBEBE", "#377EF0", "#14E21C"],
                // backgroundColor: ["#BEBEBE", "#377EF0", "#14E21C"],
                // pointBackgroundColor: "rgba(255,206,86,0.2)",
            },
        ],
    }


    const optionsDoughnut = {
        plugins: {
            tooltip: {
                enabled: false,

                external: function (context) {
                    // Tooltip Element
                    // console.log(context)
                    // let color = context.tooltip.labelColors[0].backgroundColor
                    let tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';

                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    const tooltipModel = context.tooltip;
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = 0;
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        const titleLines = tooltipModel.title || [];
                        const bodyLines = tooltipModel.body.map(getBody);

                        // let innerHtml = '<thead>';

                        // titleLines.forEach(function(title) {
                        //     innerHtml += '<tr><th>' + title + '</th></tr>';
                        // });
                        // innerHtml += '</thead><tbody>';
                        var cover = document.createElement('div');

                        bodyLines.forEach(function (body, i) {
                            const colors = tooltipModel.labelColors[i];
                            // console.log(colors)
                            cover.className = `font-medium bg-[#fff] text-[#666] flex items-center justify-center gap-[5px] py-1 px-2 rounded overflow-hidden border shadow-sm border-[${colors.borderColor}]`;
                            const span = '<span class="w-[7px] h-[7px] rounded-full" style="background-color:' + colors.borderColor + '"></span>';
                            cover.innerHTML += span
                            cover.innerHTML += body
                            //     let style = 'background:' + '#fff';
                            //     style += '; border-color:' + colors.borderColor;
                            //     style += '; padding:' + '5px';
                            //     style += '; border-width: 2px';
                            //     innerHtml += '<tr><td>' + span + '</td></tr>';
                            // tooltipEl.appendChild(cover);
                        });
                        // innerHtml += '</tbody>';

                        // let tableRoot = tooltipEl.querySelector('div');
                        tooltipEl.innerHTML = (cover.outerHTML);
                    }

                    const position = context.chart.canvas.getBoundingClientRect();
                    const bodyFont = '12px';

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.fontSize = bodyFont;
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
                // callbacks: {
                //     labelTextColor: (i) => {'#999'}

                //     // afterLabel: tooltipItems => {
                //     //     console.log(tooltipItems)
                //     //     return 
                //     //   },
                //   },
                //   backgroundColor: '#FFF',
                //   titleFontSize: 16,
                //   labelColor: '#999',
                //   labelTextColor: '#999',
                //   titleFontColor: '#999',
                //   bodyFontColor: '#000',
                //   bodyFontSize: 14,
                //   displayColors: false
            },
            aspectRatio: 1,
            layout: {
                padding: {
                    left: 5,
                    right: 0,
                    top: 0,
                    bottom: 0,
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            datalabels: {
                formatter: (value, ctx) => {
                    let sum = 0;
                    let dataArr = ctx.chart.data.datasets[0].data;
                    dataArr.map(data => {
                        sum += data;
                    });
                    let percentage = (value * 100 / sum).toFixed(2);

                    return percentage > 0 ? percentage + '%' : '';
                },
                color: '#fff',
            },
            // htmlLegend: {
            //     // ID of the container to put the legend in
            //     containerID: 'legend-container',
            //   },
            //   legend: {
            //     display: false,
            //   }
            // cutoutPercentage: 60,
            legend: {
                display: false,
                // responsive: true,
                "position": "top",
                "align": "center",
                labels: {
                    boxWidth: 10,
                    //   padding: 40,
                    font: {
                        size: 11
                    },
                },
                // align: "center",
            },
        }
    };
    const optionsPie = {
        plugins: {
            tooltip: {
                enabled: false,

                external: function (context) {
                    // Tooltip Element
                    // console.log(context)
                    // let color = context.tooltip.labelColors[0].backgroundColor
                    let tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';

                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    const tooltipModel = context.tooltip;
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = 0;
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        const titleLines = tooltipModel.title || [];
                        const bodyLines = tooltipModel.body.map(getBody);

                        // let innerHtml = '<thead>';

                        // titleLines.forEach(function(title) {
                        //     innerHtml += '<tr><th>' + title + '</th></tr>';
                        // });
                        // innerHtml += '</thead><tbody>';
                        var cover = document.createElement('div');

                        bodyLines.forEach(function (body, i) {
                            const colors = tooltipModel.labelColors[i];
                            // console.log(colors)
                            cover.className = `bg-[#fff] text-[#666] flex items-center justify-center gap-[5px] p-2 rounded overflow-hidden border shadow-sm border-[${colors.borderColor}]`;
                            const span = '<span class="w-[7px] h-[7px] rounded-full" style="background-color:' + colors.borderColor + '"></span>';
                            cover.innerHTML += span
                            cover.innerHTML += body
                            //     let style = 'background:' + '#fff';
                            //     style += '; border-color:' + colors.borderColor;
                            //     style += '; padding:' + '5px';
                            //     style += '; border-width: 2px';
                            //     innerHtml += '<tr><td>' + span + '</td></tr>';
                            // tooltipEl.appendChild(cover);
                        });
                        // innerHtml += '</tbody>';

                        // let tableRoot = tooltipEl.querySelector('div');
                        tooltipEl.innerHTML = (cover.outerHTML);
                    }

                    const position = context.chart.canvas.getBoundingClientRect();
                    const bodyFont = '12px';

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.fontSize = bodyFont;
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
                // callbacks: {
                //     labelTextColor: (i) => {'#999'}

                //     // afterLabel: tooltipItems => {
                //     //     console.log(tooltipItems)
                //     //     return 
                //     //   },
                //   },
                //   backgroundColor: '#FFF',
                //   titleFontSize: 16,
                //   labelColor: '#999',
                //   labelTextColor: '#999',
                //   titleFontColor: '#999',
                //   bodyFontColor: '#000',
                //   bodyFontSize: 14,
                //   displayColors: false
            },
            aspectRatio: 1,
            layout: {
                padding: {
                    left: 5,
                    right: 0,
                    top: 0,
                    bottom: 0,
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            datalabels: {
                formatter: (value, ctx) => {
                    let sum = 0;
                    let dataArr = ctx.chart.data.datasets[0].data;
                    dataArr.map(data => {
                        sum += data;
                    });
                    let percentage = (value * 100 / sum).toFixed(2) + "%";
                    return value;
                },
                color: '#fff',
            },
            // cutoutPercentage: 60,
            legend: {
                display: true,
                responsive: true,
                position: "top",
                labels: {
                    boxWidth: 10,
                    //   padding: 40,
                    font: {
                        size: 11
                    },
                },
                // align: "center",
            },
        }
    };

    // const current = new Date();

    const [formData, setFormData] = useState({
        dateFrom: null,
        dateTo: null,
    });


    const getOrCreateLegendList = (chart, id) => {
        const legendContainer = document.getElementById(id);
        let listContainer = legendContainer.querySelector('ul');

        if (!listContainer) {
            listContainer = document.createElement('ul');
            listContainer.style.display = 'flex';
            listContainer.style.flexDirection = 'row';
            listContainer.style.whiteSpace = 'no-wrap'
            listContainer.style.margin = 0;
            listContainer.style.padding = 0;

            legendContainer.appendChild(listContainer);
        }

        return listContainer;
    };

    const htmlLegendPlugin = {
        id: 'htmlLegend',
        afterUpdate(chart) {
            const ul = getOrCreateLegendList(chart, 'js-legend');

            // Remove old legend items
            while (ul.firstChild) {
                ul.firstChild.remove();
            }

            // Reuse the built-in legendItems generator
            const items = chart.options.plugins.legend.labels.generateLabels(chart);

            items.forEach(item => {
                const li = document.createElement('li');
                li.style.alignItems = 'center';
                li.style.cursor = 'pointer';
                li.style.display = 'flex';
                li.style.flexDirection = 'row';
                li.style.marginLeft = '10px';

                li.onclick = () => {
                    const { type } = chart.config;
                    if (type === 'pie' || type === 'doughnut') {
                        // Pie and doughnut charts only have a single dataset and visibility is per item
                        chart.toggleDataVisibility(item.index);
                    } else {
                        chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                    }
                    chart.update();
                };

                // Color box
                const boxSpan = document.createElement('span');
                boxSpan.style.background = item.fillStyle;
                boxSpan.style.borderColor = item.strokeStyle;
                boxSpan.style.borderWidth = item.lineWidth + 'px';
                boxSpan.style.display = 'inline-block';
                boxSpan.style.flexShrink = 0;
                boxSpan.style.height = '13px';
                boxSpan.style.borderRadius = '4px';
                boxSpan.style.marginRight = '5px';
                boxSpan.style.width = '24px';

                // Text
                const textContainer = document.createElement('p');
                textContainer.style.color = item.fontColor;
                textContainer.style.margin = 0;
                textContainer.style.whiteSpace = 'nowrap'
                textContainer.style.padding = 0;
                textContainer.style.fontSize = '13px'
                textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

                const text = document.createTextNode(item.text);
                textContainer.appendChild(text);

                li.appendChild(boxSpan);
                li.appendChild(textContainer);
                ul.appendChild(li);
            });
        }
    };
    const htmlLegendPlugin1 = {
        id: 'htmlLegend',
        afterUpdate(chart) {
            const ul = getOrCreateLegendList(chart, 'js-legend1');

            // Remove old legend items
            while (ul.firstChild) {
                ul.firstChild.remove();
            }

            // Reuse the built-in legendItems generator
            const items = chart.options.plugins.legend.labels.generateLabels(chart);

            items.forEach(item => {
                const li = document.createElement('li');
                li.style.alignItems = 'center';
                li.style.cursor = 'pointer';
                li.style.display = 'flex';
                li.style.flexDirection = 'row';
                li.style.marginLeft = '10px';

                li.onclick = () => {
                    const { type } = chart.config;
                    if (type === 'pie' || type === 'doughnut') {
                        // Pie and doughnut charts only have a single dataset and visibility is per item
                        chart.toggleDataVisibility(item.index);
                    } else {
                        chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                    }
                    chart.update();
                };

                // Color box
                const boxSpan = document.createElement('span');
                boxSpan.style.background = item.fillStyle;
                boxSpan.style.borderColor = item.strokeStyle;
                boxSpan.style.borderWidth = item.lineWidth + 'px';
                boxSpan.style.display = 'inline-block';
                boxSpan.style.flexShrink = 0;
                boxSpan.style.height = '13px';
                boxSpan.style.borderRadius = '4px';
                boxSpan.style.marginRight = '5px';
                boxSpan.style.width = '24px';

                // Text
                const textContainer = document.createElement('p');
                textContainer.style.color = item.fontColor;
                textContainer.style.margin = 0;
                textContainer.style.whiteSpace = 'nowrap'
                textContainer.style.padding = 0;
                textContainer.style.fontSize = '13px'
                textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

                const text = document.createTextNode(item.text);
                textContainer.appendChild(text);

                li.appendChild(boxSpan);
                li.appendChild(textContainer);
                ul.appendChild(li);
            });
        }
    };


    const convertTime = (data) => {
        if (data.dateFrom && data.dateTo) {
            return { dateFrom: dayjs(data.dateFrom).startOf('date').format('YYYY-MM-DDTHH:mm:ss[Z]'), dateTo: dayjs(data.dateTo).endOf('date').format('YYYY-MM-DDTHH:mm:ss[Z]') }
        }
    }

    useEffect(_ => {
        if (filterShipment) {
            const formData = convertTime(filterShipment);
            fetchShipment(formData)
        }
    }, [filterShipment])
console.log('kt form data', formData);
    useEffect(_ => {
        if (filterDeliveryOrder) {
            const formData = convertTime(filterDeliveryOrder);
            fetchDeliveryOrder(formData)
        }
    }, [filterDeliveryOrder])

    useEffect(_ => {
        if (filterDOBySite) {
            const formData = convertTime(filterDOBySite);
            fetchDeliveryOrderSiteDC(formData)
        }
    }, [filterDOBySite])

    const updateFilter = (value) => {
        if (typeFilter == 1) {
            setFilterShipment(value)
        } else if (typeFilter == 2) {
            setFilterDOBySite(value)
            // return filterDeliveryOrder
        } else if (typeFilter == 3) {
            setFilterDeliveryOrder(value)
            // return filterDOBySite 
        } else {
            return
        }
        // setCriterias({ ...criterias, ...value });
    };

    const getFilterValue = () => {
        if (typeFilter == 1) {
            return filterShipment
        } else if (typeFilter == 2) {
            return filterDOBySite
        } else if (typeFilter == 3) {
            return filterDeliveryOrder
        }


        return {}
    }


    const elementRef = useCallback(node => {
        if (!node) return;
        const resizeObserver = new ResizeObserver(_debounce(100, function (muts) {
            // console.log(node.offsetWidth);
            const height = node.offsetHeight
            // console.log(height-10)
            setHeight(height - 20)
        }));
        resizeObserver.observe(node);
    }, []);

    const elementRefPie = useCallback(node => {
        if (!node) return;
        const resizeObserver = new ResizeObserver(_debounce(100, function (muts) {
            // console.log(node.offsetWidth);
            const height = node.offsetHeight
            // console.log(height-10)
            setHeightPie(height - 20)
        }));
        resizeObserver.observe(node);
    }, []);

    const elementRefBar = useCallback(node => {
        if (!node) return;
        const resizeObserver = new ResizeObserver(_debounce(100, function (muts) {
            // console.log(node.offsetWidth);
            const height = node.offsetHeight
            // console.log(height)
            // console.log(height-10)
            setHeightBar(height - 10)
        }));
        resizeObserver.observe(node);
    }, []);


    // useEffect(() => {
    //     console.log("updated", tag?.current?.clientWidth);
    //   }, [elementRef]);

    const filterProp = {
        filter: getFilterValue()
    }

    return (
        <>
            {/* <Breadcrumbs /> 
             */}
            <div className="bg-white">
                <div className="py-3 border-b px-3 flex justify-between">
                    <div className=" text-[16px] font-light  hover:text-gray-700 capitalize">
                        Dashboard
                    </div>
                    <div>
                        <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    </div>
                </div>
            </div>

            <div className="h-[calc(100vh_-_110px)] lg:mx-auto overflow-auto lg:max-w-full">
                <div className="grid-rows-1 grid grid-flow-col p-[10px] gap-3">
                    <Link to={"truck"} className="text-decoration-none">
                        <Card className="bg-white rounded overflow-hidden p-3 flex flex-col items-center">
                            <div className="text-[18px] mb-3">Total Truck</div>
                            <Typography variant="h6">{dataTotal?.numberTruck || '-'}</Typography>
                        </Card>
                    </Link>
                    <Link to={"drive"} className="text-decoration-none">
                        <Card className="bg-white  rounded overflow-hidden p-3 flex flex-col items-center">
                            <div className="text-[18px] mb-3">Total Driver</div>
                            <Typography variant="h6">{dataTotal?.numberDriver || '-'}</Typography>
                        </Card>
                    </Link>
                    <Link to={"staff"} className="text-decoration-none">
                        <Card className="bg-white  rounded overflow-hidden p-3 flex flex-col items-center">
                            <div className="text-[18px] mb-3">Total Staff</div>
                            <Typography variant="h6">{dataTotal?.numberStaff || '-'}</Typography>
                        </Card>
                    </Link>
                    <Link to={"DC"} className="text-decoration-none">
                        <Card className="bg-white  rounded overflow-hidden p-3 flex flex-col items-center">
                            <div className="text-[18px] mb-3">Total DC</div>
                            <Typography variant="h6">{dataTotal?.numberIdSite || '-'}</Typography>
                        </Card>
                    </Link>
                </div>
                <ResponsiveGridLayout
                    className="layout"
                    rowHeight={100}
                    draggableHandle=".react-grid-dragHandleExample"
                    breakpoints={{ lg: '100%', md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 12, sm: 12, xs: 4, xxs: 2 }}
                >
                    <div className="" key="1" data-grid={{ x: 0, y: 0, w: 6, h: 3, }}>
                        <Card className="flex-1 h-full">
                            <CardContent className="p-0 h-full flex flex-col relative">
                                {fetchingShipment && <LoadingLayout />}
                                <div className="header flex items-center justify-between border-b py-2 px-3 relative">
                                    <span className="react-grid-dragHandleExample absolute top-0 left-0 right-0 bottom-0" ></span>
                                    <div className="title text-[18px] z-10">
                                        Dash: Shipment Status
                                    </div>
                                    <div className="action flex items-center gap-[8px] z-10">
                                        {/* <button className="btn-primary py-[6px] px-3 rounded-[7px] bg-primary-900 text-[13px] text-white">+ Add</button> */}
                                        <Divider orientation="vertical" flexItem variant="middle" />
                                        &nbsp;
                                        <button onClick={() => { setOpenFilter(true); setTypeFilter(1) }} >

                                            <IoFilterOutline className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                        </button>
                                        <AiOutlineExpandAlt className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="content flex-1 p- overflow-hidden" >
                                    <div className="flex h-full flex-col gap-[10px] justify-between items-center overflow-hidden">
                                        <div className="mb-1">

                                            {/* <ul className=" home-2--title-chart pt-0  gap-[10px]">
                                                <li className="flex justify-between"><span><i></i>{t("Late")}</span><span className="">({dataPlanStatus?.numberLateShipment})</span></li>
                                                <li className="bg-white flex justify-between"><span><i></i>{t("On Time")}</span><span className="">({dataPlanStatus?.numberOnTimeShipment})</span></li>
                                                <li className="flex justify-between"><span><i></i>{t("Unassign")}</span><span className="">({dataPlanStatus?.numberUnassignedShipment})</span></li>
                                                <li className="flex justify-between"><span><i></i>{t("Late")}</span><span className="">({dataPlanStatus?.numberLateShipment})</span></li>
                                                <li className="bg-white flex justify-between"><span><i></i>{t("On Time")}</span><span className="">({dataPlanStatus?.numberOnTimeShipment})</span></li>
                                                <li className="flex justify-between"><span><i></i>{t("Unassign")}</span><span className="">({dataPlanStatus?.numberUnassignedShipment})</span></li>
                                                <li className="flex justify-between"><span><i></i>{t("Late")}</span><span className="">({dataPlanStatus?.numberLateShipment})</span></li>
                                                <li className="bg-white flex justify-between"><span><i></i>{t("On Time")}</span><span className="">({dataPlanStatus?.numberOnTimeShipment})</span></li>
                                                <li className="flex justify-between"><span><i></i>{t("Unassign")}</span><span className="">({dataPlanStatus?.numberUnassignedShipment})</span></li>
                                            </ul> */}
                                        </div>
                                        {/* <PerfectScrollbar> */}
                                        <div id='js-legend' className="w-full overflow-auto px-2"></div>
                                        {/* </PerfectScrollbar> */}
                                        <div className="flex-1 w-full overflow-hidden" ref={elementRef}>
                                            <div className="m-auto" style={{ width: height + "px" }}>

                                                {successShipment && <Doughnut plugins={[ChartDataLabels, htmlLegendPlugin]} data={dataDoughnutPlanStatus} options={optionsDoughnut} />}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="" key="2" data-grid={{ x: 6, y: 0, w: 6, h: 3 }}>
                        <Card className="flex-1 h-full">
                            <CardContent className="p-0 h-full flex flex-col">
                                {fetchingDeliveryOrderSite && <LoadingLayout />}
                                <div className="header flex items-center justify-between border-b py-2 px-3 relative">
                                    <span className="react-grid-dragHandleExample absolute top-0 left-0 right-0 bottom-0" ></span>
                                    <div className="title text-[18px] z-10">
                                        Dash: Delivery Order Status
                                    </div>
                                    <div className="action flex items-center gap-[8px] z-10">
                                        {/* <button className="btn-primary py-[6px] px-3 rounded-[7px] bg-primary-900 text-[13px] text-white">+ Add</button> */}
                                        <Divider orientation="vertical" flexItem variant="middle" />
                                        &nbsp;
                                        <button onClick={() => { setOpenFilter(true); setTypeFilter(2) }} >

                                            <IoFilterOutline className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                        </button>
                                        <AiOutlineExpandAlt className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="content flex-1 p- overflow-hidden" >
                                    <div className="flex h-full flex-col gap-[10px] justify-between items-center overflow-hidden">
                                        <div className="mb-1">
                                            <ul className=" home-2--title-chart pt-0 flex gap-[10px]">
                                                {/* <li className="bg-white flex justify-between"><span><i></i>{t("On Time")}</span><span className="hidden">{dataHome2.numberUnassignedJob} {t('order')}</span></li>
                                                <li className="flex justify-between"><span><i></i>{t("Late")}</span><span className="hidden">{dataHome2.numberAssignedJob} {t('order')}</span></li>
                                                <li className="flex justify-between"><span><i></i>{t("Unassign")}</span><span className="hidden">{dataHome2.numberCompletedJob} {t('order')}</span></li> */}
                                            </ul>
                                        </div>
                                        <div id='js-legend1' className="w-full overflow-auto px-2"></div>
                                        <div className="flex-1 w-full overflow-hidden" ref={elementRefPie}>
                                            <div className="m-auto" style={{ width: heightPie + 'px' }}>
                                                {successDeliveryOrder && <Doughnut plugins={[ChartDataLabels, htmlLegendPlugin1]} data={dataDoughnutDOStatus} options={optionsDoughnut} />}

                                                {/* {successDeliveryOrder && <Pie plugins={[ChartDataLabels]} options={optionsPie} data={dataDoughnutDOStatus} />} */}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="" key="3" data-grid={{ x: 0, y: 1, w: 6, h: 3 }}>
                        <Card className="flex-1 h-full">
                            <CardContent className="p-0 h-full flex flex-col">
                                {fetchingDeliveryOrder && <LoadingLayout />}
                                <div className="header flex items-center justify-between border-b py-2 px-3 relative">
                                    <span className="react-grid-dragHandleExample absolute top-0 left-0 right-0 bottom-0" ></span>
                                    <div className="title text-[18px] z-10">
                                        Dash: Total Shipment
                                    </div>
                                    <div className="action flex items-center gap-[8px] z-10">
                                        {/* <button className="btn-primary py-[6px] px-3 rounded-[7px] bg-primary-900 text-[13px] text-white">+ Add</button> */}
                                        <Divider orientation="vertical" flexItem variant="middle" />
                                        &nbsp;
                                        <button onClick={() => { setOpenFilter(true); setTypeFilter(3) }} >

                                            <IoFilterOutline className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                        </button>
                                        <AiOutlineExpandAlt className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="content flex-1 p- overflow-hidden" >
                                    <div className="flex h-full flex-col gap-[10px] justify-between items-center overflow-hidden">
                                        <div className="mb-2">
                                            {/* <ul className=" home-2--title-chart pt-0 flex gap-[10px]">
                                                <li className="bg-white flex justify-between"><span><i></i>{t("On Time")}</span><span className="hidden">{dataHome2.numberUnassignedJob} {t('order')}</span></li>
                                                <li className="flex justify-between"><span><i></i>{t("Late")}</span><span className="hidden">{dataHome2.numberAssignedJob} {t('order')}</span></li>
                                                <li className="flex justify-between"><span><i></i>{t("Unassign")}</span><span className="hidden">{dataHome2.numberCompletedJob} {t('order')}</span></li>
                                            </ul> */}
                                        </div>
                                        <div className="flex-1 px-2 w-full overflow-hidden" ref={elementRefBar}>
                                            <div className="m-auto" style={{ height: heightBar + 'px' }} >
                                                {successDeliveryOrder && <Bar plugins={[ChartDataLabels]} options={options} data={dataDoughnutPlanStatus} />}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="" key="4" data-grid={{ x: 7, y: 1, w: 6, h: 3 }}>
                        <Card className="flex-1 h-full">
                            <CardContent className="p-0 h-full flex flex-col">
                                {fetchingDeliveryOrder && <LoadingLayout />}
                                <div className="header flex items-center justify-between border-b py-2 px-3 relative">
                                    <span className="react-grid-dragHandleExample absolute top-0 left-0 right-0 bottom-0" ></span>
                                    <div className="title text-[18px] z-10">
                                        Dash: Total Order
                                    </div>
                                    <div className="action flex items-center gap-[8px] z-10">
                                        {/* <button className="btn-primary py-[6px] px-3 rounded-[7px] bg-primary-900 text-[13px] text-white">+ Add</button> */}
                                        <Divider orientation="vertical" flexItem variant="middle" />
                                        &nbsp;
                                        <button onClick={() => { setOpenFilter(true); setTypeFilter(3) }} >

                                            <IoFilterOutline className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                        </button>
                                        <AiOutlineExpandAlt className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="content flex-1 p- overflow-hidden" >
                                    <div className="flex h-full flex-col gap-[10px] justify-between items-center overflow-hidden">
                                        <div className="mb-2">
                                            {/* <ul className=" home-2--title-chart pt-0 flex gap-[10px]">
                                                <li className="bg-white flex justify-between"><span><i></i>{t("On Time")}</span><span className="hidden">{dataHome2.numberUnassignedJob} {t('order')}</span></li>
                                                <li className="flex justify-between"><span><i></i>{t("Late")}</span><span className="hidden">{dataHome2.numberAssignedJob} {t('order')}</span></li>
                                                <li className="flex justify-between"><span><i></i>{t("Unassign")}</span><span className="hidden">{dataHome2.numberCompletedJob} {t('order')}</span></li>
                                            </ul> */}
                                        </div>
                                        <div className="flex-1 px-2 w-full overflow-hidden" ref={elementRefBar}>
                                            <div className="m-auto" style={{ height: heightBar + 'px' }} >
                                                {successDeliveryOrder && <Bar plugins={[ChartDataLabels]} options={options} data={dataDoughnutDOStatus} />}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>



                </ResponsiveGridLayout>

            </div>


            <FilterRightBar open={openFilter} setOpen={setOpenFilter} triggleFiter={triggleFiter} setTriggleFiter={setTriggleFiter}>
                <FilterTimeDashboard {...filterProp} setFilter={updateFilter} triggleFiter={triggleFiter} setTriggleFiter={setTriggleFiter} />
            </FilterRightBar>
            <FormDisplay open={openForm} setOpen={setOpenForm} >
            </FormDisplay>

        </>
    );
};

export default Dashboard;
