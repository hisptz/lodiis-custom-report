import { User } from "@iapps/ngx-dhis2-http-client";

export interface CurrentUser extends User {
  attributeValues: Array<{attribute: any, value: string}>;
}
