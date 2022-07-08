##############################################################################
# Template Level Variables
##############################################################################

variable "ibmcloud_api_key" {
  description = "The IBM Cloud platform API key needed to deploy IAM enabled resources."
  type        = string
  sensitive   = true
}

variable "region" {
  description = "The region to which to deploy the VPC"
  type        = string
}

variable "prefix" {
  description = "The prefix that you would like to prepend to your resources"
  type        = string
}

variable "tags" {
  description = "List of Tags for the resource created"
  type        = list(string)
  default     = null
}

##############################################################################

##############################################################################
# VPC Variables
##############################################################################

variable "zones" {
  description = "Number of zones for each VPC"
  type        = number
  default     = 3

  validation {
    error_message = "VPCs zones can only be 1, 2, or 3."
    condition     = var.zones > 0 && var.zones < 4
  }
}

variable "vpc_names" {
  description = "Names for VPCs to create. A resource group will be dynamically created for each VPC by default."
  type        = list(string)
  default     = ["management", "workload"]

  validation {
    error_message = "VPCs must all have unique names."
    condition     = length(var.vpc_names) == length(distinct(var.vpc_names))
  }

  validation {
    error_message = "At least one VPC must be provisioned."
    condition     = length(var.vpc_names) > 0
  }
}

variable "existing_resource_groups" {
  description = "List of resource groups to use for infrastructire created. This value must be the same length as `vpc_names`. Each resource group will correspond directly to the same index as `vpc_names`. To create new resource groups, leave this variable as `[]`. Leave indexes as empty string to create new resource group."
  type        = list(string)
  default     = []
}

variable "vpc_subnet_tiers" {
  description = "List of names for subnet tiers to add to each VPC. For each tier, a subnet will be created in each zone of each VPC. Each tier of subnet will have a unique access control list on each VPC."
  type        = list(string)
  default     = ["vsi", "vpe"]

  validation {
    error_message = "Each subnet tier must have a unique name."
    condition     = length(var.vpc_subnet_tiers) == length(distinct(var.vpc_subnet_tiers))
  }

  validation {
    error_message = "At least one subnet tier must be added to VPCs."
    condition     = length(var.vpc_subnet_tiers) > 0
  }

  validation {
    error_message = "The subnet tier name `vpn` is reserved. Please use a different name."
    condition     = !contains(var.vpc_subnet_tiers, "vpn")
  }
}

variable "vpc_subnet_tiers_add_public_gateway" {
  description = "List of subnet tiers where a public gateway will be attached. Public gateways will be created in each VPC using these network tiers."
  type        = list(string)
  default     = ["vpn"]

  validation {
    error_message = "Each subnet tier must have a unique name."
    condition     = length(var.vpc_subnet_tiers_add_public_gateway) == length(distinct(var.vpc_subnet_tiers_add_public_gateway))
  }
}

variable "vpcs_add_vpn_subnet" {
  description = "List of VPCs to add a subnet and VPN gateway. VPCs must be defined in `var.vpc_names`. A subnet and address prefix will be added in zone 1 for the VPN Gateway."
  type        = list(string)
  default     = ["management"]

  validation {
    error_message = "Each VPC to add a VPN gateway must have a unique name."
    condition     = length(var.vpcs_add_vpn_subnet) == length(distinct(var.vpcs_add_vpn_subnet))
  }
}

variable "enable_transit_gateway" {
  description = "Create transit gateway"
  type        = bool
  default     = true
}

variable "transit_gateway_connections" {
  description = "List of VPC names from `var.vpc_names` to connect via a single transit gateway. To not use transit gateway, provide an empty list."
  type        = list(string)
  default     = ["management", "workload"]
}

##############################################################################

##############################################################################
# Network ACL Variables
##############################################################################

variable "add_cluster_rules" {
  description = "Automatically add needed ACL rules to allow each network to create and manage Openshift and IKS clusters."
  type        = bool
  default     = true
}

variable "global_inbound_allow_list" {
  description = "List of CIDR blocks where inbound traffic will be allowed. These allow rules will be added to each network acl."
  type        = list(string)
  default = [
    "10.0.0.0/8",   # Internal network traffic
    "161.26.0.0/16" # IBM Network traffic
  ]

  validation {
    error_message = "Global inbound allow list should contain no duplicate CIDR blocks."
    condition = length(var.global_inbound_allow_list) == 0 ? true : (
      length(var.global_inbound_allow_list) == length(distinct(var.global_inbound_allow_list))
    )
  }
}

variable "global_outbound_allow_list" {
  description = "List of CIDR blocks where outbound traffic will be allowed. These allow rules will be added to each network acl."
  type        = list(string)
  default = [
    "0.0.0.0/0"
  ]

  validation {
    error_message = "Global outbound allow list should contain no duplicate CIDR blocks."
    condition = length(var.global_outbound_allow_list) == 0 ? true : (
      length(var.global_outbound_allow_list) == length(distinct(var.global_outbound_allow_list))
    )
  }
}

variable "global_inbound_deny_list" {
  description = "List of CIDR blocks where inbound traffic will be denied. These deny rules will be added to each network acl. Deny rules will be added after all allow rules."
  type        = list(string)
  default = [
    "0.0.0.0/0"
  ]

  validation {
    error_message = "Global inbound allow list should contain no duplicate CIDR blocks."
    condition = length(var.global_inbound_deny_list) == 0 ? true : (
      length(var.global_inbound_deny_list) == length(distinct(var.global_inbound_deny_list))
    )
  }
}

variable "global_outbound_deny_list" {
  description = "List of CIDR blocks where outbound traffic will be denied. These deny rules will be added to each network acl. Deny rules will be added after all allow rules."
  type        = list(string)
  default     = []

  validation {
    error_message = "Global outbound allow list should contain no duplicate CIDR blocks."
    condition = length(var.global_outbound_deny_list) == 0 ? true : (
      length(var.global_outbound_deny_list) == length(distinct(var.global_outbound_deny_list))
    )
  }
}

##############################################################################

##############################################################################
# (Optional) Detailed Network ACL Variables
##############################################################################

variable "apply_new_rules_before_old_rules" {
  description = "When set to `true`, any new rules to be applied to existing Network ACLs will be added **before** existing rules and after any detailed rules that will be added. Otherwise, rules will be added after."
  type        = bool
  default     = true
}

variable "deny_all_tcp_ports" {
  description = "Deny all inbound and outbound TCP traffic on each port in this list."
  type        = list(number)
  default     = [22, 80]
}

variable "deny_all_udp_ports" {
  description = "Deny all inbound and outbound UDP traffic on each port in this list."
  type        = list(number)
  default     = [22, 80]
}

variable "get_detailed_acl_rules_from_json" {
  description = "Decode local file `acl-rules.json` for the automated creation of Network ACL rules. If this is set to `false`, detailed_acl_rules will be used instead."
  type        = bool
  default     = false
}

variable "detailed_acl_rules" {
  description = "OPTIONAL - List describing network ACLs and rules to add."
  type = list(
    object({
      acl_shortname = string
      rules = list(
        object({
          shortname   = string
          action      = string
          direction   = string
          add_first   = optional(bool)
          destination = optional(string)
          source      = optional(string)
          tcp = optional(
            object({
              port_max        = optional(number)
              port_min        = optional(number)
              source_port_max = optional(number)
              source_port_min = optional(number)
            })
          )
          udp = optional(
            object({
              port_max        = optional(number)
              port_min        = optional(number)
              source_port_max = optional(number)
              source_port_min = optional(number)
            })
          )
          icmp = optional(
            object({
              type = optional(number)
              code = optional(number)
            })
          )
        })
      )
    })
  )
  default = []
}

##############################################################################

##############################################################################
# Key Management Variables
##############################################################################

variable "existing_hs_crypto_name" {
  description = "OPTIONAL - Get data for an existing HPCS instance. If you want a KMS instance to be created, leave as `null`."
  type        = string
  default     = null
}

variable "existing_hs_crypto_resource_group" {
  description = "OPTIONAL - Resource group name for an existing HPCS instance. Use only with `existing_hs_crypto_name`."
  type        = string
  default     = null
}

##############################################################################

##############################################################################
# Atracker Variables
##############################################################################

variable "enable_atracker" {
  description = "Enable activity tracker for this pattern."
  type        = bool
  default     = true
}

variable "add_atracker_route" {
  description = "Add a route to the Atracker instance."
  type        = bool
  default     = false
}

##############################################################################

##############################################################################
# Services Variables
##############################################################################

variable "cos_use_random_suffix" {
  description = "Add a randomize suffix to the end of each Object Storage resource created in this module."
  type        = bool
  default     = true
}

variable "create_secrets_manager" {
  description = "Create a Secrets Manager service instance."
  type        = bool
  default     = false
}

##############################################################################

##############################################################################
# Virtual Private Endpoint Variables
##############################################################################

variable "enable_virtual_private_endpoints" {
  description = "Enable virtual private endpoints."
  type        = bool
  default     = true
}

variable "vpe_services" {
  description = "List of VPE Services to use to create endpoint gateways."
  type        = list(string)
  default     = ["cloud-object-storage", "kms"]
}

variable "vpcs_create_endpoint_gateway_on_vpe_tier" {
  description = "Create a Virtual Private Endpoint for supported services on each `vpe` tier of VPC names in this list."
  type        = list(string)
  default     = ["management", "workload"]
}

##############################################################################

##############################################################################
# Cluster Deployments
##############################################################################

variable "cluster_type" {
  description = "Cluster type. Can be `iks` or `openshift`."
  type        = string
  default     = "openshift"

  validation {
    error_message = "Cluster type must be `iks`, `openshift`, or `null`."
    condition     = var.cluster_type == null ? true : contains(["openshift", "iks"], var.cluster_type)
  }
}

variable "cluster_vpcs" {
  description = "List of VPCs where clusters will be deployed."
  type        = list(string)
  default     = ["workload"]
}

variable "cluster_subnet_tier" {
  description = "List of subnet tiers where clusters will be provisioned."
  type        = list(string)
  default     = ["vsi"]
}

variable "cluster_zones" {
  description = "Number of zones to provision clusters for each VPC. At least one zone is required. Can be 1, 2, or 3 zones."
  type        = number
  default     = 3

  validation {
    error_message = "Cluster can be provisioned only across 1, 2, or 3 zones."
    condition     = var.cluster_zones > 0 && var.cluster_zones < 4
  }
}

variable "kube_version" {
  description = "Kubernetes version to use for cluster. To get available versions, use the IBM Cloud CLI command `ibmcloud ks versions`. To use the default version, leave as default. Updates to the default versions may force this to change."
  type        = string
  default     = "default"
}

variable "flavor" {
  description = "Machine type for cluster. Use the IBM Cloud CLI command `ibmcloud ks flavors` to find valid machine types"
  type        = string
  default     = "bx2.16x64"
}

variable "workers_per_zone" {
  description = "Number of workers in each zone of the cluster. OpenShift requires at least 2 workers."
  type        = number
  default     = 2
}

variable "wait_till" {
  description = "To avoid long wait times when you run your Terraform code, you can specify the stage when you want Terraform to mark the cluster resource creation as completed. Depending on what stage you choose, the cluster creation might not be fully completed and continues to run in the background. However, your Terraform code can continue to run without waiting for the cluster to be fully created. Supported args are `MasterNodeReady`, `OneWorkerNodeReady`, and `IngressReady`"
  type        = string
  default     = "IngressReady"

  validation {
    error_message = "`wait_till` value must be one of `MasterNodeReady`, `OneWorkerNodeReady`, or `IngressReady`."
    condition = contains([
      "MasterNodeReady",
      "OneWorkerNodeReady",
      "IngressReady"
    ], var.wait_till)
  }
}

variable "update_all_workers" {
  description = "Update all workers to new kube version"
  type        = bool
  default     = false
}

variable "disable_public_service_endpoint" {
  description = "Disable the public service endpoint on the cluster."
  type        = bool
  default     = false
}

variable "entitlement" {
  description = "If you do not have an entitlement, leave as null. Entitlement reduces additional OCP Licence cost in OpenShift clusters. Use Cloud Pak with OCP Licence entitlement to create the OpenShift cluster. Note It is set only when the first time creation of the cluster, further modifications are not impacted Set this argument to cloud_pak only if you use the cluster with a Cloud Pak that has an OpenShift entitlement."
  type        = string
  default     = null
}

##############################################################################

##############################################################################
# Cluster Worker Pools
##############################################################################

variable "worker_pool_names" {
  description = "Names of worker pools to add to the cluster. Worker pools added this way will be provisioned in the same zones, flavor, and entitlement as the parent cluster."
  type        = list(string)
  default     = []

  validation {
    error_message = "Each worker pool must have a unique name."
    condition     = length(var.worker_pool_names) == length(distinct(var.worker_pool_names))
  }
}

variable "use_worker_pool_json" {
  description = "Use detailed JSON information for the creation of worker pools from JSON. Conflicts with `detailed_worker_pools`."
  type        = bool
  default     = false
}

variable "detailed_worker_pools" {
  description = "OPTIONAL - Detailed worker pool configruation. Conflicts with `use_worker_pool_json`."
  type = list(
    object({
      pool_name   = string # Prefix will be prepended onto the pool name
      cluster_vpc = string # name of the vpc where the cluster is provisioned. used to reference cluster dynamically 
      # the folowing will default to the cluster values if not otherwise provided
      resource_group_id = optional(string)
      flavor            = optional(string)
      workers_per_zone  = optional(number)
      encryption_key_id = optional(string)
      kms_instance_guid = optional(string)
    })
  )
  default = []
  validation {
    error_message = "Each worker pool must have a unique name."
    condition = (
      length(var.detailed_worker_pools) == 0
      ? true
      : length(var.detailed_worker_pools.*.pool_name) == length(distinct(var.detailed_worker_pools.*.pool_name))
    )
  }
}

##############################################################################