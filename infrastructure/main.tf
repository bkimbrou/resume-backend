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

resource "aws_iam_policy_attachment" "lambda_write_role_attach_dynamo" {
  name = "lambda_write_role_attach_dynamo"
  policy_arn = aws_iam_policy.lambda_dynamo_write_policy.arn
  roles = [
    aws_iam_role.lambda_write_role.name
  ]
}

# LAMBDA RESOURCES
resource "aws_lambda_function" "readall_certifications" {
  function_name = "ReadAllCertifications"
  handler = "readCertificationsHandler"
  role = aws_iam_role.lambda_read_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables = {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "readall_education" {
  function_name = "ReadAllEducation"
  handler = "readEducationHandler"
  role = aws_iam_role.lambda_read_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables = {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "readall_jobs" {
  function_name = "ReadAllJobs"
  handler = "readJobsHandler"
  role = aws_iam_role.lambda_read_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables = {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "readall_skills" {
  function_name = "ReadAllSkills"
  handler = "readSkillsHandler"
  role = aws_iam_role.lambda_read_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables = {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "put_certification" {
  function_name = "UpsertCertifications"
  handler = "upsertCertificationsHandler"
  role = aws_iam_role.lambda_write_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables = {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "put_education" {
  function_name = "UpsertAllEducation"
  handler = "upsertEducationHandler"
  role = aws_iam_role.lambda_write_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables = {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "put_job" {
  function_name = "UpsertAllJobs"
  handler = "upsertJobsHandler"
  role = aws_iam_role.lambda_write_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables = {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "put_skill" {
  function_name = "UpsertAllSkills"
  handler = "upsertSkillsHandler"
  role = aws_iam_role.lambda_write_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables = {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "delete_certification" {
  function_name = "DeleteCertifications"
  handler = "deleteCertificationsHandler"
  role = aws_iam_role.lambda_write_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables = {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "delete_education" {
  function_name = "DeleteAllEducation"
  handler = "deleteEducationHandler"
  role = aws_iam_role.lambda_write_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables = {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "delete_job" {
  function_name = "DeleteAllJobs"
  handler = "deleteJobsHandler"
  role = aws_iam_role.lambda_write_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables = {
      CONFIG_TABLE = var.configs_table
    }
  }
}

resource "aws_lambda_function" "delete_skill" {
  function_name = "DeleteAllSkills"
  handler = "deleteSkillsHandler"
  role = aws_iam_role.lambda_write_role.arn
  runtime = "nodejs10.x"
  filename = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables = {
      CONFIG_TABLE = var.configs_table
    }
  }
}

# API GATEWAY RESOURCES

## API DEFINITION
resource "aws_api_gateway_rest_api" "resume_api" {
  name = "resume-api"
  description = "API to access the resources needed for a resume"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

## API RESOURCES

resource "aws_api_gateway_resource" "certifications" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  parent_id = aws_api_gateway_rest_api.resume_api.root_resource_id
  path_part = "certifications"
}

resource "aws_api_gateway_resource" "certification_id" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  parent_id = aws_api_gateway_resource.certifications.id
  path_part = "{id}"
}

resource "aws_api_gateway_resource" "education" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  parent_id = aws_api_gateway_rest_api.resume_api.root_resource_id
  path_part = "education"
}

resource "aws_api_gateway_resource" "education_id" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  parent_id = aws_api_gateway_resource.education.id
  path_part = "{id}"
}

resource "aws_api_gateway_resource" "jobs" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  parent_id = aws_api_gateway_rest_api.resume_api.root_resource_id
  path_part = "jobs"
}

resource "aws_api_gateway_resource" "job_id" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  parent_id = aws_api_gateway_resource.jobs.id
  path_part = "{id}"
}

resource "aws_api_gateway_resource" "skills" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  parent_id = aws_api_gateway_rest_api.resume_api.root_resource_id
  path_part = "skills"
}

resource "aws_api_gateway_resource" "skill_id" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  parent_id = aws_api_gateway_resource.skills.id
  path_part = "{id}"
}

## API METHODS

resource "aws_api_gateway_method" "readall_certifications" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.certifications.id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "put_certification" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.certifications.id
  http_method = "PUT"
  authorization = "NONE" #TODO: Replace with cognito
  request_validator_id = aws_api_gateway_request_validator.api_body_validator.id

  request_models = {
    "application/json" = aws_api_gateway_model.certification.name
  }
}

resource "aws_api_gateway_method" "delete_certification" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.certification_id.id
  http_method = "DELETE"
  authorization = "NONE" #TODO: Replace with cognito
  request_validator_id = aws_api_gateway_request_validator.api_parameter_validator.id

  request_parameters = {
    "method.request.path.id" = true
  }
}

resource "aws_api_gateway_method" "readall_education" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.education.id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "put_education" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.education.id
  http_method = "PUT"
  authorization = "NONE" #TODO: Replace with cognito
  request_validator_id = aws_api_gateway_request_validator.api_body_validator.id

  request_models = {
    "application/json" = aws_api_gateway_model.education.name
  }
}

resource "aws_api_gateway_method" "delete_education" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.education_id.id
  http_method = "DELETE"
  authorization = "NONE" #TODO: Replace with cognito
  request_validator_id = aws_api_gateway_request_validator.api_parameter_validator.id

  request_parameters = {
    "method.request.path.id" = true
  }
}

resource "aws_api_gateway_method" "readall_jobs" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.jobs.id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "put_job" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.jobs.id
  http_method = "PUT"
  authorization = "NONE" #TODO: Replace with cognito
  request_validator_id = aws_api_gateway_request_validator.api_body_validator.id

  request_models = {
    "application/json" = aws_api_gateway_model.job.name
  }
}

resource "aws_api_gateway_method" "delete_job" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.job_id.id
  http_method = "DELETE"
  authorization = "NONE" #TODO: Replace with cognito
  request_validator_id = aws_api_gateway_request_validator.api_parameter_validator.id

  request_parameters = {
    "method.request.path.id" = true
  }
}

resource "aws_api_gateway_method" "readall_skills" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.skills.id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "put_skill" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.skills.id
  http_method = "PUT"
  authorization = "NONE" #TODO: Replace with cognito
  request_validator_id = aws_api_gateway_request_validator.api_body_validator.id

  request_models = {
    "application/json" = aws_api_gateway_model.skill.name
  }
}

resource "aws_api_gateway_method" "delete_skill" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.skill_id.id
  http_method = "DELETE"
  authorization = "NONE" #TODO: Replace with cognito
  request_validator_id = aws_api_gateway_request_validator.api_parameter_validator.id

  request_parameters = {
    "method.request.path.id" = true
  }
}

## API METHOD INTEGRATIONS

locals {
  api_lambda_source_base = "arn:aws:apigateway:${data.aws_region.current.name}:lambda:path/2015-03-31/functions/"
  execute_api_base = "arn:aws:ececute-api:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.resume_api.id}/*/"
}

resource "aws_api_gateway_integration" "readall_certifications" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.certifications.id
  http_method = aws_api_gateway_method.readall_certifications.http_method
  type = "AWS"
  integration_http_method = "POST"
  uri = "${local.api_lambda_source_base}${aws_lambda_function.readall_certifications.arn}/invocations"
  passthrough_behavior = "WHEN_NO_MATCH"

  request_templates = {
    "application/json" = file("api/mappings/request.map")
  }
}

resource "aws_api_gateway_integration" "readall_education" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.education.id
  http_method = aws_api_gateway_method.readall_education.http_method
  type = "AWS"
  integration_http_method = "POST"
  uri = "${local.api_lambda_source_base}${aws_lambda_function.readall_education.arn}/invocations"
  passthrough_behavior = "WHEN_NO_MATCH"

  request_templates = {
    "application/json" = file("api/mappings/request.map")
  }
}

resource "aws_api_gateway_integration" "readall_jobs" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.jobs.id
  http_method = aws_api_gateway_method.readall_jobs.http_method
  type = "AWS"
  integration_http_method = "POST"
  uri = "${local.api_lambda_source_base}${aws_lambda_function.readall_jobs.arn}/invocations"
  passthrough_behavior = "WHEN_NO_MATCH"

  request_templates = {
    "application/json" = file("api/mappings/request.map")
  }
}

resource "aws_api_gateway_integration" "readall_skills" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.skills.id
  http_method = aws_api_gateway_method.readall_skills.http_method
  type = "AWS"
  integration_http_method = "POST"
  uri = "${local.api_lambda_source_base}${aws_lambda_function.readall_skills.arn}/invocations"
  passthrough_behavior = "WHEN_NO_MATCH"

  request_templates = {
    "application/json" = file("api/mappings/request.map")
  }
}

resource "aws_api_gateway_integration" "put_certification" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.certifications.id
  http_method = aws_api_gateway_method.put_certification.http_method
  type = "AWS"
  integration_http_method = "POST"
  uri = "${local.api_lambda_source_base}${aws_lambda_function.put_certification.arn}/invocations"
  passthrough_behavior = "NEVER"

  request_templates = {
    "application/json" = file("api/mappings/request.map")
  }
}

resource "aws_api_gateway_integration" "put_education" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.education.id
  http_method = aws_api_gateway_method.put_education.http_method
  type = "AWS"
  integration_http_method = "POST"
  uri = "${local.api_lambda_source_base}${aws_lambda_function.put_education.arn}/invocations"
  passthrough_behavior = "NEVER"

  request_templates = {
    "application/json" = file("api/mappings/request.map")
  }
}

resource "aws_api_gateway_integration" "put_job" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.jobs.id
  http_method = aws_api_gateway_method.put_job.http_method
  type = "AWS"
  integration_http_method = "POST"
  uri = "${local.api_lambda_source_base}${aws_lambda_function.put_job.arn}/invocations"
  passthrough_behavior = "NEVER"

  request_templates = {
    "application/json" = file("api/mappings/request.map")
  }
}

resource "aws_api_gateway_integration" "put_skill" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.skills.id
  http_method = aws_api_gateway_method.put_skill.http_method
  type = "AWS"
  integration_http_method = "POST"
  uri = "${local.api_lambda_source_base}${aws_lambda_function.put_skill.arn}/invocations"
  passthrough_behavior = "NEVER"

  request_templates = {
    "application/json" = file("api/mappings/request.map")
  }
}

resource "aws_api_gateway_integration" "delete_certification" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.certification_id.id
  http_method = aws_api_gateway_method.delete_certification.http_method
  type = "AWS"
  integration_http_method = "POST"
  uri = "${local.api_lambda_source_base}${aws_lambda_function.delete_certification.arn}/invocations"
  passthrough_behavior = "NEVER"

  request_templates = {
    "application/json" = file("api/mappings/request.map")
  }
}

resource "aws_api_gateway_integration" "delete_education" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.education_id.id
  http_method = aws_api_gateway_method.delete_education.http_method
  type = "AWS"
  integration_http_method = "POST"
  uri = "${local.api_lambda_source_base}${aws_lambda_function.delete_education.arn}/invocations"
  passthrough_behavior = "NEVER"

  request_templates = {
    "application/json" = file("api/mappings/request.map")
  }
}

resource "aws_api_gateway_integration" "delete_job" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.job_id.id
  http_method = aws_api_gateway_method.delete_job.http_method
  type = "AWS"
  integration_http_method = "POST"
  uri = "${local.api_lambda_source_base}${aws_lambda_function.delete_job.arn}/invocations"
  passthrough_behavior = "NEVER"

  request_templates = {
    "application/json" = file("api/mappings/request.map")
  }
}

resource "aws_api_gateway_integration" "delete_skill" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  resource_id = aws_api_gateway_resource.skill_id.id
  http_method = aws_api_gateway_method.delete_skill.http_method
  type = "AWS"
  integration_http_method = "POST"
  uri = "${local.api_lambda_source_base}${aws_lambda_function.delete_skill.arn}/invocations"
  passthrough_behavior = "NEVER"

  request_templates = {
    "application/json" = file("api/mappings/request.map")
  }
}

## LAMBDA PERMISSIONS

resource "aws_lambda_permission" "readall_certifications" {
  function_name = aws_lambda_function.readall_certifications.function_name
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "${local.execute_api_base}${aws_api_gateway_method.readall_certifications.http_method}/${aws_api_gateway_resource.certifications.path}"
}

resource "aws_lambda_permission" "readall_education" {
  function_name = aws_lambda_function.readall_education.function_name
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "${local.execute_api_base}${aws_api_gateway_method.readall_education.http_method}/${aws_api_gateway_resource.education.path}"
}

resource "aws_lambda_permission" "readall_jobs" {
  function_name = aws_lambda_function.readall_jobs.function_name
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "${local.execute_api_base}${aws_api_gateway_method.readall_jobs.http_method}/${aws_api_gateway_resource.jobs.path}"
}

resource "aws_lambda_permission" "readall_skills" {
  function_name = aws_lambda_function.readall_skills.function_name
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "${local.execute_api_base}${aws_api_gateway_method.readall_skills.http_method}/${aws_api_gateway_resource.skills.path}"
}

resource "aws_lambda_permission" "put_certification" {
  function_name = aws_lambda_function.put_certification.function_name
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "${local.execute_api_base}${aws_api_gateway_method.put_certification.http_method}/${aws_api_gateway_resource.certifications.path}"
}

resource "aws_lambda_permission" "put_education" {
  function_name = aws_lambda_function.readall_education.function_name
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "${local.execute_api_base}${aws_api_gateway_method.put_education.http_method}/${aws_api_gateway_resource.education.path}"
}

resource "aws_lambda_permission" "put_job" {
  function_name = aws_lambda_function.put_job.function_name
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "${local.execute_api_base}${aws_api_gateway_method.put_job.http_method}/${aws_api_gateway_resource.jobs.path}"
}

resource "aws_lambda_permission" "put_skill" {
  function_name = aws_lambda_function.readall_skills.function_name
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "${local.execute_api_base}${aws_api_gateway_method.put_skill.http_method}/${aws_api_gateway_resource.skills.path}"
}

resource "aws_lambda_permission" "delete_certification" {
  function_name = aws_lambda_function.delete_certification.function_name
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "${local.execute_api_base}${aws_api_gateway_method.delete_certification.http_method}/${aws_api_gateway_resource.certification_id.path}"
}

resource "aws_lambda_permission" "delete_education" {
  function_name = aws_lambda_function.delete_education.function_name
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "${local.execute_api_base}${aws_api_gateway_method.delete_education.http_method}/${aws_api_gateway_resource.education_id.path}"
}

resource "aws_lambda_permission" "delete_job" {
  function_name = aws_lambda_function.delete_job.function_name
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "${local.execute_api_base}${aws_api_gateway_method.delete_job.http_method}/${aws_api_gateway_resource.job_id.path}"
}

resource "aws_lambda_permission" "delete_skill" {
  function_name = aws_lambda_function.delete_skill.function_name
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "${local.execute_api_base}${aws_api_gateway_method.delete_skill.http_method}/${aws_api_gateway_resource.skill_id.path}"
}

## API REQUEST VALIDATORS

resource "aws_api_gateway_request_validator" "api_body_validator" {
  name = "body-validator"
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  validate_request_body = true
  validate_request_parameters = false
}

resource "aws_api_gateway_request_validator" "api_parameter_validator" {
  name = "body-validator"
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  validate_request_body = false
  validate_request_parameters = true
}

## API MODELS

resource "aws_api_gateway_model" "certification" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  content_type = "application/json"
  name = "Certification"
  schema = file("api/models/certification.json")
}

resource "aws_api_gateway_model" "education" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  content_type = "application/json"
  name = "Certification"
  schema = file("api/models/education.json")
}

resource "aws_api_gateway_model" "job" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  content_type = "application/json"
  name = "Certification"
  schema = file("api/models/job.json")
}

resource "aws_api_gateway_model" "skill" {
  rest_api_id = aws_api_gateway_rest_api.resume_api.id
  content_type = "application/json"
  name = "Certification"
  schema = file("api/models/skill.json")
}