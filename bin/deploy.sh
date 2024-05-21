#!/bin/bash

yarn run build
rsync -avzh ./build/* indian@192.168.131.66:/var/www/digitalagenda 