# Serverless Container Architecture: AWS Lambda + ECR

This project provides a step-by-step guide and Infrastructure-as-Code (IaC) setup for running Docker containers on AWS Lambda, pulling images from Amazon ECR. 

It features an isolated VPC setup (`10.76.0.0/16`), scalable architecture, and comprehensive monitoring mechanisms using CloudWatch.

## Project Structure

- **`docker/`**: Contains the `Dockerfile` and the serverless `app.py` application.
- **`terraform/`**: Contains Terraform configurations for deploying VPC, IAM, ECR, Lambda, and CloudWatch alarms.

## Deployment Guide

### 1. Build and Push the Docker Container
1. Authenticate your Docker client to your Amazon ECR registry:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
   ```
2. Build the Docker image:
   ```bash
   docker build -t lambda-api-repo ./docker
   ```
3. Tag and push the image to the newly created ECR repository:
   ```bash
   docker tag lambda-api-repo:latest <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/lambda-api-repo:latest
   docker push <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/lambda-api-repo:latest
   ```

### 2. Deploy Infrastructure via Terraform
First, run Terraform to create the ECR repository, VPC, IAM roles, and Lambda function.

```bash
cd terraform
terraform init
terraform apply -auto-approve
```

## Monitoring & Troubleshooting

The setup includes an automatically provisioned CloudWatch Metric Alarm (`lambda-high-latency-alert`) that monitors the `p99` latency of the Lambda function. If the response time exceeds `500ms` for two consecutive periods, it triggers an alert. All deployed resources are tagged with `lambda-tags` (e.g., Environment: Production).

## Multi-Region Disaster Recovery (DR)

To ensure high availability and disaster recovery across multiple regions:
1. **Replicate ECR**: Enable cross-region replication for your ECR repository so images pushed to the primary region are automatically copied to the secondary region.
2. **Duplicate IaC**: Deploy a secondary stack in another region (e.g., `us-west-2`) using a different `.tfvars` file or a Terraform workspace. Ensure VPC CIDRs do not overlap if peering is required in the future.
3. **Route 53 Failover**: Use Amazon API Gateway or an Application Load Balancer as a trigger for both Lambda functions, and configure Route 53 with an Active-Passive Failover routing policy. If the primary region's health check fails, Route 53 routes traffic to the secondary region.

## Estimated Cost Aspect

*Estimated Monthly Run Rate for 1 Million requests/month:*
- **Lambda Compute (Tier 1)**: ~$18.40 (depends on memory allocation and duration). 
- **ECR Storage & Transfer**: ~$0.50 (Storage per GB is $0.10).
- **VPC Interface Endpoints / NAT Gateways**: ~$22.50 (If private networking outbound access is required via VPC endpoints).
- **Total**: ~$41.40 / month

*Note: The AWS free tier can significantly reduce Lambda and ECR costs for the first few months or under low usage.*
