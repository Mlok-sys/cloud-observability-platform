# Cloud Observability Platform on AWS

A fully monitored and automated cloud project deployed on AWS EC2, built using:

- Terraform (Infrastructure as Code)
- Docker & Docker Compose
- Prometheus + Node Exporter (Metrics)
- Grafana (Dashboards)
- Loki + Promtail (Logging)
- GitHub Actions CI/CD Pipeline

This platform provides real-time visibility into system performance, logs, and application behavior.

---

## Architecture Overview

The EC2 instance hosts a complete observability stack using Docker Compose:

User → (HTTPS) NGINX Reverse Proxy  
↓  
Docker Containers:  
- myapp (Node.js + Prometheus instrumentation)  
- Prometheus (scrapes app + Node Exporter)  
- Grafana (dashboards)  
- Loki (log aggregation)  
- Promtail (log forwarding)

Prometheus also scrapes host-level metrics using Node Exporter.

---

## Features

| Capability | Tool |
|-----------|------|
| Infrastructure as Code | Terraform |
| Metrics Collection | Prometheus, Node Exporter |
| Log Aggregation | Loki + Promtail |
| Visualization Dashboards | Grafana |
| App Instrumentation | Prometheus JavaScript Client |
| Automated Deployments | GitHub Actions |
| HTTPS Access | NGINX + Let’s Encrypt |

---

## Project Demonstration

- Cloud automation deployment flow  
- Centralized metrics and logging
- Real-time dashboards and alerting foundation
- Full DevOps workflow automation

---

## Live Application

Website: https://app.abdulmalikalorayfijstudying.com  
Metrics endpoint: `/metrics`

---

## Grafana Dashboards

- Node Exporter dashboard (CPU, RAM, Disk)
- Application performance dashboard (request latency and failures)
- Prometheus targets overview

Dashboards update live automatically.

---

## Project Structure
cloud-observability-platform/
│
├── Infra/                        # Terraform files
│   ├── main.tf
│   ├── provider.tf
│   ├── variables.tf
│   └── outputs.tf
│
├── monitoring/                   # Docker monitoring stack
│   ├── docker-compose.yml
│   ├── prometheus.yml
│   └── promtail-config.yml
│
└── app/
├── Dockerfile
├── server.js
└── public/ (HTML, CSS, images)

---

## CI/CD Pipeline

Every push to main triggers automated deployment:

1. Starts the AWS EC2 instance
2. Copies updated monitoring and app directories to the instance
3. Rebuilds and redeploys containers with Docker Compose
4. Verifies all monitoring components are running successfully

Workflow: `.github/workflows/deploy.yml

Requirements
	•	AWS account
	•	IAM user with EC2 permissions
	•	SSH key pair
	•	Terraform 1.x
	•	Docker & Docker Compose


