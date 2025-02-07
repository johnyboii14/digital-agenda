#!/bin/bash

yarn run build
rsync -avzh ./build/* indian@192.168.5.32:/var/www/digitalagenda 