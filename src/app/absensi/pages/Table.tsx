import { Component } from "solid-js";
import DataTable from "../../../components/ui/DataTable";
import { createAbsensiColumns } from "./absensi.columns";
import type { AbsensiTableProps } from "../type/absensi-props";

const AbsensiTable: Component<AbsensiTableProps> = (props) => {
  const columns = createAbsensiColumns(props);

  return (
    <DataTable
      rows={props.absensis}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No absensis found."
      itemsPerPage={10}
    />
  );
};

export default AbsensiTable;
