##############################################################################
# Configuration Failure States
##############################################################################

locals {
  # fail configuration if virtual private endpoints are enabled and `vpe` tier is not in tier list.
  CONFIGURATION_FAILURE_vpe_tier_not_found = regex("true", var.enable_virtual_private_endpoints != true ? true : contains(var.vpc_subnet_tiers, "vpe"))
  # fail if cluster subnet tier not found
  CONFIGURATION_FAILURE_cluster_tier_not_found_in_tier_list = regex(
    "true",
    length(var.cluster_vpcs) == 0
    ? true
    : length([
      for tier in var.cluster_subnet_tier :
      true if !contains(var.vpc_subnet_tiers, tier)
    ]) == 0
  )
  # fail if OpenShift cluster does not have enough workers
  CONFIGURATION_FAILURE_openshift_cluster_needs_2_workers = regex(
    "true",
    var.cluster_type != "openshift"
    ? true
    : length(var.cluster_vpcs) == 0
    ? true
    : var.cluster_zones * var.workers_per_zone >= 2
  )
}

##############################################################################