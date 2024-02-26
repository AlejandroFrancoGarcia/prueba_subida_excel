from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import pandas as pd



app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        filename = secure_filename(file.filename)
        file.save(filename)
        
        # Leer el archivo de Excel y convertirlo a JSON
        try:
            df = pd.read_excel(filename)
            data = df.to_dict(orient='records')
            return jsonify({'data': data})
        except Exception as e:
            return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(port=3000)
