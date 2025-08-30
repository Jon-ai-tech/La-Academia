from flask import Flask, request, send_file, jsonify
from gtts import gTTS
import io
import os
from flask_cors import CORS # Importa CORS

app = Flask(__name__)
CORS(app) # Habilita CORS para todas las rutas, útil para desarrollo local

# Opcional: Directorio para guardar temporalmente los audios (puedes omitir si sirves desde memoria)
TEMP_AUDIO_DIR = "temp_audio_files" 
if not os.path.exists(TEMP_AUDIO_DIR):
    os.makedirs(TEMP_AUDIO_DIR)

@app.route('/generate-audio')
def generate_audio_endpoint():
    text_to_speak = request.args.get('text')
    lang = request.args.get('lang', 'es') # Idioma por defecto español
    influencer_id = request.args.get('id', 'default') # Para nombrar el archivo temporalmente

    if not text_to_speak:
        return jsonify({"error": "No se proporcionó texto"}), 400

    try:
        print(f"Recibido texto para TTS ({lang}): '{text_to_speak[:50]}...' para ID: {influencer_id}")
        tts = gTTS(text=text_to_speak, lang=lang, slow=False)

        # Servir el audio directamente desde memoria (más eficiente)
        audio_fp = io.BytesIO()
        tts.write_to_fp(audio_fp)
        audio_fp.seek(0) # Rebobina el "puntero" del BytesIO al inicio

        print(f"Audio generado para ID: {influencer_id}, enviando...")
        return send_file(
            audio_fp, 
            mimetype='audio/mpeg',
            as_attachment=False, # Importante para que el navegador lo reproduzca
            download_name=f'{influencer_id}_summary.mp3' # Nombre sugerido si el usuario guarda
        )

    except Exception as e:
        print(f"Error al generar audio para ID {influencer_id}: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Iniciando servidor de audio en http://localhost:5001")
    app.run(debug=True, port=5001)