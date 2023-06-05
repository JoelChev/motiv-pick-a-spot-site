resource "aws_s3_bucket" "website_bucket" {
  bucket = var.prefix
  tags   = merge(local.default_tags, { Description = "S3 bucket for the fallback instance of ${var.application}" })
}

resource "aws_s3_bucket_ownership_controls" "ownership_controls" {
  bucket = aws_s3_bucket.website_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "public_access_block" {
  bucket = aws_s3_bucket.website_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "acl" {
  depends_on = [aws_s3_bucket_ownership_controls.ownership_controls, aws_s3_bucket_public_access_block.public_access_block]
  bucket     = aws_s3_bucket.website_bucket.id
  acl        = "public-read"
}

resource "aws_s3_bucket_website_configuration" "web_configuration" {
  bucket = aws_s3_bucket.website_bucket.id
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }
}

// Note this block needs to be applied LAST (so comment it out when first applying the infra changes and apply it second).
resource "aws_s3_bucket_policy" "public_access_website_policy" {
  bucket = aws_s3_bucket.website_bucket.id
  policy = data.aws_iam_policy_document.website_policy.json
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

