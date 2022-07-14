import { Property } from "csstype";
import { ReactNode, useState } from "react";
import styled from "styled-components";
import { isNumber } from "../utils/types";
import { Button } from "./Button";

type GridRowType = {
  id: string | number
}

type GridColumn<RowType extends GridRowType> = {
  name: string,
  sumValueGetter?: (row: RowType) => number,
  render?: (row: RowType) => ReactNode,
  textAlignment?: Property.TextAlign,
  renderSum?: (sum: number) => ReactNode,
  sumName?: string
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

const HeaderCell = styled.th<{ textAlign: Property.TextAlign }>(props => ({
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
    {columns.map(column =>
      <td style={{ textAlign: column.textAlignment }} key={column.name}>
        {column.render && column.render(row)}
      </td>
    )}
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

const SumRow = styled.tr({
  fontWeight: "bold"
});

export const Grid = <T extends GridRowType>({
  rows,
  columns,
  editRow,
  deleteRow
}: GridProps<T>) => {
  return <Table>
    <thead>
      <tr>
        {columns.map(column => <HeaderCell
          key={column.name}
          textAlign={column.textAlignment || "left"}
        >
          {column.name}
        </HeaderCell>)}
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
      {columns.some(column => column.renderSum || column.sumName || column.sumValueGetter) && <SumRow>
        {columns.map(column => {
          const sumValueGetter = column.sumValueGetter;
          if (sumValueGetter) {
            const sum = rows.reduce((sum, row) => {
              const v = sumValueGetter(row);
              return isNumber(v) ? sum + v : sum;
            }, 0);

            return <td key={column.name} style={{ textAlign: column.textAlignment }}>
              {column.renderSum ? column.renderSum(sum) : sum}
            </td>;
          }
          return <td key={column.name} style={{ textAlign: column.textAlignment }}>{column.sumName}</td>;
        })}
        {editRow && <td />}
        {deleteRow && <td />}
      </SumRow>}
    </tbody>
  </Table>;
};
