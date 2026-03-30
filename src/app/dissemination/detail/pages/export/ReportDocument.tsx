import type { Component } from "solid-js";
import type { Dissemination } from "../../../type/dissemination";
import type { DisseminationDetail } from "../../type/dissemination-detail";
import Attachment from "./Attachment";
import Content from "./Content";
import Cover from "./Cover";

interface ReportDocumentProps {
  dissemination: Dissemination;
  details: DisseminationDetail[];
}

const ReportDocument: Component<ReportDocumentProps> = (props) => {
  return (
    <>
      <Cover dissemination={props.dissemination} />
      <Content dissemination={props.dissemination} details={props.details} />
      <Attachment details={props.details} />
    </>
  );
};

export default ReportDocument;
