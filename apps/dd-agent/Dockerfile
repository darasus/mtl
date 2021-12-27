FROM gcr.io/datadoghq/agent:latest

# disable autoconfigured checks; DD container checks
# do not work as-is on Render since there's no access
# to Kubelet/kube-state-metrics.
ENV DD_AUTOCONFIG_FROM_ENVIRONMENT=false

ENV NON_LOCAL_TRAFFIC=true
ENV DD_LOGS_STDOUT=yes
ENV DD_LOGS_ENABLED=true

ENV DD_APM_ENABLED=true
ENV DD_APM_NON_LOCAL_TRAFFIC=true

ENV DD_DOGSTATSD_NON_LOCAL_TRAFFIC=true
ENV DD_PROCESS_AGENT_ENABLED=true

ENV DD_SITE "datadoghq.eu"

ENV DD_BIND_HOST "127.0.0.1"
ENV DD_HOSTNAME "127.0.0.1"