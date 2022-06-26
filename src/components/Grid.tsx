import { Property } from "csstype";
import { Fragment, ReactNode, useState } from "react";
import styled from "styled-components";
import { Button } from "./Button";

type GridRowType = {
  id: string | number
}

type GridColumn<T> = {
  name: string,
  getter: (row: T) => ReactNode,
  cellRenderer?: never,
  headerAlignment?: Property.TextAlign
} | {
  name: string,
  getter?: never,
  cellRenderer: (row: T) => ReactNode,
  headerAlignment?: Property.TextAlign
}

interface GridProps<T extends GridRowType> {
  rows: T[],
  columns: GridColumn<T>[],
  editRow?: (row: T) => void,
  deleteRow?: (row: T) => void
}

const Table = styled.table({
  width: "100%",
  borderCollapse: "collapse",
  "td": {
    borderTop: "1px solid #ccc",
    borderBottom: "1px solid #ccc",
    padding: "0px 4px"
  },
  "tr": {
    height: 48
  }
});

const ButtonCell = styled.td({
  width: 0
});

const RightAlignedHeaderCell = styled.th<{ textAlign: Property.TextAlign }>(props => ({
  textAlign: props.textAlign
}));

interface GridRowProps<T extends GridRowType> {
  columns: GridColumn<T>[],
  row: T,
  editRow?: () => void,
  deleteRow?: () => void
}

const GridRow = <T extends GridRowType>({
  columns,
  row,
  editRow,
  deleteRow
}: GridRowProps<T>) => {
  const [deleting, setDeleting] = useState(false);

  return <tr>
    {columns.map(column => {
      if (column.cellRenderer) {
        return <Fragment key={column.name}>{column.cellRenderer(row)}</Fragment>;
      }
      return <td key={column.name}>{column.getter(row)}</td>;
    })}
    {editRow && <ButtonCell>
      <Button onClick={editRow}>Edit</Button>
    </ButtonCell>}
    {deleteRow && <ButtonCell>
      <Button
        loading={deleting}
        onClick={() => {
          setDeleting(true);
          deleteRow();
        }}>
        Delete
      </Button>
    </ButtonCell>}
  </tr>;
};

export const Grid = <T extends GridRowType>({
  rows,
  columns,
  editRow,
  deleteRow
}: GridProps<T>) => {
  return <Table>
    <thead>
      <tr>
        {columns.map(column => <RightAlignedHeaderCell
          key={column.name}
          textAlign={column.headerAlignment}
        >
          {column.name}
        </RightAlignedHeaderCell>)}
      </tr>
    </thead>
    <tbody>
      {rows.map(row => <GridRow
        key={row.id}
        columns={columns}
        row={row}
        editRow={editRow ? () => editRow(row) : undefined}
        deleteRow={deleteRow ? () => deleteRow(row) : undefined}
      />)}
    </tbody>
  </Table>;
};
