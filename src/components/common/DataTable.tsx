import {JSX, useCallback, useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Paper from "@mui/material/Paper";
import TablePagination from '@mui/material/TablePagination';

export interface DataTableProps<T> {
    columns: ColumnDefinition<T>[],
    data: T[] | null,
    dataSourceUrl: string | null,
    paged: boolean,
    getRowId: (row: T) => string | number;
    getRowSx?: (row: T) => object;
}

export interface ColumnDefinition<T> {
    key: string;
    label: string;
    align?: "left" | "right" | "center";
    valueGetter?: (row: T) => string | number | JSX.Element;
    valueFormatter?: (value: unknown) => string | number | JSX.Element;
}


export default function DataTable<T>(props: DataTableProps<T>): JSX.Element {
    // const [contents, setContents] = useState<JSX.Element>(<div>MenuComponent</div>);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(25);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [data, setData] = useState<T[]>([]);

    const loadData = useCallback(() => {
        if (!props.dataSourceUrl) {
            console.log("DataTable: No dataSourceUrl provided, using static data.");
            setData(props.data || []);
            setLoading(false);
            return;
        }

        setLoading(true);
        const url = new URL(props.dataSourceUrl);
        if (props.paged) {
            url.searchParams.append("page", String(page));
            url.searchParams.append("size", String(pageSize));
        }

        fetch(url.toString())
            .then(response => response.json())
            .then(data => {
                setData(data.data);
                if (props.paged) {
                    setTotalCount(data.totalElements); // make sure your API returns this
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, [props.dataSourceUrl, props.data, props.paged, page, pageSize]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) return <p>Loading...</p>;

    function pagination(paged: boolean): JSX.Element | null {
        if (!paged) return <div/>;
        return (
            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={(_event, newPage) => {
                    setPage(newPage);
                }}
                rowsPerPage={pageSize}
                onRowsPerPageChange={(event) => {
                    setPageSize(parseInt(event.target.value, 10));
                    setPage(0); // reset to first page
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        )
    }

    const getDisplayValue = (value: unknown, valueFormatter: ((value: (string | number)) => (string | number | React.JSX.Element)) | undefined): string | number | React.JSX.Element => {
        if (value === null || value === undefined) return '-';

        if (valueFormatter) {
            return valueFormatter(value);
        } else if (typeof value === 'number') {
            return value.toFixed(4);
        }

        return value;
    };

    return (
        <div>
            <TableContainer
                component={Paper}
                elevation={3}
                sx={{
                    mt: 4,
                    borderRadius: 2,
                    overflow: 'hidden',
                }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {props.columns.map((col) => (
                                <TableCell key={col.label}
                                           align={col.align}
                                           sx={{
                                               fontWeight: 'bold',
                                               backgroundColor: 'primary.main',
                                               color: 'white',
                                               borderBottom: '2px solid',
                                               borderColor: 'divider',
                                           }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow
                                key={props.getRowId(row)}
                                sx={{
                                    ...(props.getRowSx?.(row) ?? {}),
                                    ...(!props.getRowSx && {
                                        '&:nth-of-type(odd)': {
                                            backgroundColor: 'grey.50',
                                        },
                                        '&:hover': {
                                            backgroundColor: 'primary.light',
                                            cursor: 'pointer',
                                        },
                                    }),
                                }}
                            >
                                {props.columns.map((col) => {
                                    // @ts-expect-error vvv
                                    const value = col.valueGetter ? col.valueGetter(row) : (row as T)[col.key];

                                    return (
                                        <TableCell
                                            key={col.key}
                                            align={col.align as "left" | "right" | "center"}
                                        >
                                            {getDisplayValue(value, col.valueFormatter)}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {pagination(props.paged)}
        </div>
    )

}