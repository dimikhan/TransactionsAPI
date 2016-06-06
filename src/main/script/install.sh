#!/bin/bash
# This script deploys an API to a specified catalog for and Organization. It should be a very rare occasion when this script needs to be modified!

# Input Parameters
# --m management server url - The url or dns of the API Connect Management Server
# --u username				- The username of a user in the Organization within API Connect
# --p password				- The password of the API Connect Organization User
# --c catalog				- The catalogu to publish the API to 
# --organization (optional) - The Organization to which the API belongs. The value of this parameter will be text replaced during packaging of this script to 
#  							  a default value which can be overridden with this parameter
# This paramter will be text replaced by maven at packaging time
organization=${project.organization.name}
username=
password=
managementServer=
catalog=
apiName=${project.artifactId}
apiVersion=${api.version}

# Do user input function
function usage() {
cat << EOF
usage: $0 options

This script publishes an api into an API Connect

OPTIONS:
	-h		Help
	-m      API Connect Management Server URL
	-o      Organization
	-c      Catalog
	-u      User
	-p      Password
EOF
}

function apicLogin() {
	# Log into Management Console
	#apic login
	apic login --username $username --password $password --server $managementServer
	
	# if login failed exit
	result=$?
	if [[ $result -ne 0 ]]
	then
		echo "Deployment of API $apiName version $apiVersion to catalog $catalog failed."
		exit 1
	fi
}

function apicLogout() {
	apic logout --server $managementServer
}

function apicPushDraft() {
	# Push Product/API into Drafts
	apic drafts:push product.yaml --organization $organization --server $managementServer
	result=$?
	if [[ $result -gt 0 ]]
	then
		echo "Pushing API $apiName version $apiVersion to draft failed."
		apicLogout
		exit 1
	fi
}

function apicPublishToCatalog() {
	apic publish product.yaml --server $managementServer --organization $organization --catalog $catalog
	result=$?
	if [[ $result -gt 0 ]]
	then
		echo "Publishing API $apiName version $apiVersion to catalog $catalog failed."
		apicLogout
		exit 1
	fi
}

function parseParameters() {
	while getopts “m:o:c:u:p:” OPTION
	do
	     case $OPTION in
	        h)
	             usage
	             exit 1
	             ;;
	        m)
	            managementServer=$OPTARG
	             ;;
	        o)
	            organization=$OPTARG
	             ;;
	        c)
	            catalog=$OPTARG
	             ;;
	        u)
	            username=$OPTARG
	             ;;
	        p)
	            password=$OPTARG
	             ;;
	        ?)
	             usage
	             exit
	             ;;
	     esac
	done
	
	# ensure required params are not blank
	echo "organization=$organization,managementServer=$managementServer,catalog=$catalog,username=$username,password=$password"
	if [[ -z $managementServer ]] || [[ -z $organization ]] || [[ -z $catalog ]] || [[ -z $username ]] || [[ -z $password ]]
	then
		usage
		exit 1
	fi
}


# start of main pogram
parseParameters $@
apicLogin
apicPushDraft
apicPublishToCatalog

# Deployment complete
echo "Deployment of API $apiName version $apiVersion to catalog $catalog is complete."
apicLogout

exit 0