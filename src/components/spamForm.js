import React, { useState } from 'react';

const SpamForm = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/api/prediccion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ texto: text })  // Importante: debe llamarse "texto"
        });

        const data = await response.json();
        if (data.etiqueta) {
            setResult(data.etiqueta === "spam" ? "Esto en efecto es spam" : "Y esto no lo es");
        } else {
            setResult("Error al procesar la predicción");
        }
    };

    return (
        <div className="spam-form">
            <h1>Detector de Spam</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Escriba aquí su texto por favor"
                    required
                />
                <button type="submit">Enviar</button>
            </form>
            {result && (
                <p className={result.includes("spam") ? "spam" : "ham"}>
                    {result}
                </p>
            )}
        </div>
    );
};

export default SpamForm;
