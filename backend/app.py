from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import joblib
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import joblib

# Configuración inicial para Flask
app = Flask(__name__)
CORS(app)

# Conexión a MongoDB  y creación de base de datos y colección
client = MongoClient("mongodb://localhost:27017/")
db = client["spamDB"]
collection = db["mensajes"]

# Carga del modelo y vectorizador
model = joblib.load("spam_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")

# Preprocesamiento de texto, limpieza y tokenización
nltk.download("stopwords")
stop_words = set(stopwords.words("english"))
stemmer = PorterStemmer()

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    words = text.split()
    words = [stemmer.stem(word) for word in words if word not in stop_words]
    return " ".join(words)

# Ruta para predecir y guardar
@app.route("/api/prediccion", methods=["POST"])
def predecir():
    data = request.get_json()
    texto_original = data.get("texto", "")
    
    if not texto_original:
        return jsonify({"error": "Texto no proporcionado"}), 400

    texto_limpio = clean_text(texto_original)
    vector = vectorizer.transform([texto_limpio])
    pred = model.predict(vector)[0]
    etiqueta = "spam" if pred == 1 else "ham"

    # Guardar en MongoDB
    collection.insert_one({
        "texto": texto_original,
        "etiqueta": etiqueta
    })

    return jsonify({
        "texto": texto_original,
        "etiqueta": etiqueta
    })

if __name__ == "__main__":
    app.run(debug=True)
