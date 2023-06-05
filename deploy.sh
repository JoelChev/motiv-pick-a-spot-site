#!/bin/bash
set -eou pipefail

while getopts e:h: flag
do
    case "${flag}" in
        e) environment=${OPTARG};;
        h) 
        echo "To use this script, specify an environment with the -e flag"
        echo "Possible values are 'staging', 'production'"
        echo "e.g. bash ./deploy.sh -e staging"
        exit 0;;
    esac
done
# Check that environment flag is set.
if test -z $environment
then
    echo "To use this script, specify an environment with the -e flag"
    echo "e.g. bash ./deploy.sh -e staging"
    echo "Nothing deployed for now."
    exit 0
else
    echo "Deploying to the $environment environment"
    if [ $environment == "staging" ];
    then
        npm run build:staging
        aws s3 sync ./build s3://motiv-pick-a-spot-staging
    elif [ $environment == "production" ];
    then
        npm run build:production
        aws s3 sync ./build s3://motiv-pick-a-spot-production
    else
        echo "Invalid environment specified, nothing deployed for now"
        exit 0
    fi
fi
