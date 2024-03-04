import react, { useEffect, useState } from "react";
import { CustomAsyncSelect } from "..";
import { useTranslation } from "react-i18next";
import { FormControl, InputLabel, MenuItem, TextField } from "@mui/material";
import CustomSelect from "../FormField/CustomSelect";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import { DesktopDatePicker, DatePicker } from "@mui/x-date-pickers";
import CustomDateField from "../FormField/CustomDateField";
import { useForm } from "react-hook-form";
import CustomTextField from "../FormField/CustomTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetTruckTypeQuery } from "../../services/apiSlice";
import MultipleSelectCheckbox from "../FormField/MultipleSelectCheckbox";
import { useSelector } from "react-redux";
import CustomDateTimeField from "../FormField/CustomDateTimeField";

const FilterDashboardTime = ({ setFilter, triggleFiter, setTriggleFiter }) => {
    const { t } = useTranslation();

    const [selfFilter, setSelfFilter] = useState({shipmentId: '', shipmentStatus: [], truckId: '', driverId:'', dateFrom:0, dateTo: 0})
    const schema = yup.object().shape({ 
        // dateFrom: yup.date().default(() => new Date()),
        dateTo: yup
        .date()
        .when(
            "createdFrom",
            (dateTo, schema) => dateTo && schema.min(dateTo, 'From date must greater or equal To date')),
    })
    useEffect(_ => {
        // alert( triggleFiter)
        if(triggleFiter){
            handleSubmit(onSubmit)()
            // setFilter(selfFilter)

            setTimeout(_ => {
                setTriggleFiter(false)
            }, 100)
        }
    }, [triggleFiter])

    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        setValue,
        resetField,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
          
            dateFrom: dayjs().subtract(1, 'months').startOf('day'),
            dateTo: dayjs().endOf('day'),
           
        },
    });

    const onSubmit = async (data) => {
        setFilter(data)
        
    }


    return (
        <>
            <form
                noValidate
                className="flex h-full flex-col "
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="relative flex">
                        <div className=" px-4 sm:px-6  h-full max-w-full">
                            <div className="space-y-4 pt-6 pb-5">
                                 <CustomDateTimeField
                                    name="dateFrom"
                                    label="dateFrom"
                                    control={control}
                                    errors={errors.dateFrom}
                                    required
                                />

                                <CustomDateTimeField
                                    name="dateTo"
                                    label="dateTo"
                                    control={control}
                                    errors={errors.dateTo}
                                    required
                                />
                            </div>
                        </div>
                </div>                
            </form>
        

        </>
    )
}

export default FilterDashboardTime

// const FilterDashboardTime = () => {
//     const [valueTime, setValueTime] = useState('')
//     const handlechange =(e)=>{
//         setValueTime(e)
//     }
//     return (
//         <div>

//         </div>
//         // <div>
//         //     <LocalizationProvider dateAdapter={AdapterDayjs}>
//         //         <DemoContainer components={['DateTimePicker']}>
//         //             <DateTimePicker label="DateFrom" defaultValue={dayjs('2022-04-17')} format="L HH:mm" onChange={(e)=>handlechange(e)}/>
//         //             <DateTimePicker label="DateTo" defaultValue={dayjs('2022-04-17')} format="L HH:mm" />
//         //         </DemoContainer>
//         //     </LocalizationProvider>
            
//         // </div>
//     )
// }
// export default FilterDashboardTime