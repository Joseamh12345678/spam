import React, { useState } from 'react';

const SpamForm = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null)
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const response = await fetch("http://localhost:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        })

        const data = await response.json();
        setResult(data.is_spam ? "Esto en efecto es spam" : "Y esto no lo es");
    }

    return (
        <div className="spam-form">
            <h1>Detector de Spam</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onchange={(e) => setText(e.target.value)}
                    placeholder='Escriba aqui su texto por favor'
                    required
                />
                <button type="submit">Enviar</button>
            </form>
            {result && <p classNme={result === "Si es Spam" ? "spam" : "ham"}>{result}</p>}
        </div>
    )
};
export default SpamForm;