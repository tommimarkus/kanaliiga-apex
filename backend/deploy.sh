#!/bin/bash -e


## POISTA TÄMÄ
## TEE ECOSYSTEM CONFIG KANAPEX
## => gitistä suoraa deploy

OPTS=`getopt -o bzciq --long skip-build,skip-zip,skip-copy,skip-install,quiet -n 'parse-options' -- "$@"`

eval set -- "$OPTS"

SKIP_BUILD=false
SKIP_ZIP=false
SKIP_COPY=false
SKIP_INSTALL=false
QUIET=false

while true
do
    case "$1" in
        -b | --skip-build ) SKIP_BUILD=true; shift ;;
        -z | --skip-zip ) SKIP_ZIP=true; shift ;;
        -c | --skip-copy ) SKIP_COPY=true; shift ;;
        -i | --skip-install ) SKIP_INSTALL=true; shift ;;
        -q | --quiet ) QUIET=true; shift ;;
        * ) break ;;
    esac
done

if [ $QUIET == true ]; then
SCP_OPTS="-q"
ZIP_OPTS="-qq"
pushd () {
    command pushd "$@" > /dev/null
}
popd () {
    command popd "$@" > /dev/null
}
fi

CLEANUP_LIST=()

on_exit() {
    for cleanup_file in "${CLEANUP_LIST[@]}"
    do
        if [ $QUIET != true ]; then
            echo "Cleaning up: $(basename "$cleanup_file")"
        fi
        rm "$cleanup_file"
    done
}

trap 'on_exit' EXIT

on_error() {
    echo "Error $1 on line $2"
}

trap 'on_error $? $LINENO' ERR

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

fullpath() {
    echo $(realpath "$1")
}

pushd $SCRIPT_DIR

USER_NAME="deploy"
HOST_NAME="kanaliiga-apex.dinosauruskeksi.com"
ZIP_NAME="kanaliiga-apex-backend.zip"

# Build
if [ $SKIP_BUILD != true ]; then
    npm ci --production
    npm run build --production
fi

# Zip
if [ $SKIP_ZIP != true ]; then
    zip ${ZIP_OPTS:+"$ZIP_OPTS"} -r "$ZIP_NAME" dist node_modules
    CLEANUP_LIST+=($(fullpath "$ZIP_NAME"))
fi

# Copy
if [ $SKIP_COPY != true ]; then
    scp ${SCP_OPTS:+"$SCP_OPTS"} "$ZIP_NAME" $USER_NAME@$HOST_NAME:~/"$ZIP_NAME"
fi

# Install
if [ $SKIP_INSTALL != true ]; then
    ssh -T $USER_NAME@$HOST_NAME << CMDS
        cd ~
        set -o allexport
        source .deploy.env
        set +o allexport
        sudo rm -rf "\$APP_DIR_NEW"
        unzip ${ZIP_OPTS:+"$ZIP_OPTS"} "$ZIP_NAME" -d "\$APP_DIR_NEW"
        rm "$ZIP_NAME"
        chmod -R "\$APP_PERMISSIONS" "\$APP_DIR_NEW"
        cp "\$DOTENV" "\$APP_DIR_NEW/.env"
        sudo rm -rf "\$APP_DIR_OLD"
        [ -d "\$APP_DIR" ] && mv -f "\$APP_DIR" "\$APP_DIR_OLD"
        sudo chown -R "\$USER_RUN":"\$GROUP_APPS" "\$APP_DIR_NEW"
        mv -f "\$APP_DIR_NEW" "\$APP_DIR"
CMDS
fi

popd # $SCRIPT_DIR