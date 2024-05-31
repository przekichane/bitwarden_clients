import {
  UserAccessPolicyView,
  GroupAccessPolicyView,
  ServiceAccountAccessPolicyView,
  GrantedProjectAccessPolicyView,
} from "../../../../models/view/access-policies/access-policy.view";
import { ProjectPeopleAccessPoliciesView } from "../../../../models/view/access-policies/project-people-access-policies.view";
import { ProjectServiceAccountsAccessPoliciesView } from "../../../../models/view/access-policies/project-service-accounts-access-policies.view";
import {
  ServiceAccountGrantedPoliciesView,
  GrantedProjectPolicyPermissionDetailsView,
} from "../../../../models/view/access-policies/service-account-granted-policies.view";
import { ServiceAccountPeopleAccessPoliciesView } from "../../../../models/view/access-policies/service-account-people-access-policies.view";

import { ApItemEnum } from "./enums/ap-item.enum";
import { ApPermissionEnum, ApPermissionEnumUtil } from "./enums/ap-permission.enum";

export type ApItemValueType = {
  id: string;
  type: ApItemEnum;
  permission: ApPermissionEnum;
  currentUserInGroup?: boolean;
  currentUser?: boolean;
};

export function convertToProjectPeopleAccessPoliciesView(
  selectedPolicyValues: ApItemValueType[],
): ProjectPeopleAccessPoliciesView {
  const view = new ProjectPeopleAccessPoliciesView();
  view.userAccessPolicies = selectedPolicyValues
    .filter((x) => x.type == ApItemEnum.User)
    .map((filtered) => {
      return convertToUserAccessPolicyView(filtered);
    });

  view.groupAccessPolicies = selectedPolicyValues
    .filter((x) => x.type == ApItemEnum.Group)
    .map((filtered) => {
      return convertToGroupAccessPolicyView(filtered);
    });
  return view;
}

export function convertToServiceAccountPeopleAccessPoliciesView(
  selectedPolicyValues: ApItemValueType[],
): ServiceAccountPeopleAccessPoliciesView {
  const view = new ServiceAccountPeopleAccessPoliciesView();
  view.userAccessPolicies = selectedPolicyValues
    .filter((x) => x.type == ApItemEnum.User)
    .map((filtered) => {
      return convertToUserAccessPolicyView(filtered);
    });

  view.groupAccessPolicies = selectedPolicyValues
    .filter((x) => x.type == ApItemEnum.Group)
    .map((filtered) => {
      return convertToGroupAccessPolicyView(filtered);
    });
  return view;
}

export function convertToServiceAccountGrantedPoliciesView(
  selectedPolicyValues: ApItemValueType[],
): ServiceAccountGrantedPoliciesView {
  const view = new ServiceAccountGrantedPoliciesView();

  view.grantedProjectPolicies = selectedPolicyValues
    .filter((x) => x.type == ApItemEnum.Project)
    .map((filtered) => {
      const detailView = new GrantedProjectPolicyPermissionDetailsView();
      const policyView = new GrantedProjectAccessPolicyView();
      policyView.grantedProjectId = filtered.id;
      policyView.read = ApPermissionEnumUtil.toRead(filtered.permission);
      policyView.write = ApPermissionEnumUtil.toWrite(filtered.permission);

      detailView.accessPolicy = policyView;
      return detailView;
    });

  return view;
}

export function convertToProjectServiceAccountsAccessPoliciesView(
  selectedPolicyValues: ApItemValueType[],
): ProjectServiceAccountsAccessPoliciesView {
  const view = new ProjectServiceAccountsAccessPoliciesView();

  view.serviceAccountAccessPolicies = selectedPolicyValues
    .filter((x) => x.type == ApItemEnum.ServiceAccount)
    .map((filtered) => {
      return convertToServiceAccountAccessPolicyView(filtered);
    });

  return view;
}

function convertToUserAccessPolicyView(apItem: ApItemValueType): UserAccessPolicyView {
  const policyView = new UserAccessPolicyView();
  policyView.organizationUserId = apItem.id;
  policyView.read = ApPermissionEnumUtil.toRead(apItem.permission);
  policyView.write = ApPermissionEnumUtil.toWrite(apItem.permission);
  return policyView;
}

function convertToGroupAccessPolicyView(apItem: ApItemValueType): GroupAccessPolicyView {
  const policyView = new GroupAccessPolicyView();
  policyView.groupId = apItem.id;
  policyView.read = ApPermissionEnumUtil.toRead(apItem.permission);
  policyView.write = ApPermissionEnumUtil.toWrite(apItem.permission);
  return policyView;
}

function convertToServiceAccountAccessPolicyView(
  apItem: ApItemValueType,
): ServiceAccountAccessPolicyView {
  const policyView = new ServiceAccountAccessPolicyView();
  policyView.serviceAccountId = apItem.id;
  policyView.read = ApPermissionEnumUtil.toRead(apItem.permission);
  policyView.write = ApPermissionEnumUtil.toWrite(apItem.permission);
  return policyView;
}
