import {DataGrid, GridColDef, GridRowClassNameParams, GridSortingInitialState} from '@mui/x-data-grid';
import {GridEventListener} from "@mui/x-data-grid/models/events";

interface MyTableProps {
    columns: GridColDef[],
    sorting: GridSortingInitialState | undefined
    onRowClick: GridEventListener<'rowClick'> | undefined
    rowClassName:  (params: GridRowClassNameParams) => string
    rowId:  (params: object) => string
    rows: []
}

export default function MyTable(props: MyTableProps) {
    return (
        <div style={{width: '100%'}}>
            <DataGrid
                rows={props.rows}
                columns={props.columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 50},
                    },
                    sorting: props.sorting
                }}
                getRowId={props.rowId}
                getRowClassName={props.rowClassName}
                onRowClick={props.onRowClick}
                pageSizeOptions={[50, 100]}
            />

        </div>
    );
    //checkboxSelection
}