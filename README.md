# BoeingHackathon

do this on a linux system
```sh
python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
```

to run (while in the virtual environment)
```sh
export FLASK_APP=flaskr
export FLASK_ENV=development
flask run
```

to start the database
```sh
flask init-db
```
