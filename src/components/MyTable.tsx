import {DataGrid, GridColDef} from '@mui/x-data-grid';

interface MyTableProps {
    columns: GridColDef[],
    rows: []
}

export default function MyTable(props: MyTableProps) {
    return (
        <div style={{ width: '100%'}}>
            <DataGrid
                rows={props.rows}
                columns={props.columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 50},
                    },
                }}
                pageSizeOptions={[50, 100]}

            />

        </div>
    );
    //checkboxSelection
}