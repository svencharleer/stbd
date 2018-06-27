#!/bin/bash
#
# Make bundle and copy to dossi

echo "current working directory $PWD"
cd ..
echo "current working directory $PWD"
meteor build ../able_test --architecture os.linux.x86_64
#cd ../able_test
#scp -P 2222 * able@dossi.cs.kuleuven.be:/localhost/home/able/dashboards
#echo "Tar is available on server"
