import type { Component } from "solid-js";
import DataTable from "../../../components/ui/DataTable";
import { createDisseminationColumns } from "./dissemination.columns";
import type { DisseminationTableProps } from "../type/dissemination-props";

const DisseminationTable: Component<DisseminationTableProps> = (props) => {
  const columns = createDisseminationColumns(props);

  return (
    <DataTable
      rows={props.disseminations}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No disseminations found."
      itemsPerPage={10}
    />
  );
};

export default DisseminationTable;
