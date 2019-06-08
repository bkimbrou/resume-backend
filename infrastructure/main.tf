# DYNAMO RESOURCES
resource "aws_dynamodb_table" "certifications_table" {
  hash_key = "id"
  name = var.certifications_table
  read_capacity = 3
  write_capacity = 1
  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "name"
    type = "S"
  }
  attribute {
    name = "description"
    type = "S"
  }
  attribute {
    name = "dateIssued"
    type = "S"
  }
  attribute {
    name = "dateExpires"
    type = "S"
  }
  attribute {
    name = "image"
    type = "S"
  }
}

resource "aws_dynamodb_table" "education_table" {
  hash_key = "id"
  name = var.education_table
  read_capacity = 3
  write_capacity = 1
  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "school"
    type = "S"
  }
  attribute {
    name = "location"
    type = "S"
  }
  attribute {
    name = "isCurrentlyAttending"
    type = "BOOL"
  }
  attribute {
    name = "degree"
    type = "S"
  }
  attribute {
    name = "graduationDate"
    type = "S"
  }
}

resource "aws_dynamodb_table" "jobs_table" {
  hash_key = "id"
  name = var.jobs_table
  read_capacity = 3
  write_capacity = 1
  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "employer"
    type = "S"
  }
  attribute {
    name = "title"
    type = "S"
  }
  attribute {
    name = "responsibilities"
    type = "SS"
  }
  attribute {
    name = "startDate"
    type = "S"
  }
  attribute {
    name = "endDate"
    type = "S"
  }
}

resource "aws_dynamodb_table" "skills_table" {
  hash_key = "id"
  name = var.skills_table
  read_capacity = 3
  write_capacity = 1
  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "name"
    type = "S"
  }
  attribute {
    name = "description"
    type = "S"
  }
  attribute {
    name = "monthsOfExperience"
    type = "N"
  }
  attribute {
    name = "dateLastUsed"
    type = "S"
  }
}

resource "aws_dynamodb_table" "configs_table" {
  hash_key = "env"
  name = "configs_table"
  read_capacity = 12
  write_capacity = 1
  attribute {
    name = "env"
    type = "S"
  }
  attribute {
    name = "config"
    type = "M"
  }
}

# IAM RESOURCES
resource "aws_iam_role" "lambda_read_role" {
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy.json
  name = "resume-backend-lambda-read-role"
}

resource "aws_iam_policy" "lambda_dynamo_read_policy" {
  name = "resume-backend-dynamo-read-policy"
  policy = data.aws_iam_policy_document.lambda_dynamo_read_policy.json
}

resource "aws_iam_role" "lambda_write_role" {
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy.json
  name = "resume-backend-lambda-write-role"
}

resource "aws_iam_policy" "lambda_dynamo_write_policy" {
  name = "resume-backend-dynamo-write-policy"
  policy = data.aws_iam_policy_document.lambda_dynamo_read_policy.json
}

resource "aws_iam_policy_attachment" "lambda_read_role_attach_dynamo" {
  name = "lambda_read_role_attach_dynamo"
  policy_arn = aws_iam_policy.lambda_dynamo_read_policy.arn
  roles = [
    aws_iam_role.lambda_read_role.name,
    aws_iam_role.lambda_write_role.name
  ]
}

resource "aws_iam_policy_attachment" "lambda_read_role_attach_dynamo" {
  name = "lambda_write_role_attach_dynamo"
  policy_arn = aws_iam_policy.lambda_dynamo_write_policy.arn
  roles = [
    aws_iam_role.lambda_write_role.name
  ]
}

# LAMBDA RESOURCES
resource "aws_lambda_function" "read_all_certifications_lambda" {
  function_name = "ReadAllCertifications"
  handler = "readCertificationsHandler"
  role = aws_iam_role.lambda_read_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "read_all_education_lambda" {
  function_name = "ReadAllEducation"
  handler = "readEducationHandler"
  role = aws_iam_role.lambda_read_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "read_all_jobs_lambda" {
  function_name = "ReadAllJobs"
  handler = "readJobsHandler"
  role = aws_iam_role.lambda_read_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "read_all_skills_lambda" {
  function_name = "ReadAllSkills"
  handler = "readSkillsHandler"
  role = aws_iam_role.lambda_read_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "upsert_certifications_lambda" {
  function_name = "UpsertCertifications"
  handler = "upsertCertificationsHandler"
  role = aws_iam_role.lambda_write_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "upsert_education_lambda" {
  function_name = "UpsertAllEducation"
  handler = "upsertEducationHandler"
  role = aws_iam_role.lambda_write_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "upsert_jobs_lambda" {
  function_name = "UpsertAllJobs"
  handler = "upsertJobsHandler"
  role = aws_iam_role.lambda_write_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "upsert_skills_lambda" {
  function_name = "UpsertAllSkills"
  handler = "upsertSkillsHandler"
  role = aws_iam_role.lambda_write_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "delete_certifications_lambda" {
  function_name = "DeleteCertifications"
  handler = "deleteCertificationsHandler"
  role = aws_iam_role.lambda_write_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "delete_education_lambda" {
  function_name = "DeleteAllEducation"
  handler = "deleteEducationHandler"
  role = aws_iam_role.lambda_write_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "delete_jobs_lambda" {
  function_name = "DeleteAllJobs"
  handler = "deleteJobsHandler"
  role = aws_iam_role.lambda_write_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "delete_skills_lambda" {
  function_name = "DeleteAllSkills"
  handler = "deleteSkillsHandler"
  role = aws_iam_role.lambda_write_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables {
      CONFIG_TABLE = var.configs_table
    }
  }
}