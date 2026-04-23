import * as cheerio from "cheerio";
import {GeneralError} from "../errors";

export default class DocumentParser {
  private readonly cheerioApi: cheerio.CheerioAPI;

  constructor(htmlDocument: any) {
    this.cheerioApi = cheerio.load(htmlDocument, {}, true);
  }

  public getElementsBySelector(
    selector: string,
    parentElement: any = null,
  ): cheerio.Cheerio<any> {
    if (!this.cheerioApi) throw new GeneralError("cheerio api does not exist");
    if (parentElement) {
      return this.cheerioApi(parentElement).find(selector);
    }
    return this.cheerioApi(selector);
  }

  public getSingleElement(selector: string, parentElement: any = null): any {
    if (!this.cheerioApi) throw new GeneralError("cheerio api does not exist");
    if (parentElement) {
      return this.cheerioApi(parentElement).find(selector)?.[0];
    }
    return this.cheerioApi(selector)?.[0];
  }

  public getElementAttribute(
    selector: string,
    attributeKey: string,
    element?: any,
  ) {
    if (!this.cheerioApi) throw new GeneralError("cheerio api does not exist");
    const selectedElement = this.getSingleElement(selector, element);
    if (!selectedElement) throw new GeneralError("Could not find attribute");
    return this.cheerioApi(selectedElement).attr(attributeKey);
  }

  public getElementText(selector: string, element: any) {
    if (!this.cheerioApi) throw new GeneralError("cheerio api does not exists");
    const selectedElement = this.getSingleElement(selector, element);
    return this.cheerioApi(selectedElement).text();
  }

  public select(element: any): cheerio.Cheerio<any> {
    return this.cheerioApi(element);
  }
}
