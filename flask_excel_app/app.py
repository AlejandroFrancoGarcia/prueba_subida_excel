from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

uploaded_filename = None  # Variable global para almacenar el nombre del archivo cargado

@app.route('/api/upload', methods=['POST'])
def upload_file():
    global uploaded_filename

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        filename = secure_filename(file.filename)
        file.save(filename)
        uploaded_filename = filename  # Almacenamos el nombre del archivo
        
        # Leer el archivo de Excel y convertirlo a JSON
        try:
            df = pd.read_excel(filename)
            data = df.to_dict(orient='records')
            return jsonify({'data': data})
        except Exception as e:
            return jsonify({'error': str(e)})

@app.route('/api/excel-data', methods=['GET'])
def get_excel_data():
    global uploaded_filename
    
    if uploaded_filename is None:
        return jsonify({'error': 'No file uploaded'})

    try:
        df = pd.read_excel(uploaded_filename)
        data = df.to_dict(orient='records')
        return jsonify({'data': data})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(port=3000)
