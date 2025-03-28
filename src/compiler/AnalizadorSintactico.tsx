import React, { useImperativeHandle, forwardRef } from 'react';
import { Modal } from 'antd';

interface AnalizadorSintacticoRef {
    analyze: (text: string) => void; 
}

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
        // Tokenización simple: separar por espacios y caracteres especiales
        return text.match(/\S+/g) || [];
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
                    return left; // Continúa con el análisis
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
                    return left; // Continúa con el análisis
                }
                left = { type: 'BinaryExpression', operator, left, right };
            }
            return left;
        };

        const parseFactor = (): any => {
            if (index < tokens.length && /^\d+$/.test(tokens[index])) {
                return { type: 'Literal', value: parseInt(tokens[index++], 10) };
            } else if (index < tokens.length && tokens[index] === '(') {
                index++; // consumir '('
                const expression = parseExpression();
                if (index < tokens.length && tokens[index] === ')') {
                    index++; // consumir ')'
                    return expression;
                } else {
                    errors.push(`Error de sintaxis: se esperaba ')'`);
                    return null; // Continúa con el análisis
                }
            }
            errors.push(`Error de sintaxis: se esperaba un número o '(' pero se encontró '${tokens[index] || 'fin de entrada'}'`);
            return null; // Continúa con el análisis
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
//3 + 5 - 2 * ( 7 / 1 ) holiwi 

/*
Análisis Sintáctico
Errores Sintácticos:

Error de sintaxis: se encontró un token inesperado 'holiwi'
Árbol de Análisis:

{
    "type": "BinaryExpression",
    "operator": "-",
    "left": {
        "type": "BinaryExpression",
        "operator": "+",
        "left": {
        "type": "Literal",
        "value": 3
        },
        "right": {
        "type": "Literal",
        "value": 5
        }
    },
    "right": {
        "type": "BinaryExpression",
        "operator": "*",
        "left": {
        "type": "Literal",
        "value": 2
        },
        "right": {
        "type": "BinaryExpression",
        "operator": "/",
        "left": {
            "type": "Literal",
            "value": 7
        },
        "right": {
            "type": "Literal",
            "value": 1
        }
        }
    }
    }
  */

    /*      
            Análisis Léxico
        Total de palabras: 1

        holiwi

        Total de números: 5

        3
        5
        2
        7
        1
        Total de caracteres especiales: 6

        +
        -
        *
        (
        /
        )
        Total de caracteres inválidos: 0
            */