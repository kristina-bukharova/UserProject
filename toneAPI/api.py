import flask
import random

app = flask.Flask(__name__)

@app.route('/tone', methods=['GET'])
def getRandomTone():
    tone = random.choice(["humorous", "ironic", "cynical"])
    return { "tone" : tone }

app.run()