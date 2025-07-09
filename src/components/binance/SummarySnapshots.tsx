import {TextField} from "@mui/material";
import {JSX, useMemo, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {urlBuilder} from "../../utils/UrlBuilderNew.ts";
import {TradesSummarySnapshot} from "../../types/TradesSummarySnapshot.ts";
import useFetch from "../../api/Api.ts";
import LoadingComponent from "../LoadingComponent.tsx";
import {removeUnncessaryDotsInValueArray} from "../../utils/Calculations.ts";
import {formatDateTimeString} from "../../utils/DateFormatter.ts";
import {LineChart} from "@mui/x-charts/LineChart";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";


export function SummarySnapshots(): JSX.Element {
    const [dateFrom, setDateFrom] = useState<Dayjs | null>(dayjs().subtract(7, 'day'));
    const [dateTo, setDateTo] = useState<Dayjs | null>(dayjs());

    function formatDateToBe(date: Dayjs | null) {
        if (date) {
            return dayjs(date).format('YYYY-MM-DD')
        }
        return null
    }

    const summarySnapshotsUrl = useMemo(() => {
        return urlBuilder('/binance/trades/summary-snapshots')
            .addParameter("dateFrom", formatDateToBe(dateFrom))
            .addParameter("dateTo", formatDateToBe(dateTo))
            .build();
    }, [dateFrom, dateTo]);
    const snapshots: TradesSummarySnapshot[] = useFetch<TradesSummarySnapshot[]>(summarySnapshotsUrl)


    function Chart({snapshots}: { snapshots: TradesSummarySnapshot[] }) {
        if (!snapshots || snapshots.length === 0) {
            return <LoadingComponent/>;
        }

        const invested = removeUnncessaryDotsInValueArray(snapshots.map(x => x.invested));
        const actualValues = snapshots.map(x => x.actualValue);

        const notNullInvested = invested.filter(n => n != null);
        const investedMin = Math.min(...notNullInvested);
        const investedMax = Math.max(...notNullInvested);

        const notNullAv = actualValues.filter(n => n != null);
        const avMin = Math.min(...notNullAv);
        const avMax = Math.max(...notNullAv);

        const yMin = Math.min(investedMin, avMin) - 30;
        const yMax = Math.max(investedMax, avMax) + 10;

        const xLabels = snapshots.map(x => formatDateTimeString(x.dateTime));

        return (
            <div className="centered-element-wrapper">
                <div className="centered-element">
                    <LineChart
                        width={1580}
                        height={500}
                        series={[
                            {data: invested, connectNulls: true, showMark: false, label: 'Invested', baseline: 60},
                            {data: actualValues, showMark: false, label: 'Actual value', baseline: 60},
                        ]}
                        xAxis={[{scaleType: 'point', data: xLabels}]}
                        yAxis={[{min: yMin, max: yMax}]}
                        grid={{vertical: true, horizontal: true}}
                    />
                </div>
            </div>
        );
    }

    const DatePickers = () => {
        const handleDateFromChange = (newDate: Dayjs | null) => {
            setDateFrom(newDate);
        };

        const handleDateToChange = (newDate: Dayjs | null) => {
            setDateTo(newDate);
        };

        return (
            <div className={"centered-element-wrapper"}>
                <div className={"centered-element"}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Select Date From"
                            value={dateFrom}
                            onChange={handleDateFromChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>
                <div className={"centered-element"}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Select Date To"
                            value={dateTo}
                            onChange={handleDateToChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>
            </div>
        )
    }


    return (
        <div>
            <Chart snapshots={snapshots}/>
            <DatePickers/>
        </div>
    );
}

