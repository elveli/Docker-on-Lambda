# Serverless Container Architecture: AWS Lambda + ECR

This project provides a step-by-step guide and Infrastructure-as-Code (IaC) setup for running Docker containers on AWS Lambda, pulling images from Amazon ECR. 

It features an isolated VPC setup (`10.76.0.0/16`), scalable architecture, and comprehensive monitoring mechanisms using CloudWatch.

## Why Containerize on Lambda? (Lambda Usage)
By running a container image on AWS Lambda, you combine the predictability and portability of Docker with the scale-to-zero serverless economics of Lambda. Lambda pulls the image from Amazon ECR upon invocation, provisions a microVM under the hood, and executes your code without requiring you to manage or patch underlying servers.

## Project Structure

- **`docker/`**: Contains the `Dockerfile` and the serverless `app.py` application.
- **`terraform/`**: Contains Terraform configurations for deploying VPC, IAM, ECR, Lambda, and CloudWatch alarms.

## Prerequisites

Before starting, ensure you have the following installed and running on your local machine:
- **Docker Daemon**: You must have Docker running (e.g., [Docker Desktop](https://www.docker.com/products/docker-desktop), [OrbStack](https://orbstack.dev/), or Colima) to build and push the container image to ECR.
- **Terraform CLI**: To provision the AWS infrastructure.
- **AWS CLI**: Configured with appropriate credentials to access your AWS account.

## Deployment Guide

### 1. Create the ECR Repository
Before you can push your Docker image, you must provision the ECR repository using Terraform. This resolves the chicken-and-egg dependency issue.

```bash
cd terraform
terraform init
terraform apply -target=aws_ecr_repository.lambda_repo -auto-approve
```

### 2. Build and Push the Docker Container
1. Get your AWS Account ID and set it as an environment variable:
   ```bash
   export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
   export AWS_REGION=us-east-1
   ```
2. Authenticate your Docker client to your Amazon ECR registry:
   ```bash
   aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
   ```
3. Build the Docker image:
   ```bash
   docker build -t lambda-api-repo ../docker
   ```
4. Tag and push the image to the newly created ECR repository:
   ```bash
   docker tag lambda-api-repo:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/lambda-api-repo:latest
   docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/lambda-api-repo:latest
   ```

### 3. Deploy Infrastructure via Terraform
Now that the Docker image exists in ECR, run Terraform to create the remaining resources (VPC, IAM roles, and Lambda function) without errors.

```bash
terraform apply -auto-approve
```

### 3. Useful Docker CLI Commands

Here are some commands to check, inspect, and test your local Docker image before pushing to ECR. 

> **Note:** The `docker` and `dive` CLI commands below connect to your **local Docker daemon** (e.g., Docker Desktop, OrbStack) and analyze the image cached locally on your machine. They do not connect directly to the remote Amazon ECR unless you prepend the full ECR URI to the image name.

**Check built images:**
```bash
docker images | grep lambda-api-repo
```

**Run the container locally:**
To map the Lambda Runtime Interface Emulator (RIE) to port 9000 and test locally:
```bash
docker run -p 9000:8080 lambda-api-repo:latest
```

**Test the local container endpoint:**
In a separate terminal, trigger the local Lambda environment:
```bash
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'
```

**View running containers and logs:**
```bash
# List running containers
docker ps

# Get container ID for the specific image
docker ps -q -f ancestor=lambda-api-repo:latest

# View logs for a running container
docker logs $(docker ps -q -f ancestor=lambda-api-repo:latest)

# Follow logs in real-time
docker logs -f $(docker ps -q -f ancestor=lambda-api-repo:latest)
```

**Inspect image details:**
```bash
# View image configuration, layers, and environment variables
docker inspect lambda-api-repo:latest

# Check the history of image layers
docker history lambda-api-repo:latest
```

**Analyze image layers and space:**
```bash
# Discover wasted space and layer details with dive
dive lambda-api-repo:latest
```

**Scan vulnerabilities with Docker Scout:**
```bash
# Get a quick overview of image vulnerabilities
docker scout quickview lambda-api-repo:latest

# Get detailed CVE information
docker scout cves lambda-api-repo:latest
```

### 4. Useful AWS Lambda CLI Commands

To inspect, invoke, or troubleshoot the deployed Lambda function directly from your terminal:

**View Lambda Configuration:**
```bash
# Returns memory size, timeout, role, VPC config, and attached ECR image URI
aws lambda get-function-configuration --function-name lambda-docker-api
```

**Invoke the Lambda remotely & check output:**
```bash
# Triggers the function and saves the response payload to response.json
aws lambda invoke --function-name lambda-docker-api --payload '{}' response.json
cat response.json
```

**Fetch Lambda Logs (CloudWatch Tail):**
```bash
# Streams real-time logs from CloudWatch for the function
aws logs tail /aws/lambda/lambda-docker-api --follow
```

**Check applied Lambda Tags:**
```bash
aws lambda list-tags --resource arn:aws:lambda:${AWS_REGION}:${AWS_ACCOUNT_ID}:function:lambda-docker-api
```

### 5. Useful AWS IAM CLI Commands

To verify the IAM roles and policies created for this project:

**List the Lambda execution role:**
```bash
aws iam get-role --role-name lambda_execution_role
```

**List policies attached to the role:**
```bash
aws iam list-attached-role-policies --role-name lambda_execution_role
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
