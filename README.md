# Serverless Container Architecture: AWS Lambda + ECR

This project provides a step-by-step guide and Infrastructure-as-Code (IaC) setup for running Docker containers on AWS Lambda, pulling images from Amazon ECR. 

It features an isolated VPC setup (`10.76.0.0/16`), scalable architecture, and comprehensive monitoring mechanisms using CloudWatch.

## Why Containerize on Lambda? (Lambda Usage)
By running a container image on AWS Lambda, you combine the predictability and portability of Docker with the scale-to-zero serverless economics of Lambda. Lambda pulls the image from Amazon ECR upon invocation, provisions a microVM under the hood, and executes your code without requiring you to manage or patch underlying servers.

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

### 3. Useful Docker CLI Commands

Here are some commands to check, inspect, and test your local Docker image before pushing to ECR:

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

# View logs for a running container
docker logs <container_id>

# Follow logs in real-time
docker logs -f <container_id>
```

**Inspect image details:**
```bash
# View image configuration, layers, and environment variables
docker inspect lambda-api-repo:latest

# Check the history of image layers
docker history lambda-api-repo:latest
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
aws lambda list-tags --resource arn:aws:lambda:<REGION>:<ACCOUNT_ID>:function:lambda-docker-api
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
