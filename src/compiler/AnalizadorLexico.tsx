import React, { useImperativeHandle, forwardRef } from 'react';
import { Modal } from 'antd';

interface AnalizadorLexicoRef {
    analyze: (text: string) => void; 
}

const AnalizadorLexico = forwardRef<AnalizadorLexicoRef, {}>((props, ref) => {
    const analyzeText = (text: string) => {
        const words: string[] = [];
        const numbers: string[] = [];
        const specialChars: string[] = [];
        const invalidChars: string[] = [];

        const regex = /[a-zA-Z]+|\d+|[^a-zA-Z0-9\s]/g; 
        let match: RegExpExecArray | null;

        while ((match = regex.exec(text)) !== null) {
            const token = match[0];
            if (/^[a-zA-Z]+$/.test(token)) {
                words.push(token); 
            } else if (/^\d+$/.test(token)) {
                numbers.push(token); 
            } else if (/[^a-zA-Z0-9\s]/.test(token)) {
                specialChars.push(token); 
            }
        }


        const invalidRegex = /[áéíóúüñ]/; 
        for (let char of text) {
            if (!/[a-zA-Z0-9\s]/.test(char) && !invalidChars.includes(char) && !specialChars.includes(char)) {
                invalidChars.push(char);
            }
            if (invalidRegex.test(char) && !invalidChars.includes(char)) {
                invalidChars.push(char);
            }
        }

        const content = (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <p><strong>Total de palabras:</strong> {words.length}</p>
                <ul>
                    {words.map((word, index) => (
                        <li key={index}>{word}</li>
                    ))}
                </ul>
                <p><strong>Total de números:</strong> {numbers.length}</p>
                <ul>
                    {numbers.map((number, index) => (
                        <li key={index}>{number}</li>
                    ))}
                </ul>
                <p><strong>Total de caracteres especiales:</strong> {specialChars.length}</p>
                <ul>
                    {specialChars.map((char, index) => (
                        <li key={index}>{char}</li>
                    ))}
                </ul>
                <p><strong>Total de caracteres inválidos:</strong> {invalidChars.length}</p>
                <ul>
                    {invalidChars.map((char, index) => (
                        <li key={index}>{char}</li>
                    ))}
                </ul>
            </div>
        );

        Modal.info({
            title: 'Análisis Léxico',
            content: content,
            width: 800,
            onOk() {}, 
        });
    };

    useImperativeHandle(ref, () => ({
        analyze: (text: string) => analyzeText(text),
    }));

    return null; 
});

export default AnalizadorLexico;