#!/bin/bash
echo "Intergation test........"

aws --version

Data=$(aws ec2 describe-instances)
# echo "Data - "$Data
PublichIPAddress=$(aws ec2 describe-instances | jq -r ' .Reservations[].Instances[] | select(.Tags[].Value == "DevelopmentServer") | .PublicIpAddress')
echo "PublichIPAddress - "$PublichIPAddress
if [[ "$PublichIPAddress" != '' ]]; then
    echo "Testing connectivity to $PublichIPAddress"
    ping -c 4 $PublichIPAddress || { echo "Ping failed. Check network access."; exit 1; }
    echo "Making HTTP request..."
    http_code=$(curl -x "" -s -o /dev/null -w "%{http_code}"  http://$PublichIPAddress:80)
    # sleep 30s
    echo "http_code - "$http_code
    
    if [[ "$http_code" -eq 200 ]]; 
        then
            echo "HTTP Status Code is 200 Tests Passed"
        else
            echo "Intergation test failed"
            exit 1;
    fi;

else
        echo "Could not fetch a token/PublichIPAddress; Check/Debug line 8"
        exit 1;
fi;