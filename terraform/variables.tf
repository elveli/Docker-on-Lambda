variable "aws_region" {
  description = "The AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.76.0.0/16"
}

variable "lambda_tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default = {
    Environment   = "Production"
    Service       = "lambda-api"
    CreatedBy     = "Terraform"
    docker-lambda = "true"
  }
}
