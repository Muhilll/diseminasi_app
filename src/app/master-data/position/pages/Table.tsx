import { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createPositionColumns } from "./position.columns";
import type { PositionTableProps } from "../type/position-props";

const PositionTable: Component<PositionTableProps> = (props) => {
  const columns = createPositionColumns(props);

  return (
    <DataTable
      rows={props.positions}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No positions found."
      itemsPerPage={10}
    />
  );
};

export default PositionTable;
