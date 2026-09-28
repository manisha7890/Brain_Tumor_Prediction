import os
import numpy as np
import json
# Keras
import keras
from keras.models import load_model
from keras.preprocessing import image
# Flask utils
from flask import Flask, request, render_template
from werkzeug.utils import secure_filename
import tensorflow_hub as hub
import pathlib
# Define a flask app
app = Flask(__name__)

# Model saved with Keras model.save()
model = load_model(('braintumor.h5'), custom_objects={'KerasLayer': hub.KerasLayer})

def generate_custom_name(original_file_name):
    return "1" + pathlib.Path(original_file_name).suffix

def model_predict(img_path, model):
    test_image = image.load_img(img_path, target_size = (150,150))
    test_image = image.img_to_array(test_image)
    test_image = np.array(test_image)
    test_image = np.expand_dims(test_image, axis=0)
    result = model.predict(test_image)

    labels = ['Glioma','Meningioma','No Tumor','Pituitary']

    return labels[result.argmax()] , result

@app.route('/', methods=['GET'])
def index():
    return render_template('home.html')

@app.route('/brain', methods=['GET'])
def brain():
    # Main page
    return render_template('index.html')


@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # Get the file from post request
        f = request.files['file']

        # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        file_name = generate_custom_name(f.filename)
        file_path = os.path.join(
            basepath, 'uploads', file_name)
        f.save(file_path)

        # Make prediction
        preds , res = model_predict(file_path, model)

        data = {
            "pred" : preds,
            "glioma" : str(round(res[0][0]*100,4)),
            "meningioma" :str(round(res[0][1]*100,4)),
            "notumor": str(round(res[0][2]*100,4)),
            "pituitary":str(round(res[0][3]*100,4)),
              }

        y = json.dumps(data)
        return y

    return None
if __name__ == '__main__':
    app.run(host='0.0.0.0',port= 1000,debug=True)
