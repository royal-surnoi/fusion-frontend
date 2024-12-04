variable "AMI_id"{
    type = string
    default = "ami-0453ec754f44f9a4a"
}

variable "instance_type" {
  type = string
  default = "t2.micro"
}

variable "tags" {
    type = map
    default = {
        Name = "DevelopmentServer"
        Application = "FusionIQ"
        Envronment  = "Development"
        Owner       = "DevOpsTeam"
        CostCenter  = "DevOpsTeam"
    }
}

variable "cidr_blocks" {
    type = string
    default = "0.0.0.0/0"
  
}

