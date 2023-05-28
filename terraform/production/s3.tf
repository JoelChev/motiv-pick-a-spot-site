resource "aws_s3_bucket" "website_bucket" {
  bucket = var.prefix
  acl    = "public-read"
  policy = data.aws_iam_policy_document.website_policy.json
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
  tags = merge(local.default_tags, { Description = "S3 bucket for the staging instance of ${var.application}" })

}

data "aws_iam_policy_document" "website_policy" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    principals {
      identifiers = ["*"]
      type        = "AWS"
    }
    resources = [
      "arn:aws:s3:::${var.prefix}/*"
    ]
  }
}

