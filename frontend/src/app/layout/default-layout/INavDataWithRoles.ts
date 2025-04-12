import { INavData } from "@coreui/angular-pro";

export interface INavDataWithRoles extends INavData {
  roles?: string[];
  children?: INavDataWithRoles[];
}
