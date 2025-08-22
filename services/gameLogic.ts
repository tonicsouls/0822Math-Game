
import { Problem, MoveType } from '../types';

export const generateProblem = (level: number, type: MoveType): Problem => {
    let num1: number, num2: number, answer: number, text: string, difficulty = level;
    
    if (level === 1) { // Easy
        if (type === 'add') { num1 = Math.floor(Math.random() * 10) + 1; num2 = Math.floor(Math.random() * 10) + 1; answer = num1 + num2; text = `${num1} + ${num2} = ?`; } 
        else if (type === 'sub') { num1 = Math.floor(Math.random() * 10) + 5; num2 = Math.floor(Math.random() * (num1-1)) + 1; answer = num1 - num2; text = `${num1} - ${num2} = ?`; }
        else { num1 = Math.floor(Math.random() * 5) + 1; num2 = Math.floor(Math.random() * 5) + 1; answer = num1 * num2; text = `${num1} × ${num2} = ?`; }
    } else if (level === 2) { // Medium
        if (type === 'add') { num1 = Math.floor(Math.random() * 25) + 5; num2 = Math.floor(Math.random() * 25) + 5; answer = num1 + num2; text = `${num1} + ${num2} = ?`; } 
        else if (type === 'sub') { num1 = Math.floor(Math.random() * 30) + 15; num2 = Math.floor(Math.random() * 15) + 5; answer = num1 - num2; text = `${num1} - ${num2} = ?`; }
        else if (type === 'mul') { num1 = Math.floor(Math.random() * 8) + 2; num2 = Math.floor(Math.random() * 8) + 2; answer = num1 * num2; text = `${num1} × ${num2} = ?`; }
        else { num2 = Math.floor(Math.random() * 5) + 2; answer = Math.floor(Math.random() * 5) + 2; num1 = num2 * answer; text = `${num1} ÷ ${num2} = ?`; }
    } else if (level === 3) { // Hard
        if (type === 'mul' || type === 'add') { num1 = Math.floor(Math.random() * 11) + 5; num2 = Math.floor(Math.random() * 11) + 5; answer = num1 * num2; text = `${num1} × ${num2} = ?`; } 
        else { num2 = Math.floor(Math.random() * 8) + 3; answer = Math.floor(Math.random() * 8) + 3; num1 = num2 * answer; text = `${num1} ÷ ${num2} = ?`; }
    } else { // Legendary
        const variable = 'x';
        num1 = Math.floor(Math.random() * 10) + 2;
        num2 = Math.floor(Math.random() * 10) + 2;
        const offset = Math.floor(Math.random() * 20) - 10;
        const result = num1 * num2 + offset;
        answer = num2;
        text = (offset >= 0) ? `${num1}${variable} + ${offset} = ${result}` : `${num1}${variable} - ${-offset} = ${result}`;
        difficulty = 5;
    }
    
    const choices = new Set<number>([answer]);
    while (choices.size < 4) {
        const offset = (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
        const wrongAns = answer + offset;
        if (wrongAns !== answer && wrongAns >= 0) choices.add(wrongAns);
    }
    return { text, answer, choices: Array.from(choices).sort((a, b) => a - b), difficulty, moveType: type };
}
