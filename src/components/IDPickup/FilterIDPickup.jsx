import react, { useEffect, useState } from "react";
import { CustomAsyncSelect } from "..";
import { useTranslation } from "react-i18next";
import { TextField } from "@mui/material";

const FilterIDPickup = ({ fleets, filter, setFilter, triggleFiter, setTriggleFiter }) => {
    const { t } = useTranslation();

    const [selfFilter, setSelfFilter] = useState({})

    useEffect(_ => {
        if (triggleFiter) {
            setFilter(selfFilter)

            setTimeout(_ => {
                setTriggleFiter(false)
            }, 100)
        }
    }, [triggleFiter])

    // useEffect(_ => {
    //     if(filter){
    //         setFilter(selfFilter)
    //     }
    // }, [filter])


    const handleChange = (e) => {

    }

    return (
        <>
            <div className="flex flex-col gap-3">
                {/* <div className="w-full">
                    <CustomAsyncSelect
                        label="branchName"
                        data={fleets?.content.map((item) => ({
                            id: item.groupId,
                            text: item.groupName,
                        }))}
                        isFetching={isFetchingFleet}
                        isLoading={isLoadingFleet}
                        // onChange={handleChange}
                        onChange={(e) => setSelfFilter(prevState => ({
                            ...prevState,
                            branchName: e.target.value || null
                        }))}
                    />
                </div> */}
                <div className="flex flex-col gap-3">
                    <div className="w-full">
                        <TextField
                            label={t('IDPFilterIDPickup')}
                            variant="outlined"
                            name="IDPFilterIDPickup"
                            fullWidth
                            onChange={(e) => setFilter(prevState => ({
                                ...prevState,
                                IDPFilterIDPickup: e.target.value || null
                            }))}
                        />
                    </div>
                    <div className="w-full">
                        <TextField
                            label={t('description')}
                            variant="outlined"
                            name="description"
                            fullWidth
                            onChange={(e) => setFilter(prevState => ({
                                ...prevState,
                                description: e.target.value || null
                            }))}
                        />
                    </div>
                    <div className="w-full">
                        <TextField
                            label={t('district')}
                            variant="outlined"
                            name="district"
                            fullWidth
                            onChange={(e) => setFilter(prevState => ({
                                ...prevState,
                                district: e.target.value || null
                            }))}
                        />
                    </div>
                    <div className="w-full">
                        <TextField
                            label={t('lane')}
                            variant="outlined"
                            name="lane"
                            fullWidth
                            onChange={(e) => setFilter(prevState => ({
                                ...prevState,
                                lane: e.target.value || null
                            }))}
                        />
                    </div>
                    <div className="w-full">
                        <TextField
                            label={t('lat')}
                            variant="outlined"
                            name="lat"
                            fullWidth
                            onChange={(e) => setFilter(prevState => ({
                                ...prevState,
                                lat: e.target.value || null
                            }))}
                        />
                    </div>
                    <div className="w-full">
                        <TextField
                            label={t('lng')}
                            variant="outlined"
                            name="lng"
                            fullWidth
                            onChange={(e) => setFilter(prevState => ({
                                ...prevState,
                                lng: e.target.value || null
                            }))}
                        />
                    </div>
                    <div className="w-full">
                        <TextField
                            label={t('other')}
                            variant="outlined"
                            name="other"
                            fullWidth
                            onChange={(e) => setFilter(prevState => ({
                                ...prevState,
                                other: e.target.value || null
                            }))}
                        />
                    </div>
                    <div className="w-full">
                        <TextField
                            label={t('postalCode')}
                            variant="outlined"
                            name="postalCode"
                            fullWidth
                            onChange={(e) => setFilter(prevState => ({
                                ...prevState,
                                postalCode: e.target.value || null
                            }))}
                        />
                    </div>
                    <div className="w-full">
                        <TextField
                            label={t('province')}
                            variant="outlined"
                            name="province"
                            fullWidth
                            onChange={(e) => setFilter(prevState => ({
                                ...prevState,
                                province: e.target.value || null
                            }))}
                        />
                    </div>
                    <div className="w-full">
                        <TextField
                            label={t('road')}
                            variant="outlined"
                            name="road"
                            fullWidth
                            onChange={(e) => setFilter(prevState => ({
                                ...prevState,
                                road: e.target.value || null
                            }))}
                        />
                    </div>
                    <div className="w-full">
                        <TextField
                            label={t('senderName')}
                            variant="outlined"
                            name="senderName"
                            fullWidth
                            onChange={(e) => setFilter(prevState => ({
                                ...prevState,
                                senderName: e.target.value || null
                            }))}
                        />
                    </div>
                    <div className="w-full">
                        <TextField
                            label={t('senderNumber')}
                            variant="outlined"
                            name="senderNumber"
                            fullWidth
                            onChange={(e) => setFilter(prevState => ({
                                ...prevState,
                                senderNumber: e.target.value || null
                            }))}
                        />
                    </div>
                    <div className="w-full">
                        <TextField
                            label={t('subDistrict')}
                            variant="outlined"
                            name="subDistrict"
                            fullWidth
                            onChange={(e) => setFilter(prevState => ({
                                ...prevState,
                                subDistrict: e.target.value || null
                            }))}
                        />
                    </div>
                    <div className="w-full">
                        <TextField
                            label={t('villageNo')}
                            variant="outlined"
                            name="villageNo"
                            fullWidth
                            onChange={(e) => setFilter(prevState => ({
                                ...prevState,
                                villageNo: e.target.value || null
                            }))}
                        />
                    </div>
                </div>
            </div>

        </>
    )
}

export default FilterIDPickup