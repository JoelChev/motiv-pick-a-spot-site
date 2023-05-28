variable "prefix" {
  type    = string
  default = "motiv-pick-a-spot-production"
}

variable "application" {
  type    = string
  default = "motiv-pick-a-spot"
}

####################################
#               Tags               #
####################################

locals {
  default_tags = {
    Terraform   = var.tag_terraform
    Description = ""
    Repository  = var.tag_repository
    Environment = var.tag_environment
  }
}

variable "tag_terraform" {
  description = "Tag metadata for Motiv Fitness Daily Focus resources"
  default     = "True"
}

variable "tag_repository" {
  description = "Tag metadata for the GitHub repository name"
  default     = "motiv-pick-a-spot-site"
}

variable "tag_environment" {
  description = "Tag metadata for the deployment environment"
  default     = "Production"
}