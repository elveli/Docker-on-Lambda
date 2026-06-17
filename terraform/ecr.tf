# ECR Repository to store the Docker image
resource "aws_ecr_repository" "lambda_repo" {
  name                 = "lambda-api-repo"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = var.lambda_tags
}
