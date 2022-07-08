// This file was generated by tfxjs
const tfxjs = require("tfxjs");
const tfx = new tfxjs(
  "..",
  {
    ibmcloud_api_key: process.env.API_KEY,
    prefix: "at-3-zone",
    region: "us-south",
    zones: 3
  },
  {
    quiet: true,
  }
);

tfx.plan("tfx Generated Plan", () => {
  tfx.module(
    "Root Module",
    "root_module",
    tfx.resource(
      "Resource Group Management",
      'ibm_resource_group.resource_group["management"]',
      {
        name: "at-3-zone-management-rg",
      }
    ),
    tfx.resource(
      "Resource Group Workload",
      'ibm_resource_group.resource_group["workload"]',
      {
        name: "at-3-zone-workload-rg",
      }
    )
  );

  tfx.module(
    "Icse Vpc Network",
    "module.icse_vpc_network",
    tfx.resource("Format Output", "data.external.format_output", {
      program: ["python3", "vpc_module/scripts/output.py", null],
    })
  );

  tfx.module(
    "Cloud Object Storage",
    "module.icse_vpc_network.module.services.module.cloud_object_storage",
    tfx.resource(
      "Bucket Atracker Bucket",
      'ibm_cos_bucket.bucket["atracker-bucket"]',
      {
        abort_incomplete_multipart_upload_days: [],
        activity_tracking: [],
        archive_rule: [],
        endpoint_type: "public",
        expire_rule: [],
        force_delete: true,
        metrics_monitoring: [],
        noncurrent_version_expiration: [],
        object_versioning: [],
        region_location: "us-south",
        retention_rule: [],
        storage_class: "standard",
      }
    ),
    tfx.resource(
      "Bucket Management Flow Logs Bucket",
      'ibm_cos_bucket.bucket["management-flow-logs-bucket"]',
      {
        abort_incomplete_multipart_upload_days: [],
        activity_tracking: [],
        archive_rule: [],
        endpoint_type: "public",
        expire_rule: [],
        force_delete: true,
        metrics_monitoring: [],
        noncurrent_version_expiration: [],
        object_versioning: [],
        region_location: "us-south",
        retention_rule: [],
        storage_class: "standard",
      }
    ),
    tfx.resource(
      "Bucket Workload Flow Logs Bucket",
      'ibm_cos_bucket.bucket["workload-flow-logs-bucket"]',
      {
        abort_incomplete_multipart_upload_days: [],
        activity_tracking: [],
        archive_rule: [],
        endpoint_type: "public",
        expire_rule: [],
        force_delete: true,
        metrics_monitoring: [],
        noncurrent_version_expiration: [],
        object_versioning: [],
        region_location: "us-south",
        retention_rule: [],
        storage_class: "standard",
      }
    ),
    tfx.resource("Cos Cos", 'ibm_resource_instance.cos["cos"]', {
      location: "global",
      plan: "standard",
      resource_group_id: "43f12020027c446489dff6360d5b821c",
      service: "cloud-object-storage",
    }),
    tfx.resource("Random Cos Suffix", "random_string.random_cos_suffix", {
      length: 8,
      lower: true,
      min_lower: 0,
      min_numeric: 0,
      min_special: 0,
      min_upper: 0,
      number: true,
      numeric: true,
      special: false,
      upper: false,
    })
  );

  tfx.module(
    "Key Management Key Management",
    'module.icse_vpc_network.module.services.module.key_management["key_management"]',
    tfx.resource("Policy 0", "ibm_iam_authorization_policy.policy[0]", {
      description:
        "Allow block storage volumes to be encrypted by Key Management instance.",
      roles: ["Reader"],
      source_service_name: "server-protect",
      target_service_name: "kms",
    }),
    tfx.resource("Key Bucket Key", 'ibm_kms_key.key["bucket-key"]', {
      force_delete: true,
      key_name: "at-3-zone-bucket-key",
      key_ring_id: "default",
      standard_key: false,
    }),
    tfx.resource("Kms 0", "ibm_resource_instance.kms[0]", {
      location: "us-south",
      name: "at-3-zone-kms",
      plan: "tiered-pricing",
      resource_group_id: "43f12020027c446489dff6360d5b821c",
      service: "kms",
    })
  );

  tfx.module(
    "Vpc",
    "module.icse_vpc_network.module.vpc",
    tfx.resource("Format Output", "data.external.format_output", {
      program: [
        "python3",
        ".terraform/modules/icse_vpc_network.vpc/scripts/output.py",
        null,
      ],
    }),
    tfx.resource(
      "Connection Management",
      'ibm_tg_connection.connection["management"]',
      {
        name: "at-3-zone-management-hub-connection",
        network_type: "vpc",
        timeouts: {
          create: "30m",
          delete: "30m",
          update: null,
        },
      }
    ),
    tfx.resource(
      "Connection Workload",
      'ibm_tg_connection.connection["workload"]',
      {
        name: "at-3-zone-workload-hub-connection",
        network_type: "vpc",
        timeouts: {
          create: "30m",
          delete: "30m",
          update: null,
        },
      }
    ),
    tfx.resource("Transit Gateway 0", "ibm_tg_gateway.transit_gateway[0]", {
      global: false,
      location: "us-south",
      name: "at-3-zone-transit-gateway",
      timeouts: {
        create: "30m",
        delete: "30m",
        update: null,
      },
    })
  );

  tfx.module(
    "Vpcs Management",
    'module.icse_vpc_network.module.vpc.module.vpcs["management"]',
    tfx.resource("Vpc", "ibm_is_vpc.vpc", {
      address_prefix_management: "auto",
      classic_access: false,
      name: "at-3-zone-management-vpc",
      resource_group: "43f12020027c446489dff6360d5b821c",
    })
  );

  tfx.module(
    "Public Gateways",
    'module.icse_vpc_network.module.vpc.module.vpcs["management"].module.public_gateways',
    tfx.resource("Gateway Zone 1", 'ibm_is_public_gateway.gateway["zone-1"]', {
      name: "at-3-zone-management-public-gateway-zone-1",
      resource_group: "43f12020027c446489dff6360d5b821c",
      zone: "us-south-1",
    })
  );

  tfx.module(
    "Network Acls",
    'module.icse_vpc_network.module.vpc.module.vpcs["management"].module.network_acls',
    tfx.resource("Acl Vpe Acl", 'ibm_is_network_acl.acl["vpe-acl"]', {
      name: "at-3-zone-management-vpe-acl",
      resource_group: "43f12020027c446489dff6360d5b821c",
      rules: [
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "roks-create-worker-nodes-inbound",
          source: "161.26.0.0/16",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "161.26.0.0/16",
          direction: "outbound",
          icmp: [],
          name: "roks-create-worker-nodes-outbound",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "roks-nodes-to-service-inbound",
          source: "166.8.0.0/14",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "166.8.0.0/14",
          direction: "outbound",
          icmp: [],
          name: "roks-nodes-to-service-outbound",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "allow-app-incoming-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 65535,
              port_min: 1,
              source_port_max: 30000,
              source_port_min: 30000,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "outbound",
          icmp: [],
          name: "allow-app-outgoing-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 32767,
              port_min: 30000,
              source_port_max: 65535,
              source_port_min: 1,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "allow-lb-incoming-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 443,
              port_min: 443,
              source_port_max: 65535,
              source_port_min: 1,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "outbound",
          icmp: [],
          name: "allow-lb-outgoing-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 65535,
              port_min: 1,
              source_port_max: 443,
              source_port_min: 443,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "vpe-allow-inbound-1",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "vpe-allow-inbound-2",
          source: "161.26.0.0/16",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "0.0.0.0/0",
          direction: "outbound",
          icmp: [],
          name: "vpe-allow-outbound-1",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
      ],
    }),
    tfx.resource("Acl Vpn Acl", 'ibm_is_network_acl.acl["vpn-acl"]', {
      name: "at-3-zone-management-vpn-acl",
      resource_group: "43f12020027c446489dff6360d5b821c",
      rules: [
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "roks-create-worker-nodes-inbound",
          source: "161.26.0.0/16",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "161.26.0.0/16",
          direction: "outbound",
          icmp: [],
          name: "roks-create-worker-nodes-outbound",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "roks-nodes-to-service-inbound",
          source: "166.8.0.0/14",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "166.8.0.0/14",
          direction: "outbound",
          icmp: [],
          name: "roks-nodes-to-service-outbound",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "allow-app-incoming-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 65535,
              port_min: 1,
              source_port_max: 30000,
              source_port_min: 30000,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "outbound",
          icmp: [],
          name: "allow-app-outgoing-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 32767,
              port_min: 30000,
              source_port_max: 65535,
              source_port_min: 1,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "allow-lb-incoming-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 443,
              port_min: 443,
              source_port_max: 65535,
              source_port_min: 1,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "outbound",
          icmp: [],
          name: "allow-lb-outgoing-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 65535,
              port_min: 1,
              source_port_max: 443,
              source_port_min: 443,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "vpn-allow-inbound-1",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "vpn-allow-inbound-2",
          source: "161.26.0.0/16",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "0.0.0.0/0",
          direction: "outbound",
          icmp: [],
          name: "vpn-allow-outbound-1",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
      ],
    }),
    tfx.resource("Acl Vsi Acl", 'ibm_is_network_acl.acl["vsi-acl"]', {
      name: "at-3-zone-management-vsi-acl",
      resource_group: "43f12020027c446489dff6360d5b821c",
      rules: [
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "roks-create-worker-nodes-inbound",
          source: "161.26.0.0/16",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "161.26.0.0/16",
          direction: "outbound",
          icmp: [],
          name: "roks-create-worker-nodes-outbound",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "roks-nodes-to-service-inbound",
          source: "166.8.0.0/14",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "166.8.0.0/14",
          direction: "outbound",
          icmp: [],
          name: "roks-nodes-to-service-outbound",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "allow-app-incoming-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 65535,
              port_min: 1,
              source_port_max: 30000,
              source_port_min: 30000,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "outbound",
          icmp: [],
          name: "allow-app-outgoing-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 32767,
              port_min: 30000,
              source_port_max: 65535,
              source_port_min: 1,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "allow-lb-incoming-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 443,
              port_min: 443,
              source_port_max: 65535,
              source_port_min: 1,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "outbound",
          icmp: [],
          name: "allow-lb-outgoing-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 65535,
              port_min: 1,
              source_port_max: 443,
              source_port_min: 443,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "vsi-allow-inbound-1",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "vsi-allow-inbound-2",
          source: "161.26.0.0/16",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "0.0.0.0/0",
          direction: "outbound",
          icmp: [],
          name: "vsi-allow-outbound-1",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
      ],
    })
  );

  tfx.module(
    "Subnets",
    'module.icse_vpc_network.module.vpc.module.vpcs["management"].module.subnets',
    tfx.resource(
      "Subnet at-3-zone Management Vpe 1",
      'ibm_is_subnet.subnet["at-3-zone-management-vpe-1"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.10.20.0/24",
        name: "at-3-zone-management-vpe-1",
        resource_group: "43f12020027c446489dff6360d5b821c",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet at-3-zone Management Vpe 2",
      'ibm_is_subnet.subnet["at-3-zone-management-vpe-2"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.20.20.0/24",
        name: "at-3-zone-management-vpe-2",
        resource_group: "43f12020027c446489dff6360d5b821c",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet at-3-zone Management Vpe 3",
      'ibm_is_subnet.subnet["at-3-zone-management-vpe-3"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.30.20.0/24",
        name: "at-3-zone-management-vpe-3",
        resource_group: "43f12020027c446489dff6360d5b821c",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Subnet at-3-zone Management Vpn 1",
      'ibm_is_subnet.subnet["at-3-zone-management-vpn-1"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.10.30.0/24",
        name: "at-3-zone-management-vpn-1",
        resource_group: "43f12020027c446489dff6360d5b821c",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet at-3-zone Management Vsi 1",
      'ibm_is_subnet.subnet["at-3-zone-management-vsi-1"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.10.10.0/24",
        name: "at-3-zone-management-vsi-1",
        resource_group: "43f12020027c446489dff6360d5b821c",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet at-3-zone Management Vsi 2",
      'ibm_is_subnet.subnet["at-3-zone-management-vsi-2"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.20.10.0/24",
        name: "at-3-zone-management-vsi-2",
        resource_group: "43f12020027c446489dff6360d5b821c",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet at-3-zone Management Vsi 3",
      'ibm_is_subnet.subnet["at-3-zone-management-vsi-3"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.30.10.0/24",
        name: "at-3-zone-management-vsi-3",
        resource_group: "43f12020027c446489dff6360d5b821c",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Subnet Prefix at-3-zone Management Vpe 1",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-3-zone-management-vpe-1"]',
      {
        cidr: "10.10.20.0/24",
        is_default: false,
        name: "at-3-zone-management-vpe-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet Prefix at-3-zone Management Vpe 2",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-3-zone-management-vpe-2"]',
      {
        cidr: "10.20.20.0/24",
        is_default: false,
        name: "at-3-zone-management-vpe-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet Prefix at-3-zone Management Vpe 3",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-3-zone-management-vpe-3"]',
      {
        cidr: "10.30.20.0/24",
        is_default: false,
        name: "at-3-zone-management-vpe-3",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Subnet Prefix at-3-zone Management Vpn 1",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-3-zone-management-vpn-1"]',
      {
        cidr: "10.10.30.0/24",
        is_default: false,
        name: "at-3-zone-management-vpn-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet Prefix at-3-zone Management Vsi 1",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-3-zone-management-vsi-1"]',
      {
        cidr: "10.10.10.0/24",
        is_default: false,
        name: "at-3-zone-management-vsi-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet Prefix at-3-zone Management Vsi 2",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-3-zone-management-vsi-2"]',
      {
        cidr: "10.20.10.0/24",
        is_default: false,
        name: "at-3-zone-management-vsi-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet Prefix at-3-zone Management Vsi 3",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-3-zone-management-vsi-3"]',
      {
        cidr: "10.30.10.0/24",
        is_default: false,
        name: "at-3-zone-management-vsi-3",
        zone: "us-south-3",
      }
    )
  );

  tfx.module(
    "Vpn Gateway",
    'module.icse_vpc_network.module.vpc.module.vpcs["management"].module.vpn_gateway',
    tfx.resource("Gateway 0", "ibm_is_vpn_gateway.gateway[0]", {
      mode: "route",
      name: "at-3-zone-management-vpn-gateway",
      timeouts: {
        create: null,
        delete: "1h",
      },
    })
  );

  tfx.module(
    "Vpcs Workload",
    'module.icse_vpc_network.module.vpc.module.vpcs["workload"]',
    tfx.resource("Vpc", "ibm_is_vpc.vpc", {
      address_prefix_management: "auto",
      classic_access: false,
      name: "at-3-zone-workload-vpc",
    })
  );

  tfx.module(
    "Network Acls",
    'module.icse_vpc_network.module.vpc.module.vpcs["workload"].module.network_acls',
    tfx.resource("Acl Vpe Acl", 'ibm_is_network_acl.acl["vpe-acl"]', {
      name: "at-3-zone-workload-vpe-acl",
      rules: [
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "roks-create-worker-nodes-inbound",
          source: "161.26.0.0/16",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "161.26.0.0/16",
          direction: "outbound",
          icmp: [],
          name: "roks-create-worker-nodes-outbound",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "roks-nodes-to-service-inbound",
          source: "166.8.0.0/14",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "166.8.0.0/14",
          direction: "outbound",
          icmp: [],
          name: "roks-nodes-to-service-outbound",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "allow-app-incoming-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 65535,
              port_min: 1,
              source_port_max: 30000,
              source_port_min: 30000,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "outbound",
          icmp: [],
          name: "allow-app-outgoing-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 32767,
              port_min: 30000,
              source_port_max: 65535,
              source_port_min: 1,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "allow-lb-incoming-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 443,
              port_min: 443,
              source_port_max: 65535,
              source_port_min: 1,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "outbound",
          icmp: [],
          name: "allow-lb-outgoing-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 65535,
              port_min: 1,
              source_port_max: 443,
              source_port_min: 443,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "vpe-allow-inbound-1",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "vpe-allow-inbound-2",
          source: "161.26.0.0/16",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "0.0.0.0/0",
          direction: "outbound",
          icmp: [],
          name: "vpe-allow-outbound-1",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
      ],
    }),
    tfx.resource("Acl Vsi Acl", 'ibm_is_network_acl.acl["vsi-acl"]', {
      name: "at-3-zone-workload-vsi-acl",
      rules: [
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "roks-create-worker-nodes-inbound",
          source: "161.26.0.0/16",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "161.26.0.0/16",
          direction: "outbound",
          icmp: [],
          name: "roks-create-worker-nodes-outbound",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "roks-nodes-to-service-inbound",
          source: "166.8.0.0/14",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "166.8.0.0/14",
          direction: "outbound",
          icmp: [],
          name: "roks-nodes-to-service-outbound",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "allow-app-incoming-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 65535,
              port_min: 1,
              source_port_max: 30000,
              source_port_min: 30000,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "outbound",
          icmp: [],
          name: "allow-app-outgoing-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 32767,
              port_min: 30000,
              source_port_max: 65535,
              source_port_min: 1,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "allow-lb-incoming-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 443,
              port_min: 443,
              source_port_max: 65535,
              source_port_min: 1,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "outbound",
          icmp: [],
          name: "allow-lb-outgoing-traffic-requests",
          source: "10.0.0.0/8",
          tcp: [
            {
              port_max: 65535,
              port_min: 1,
              source_port_max: 443,
              source_port_min: 443,
            },
          ],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "vsi-allow-inbound-1",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "10.0.0.0/8",
          direction: "inbound",
          icmp: [],
          name: "vsi-allow-inbound-2",
          source: "161.26.0.0/16",
          tcp: [],
          udp: [],
        },
        {
          action: "allow",
          destination: "0.0.0.0/0",
          direction: "outbound",
          icmp: [],
          name: "vsi-allow-outbound-1",
          source: "10.0.0.0/8",
          tcp: [],
          udp: [],
        },
      ],
    })
  );

  tfx.module(
    "Subnets",
    'module.icse_vpc_network.module.vpc.module.vpcs["workload"].module.subnets',
    tfx.resource(
      "Subnet at-3-zone Workload Vpe 1",
      'ibm_is_subnet.subnet["at-3-zone-workload-vpe-1"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.40.20.0/24",
        name: "at-3-zone-workload-vpe-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet at-3-zone Workload Vpe 2",
      'ibm_is_subnet.subnet["at-3-zone-workload-vpe-2"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.50.20.0/24",
        name: "at-3-zone-workload-vpe-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet at-3-zone Workload Vpe 3",
      'ibm_is_subnet.subnet["at-3-zone-workload-vpe-3"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.60.20.0/24",
        name: "at-3-zone-workload-vpe-3",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Subnet at-3-zone Workload Vsi 1",
      'ibm_is_subnet.subnet["at-3-zone-workload-vsi-1"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.40.10.0/24",
        name: "at-3-zone-workload-vsi-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet at-3-zone Workload Vsi 2",
      'ibm_is_subnet.subnet["at-3-zone-workload-vsi-2"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.50.10.0/24",
        name: "at-3-zone-workload-vsi-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet at-3-zone Workload Vsi 3",
      'ibm_is_subnet.subnet["at-3-zone-workload-vsi-3"]',
      {
        ip_version: "ipv4",
        ipv4_cidr_block: "10.60.10.0/24",
        name: "at-3-zone-workload-vsi-3",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Subnet Prefix at-3-zone Workload Vpe 1",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-3-zone-workload-vpe-1"]',
      {
        cidr: "10.40.20.0/24",
        is_default: false,
        name: "at-3-zone-workload-vpe-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet Prefix at-3-zone Workload Vpe 2",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-3-zone-workload-vpe-2"]',
      {
        cidr: "10.50.20.0/24",
        is_default: false,
        name: "at-3-zone-workload-vpe-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet Prefix at-3-zone Workload Vpe 3",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-3-zone-workload-vpe-3"]',
      {
        cidr: "10.60.20.0/24",
        is_default: false,
        name: "at-3-zone-workload-vpe-3",
        zone: "us-south-3",
      }
    ),
    tfx.resource(
      "Subnet Prefix at-3-zone Workload Vsi 1",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-3-zone-workload-vsi-1"]',
      {
        cidr: "10.40.10.0/24",
        is_default: false,
        name: "at-3-zone-workload-vsi-1",
        zone: "us-south-1",
      }
    ),
    tfx.resource(
      "Subnet Prefix at-3-zone Workload Vsi 2",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-3-zone-workload-vsi-2"]',
      {
        cidr: "10.50.10.0/24",
        is_default: false,
        name: "at-3-zone-workload-vsi-2",
        zone: "us-south-2",
      }
    ),
    tfx.resource(
      "Subnet Prefix at-3-zone Workload Vsi 3",
      'ibm_is_vpc_address_prefix.subnet_prefix["at-3-zone-workload-vsi-3"]',
      {
        cidr: "10.60.10.0/24",
        is_default: false,
        name: "at-3-zone-workload-vsi-3",
        zone: "us-south-3",
      }
    )
  );

  tfx.module(
    "Flow Logs",
    "module.icse_vpc_network.module.flow_logs",
    tfx.resource(
      "Flow Logs Policy Cos",
      'ibm_iam_authorization_policy.flow_logs_policy["cos"]',
      {
        description:
          "Allow flow logs write access cloud object storage instance",
        roles: ["Writer"],
        source_resource_type: "flow-log-collector",
        source_service_name: "is",
        target_service_name: "cloud-object-storage",
      }
    ),
    tfx.resource(
      "Flow Logs Management",
      'ibm_is_flow_log.flow_logs["management"]',
      {
        active: true,
        name: "at-3-zone-management-flow-logs",
        resource_group: "43f12020027c446489dff6360d5b821c",
      }
    ),
    tfx.resource(
      "Flow Logs Workload",
      'ibm_is_flow_log.flow_logs["workload"]',
      {
        active: true,
        name: "at-3-zone-workload-flow-logs",
      }
    )
  );

  tfx.module(
    "Activity Tracker",
    "module.icse_vpc_network.module.activity_tracker",
    tfx.resource(
      "Atracker Target 0",
      "ibm_atracker_target.atracker_target[0]",
      {
        cos_endpoint: [
          {
            endpoint:
              "s3.private.us-south.cloud-object-storage.appdomain.cloud",
            service_to_service_enabled: null,
          },
        ],
        logdna_endpoint: [],
        name: "at-3-zone-atracker",
        target_type: "cloud_object_storage",
      }
    ),
    tfx.resource("Atracker Cos Key 0", "ibm_resource_key.atracker_cos_key[0]", {
      name: "at-3-zone-atracker-cos-bind-key",
      role: "Writer",
    })
  );
});
