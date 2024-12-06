terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "5.78.0"
    }
  }
  backend "s3" {
    bucket = "fusion-iac-backend-royal"
    key    = "LockID"
    region = "us-east-1"
    dynamodb_table = "tflock"
  }
}

provider "aws" {
  region = "us-east-1"
}