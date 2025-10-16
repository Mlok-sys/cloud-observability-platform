# ☁️ Cloud Observability Platform

This project builds a **complete observability and monitoring environment on AWS** using **Terraform**, **Docker**, and **Grafana**.  
It automates infrastructure provisioning, monitoring deployment, and continuous delivery through **GitHub Actions**.

---

## 🚀 Project Overview

This platform provides end-to-end visibility for cloud systems using:
- **Terraform** for Infrastructure-as-Code (IaC)
- **Docker Compose** for containerized observability stack
- **Grafana + Prometheus** for metrics collection & visualization
- **Loki + Promtail** for centralized logging
- **GitHub Actions** for CI/CD automation to EC2
- **Elastic IP** for persistent access to the monitoring server

---

## 🧱 Architecture

Cloud-Observability-Platform/
│
├── Infra/
│ ├── main.tf
│ ├── variables.tf
│ ├── outputs.tf
│ ├── provider.tf
│ └── home/
│ └── ec2-user/
│ └── monitoring/
│ ├── docker-compose.yml
│ ├── prometheus.yml
│ └── promtail-config.yml
│
├── app/
│ ├── Dockerfile
│ ├── server.js
│ └── package.json
│
├── .github/
│ └── workflows/
│ └── deploy.yml
│
└── README.md