resource "aws_instance" "development-instance" {
  ami = var.AMI_id
  instance_type =  var.instance_type
  vpc_security_group_ids = [aws_security_group.dev-stage-sg.id]
  key_name = aws_key_pair.deployer.key_name
  user_data = "${file("docker_config.sh")}"
  tags = var.tags
}


resource "aws_key_pair" "deployer" {
  key_name   = "Royal_Emp"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC9k7YLrxoLFcqCv+V/4ACpAy84gwOrBp2yqBOOuSGVBNl05TvCY7CkfpcmCVJdmenj6RUe5oSiQFATuhvqEnJsRkLIS/+Mf0t5KgUo+WjBpcLwDTyShsujA59qE4VbLMmXdAnCqnYnKT79KIndFafaGpnuxoep1JK07TatC1sm5ccPmgsIpAIOf0OxeWBfsodBX24qoQWh2oxDgEJX5ixPRNKBqgBkLNjp2vkt4ZlE1tNap28w8AdvHc9EIxVeWyoMohdL5yJyH4c7D9LYyYwml3t7PPWZSoL/9kdPadvqyywcEjtfE9VDfd+i9BadVtzj2v3dH+RJeiMOeIhhASxt Royal_Emp_1158"

}

resource "aws_security_group" "dev-stage-sg" {
    name        = "DevelopmentServer-sg"
    description = "Allow SSH,HTTP,80 and 8080 inbound traffic and all outbound traffic"
    tags = var.tags
}

resource "aws_vpc_security_group_ingress_rule" "allow_ssh_ipv4" {
  security_group_id = aws_security_group.dev-stage-sg.id
  cidr_ipv4         = var.cidr_blocks
  from_port         = 22
  ip_protocol       = "tcp"
  to_port           = 22
}
resource "aws_vpc_security_group_ingress_rule" "allow_HTTP_ipv4" {
  security_group_id = aws_security_group.dev-stage-sg.id
  cidr_ipv4         = var.cidr_blocks
  from_port         = 80
  ip_protocol       = "tcp"
  to_port           = 80
}

resource "aws_vpc_security_group_ingress_rule" "allow_HTTPS_ipv4" {
  security_group_id = aws_security_group.dev-stage-sg.id
  cidr_ipv4         = var.cidr_blocks
  from_port         = 443
  ip_protocol       = "tcp"
  to_port           = 443
}

resource "aws_vpc_security_group_ingress_rule" "allow_8080_ipv4" {
  security_group_id = aws_security_group.dev-stage-sg.id
  cidr_ipv4         = var.cidr_blocks
  from_port         = 8080
  ip_protocol       = "tcp"
  to_port           = 8080
}
resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv4" {
  security_group_id = aws_security_group.dev-stage-sg.id
  cidr_ipv4         = var.cidr_blocks
  ip_protocol       = "-1" # semantically equivalent to all ports
}

resource "aws_route53_zone" "dev" {
  name = "royalreddy.co.in"
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.dev.zone_id
  name    = "dev.royalreddy.co.in"
  type    = "A"
  ttl     = 300
  records = [aws_instance.development-instance.public_ip]
}