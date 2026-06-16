resource "aws_lambda_function" "api" {
  function_name = "lambda-docker-api"
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.lambda_repo.repository_url}:latest"
  role          = aws_iam_role.lambda_exec.arn

  vpc_config {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  timeout     = 30
  memory_size = 512

  tags = var.lambda_tags

  # Ensure the role is attached before creating the function
  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_access
  ]
}
