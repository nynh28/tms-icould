import react from "react";
import { CustomAsyncSelect } from "..";
import { useTranslation } from "react-i18next";
import { TextField } from "@mui/material";

const FilterDriver = ({ fleets, filter, setFilter }) => {
    const { t } = useTranslation();

    const handleChange = (e) => {

    }

    return (
        <>
            <div className="flex flex-col gap-3">
                <div className="w-full">
                    <CustomAsyncSelect
                        label="branchName"
                        data={fleets?.content.map((item) => ({
                            id: item.groupId,
                            text: item.groupName,
                        }))}
                        isFetching={isFetchingFleet}
                        isLoading={isLoadingFleet}
                        // onChange={handleChange}
                        onChange={(e) => setFilter(prevState => ({
                            ...prevState,
                            branchName: e.target.value || null
                        }))}
                    />
                </div>
                <div className="w-full">
                    <TextField
                        label={t('phone')}
                        variant="outlined"
                        name="phone"
                        fullWidth
                        value={filter.phone}
                        onChange={(e) => setFilter(prevState => ({
                            ...prevState,
                            phone: e.target.value || null
                        }))}
                    />
                </div>
                <div className="w-full">
                    <TextField
                        label={t('fullName')}
                        variant="outlined"
                        name="fullName"
                        fullWidth
                        value={filter.fullName}
                        onChange={(e) => setFilter(prevState => ({
                            ...prevState,
                            fullName: e.target.value || null
                        }))}
                    />
                </div>
            </div>

        </>
    )
}

export default FilterDriver