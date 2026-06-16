# CloudWatch Alarm for high p99 latency
resource "aws_cloudwatch_metric_alarm" "high_latency" {
  alarm_name          = "lambda-high-latency-alert"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "Duration"
  namespace           = "AWS/Lambda"
  period              = "60"
  extended_statistic  = "p99"
  threshold           = "500" # 500ms
  alarm_description   = "This metric monitors lambda p99 latency"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = aws_lambda_function.api.function_name
  }

  tags = var.lambda_tags
}
