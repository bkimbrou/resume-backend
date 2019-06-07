resource "aws_dynamodb_table" "certifications_table" {
  hash_key = "id"
  name = var.certifications_table
  read_capacity = 5
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
  read_capacity = 5
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
  read_capacity = 5
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
  read_capacity = 5
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