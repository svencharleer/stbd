#!/bin/bash

cd biochemie
mongoimport -u "sven" -p "e88xJfqmWHcDeEVUX5gMxFb56Q62ysS7teVbAC9Fg4wjAtNK6qqxY96SavyEjUWQ5h7sat3KqdcEweYnkZbzKbaPshkbeEVa57xg" --authenticationDatabase able_biochemie --db able_biochemie --collection generic_grades  generic_grades.json
mongoimport -u "sven" -p "e88xJfqmWHcDeEVUX5gMxFb56Q62ysS7teVbAC9Fg4wjAtNK6qqxY96SavyEjUWQ5h7sat3KqdcEweYnkZbzKbaPshkbeEVa57xg" --authenticationDatabase able_biochemie --db able_biochemie --collection generic_cse  generic_cse.json
cd ..
cd biologie
mongoimport -u "sven" -p "e88xJfqmWHcDeEVUX5gMxFb56Q62ysS7teVbAC9Fg4wjAtNK6qqxY96SavyEjUWQ5h7sat3KqdcEweYnkZbzKbaPshkbeEVa57xg" --authenticationDatabase able_biologie --db able_biologie --collection generic_grades  generic_grades.json
mongoimport -u "sven" -p "e88xJfqmWHcDeEVUX5gMxFb56Q62ysS7teVbAC9Fg4wjAtNK6qqxY96SavyEjUWQ5h7sat3KqdcEweYnkZbzKbaPshkbeEVa57xg" --authenticationDatabase able_biologie --db able_biologie --collection generic_cse  generic_cse.json
cd ..
cd chemie
mongoimport -u "sven" -p "e88xJfqmWHcDeEVUX5gMxFb56Q62ysS7teVbAC9Fg4wjAtNK6qqxY96SavyEjUWQ5h7sat3KqdcEweYnkZbzKbaPshkbeEVa57xg" --authenticationDatabase able_chemie --db able_chemie --collection generic_grades  generic_grades.json
mongoimport -u "sven" -p "e88xJfqmWHcDeEVUX5gMxFb56Q62ysS7teVbAC9Fg4wjAtNK6qqxY96SavyEjUWQ5h7sat3KqdcEweYnkZbzKbaPshkbeEVa57xg" --authenticationDatabase able_chemie --db able_chemie --collection generic_cse  generic_cse.json
cd ..
cd fysica
mongoimport -u "sven" -p "e88xJfqmWHcDeEVUX5gMxFb56Q62ysS7teVbAC9Fg4wjAtNK6qqxY96SavyEjUWQ5h7sat3KqdcEweYnkZbzKbaPshkbeEVa57xg" --authenticationDatabase able_fysica --db able_fysica --collection generic_grades  generic_grades.json
mongoimport -u "sven" -p "e88xJfqmWHcDeEVUX5gMxFb56Q62ysS7teVbAC9Fg4wjAtNK6qqxY96SavyEjUWQ5h7sat3KqdcEweYnkZbzKbaPshkbeEVa57xg" --authenticationDatabase able_fysica --db able_fysica --collection generic_cse  generic_cse.json
cd ..
cd geologie
mongoimport -u "sven" -p "e88xJfqmWHcDeEVUX5gMxFb56Q62ysS7teVbAC9Fg4wjAtNK6qqxY96SavyEjUWQ5h7sat3KqdcEweYnkZbzKbaPshkbeEVa57xg" --authenticationDatabase able_geologie --db able_geologie --collection generic_grades  generic_grades.json
mongoimport -u "sven" -p "e88xJfqmWHcDeEVUX5gMxFb56Q62ysS7teVbAC9Fg4wjAtNK6qqxY96SavyEjUWQ5h7sat3KqdcEweYnkZbzKbaPshkbeEVa57xg" --authenticationDatabase able_geologie --db able_geologie --collection generic_cse  generic_cse.json
cd ..
cd geografie
mongoimport -u "sven" -p "e88xJfqmWHcDeEVUX5gMxFb56Q62ysS7teVbAC9Fg4wjAtNK6qqxY96SavyEjUWQ5h7sat3KqdcEweYnkZbzKbaPshkbeEVa57xg" --authenticationDatabase able_geografie --db able_geografie --collection generic_grades  generic_grades.json
mongoimport -u "sven" -p "e88xJfqmWHcDeEVUX5gMxFb56Q62ysS7teVbAC9Fg4wjAtNK6qqxY96SavyEjUWQ5h7sat3KqdcEweYnkZbzKbaPshkbeEVa57xg" --authenticationDatabase able_geografie --db able_geografie --collection generic_cse  generic_cse.json
cd ..
cd informatica
mongoimport -u "sven" -p "e88xJfqmWHcDeEVUX5gMxFb56Q62ysS7teVbAC9Fg4wjAtNK6qqxY96SavyEjUWQ5h7sat3KqdcEweYnkZbzKbaPshkbeEVa57xg" --authenticationDatabase able_informatica --db able_informatica --collection generic_grades  generic_grades.json
mongoimport -u "sven" -p "e88xJfqmWHcDeEVUX5gMxFb56Q62ysS7teVbAC9Fg4wjAtNK6qqxY96SavyEjUWQ5h7sat3KqdcEweYnkZbzKbaPshkbeEVa57xg" --authenticationDatabase able_informatica --db able_informatica --collection generic_cse  generic_cse.json
cd ..
cd wiskunde
mongoimport -u "sven" -p "e88xJfqmWHcDeEVUX5gMxFb56Q62ysS7teVbAC9Fg4wjAtNK6qqxY96SavyEjUWQ5h7sat3KqdcEweYnkZbzKbaPshkbeEVa57xg" --authenticationDatabase able_wiskunde --db able_wiskunde --collection generic_grades  generic_grades.json
mongoimport -u "sven" -p "e88xJfqmWHcDeEVUX5gMxFb56Q62ysS7teVbAC9Fg4wjAtNK6qqxY96SavyEjUWQ5h7sat3KqdcEweYnkZbzKbaPshkbeEVa57xg" --authenticationDatabase able_wiskunde --db able_wiskunde --collection generic_cse  generic_cse.json
cd ..
