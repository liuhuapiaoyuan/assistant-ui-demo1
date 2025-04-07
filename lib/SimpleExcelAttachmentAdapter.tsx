"use client";
import { SimpleTextAttachmentAdapter, PendingAttachment, CompleteAttachment } from "@assistant-ui/react";

export class SimpleExcelAttachmentAdapter extends SimpleTextAttachmentAdapter {
  public accept = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  public async send(
    attachment: PendingAttachment
  ): Promise<CompleteAttachment> {
    /* TODO  这里需要读取文本二进制，并完成文件上传，以及表头的读取 */
    const columns = `
    客户名称	业务品种	品种分类	项目所在区	国民经济行业分类	行业分类	从业人员	营业收入	资产总额	担保金额	在保金额	解除金额	担保期限	反担保方式	担保费率	担保费	企业规模	申请机构	支行	项目经办	所属部门	收费日期	放款日期	到期日期	解除日期	银行保证合同编号	放款银行借款合同编号	委托担保合同编号	银行审批利率	业务类型	企业类别	是否三农	省再担备案	二八共担	足额抵押	政府纪要	企业划型	项目编号	融资性
      `;
    return {
      ...attachment,
      status: { type: "complete" },
      content: [
        {
          type: "text",
          text: `<attachment.excel.columns name=${attachment.name}>\n${columns}\n</attachment.excel.columns>`,
        },
      ],
    };
  }
}
