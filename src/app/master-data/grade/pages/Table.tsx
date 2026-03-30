import { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createGradeColumns } from "./grade.columns";
import type { GradeTableProps } from "../type/grade-props";

const GradeTable: Component<GradeTableProps> = (props) => {
  const columns = createGradeColumns(props);

  return (
    <DataTable
      rows={props.grades}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No grades found."
      itemsPerPage={10}
    />
  );
};

export default GradeTable;
