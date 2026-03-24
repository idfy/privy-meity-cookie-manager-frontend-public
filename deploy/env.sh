#!/bin/bash

export CONFIG_PATH=$1/env-config.js
export ENV_FILE=${2:-.env}
# Recreate config file
rm -rf $CONFIG_PATH
touch $CONFIG_PATH

# Add assignment 
echo -e "window._env_={\c" >> $CONFIG_PATH
first=true

# Read each line in .env file
# Each line represents key=value pairs
while read -r line || [[ -n "$line" ]];
do
  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  # Read value of current variable if exists as Environment variable
  value=$(printf '%s\n' "${!varname}")
  # Otherwise use value from .env file
  [[ -z $value ]] && value=${varvalue}
  
  # Append configuration property to JS file
  if [ "$first" = "false" ] ; then
    echo -e ",\c" >> $CONFIG_PATH
  fi
  echo -e "$varname:'$value'\c" >> $CONFIG_PATH
  first=false
done < $ENV_FILE

echo -e "};\c" >> $CONFIG_PATH