import flask
import random

app = flask.Flask(__name__)

@app.route('/tone', methods=['GET'])
def getRandomTone():
    tone = random.choice(["Humorous", "Ironic", "Cynical"])
    return { "tone" : tone }

app.run(host='0.0.0.0')