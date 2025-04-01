import React, { useImperativeHandle, forwardRef } from 'react';
import { Modal } from 'antd';

interface AnalizadorSintacticoRef {
    analyze: (text: string) => void; 
}

const reservedWords = new Set(['if', 'else', 'while', 'return', 'function', 'var', 'let', 'const']);

const AnalizadorSintactico = forwardRef<AnalizadorSintacticoRef>((props, ref) => {
    const analyzeText = (text: string) => {
        const tokens = tokenize(text);
        const errors: string[] = [];
        const parseTree = parse(tokens, errors);

        const content = ( 
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {errors.length > 0 ? (
                    <>
                        <p><strong>Errores Sintácticos:</strong></p>
                        <ul>
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p><strong>El texto es sintácticamente correcto.</strong></p>
                )}
                <p><strong>Árbol de Análisis:</strong></p>
                <pre>{JSON.stringify(parseTree, null, 2)}</pre>
            </div>
        );

        Modal.info({
            title: 'Análisis Sintáctico',
            content: content,
            width: 800, 
            onOk() {}, 
        });
    };

    const tokenize = (text: string): string[] => {
        // Tokenización mejorada para manejar correctamente los paréntesis
        return text.match(/(\S+|\(|\))/g) || [];
    };

    const parse = (tokens: string[], errors: string[]): any => {
        let index = 0;

        const parseExpression = (): any => {
            let left = parseTerm();
            if (!left) return null;

            while (index < tokens.length && (tokens[index] === '+' || tokens[index] === '-')) {
                const operator = tokens[index++];
                const right = parseTerm();
                if (!right) {
                    errors.push(`Error de sintaxis: se esperaba un término después de '${operator}'`);
                    return left; 
                }
                left = { type: 'BinaryExpression', operator, left, right };
            }
            return left;
        };

        const parseTerm = (): any => {
            let left = parseFactor();
            if (!left) return null;

            while (index < tokens.length && (tokens[index] === '*' || tokens[index] === '/')) {
                const operator = tokens[index++];
                const right = parseFactor();
                if (!right) {
                    errors.push(`Error de sintaxis: se esperaba un factor después de '${operator}'`);
                    return left; 
                }
                left = { type: 'BinaryExpression', operator, left, right };
            }
            return left;
        };

        const parseFactor = (): any => {
            if (index < tokens.length && /^\d+$/.test(tokens[index])) {
                return { type: 'Literal', value: parseInt(tokens[index++], 10) };
            } else if (index < tokens.length && /^[a-zA-Z_]\w*$/.test(tokens[index])) {
                const identifier = tokens[index++];
                if (reservedWords.has(identifier)) {
                    errors.push(`Error de sintaxis: '${identifier}' es una palabra reservada y no puede ser utilizada como identificador.`);
                    return null; // Retornar null si es una palabra reservada
                }
                return { type: 'Identifier', name: identifier };
            } else if (index < tokens.length && tokens[index] === '(') {
                index++; 
                const expression = parseExpression();
                if (index < tokens.length && tokens[index] === ')') {
                    index++; 
                    return expression;
                } else {
                    errors.push(`Error de sintaxis: se esperaba ')'`);
                    return null;
                }
            }
            errors.push(`Error de sintaxis: se esperaba un número, un identificador o '(' pero se encontró '${tokens[index] || 'fin de entrada'}'`);
            return null; 
        };

        const parseTree = parseExpression();
        if (index < tokens.length) {
            errors.push(`Error de sintaxis: se encontró un token inesperado '${tokens[index]}'`);
        }
        return parseTree;
    };

    useImperativeHandle(ref, () => ({
        analyze: (text: string) => analyzeText(text),
    }));

    return null; 
});

export default AnalizadorSintactico;

// con eso lo probe deberia dar
//x + 5 * ( x - 3 ) + 2 / 4 * ( 5 - 6 ) if ( x > 5 ) { return x; } else { return y; }
// x + 5 * ( yolo - 3 ) + 2 / 4 * ( 5 - 6 )

