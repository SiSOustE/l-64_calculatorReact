// Используем React и ReactDOM как глобальные переменные
const { useState, useCallback } = React;
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

const Calculator = () => {
    // Состояния
    const [currentValue, setCurrentValue] = useState(0); // Текущее значение (результат или вводимое число)
    const [storedValue, setStoredValue] = useState(null); // Промежуточное значение для операций
    const [operation, setOperation] = useState(null); // Текущая операция
    const [history, setHistory] = useState([]); // История операций
    const [display, setDisplay] = useState('0'); // Отображаемый текст
    const [resetNext, setResetNext] = useState(false); // Флаг сброса дисплея при следующем вводе

    // Функция для выполнения вычислений
    const calculate = useCallback((op, a, b) => {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/':
                if (b === 0) {
                    alert("Ошибка: Деление на ноль!");
                    return a; // Возвращаем предыдущее значение
                }
                return a / b;
            default: return b;
        }
    }, []);

    // Обработчик нажатия цифры или точки
    const handleDigit = (digit) => {
        if (resetNext) {
            setDisplay(digit === '.' ? '0.' : digit);
            setResetNext(false);
        } else {
            // Предотвращаем несколько точек
            if (digit === '.' && display.includes('.')) return;
            // Предотвращаем ведущие нули (00 -> 0, но 0.0 разрешено)
            if (display === '0' && digit !== '.') {
                setDisplay(digit);
            } else {
                setDisplay(display + digit);
            }
        }
        // Обновляем currentValue на основе текущего display
        setCurrentValue(parseFloat(display + (resetNext && digit !== '.' ? digit : (digit === '.' && !display.includes('.') ? '0.' : digit === '.' ? '.' : digit))) || 0);
    };

    // Обработчик нажатия операции
    const handleOperation = (op) => {
        const inputValue = parseFloat(display);

        if (storedValue === null) {
            setStoredValue(inputValue);
        } else if (operation) {
            const result = calculate(operation, storedValue, inputValue);
            setStoredValue(result);
            setCurrentValue(result);
            // Не добавляем в историю здесь, только при =
        }
        setOperation(op);
        setDisplay(op); // Отображаем операцию
        setResetNext(true);
    };

    // Обработчик нажатия равно
    const handleEquals = () => {
        if (operation && storedValue !== null) {
            const inputValue = parseFloat(display);
            const result = calculate(operation, storedValue, inputValue);

            // Добавляем в историю
            const expression = `${storedValue} ${operation} ${inputValue}`;
            setHistory(prevHistory => [...prevHistory, { expression, result }]);

            setCurrentValue(result);
            setStoredValue(null);
            setOperation(null);
            setDisplay(String(result));
            setResetNext(true);
        }
    };

    // Обработчик очистки (C)
    const handleClear = () => {
        setCurrentValue(0);
        setStoredValue(null);
        setOperation(null);
        setDisplay('0');
        setResetNext(false);
    };

    // Обработчик полной очистки (AC)
    const handleAllClear = () => {
        handleClear();
        setHistory([]);
    };

    // Функция для повторного использования результата из истории
    const reuseResult = (result) => {
         setCurrentValue(result);
         setDisplay(String(result));
         setStoredValue(null);
         setOperation(null);
         setResetNext(true);
    };

    return (
        <div className="calculator-app">
             <h1>React Калькулятор</h1>
            <div className="calculator">
                {/* История операций */}
                {history.length > 0 && (
                    <div className="history">
                        <h3>История:</h3>
                        <ul className="history-list">
                            {history.map((item, index) => (
                                <li key={index} className="history-item">
                                    {item.expression} = {item.result}
                                    <button
                                        onClick={() => reuseResult(item.result)}
                                        style={{ marginLeft: '10px', padding: '2px 5px', fontSize: '0.8em' }}
                                    >
                                        Использовать
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={handleAllClear} className="function">Очистить Историю (AC)</button>
                    </div>
                )}

                {/* Дисплей */}
                <div className="display">{display}</div>

                {/* Кнопки */}
                <div className="buttons">
                    <button onClick={handleAllClear} className="function">AC</button>
                    <button onClick={handleClear} className="function">C</button>
                    <button onClick={() => handleOperation('/')} className="operator">/</button>
                    <button onClick={() => handleOperation('*')} className="operator">*</button>

                    <button onClick={() => handleDigit('7')}>7</button>
                    <button onClick={() => handleDigit('8')}>8</button>
                    <button onClick={() => handleDigit('9')}>9</button>
                    <button onClick={() => handleOperation('-')} className="operator">-</button>

                    <button onClick={() => handleDigit('4')}>4</button>
                    <button onClick={() => handleDigit('5')}>5</button>
                    <button onClick={() => handleDigit('6')}>6</button>
                    <button onClick={() => handleOperation('+')} className="operator">+</button>

                    <button onClick={() => handleDigit('1')}>1</button>
                    <button onClick={() => handleDigit('2')}>2</button>
                    <button onClick={() => handleDigit('3')}>3</button>
                    <button onClick={handleEquals} className="equals" rowSpan="2">=</button>

                    <button onClick={() => handleDigit('0')} className="zero">0</button>
                    <button onClick={() => handleDigit('.')}>.</button>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    return <Calculator />;
};

root.render(<App />);