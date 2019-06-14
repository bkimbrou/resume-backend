data "aws_region" "current" {}

data "aws_caller_identity" "current" {}

data "archive_file" "lambda_zip" {
  output_path = "../dist/lambda.zip"
  type = "zip"
  source_file = "../dist/index.js"
}

data "aws_iam_policy_document" "lambda_assume_role_policy" {
  statement {
    principals {
      identifiers = ["lambda.amazonaws.com"]
      type = "Service"
    }
    actions = ["sts:AssumeRole"]
    effect = "Allow"
  }
}

data "aws_iam_policy_document" "lambda_dynamo_read_policy" {
  statement {
    actions = ["dynamodb:Scan"]
    effect = "Allow"
    resources = [
      aws_dynamodb_table.certifications_table.arn,
      aws_dynamodb_table.configs_table.arn,
      aws_dynamodb_table.education_table.arn,
      aws_dynamodb_table.jobs_table.arn,
      aws_dynamodb_table.skills_table.arn
    ]
  }
}

data "aws_iam_policy_document" "lambda_dynamo_write_policy" {
  statement {
    actions = [
      "dynamodb:PutItem",
      "dynamodb:DeleteItem"
    ]
    effect = "Allow"
    resources = [
      aws_dynamodb_table.certifications_table.arn,
      aws_dynamodb_table.configs_table.arn,
      aws_dynamodb_table.education_table.arn,
      aws_dynamodb_table.jobs_table.arn,
      aws_dynamodb_table.skills_table.arn
    ]
  }
}

data "aws_iam_policy" "lambda_basic_policy" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}